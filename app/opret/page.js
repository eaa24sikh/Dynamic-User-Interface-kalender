import { notFound } from "next/navigation";
import { getEvent, getNote, getReminder } from "@/lib/supabase/server";
import { parseIsoDate, toDanishDateAndTime, toIsoDate, today } from "@/lib/calendar";
import CreateForm from "@/components/opret/CreateForm";

// "14:30:00" -> "14:00" (tidspunkterne i formularen er hele timer)
function toSlot(time) {
  return `${time.slice(0, 2)}:00`;
}

// Henter det, der skal redigeres, og laver det om til de værdier, formularen starter med.
// Giver null, hvis det ikke findes.
async function getInitialValues(type, id) {
  if (type === "begivenhed") {
    const event = await getEvent(id);
    if (!event) {
      return null;
    }
    const start = toDanishDateAndTime(event.start_at);
    return {
      title: event.title,
      date: start.date,
      slot: toSlot(start.time),
      location: event.location,
      reminder: event.reminder,
      invitees: event.friends,
      sticker: event.stickers,
    };
  }

  if (type === "note") {
    const note = await getNote(id);
    if (!note) {
      return null;
    }
    return {
      title: note.title,
      date: note.date,
      content: note.content,
    };
  }

  const reminder = await getReminder(id);
  if (!reminder) {
    return null;
  }
  let slot = null;
  if (reminder.remind_at) {
    slot = toSlot(toDanishDateAndTime(reminder.remind_at).time);
  }
  return {
    title: reminder.title,
    date: reminder.date,
    slot: slot,
    alarm: reminder.alarm,
    repeat: reminder.repeat,
  };
}

// Siden hvor man opretter eller redigerer en påmindelse, note eller begivenhed.
// Adressen kan være fx /opret?type=note&dato=2026-11-13 (begge dele kan udelades).
// Står der et id, fx /opret?type=note&id=12, redigerer man noten med det id.
export default async function CreatePage({ searchParams }) {
  const params = await searchParams;

  // Hvilken knap der er valgt øverst. Påmindelse, hvis der ikke står noget.
  let type = "paamindelse";
  if (params.type === "note" || params.type === "begivenhed") {
    type = params.type;
  }

  // Redigering: hent det der allerede er gemt
  if (params.id) {
    const initial = await getInitialValues(type, params.id);
    if (!initial) {
      notFound();
    }
    return <CreateForm initialType={type} initialDate={initial.date} initial={initial} editId={params.id} />;
  }

  // Dagen der oprettes på. I dag, hvis der ikke står nogen dato.
  let date = parseIsoDate(params.dato);
  if (!date) {
    date = today();
  }

  return <CreateForm initialType={type} initialDate={toIsoDate(date)} />;
}
