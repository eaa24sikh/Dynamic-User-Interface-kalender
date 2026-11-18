"use server";

// Denne fil kører på serveren. deleteItem bliver kaldt,
// når man trykker på skraldespanden på dagssiden.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseIsoDate } from "@/lib/calendar";

// Hvilken tabel hver type ligger i
const TABLES = {
  begivenhed: "events",
  paamindelse: "reminders",
  note: "event_notes",
};

// Sletter en begivenhed, påmindelse eller note og går tilbage til dagssiden.
// Formularen sender type, id, date (dagen) og tab (fanen man stod på).
export async function deleteItem(formData) {
  const type = formData.get("type");
  const id = formData.get("id");
  const date = formData.get("date");
  const tab = formData.get("tab");

  const table = TABLES[type];
  if (!table || !id || !parseIsoDate(date)) {
    return;
  }

  const supabase = createClient();
  const result = await supabase.from(table).delete().eq("id", id);
  if (result.error) {
    console.error(`Kunne ikke slette: ${result.error.message}`);
  }

  // Tilbage til dagen. nr fjernes, så det første kort vises.
  redirect(`/dag?dato=${date}&fane=${tab}`);
}
