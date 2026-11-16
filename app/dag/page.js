import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient, getEventImages, getEvents, getNotes, getReminders } from "@/lib/supabase/server";
import { formatDayTitle, nowInMinutes, parseIsoDate, timeToMinutes, toIsoDate, today } from "@/lib/calendar";
import TopBar from "@/components/calendar/TopBar";
import WeekStrip from "@/components/day/WeekStrip";
import DayTabs from "@/components/day/DayTabs";
import CardStack from "@/components/day/CardStack";
import PlanCard from "@/components/day/PlanCard";
import styles from "./page.module.css";

// Teksterne til de tre faner
const TABS = {
  planer: { label: "Planer", more: "Se flere planer", empty: "Ingen planer denne dag" },
  noter: { label: "Noter", more: "Se flere noter", empty: "Ingen noter denne dag" },
  minder: { label: "Minder", more: "Se næste minde", empty: "Ingen minder denne dag" },
};

// Billederne (minder) ligger i denne mappe i Supabase Storage
const IMAGE_BUCKET = "event-images";

// Henter billederne fra dagens begivenheder og laver et link til hvert billede.
// Mappen er privat, så hvert billede skal have et "signeret" link, der virker i en time.
async function getPhotos(dateIso) {
  const images = await getEventImages(dateIso);
  if (images.length === 0) {
    return [];
  }

  const paths = [];
  for (const image of images) {
    paths.push(image.storage_path);
  }

  const supabase = createClient();
  const result = await supabase.storage.from(IMAGE_BUCKET).createSignedUrls(paths, 60 * 60);
  if (result.error) {
    console.error(`Kunne ikke hente billeder: ${result.error.message}`);
    return [];
  }

  const photos = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const link = result.data[i];

    // Spring billeder over, der ikke kunne laves et link til
    if (!link || !link.signedUrl) {
      continue;
    }

    // Billedteksten fra databasen, ellers "Minde fra <begivenhed>"
    let alt = `Minde fra ${image.events.title}`;
    if (image.alt_text) {
      alt = image.alt_text;
    }

    photos.push({ id: image.id, url: link.signedUrl, alt: alt });
  }
  return photos;
}

// Lægger begivenheder og påmindelser sammen i én liste ("planer"), sorteret efter tidspunkt
function getPlans(events, reminders) {
  const plans = [];

  for (const event of events) {
    plans.push({
      id: `event-${event.id}`,
      isEvent: true,
      title: event.title,
      start: event.start_time,
      end: event.end_time,
      location: event.location,
      description: event.description,
    });
  }

  for (const reminder of reminders) {
    plans.push({
      id: `reminder-${reminder.id}`,
      isEvent: false,
      title: `Husk: ${reminder.title}`,
      start: reminder.time,
    });
  }

  // Sortér efter tidspunkt. Planer uden tidspunkt kommer først.
  plans.sort(function (a, b) {
    const timeA = a.start || "";
    const timeB = b.start || "";
    if (timeA < timeB) {
      return -1;
    }
    if (timeA > timeB) {
      return 1;
    }
    return 0;
  });

  return plans;
}

// Den lille tekst øverst på kortet: "Påmindelse", "Nu" eller fx "Næste - om 2 timer".
// Giver null, når der ikke skal stå noget.
function getPlanLabel(plan, plans, isToday) {
  if (!plan.isEvent) {
    return "Påmindelse";
  }
  if (!isToday || !plan.start) {
    return null;
  }

  const now = nowInMinutes();
  const start = timeToMinutes(plan.start);
  let end = start;
  if (plan.end) {
    end = timeToMinutes(plan.end);
  }

  // Begivenheden er i gang lige nu
  if (start <= now && now < end) {
    return "Nu";
  }
  // Begivenheden er slut
  if (start <= now) {
    return null;
  }

  // Hvor lang tid er der til?
  const minutesLeft = start - now;
  let until;
  if (minutesLeft < 60) {
    until = `om ${minutesLeft} min`;
  } else {
    const hours = Math.round(minutesLeft / 60);
    if (hours === 1) {
      until = "om 1 time";
    } else {
      until = `om ${hours} timer`;
    }
  }

  // Er det den første begivenhed, der ikke er startet endnu? Så skriv "Næste"
  let nextEvent = null;
  for (const other of plans) {
    if (other.isEvent && other.start && timeToMinutes(other.start) > now) {
      nextEvent = other;
      break;
    }
  }
  if (nextEvent === plan) {
    return `Næste - ${until}`;
  }
  return until;
}

// Dagssiden. Adressen kan være fx /dag?dato=2026-11-09&fane=noter&nr=1
//   dato – dagen (i dag, hvis den mangler)
//   fane – planer, noter eller minder (planer, hvis den mangler)
//   nr   – hvilken plan, note eller hvilket billede der vises på kortet
export default async function DayPage({ searchParams }) {
  const params = await searchParams;

  // Står der ingen dato, vises i dag. En forkert dato giver "siden findes ikke".
  let date;
  if (params.dato === undefined) {
    date = today();
  } else {
    date = parseIsoDate(params.dato);
    if (!date) {
      notFound();
    }
  }
  const dato = toIsoDate(date);
  const isToday = dato === toIsoDate(today());

  let activeTab = "planer";
  if (params.fane === "noter" || params.fane === "minder") {
    activeTab = params.fane;
  }

  // Hent alt for dagen
  const events = await getEvents(dato, dato);
  const reminders = await getReminders(dato, dato);
  const notes = await getNotes(dato, dato);
  const photos = await getPhotos(dato);
  const plans = getPlans(events, reminders);

  // Listen der hører til den valgte fane
  let items;
  if (activeTab === "planer") {
    items = plans;
  } else if (activeTab === "noter") {
    items = notes;
  } else {
    items = photos;
  }

  // Hvilket element der vises på kortet (det første, hvis nr mangler eller er forkert)
  let index = Number(params.nr);
  if (!Number.isInteger(index) || index < 0 || index >= items.length) {
    index = 0;
  }
  const item = items[index];

  // Knappen "Se flere …" går til det næste element, og fra det sidste tilbage til det første.
  // Den vises kun, når der er mere end ét.
  let more = null;
  if (items.length > 1) {
    let nextIndex = index + 1;
    if (nextIndex === items.length) {
      nextIndex = 0;
    }
    more = {
      href: `/dag?dato=${dato}&fane=${activeTab}&nr=${nextIndex}`,
      label: TABS[activeTab].more,
    };
  }

  // Ugebåndet beholder den åbne fane, når man skifter dag
  let tabQuery = "";
  if (activeTab !== "planer") {
    tabQuery = `&fane=${activeTab}`;
  }

  // Det der står på kortet
  let cardContent;
  let centered = true;
  if (!item) {
    cardContent = <p className={styles.empty}>{TABS[activeTab].empty}</p>;
  } else if (activeTab === "planer") {
    cardContent = <PlanCard plan={item} label={getPlanLabel(item, plans, isToday)} />;
    centered = false;
  } else if (activeTab === "noter") {
    cardContent = <p className={styles.note}>{item.content}</p>;
  } else {
    cardContent = (
      <div className={styles.photo}>
        <Image src={item.url} alt={item.alt} fill sizes="235px" />
      </div>
    );
  }

  const tabs = [
    { id: "planer", label: TABS.planer.label, count: plans.length },
    { id: "noter", label: TABS.noter.label, count: notes.length },
    { id: "minder", label: TABS.minder.label, count: photos.length },
  ];

  return (
    <main className={styles.page}>
      <TopBar backHref={`/?dato=${dato}`} dateIso={dato} />

      <WeekStrip date={date} tabQuery={tabQuery} />

      <h1 className={styles.title}>
        <span>{formatDayTitle(date)}</span>
      </h1>

      <section className={styles.sheet}>
        <DayTabs dateIso={dato} activeTab={activeTab} tabs={tabs} />

        <CardStack more={more} centered={centered}>
          {cardContent}
        </CardStack>
      </section>
    </main>
  );
}
