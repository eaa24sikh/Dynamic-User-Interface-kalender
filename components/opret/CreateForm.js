"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createItem } from "@/app/opret/actions";
import { formatShortDate, parseIsoDate } from "@/lib/calendar";
import styles from "./CreateForm.module.css";

const TYPES = [
  { id: "paamindelse", label: "Påmindelse" },
  { id: "note", label: "Note" },
  { id: "begivenhed", label: "Begivenhed" },
];

// "00:00-01:00" … "23:00-00:00" – the value is the start time
const SLOTS = Array.from({ length: 24 }, (_, hour) => {
  const start = String(hour).padStart(2, "0");
  const end = String((hour + 1) % 24).padStart(2, "0");
  return { value: `${start}:00`, label: `${start}:00-${end}:00` };
});

const REPEAT_OPTIONS = [
  { value: "aldrig", label: "Aldrig" },
  { value: "dagligt", label: "Hver dag" },
  { value: "ugentligt", label: "Hver uge" },
  { value: "maanedligt", label: "Hver måned" },
  { value: "aarligt", label: "Hvert år" },
];

const REMINDER_OPTIONS = [
  { value: "", label: "Ingen" },
  { value: "15", label: "15 min før" },
  { value: "30", label: "30 min før" },
  { value: "60", label: "1 time før" },
  { value: "1440", label: "1 dag før" },
];

// left/top place each icon inside its tile, as in Figma
const STICKERS = [
  { name: "stjerne", width: 27.086, height: 27.086, left: 8.51, top: 8.51 },
  { name: "blomst", width: 27.8599, height: 27.8597, left: 10.44, top: 8.12 },
  { name: "sol", width: 27.086, height: 27.086, left: 8.51, top: 8.51 },
  { name: "hjerte", width: 27.8598, height: 27.9104, left: 8.12, top: 8.12 },
  { name: "flag", width: 27.086, height: 27.086, left: 9.29, top: 8.51 },
  { name: "taco", width: 27.8598, height: 27.8599, left: 8.12, top: 8.12 },
];

// An invisible date input on top of the text, so the whole area opens the date picker
function DateInput({ date, onChange }) {
  return (
    <input
      type="date"
      name="date"
      value={date}
      required
      className={styles.dateInput}
      onChange={(event) => event.target.value && onChange(event.target.value)}
      onClick={(event) => event.currentTarget.showPicker?.()}
    />
  );
}

function SlotSelect({ className }) {
  return (
    <select name="slot" defaultValue="09:00" className={className} aria-label="Tidspunkt">
      {SLOTS.map((slot) => (
        <option key={slot.value} value={slot.value}>
          {slot.label}
        </option>
      ))}
    </select>
  );
}

function ReminderFields({ date, setDate }) {
  return (
    <>
      <div className={styles.list}>
        <label className={styles.row}>
          <Image src="/icons/opret/calendar.svg" alt="" width={18} height={18} />
          <span className={styles.rowText}>{formatShortDate(parseIsoDate(date))}</span>
          <DateInput date={date} onChange={setDate} />
        </label>
        <div className={styles.row}>
          <Image src="/icons/opret/time.svg" alt="" width={18} height={18} />
          <SlotSelect className={`${styles.slot} ${styles.slotPlain}`} />
        </div>
        <label className={`${styles.row} ${styles.spread}`}>
          <span className={styles.rowLabel}>
            <Image src="/icons/opret/bell.svg" alt="" width={18} height={18} />
            <span className={styles.interText}>Alarm</span>
          </span>
          <span className={styles.toggle}>
            <input type="checkbox" name="alarm" />
            <span className={styles.track} aria-hidden="true" />
          </span>
        </label>
      </div>

      <label className={`${styles.card} ${styles.repeat}`}>
        <span className={styles.repeatLabel}>
          <span className={styles.repeatIcon}>
            <Image src="/icons/opret/repeat.svg" alt="" width={20} height={22} />
          </span>
          <span className={styles.rowText}>Gentag</span>
        </span>
        <span className={styles.repeatChoice}>
          <select name="repeat" defaultValue="aldrig" className={styles.repeatSelect}>
            {REPEAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.arrows} aria-hidden="true">
            <Image src="/icons/opret/arrow-up.svg" alt="" width={24} height={24} className={styles.arrowUp} />
            <Image src="/icons/opret/arrow-down.svg" alt="" width={24} height={24} className={styles.arrowDown} />
          </span>
        </span>
      </label>
    </>
  );
}

// The note is saved on the day you came from (?dato=)
function NoteFields({ date }) {
  return (
    <div className={`${styles.card} ${styles.noteCard}`}>
      <input type="hidden" name="date" value={date} />
      <textarea name="content" className={styles.noteText} placeholder="Skriv din note her…" aria-label="Note" />
    </div>
  );
}

function EventFields({ date, setDate }) {
  return (
    <>
      <div className={styles.list}>
        <div className={`${styles.row} ${styles.spread}`}>
          <label className={styles.rowLabel}>
            <Image src="/icons/opret/calendar.svg" alt="" width={18} height={18} />
            <span className={styles.rowText}>{formatShortDate(parseIsoDate(date))}</span>
            <DateInput date={date} onChange={setDate} />
          </label>
          <SlotSelect className={styles.slot} />
        </div>
        <label className={`${styles.row} ${styles.tight}`}>
          <Image src="/icons/opret/location.svg" alt="" width={21} height={21} />
          <input name="location" className={`${styles.interText} ${styles.textInput}`} placeholder="Tilføj sted" />
        </label>
        <label className={`${styles.row} ${styles.spread}`}>
          <span className={styles.rowLabel}>
            <Image src="/icons/opret/bell.svg" alt="" width={18} height={18} />
            <span className={styles.interText}>Påmindelse</span>
          </span>
          <select name="reminder" defaultValue="60" className={styles.valueSelect}>
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className={`${styles.row} ${styles.spread}`}>
          <span className={`${styles.rowLabel} ${styles.tight}`}>
            <Image src="/icons/opret/people.svg" alt="" width={19} height={19} />
            <span className={styles.interText}>Inviter venner</span>
          </span>
          <input name="invitees" className={`${styles.interText} ${styles.inviteInput}`} placeholder="Tilføj navne" />
        </label>
      </div>

      <fieldset className={`${styles.card} ${styles.stickers}`}>
        <legend className={styles.stickersTitle}>Stickers</legend>
        <div className={styles.stickerRow}>
          {STICKERS.map((sticker) => (
            <label key={sticker.name} className={styles.sticker}>
              <input type="radio" name="sticker" value={sticker.name} />
              <Image
                src={`/icons/opret/sticker-${sticker.name}.svg`}
                alt={sticker.name}
                width={sticker.width}
                height={sticker.height}
                style={{ left: sticker.left, top: sticker.top }}
              />
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export default function CreateForm({ initialType, initialDate }) {
  const router = useRouter();
  const [type, setType] = useState(initialType);
  const [date, setDate] = useState(initialDate);
  const [state, formAction, pending] = useActionState(createItem, {});

  function cancel() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <form action={formAction} className={styles.page}>
      <input type="hidden" name="type" value={type} />

      <header className={styles.header}>
        <button type="button" className={styles.cancel} onClick={cancel}>
          Annuller
        </button>
        <button type="submit" className={styles.save} disabled={pending}>
          {pending ? "Gemmer…" : "Gem"}
        </button>
      </header>

      <div className={styles.segment} role="radiogroup" aria-label="Hvad vil du oprette?">
        {TYPES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={type === option.id}
            className={type === option.id ? `${styles.segmentButton} ${styles.segmentActive}` : styles.segmentButton}
            onClick={() => setType(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className={`${styles.card} ${styles.titleCard}`}>
        <span className={styles.titleLabel}>Titel</span>
        <input name="title" className={styles.titleInput} autoComplete="off" required />
      </label>

      {type === "paamindelse" && <ReminderFields date={date} setDate={setDate} />}
      {type === "note" && <NoteFields date={date} />}
      {type === "begivenhed" && <EventFields date={date} setDate={setDate} />}

      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
