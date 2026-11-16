"use server";

// Denne fil kører på serveren. createItem bliver kaldt,
// når man trykker "Gem" på /opret.

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

// Gemmer en påmindelse, note eller begivenhed i Supabase.
// Går det godt, sendes man videre til dagssiden.
// Går det galt, gives en fejlbesked tilbage, som formularen viser.
//
// Hvor det bliver gemt:
//   Påmindelse – en række i "reminders" med dato og tidspunkt
//   Note       – en række i "event_notes" med dato
//   Begivenhed – en række i "events". "Påmindelse før" bliver en række i "reminders",
//                og en sticker bliver en række i "day_stickers".
//                "Inviter venner" bliver ikke gemt.
export async function createItem(previousState, formData) {
  const type = formData.get("type");
  const title = getText(formData, "title");
  const date = formData.get("date");
  const slot = formData.get("slot");

  if (!title) {
    return { error: "Skriv en titel" };
  }
  if (!parseIsoDate(date)) {
    return { error: "Vælg en dag" };
  }

  // Alt gemmes i appens kalender
  const calendarId = await getCalendarId();
  if (!calendarId) {
    return { error: "Det kunne ikke gemmes. Prøv igen." };
  }

  const supabase = createClient();
  let result;
  let tab;

  if (type === "paamindelse") {
    if (!isSlot(slot)) {
      return { error: "Vælg et tidspunkt" };
    }

    result = await supabase.from("reminders").insert({
      calendar_id: calendarId,
      title: title,
      date: date,
      time: slot,
      remind_at: toDatabaseTimestamp(date, slot),
      alarm: formData.get("alarm") === "on",
      repeat: formData.get("repeat"),
    });
    tab = "planer";
  } else if (type === "note") {
    const content = getText(formData, "content");
    if (!content) {
      return { error: "Skriv en note" };
    }

    result = await supabase.from("event_notes").insert({
      calendar_id: calendarId,
      title: title,
      date: date,
      content: content,
    });
    tab = "noter";
  } else if (type === "begivenhed") {
    if (!isSlot(slot)) {
      return { error: "Vælg et tidspunkt" };
    }

    // .select().single() giver os den nye begivenhed tilbage, så vi kender dens id og starttid
    result = await supabase
      .from("events")
      .insert({
        calendar_id: calendarId,
        title: title,
        location: getText(formData, "location"),
        start_at: toDatabaseTimestamp(date, slot),
        end_at: toDatabaseTimestamp(date, slotEnd(slot)),
        all_day: false,
        timezone: "Europe/Copenhagen",
      })
      .select("id, start_at")
      .single();

    if (!result.error) {
      await saveEventExtras(supabase, formData, calendarId, date, result.data);
    }
    tab = "planer";
  } else {
    return { error: "Vælg hvad du vil oprette" };
  }

  if (result.error) {
    console.error(`Kunne ikke gemme: ${result.error.message}`);
    return { error: "Det kunne ikke gemmes. Prøv igen." };
  }

  redirect(`/dag?dato=${date}&fane=${tab}`);
}

// Gemmer "Påmindelse før" og stickeren for en ny begivenhed.
// Går det galt, skrives det kun i terminalen – selve begivenheden er jo gemt.
async function saveEventExtras(supabase, formData, calendarId, date, event) {
  // "Påmindelse før" er et antal minutter, fx 60. "Ingen" er tom.
  const minutesBefore = Number(formData.get("reminder"));
  if (minutesBefore > 0) {
    const startTime = new Date(event.start_at).getTime();
    const remindAt = new Date(startTime - minutesBefore * 60 * 1000);

    const reminderResult = await supabase.from("reminders").insert({
      event_id: event.id,
      remind_at: remindAt.toISOString(),
    });
    if (reminderResult.error) {
      console.error(`Kunne ikke gemme påmindelsen: ${reminderResult.error.message}`);
    }
  }

  const sticker = getText(formData, "sticker");
  if (sticker) {
    const stickerResult = await supabase.from("day_stickers").insert({
      calendar_id: calendarId,
      date: date,
      sticker: sticker,
    });
    if (stickerResult.error) {
      console.error(`Kunne ikke gemme stickeren: ${stickerResult.error.message}`);
    }
  }
}
