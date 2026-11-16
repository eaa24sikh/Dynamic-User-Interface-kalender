import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { toDanishDateAndTime, toDatabaseTimestamp } from "@/lib/calendar";

// Forbindelsen til Supabase-databasen. URL og nøgle står i .env.local.
// Login'et i appen har ikke noget med Supabase at gøre, så alle bruger den samme forbindelse.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

// Skriver en fejl fra databasen i terminalen og giver en tom liste tilbage
function rowsOrEmpty(result, table) {
  if (result.error) {
    console.error(`Kunne ikke hente ${table}: ${result.error.message}`);
    return [];
  }
  return result.data;
}

// Begivenheder fra fromDate til toDate (begge med), sorteret efter tidspunkt.
// Tidspunkterne regnes om til dansk tid, så hver begivenhed får
// { id, date, start_time, end_time, title, location, description }
export async function getEvents(fromDate, toDate) {
  const supabase = createClient();
  const result = await supabase
    .from("events")
    .select("id, title, location, description, start_at, end_at")
    .gte("start_at", toDatabaseTimestamp(fromDate, "00:00"))
    .lte("start_at", toDatabaseTimestamp(toDate, "23:59"))
    .order("start_at");

  const events = [];
  for (const row of rowsOrEmpty(result, "begivenheder")) {
    const start = toDanishDateAndTime(row.start_at);

    let endTime = null;
    if (row.end_at) {
      endTime = toDanishDateAndTime(row.end_at).time;
    }

    events.push({
      id: row.id,
      date: start.date,
      start_time: start.time,
      end_time: endTime,
      title: row.title,
      location: row.location,
      description: row.description,
    });
  }
  return events;
}

// Påmindelser der står på en dag (ikke dem der hører til en begivenhed).
// Hver påmindelse er { id, date, title, time }
export async function getReminders(fromDate, toDate) {
  const supabase = createClient();
  const result = await supabase
    .from("reminders")
    .select("id, date, title, time")
    .gte("date", fromDate)
    .lte("date", toDate)
    .order("time", { nullsFirst: true });
  return rowsOrEmpty(result, "påmindelser");
}

// Noter der står på en dag. Hver note er { id, date, title, content }
export async function getNotes(fromDate, toDate) {
  const supabase = createClient();
  const result = await supabase
    .from("event_notes")
    .select("id, date, title, content")
    .gte("date", fromDate)
    .lte("date", toDate)
    .order("created_at");
  return rowsOrEmpty(result, "noter");
}

// Stickers på dagene. Hver sticker er { date, sticker }
export async function getStickers(fromDate, toDate) {
  const supabase = createClient();
  const result = await supabase
    .from("day_stickers")
    .select("date, sticker")
    .gte("date", fromDate)
    .lte("date", toDate);
  return rowsOrEmpty(result, "stickers");
}

// Billederne fra begivenhederne på én dag.
// Hvert billede er { id, storage_path, alt_text, events: { title } }
export async function getEventImages(date) {
  const supabase = createClient();
  const result = await supabase
    .from("event_images")
    .select("id, storage_path, alt_text, events!inner(title, start_at)")
    .gte("events.start_at", toDatabaseTimestamp(date, "00:00"))
    .lte("events.start_at", toDatabaseTimestamp(date, "23:59"));
  return rowsOrEmpty(result, "billeder");
}

// Id'et på den kalender, som alt bliver gemt i.
// Appen har kun én kalender. Findes den ikke endnu, bliver den lavet og kaldt "Min kalender".
// Giver null, hvis det går galt.
export async function getCalendarId() {
  const supabase = createClient();

  const found = await supabase.from("calendars").select("id").order("created_at").limit(1);
  if (found.error) {
    console.error(`Kunne ikke finde kalender: ${found.error.message}`);
    return null;
  }
  if (found.data.length > 0) {
    return found.data[0].id;
  }

  const created = await supabase.from("calendars").insert({ name: "Min kalender" }).select("id").single();
  if (created.error) {
    console.error(`Kunne ikke oprette kalender: ${created.error.message}`);
    return null;
  }
  return created.data.id;
}
