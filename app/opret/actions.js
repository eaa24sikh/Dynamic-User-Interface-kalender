"use server";

// Denne fil kører på serveren. createItem bliver kaldt,
// når man trykker "Gem" på /opret – både når man opretter og redigerer.

import { redirect } from "next/navigation";
import { createClient, getCalendarId } from "@/lib/supabase/server";
import { parseIsoDate, toDatabaseTimestamp } from "@/lib/calendar";

// Tidspunktet skal være et helt klokkeslæt fra "00:00" til "23:00"
function isSlot(value) {
  if (typeof value !== "string" || value.length !== 5 || !value.endsWith(":00")) {
    return false;
  }
  const hour = Number(value.slice(0, 2));
  return Number.isInteger(hour) && hour >= 0 && hour <= 23;
}

// Sluttidspunktet er en time senere: "14:00" -> "15:00".
// "23:00" giver "24:00", som databasen forstår som slutningen af dagen.
function slotEnd(start) {
  const hour = Number(start.slice(0, 2)) + 1;
  if (hour < 10) {
    return `0${hour}:00`;
  }
  return `${hour}:00`;
}

// Teksten fra et felt i formularen. Tomme felter bliver til null.
function getText(formData, name) {
  const value = formData.get(name);
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  return trimmed;
}

// Gemmer en ny påmindelse, note eller begivenhed i Supabase – eller retter en der findes,
// hvis formularen har et id (så redigerer man).
// Går det godt, sendes man videre til dagssiden.
// Går det galt, gives en fejlbesked tilbage, som formularen viser.
//
// Hvor det bliver gemt:
//   Påmindelse – en række i "reminders" med dato og tidspunkt (remind_at)
//   Note       – en række i "event_notes" med dato
//   Begivenhed – en række i "events". "Påmindelse før", "Inviter venner" og stickeren
//                gemmes i kolonnerne reminder, friends og stickers.
export async function createItem(previousState, formData) {
  const type = formData.get("type");
  const title = getText(formData, "title");
  const date = formData.get("date");
  const slot = formData.get("slot");
  const id = formData.get("id");

  if (!title) {
    return { error: "Skriv en titel" };
  }
  if (!parseIsoDate(date)) {
    return { error: "Vælg en dag" };
  }

  const supabase = createClient();
  let table;
  let row;
  let tab;

  if (type === "paamindelse") {
    if (!isSlot(slot)) {
      return { error: "Vælg et tidspunkt" };
    }

    // Klokkeslættet gemmes i remind_at sammen med datoen
    table = "reminders";
    row = {
      title: title,
      date: date,
      remind_at: toDatabaseTimestamp(date, slot),
      alarm: formData.get("alarm") === "on",
      repeat: formData.get("repeat"),
    };
    tab = "planer";
  } else if (type === "note") {
    const content = getText(formData, "content");
    if (!content) {
      return { error: "Skriv en note" };
    }

    table = "event_notes";
    row = {
      title: title,
      date: date,
      content: content,
    };
    tab = "noter";
  } else if (type === "begivenhed") {
    if (!isSlot(slot)) {
      return { error: "Vælg et tidspunkt" };
    }

    // Begivenheden gemmes i appens kalender
    const calendarId = await getCalendarId();
    if (!calendarId) {
      return { error: "Det kunne ikke gemmes. Prøv igen." };
    }

    // "Påmindelse før" er et antal minutter, fx 60. "Ingen" er tom og gemmes som null.
    let reminder = null;
    const minutesBefore = Number(formData.get("reminder"));
    if (minutesBefore > 0) {
      reminder = minutesBefore;
    }

    table = "events";
    row = {
      calendar_id: calendarId,
      title: title,
      location: getText(formData, "location"),
      start_at: toDatabaseTimestamp(date, slot),
      end_at: toDatabaseTimestamp(date, slotEnd(slot)),
      all_day: false,
      reminder: reminder,
      friends: getText(formData, "invitees"),
      stickers: getText(formData, "sticker"),
    };
    tab = "planer";
  } else {
    return { error: "Vælg hvad du vil oprette" };
  }

  // Med et id rettes den række, der findes. Uden id laves en ny.
  let result;
  if (id) {
    result = await supabase.from(table).update(row).eq("id", id);
  } else {
    result = await supabase.from(table).insert(row);
  }

  if (result.error) {
    console.error(`Kunne ikke gemme: ${result.error.message}`);
    return { error: "Det kunne ikke gemmes. Prøv igen." };
  }

  redirect(`/dag?dato=${date}&fane=${tab}`);
}
