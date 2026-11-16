"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseIsoDate } from "@/lib/calendar";

// "14:00" -> "15:00", and "23:00" -> "24:00" (Postgres accepts 24:00 as the end of the day)
function slotEnd(start) {
  const hour = Number(start.slice(0, 2)) + 1;
  return `${String(hour).padStart(2, "0")}:00`;
}

function isSlot(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):00$/.test(value);
}

// Empty text fields are saved as null
function text(formData, name) {
  const value = formData.get(name)?.trim();
  return value ? value : null;
}

export async function createItem(prevState, formData) {
  const type = formData.get("type");
  const title = text(formData, "title");
  const date = formData.get("date");
  const slot = formData.get("slot");

  if (!title) return { error: "Skriv en titel" };
  if (!parseIsoDate(date)) return { error: "Vælg en dag" };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { error: "Du skal være logget ind for at gemme" };

  let result;
  let tab = "planer";

  if (type === "paamindelse") {
    if (!isSlot(slot)) return { error: "Vælg et tidspunkt" };
    result = await supabase.from("reminders").insert({
      title,
      date,
      time: slot,
      alarm: formData.get("alarm") === "on",
      repeat: formData.get("repeat"),
    });
  } else if (type === "note") {
    const content = text(formData, "content");
    if (!content) return { error: "Skriv en note" };
    result = await supabase.from("notes").insert({ title, date, content });
    tab = "noter";
  } else if (type === "begivenhed") {
    if (!isSlot(slot)) return { error: "Vælg et tidspunkt" };
    const reminderMinutes = Number.parseInt(formData.get("reminder"), 10);
    result = await supabase.from("events").insert({
      title,
      date,
      start_time: slot,
      end_time: slotEnd(slot),
      location: text(formData, "location"),
      reminder_minutes: Number.isNaN(reminderMinutes) ? null : reminderMinutes,
      invitees: text(formData, "invitees"),
      sticker: text(formData, "sticker"),
    });
  } else {
    return { error: "Vælg hvad du vil oprette" };
  }

  if (result.error) {
    console.error(result.error.message);
    return { error: "Det kunne ikke gemmes. Prøv igen." };
  }

  redirect(`/dag?dato=${date}&fane=${tab}`);
}
