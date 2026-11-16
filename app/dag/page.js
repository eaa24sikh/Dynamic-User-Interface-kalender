import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDayTitle, nowInMinutes, parseIsoDate, timeToMinutes, toIsoDate, today } from "@/lib/calendar";
import TopBar from "@/components/calendar/TopBar";
import WeekStrip from "@/components/day/WeekStrip";
import DayTabs from "@/components/day/DayTabs";
import CardStack from "@/components/day/CardStack";
import PlanCard from "@/components/day/PlanCard";
import styles from "./page.module.css";

const TABS = {
  planer: { label: "Planer", more: "Se flere planer", empty: "Ingen planer denne dag" },
  noter: { label: "Noter", more: "Se flere noter", empty: "Ingen noter denne dag" },
  minder: { label: "Minder", more: "Se næste minde", empty: "Ingen minder denne dag" },
};

// Photos are saved in this Supabase Storage bucket
const MEMORY_BUCKET = "minder";

async function getDayData(dateIso) {
  const supabase = await createClient();

  const [events, reminders, notes, memories] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, start_time, end_time, location, description")
      .eq("date", dateIso)
      .order("start_time", { nullsFirst: true }),
    supabase
      .from("reminders")
      .select("id, title, time")
      .eq("date", dateIso)
      .order("time", { nullsFirst: true }),
    supabase.from("notes").select("id, content").eq("date", dateIso).order("created_at"),
    supabase
      .from("memories")
      .select("id, image_path, events(title)")
      .eq("date", dateIso)
      .order("taken_at"),
  ]);

  for (const result of [events, reminders, notes, memories]) {
    if (result.error) console.error(result.error.message);
  }

  // The bucket is private, so the photos need signed links (valid for an hour)
  let photos = [];
  if (memories.data?.length) {
    const { data, error } = await supabase.storage
      .from(MEMORY_BUCKET)
      .createSignedUrls(memories.data.map((memory) => memory.image_path), 60 * 60);
    if (error) console.error(error.message);
    photos = memories.data.map((memory, index) => ({
      id: memory.id,
      url: data?.[index]?.signedUrl,
      alt: memory.events ? `Minde fra ${memory.events.title}` : "Minde",
    }));
  }

  return {
    plans: getPlans(events.data ?? [], reminders.data ?? []),
    notes: notes.data ?? [],
    photos: photos.filter((photo) => photo.url),
  };
}

// Events and reminders in one list, sorted by time
function getPlans(events, reminders) {
  const plans = [
    ...events.map((event) => ({
      id: `event-${event.id}`,
      isEvent: true,
      title: event.title,
      start: event.start_time,
      end: event.end_time,
      location: event.location,
      description: event.description,
    })),
    ...reminders.map((reminder) => ({
      id: `reminder-${reminder.id}`,
      isEvent: false,
      title: `Husk: ${reminder.title}`,
      start: reminder.time,
    })),
  ];
  return plans.sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));
}

// "Næste - om 2 timer", "Nu" or "Påmindelse"
function getPlanLabel(plan, plans, isToday) {
  if (!plan.isEvent) return "Påmindelse";
  if (!isToday || !plan.start) return null;

  const now = nowInMinutes();
  const start = timeToMinutes(plan.start);
  const end = plan.end ? timeToMinutes(plan.end) : start;

  if (start <= now && now < end) return "Nu";
  if (start <= now) return null;

  const minutes = start - now;
  const hours = Math.round(minutes / 60);
  const until = minutes < 60 ? `om ${minutes} min` : `om ${hours} ${hours === 1 ? "time" : "timer"}`;
  const next = plans.find((other) => other.isEvent && other.start && timeToMinutes(other.start) > now);
  return next === plan ? `Næste - ${until}` : until;
}

export default async function DayPage({ searchParams }) {
  const { dato: datoParam, fane, nr } = await searchParams;

  // Without ?dato= the page shows today
  const date = datoParam === undefined ? today() : parseIsoDate(datoParam);
  if (!date) notFound();
  const dato = toIsoDate(date);

  const activeTab = TABS[fane] ? fane : "planer";
  const { plans, notes, photos } = await getDayData(dato);
  const items = { planer: plans, noter: notes, minder: photos }[activeTab];

  // nr picks which plan, note or photo is shown on the card
  const index = Math.abs(Number.parseInt(nr, 10) || 0) % Math.max(items.length, 1);
  const item = items[index];
  const tabQuery = activeTab === "planer" ? "" : `&fane=${activeTab}`;
  const more =
    items.length > 1
      ? {
          href: `/dag?dato=${dato}&fane=${activeTab}&nr=${(index + 1) % items.length}`,
          label: TABS[activeTab].more,
        }
      : null;

  return (
    <main className={styles.page}>
      <TopBar backHref={`/?dato=${dato}`} />

      <WeekStrip date={date} tabQuery={tabQuery} />

      <h1 className={styles.title}>
        <span>{formatDayTitle(date)}</span>
      </h1>

      <section className={styles.sheet}>
        <DayTabs
          dateIso={dato}
          activeTab={activeTab}
          tabs={[
            { id: "planer", label: TABS.planer.label, count: plans.length },
            { id: "noter", label: TABS.noter.label, count: notes.length },
            { id: "minder", label: TABS.minder.label, count: photos.length },
          ]}
        />

        <CardStack more={more} centered={!item || activeTab !== "planer"}>
          {!item && <p className={styles.empty}>{TABS[activeTab].empty}</p>}

          {item && activeTab === "planer" && (
            <PlanCard plan={item} label={getPlanLabel(item, plans, dato === toIsoDate(today()))} />
          )}

          {item && activeTab === "noter" && <p className={styles.note}>{item.content}</p>}

          {item && activeTab === "minder" && (
            <div className={styles.photo}>
              <Image src={item.url} alt={item.alt} fill sizes="235px" />
            </div>
          )}
        </CardStack>
      </section>
    </main>
  );
}
