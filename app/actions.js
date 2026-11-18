"use server";

// Denne fil kører på serveren. placeSticker bliver kaldt,
// når man slipper en sticker på en dag i månedsoversigten.

import { refresh } from "next/cache";
import { createClient, getCalendarId } from "@/lib/supabase/server";
import { parseIsoDate } from "@/lib/calendar";

// De stickers der findes (samme navne som filerne public/icons/sticker-<navn>.svg)
const STICKERS = ["stjerne", "blomst", "sol", "hjerte", "flag", "taco"];

// Sætter en sticker på en dag. En dag kan kun have én sticker,
// så hvis der allerede er en, bliver den skiftet ud.
//
//   date    – dagen, fx "2026-11-10"
//   sticker – navnet, fx "stjerne"
export async function placeSticker(date, sticker) {
  if (!parseIsoDate(date) || !STICKERS.includes(sticker)) {
    return;
  }

  const calendarId = await getCalendarId();
  if (!calendarId) {
    return;
  }

  const supabase = createClient();

  // Fjern den sticker, der måske allerede står på dagen
  await supabase.from("day_stickers").delete().eq("calendar_id", calendarId).eq("date", date);

  const result = await supabase.from("day_stickers").insert({
    calendar_id: calendarId,
    date: date,
    sticker: sticker,
  });
  if (result.error) {
    console.error(`Kunne ikke gemme sticker: ${result.error.message}`);
    return;
  }

  // Hent siden igen, så stickeren bliver vist på dagen
  refresh();
}
