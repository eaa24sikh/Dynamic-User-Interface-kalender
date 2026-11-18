"use client";

// "use client" betyder, at formularen kører i browseren.
// Det skal den, fordi den husker hvad man har valgt (useState), mens man udfylder den.

import { useActionState, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createItem } from "@/app/opret/actions";
import Icon from "@/components/Icon";
import Toggle from "@/components/Toggle";
import { formatShortDate, parseIsoDate } from "@/lib/calendar";
import styles from "./CreateForm.module.css";

// Knapperne øverst: hvad man vil oprette
const TYPES = [
  { id: "paamindelse", label: "Påmindelse" },
  { id: "note", label: "Note" },
  { id: "begivenhed", label: "Begivenhed" },
];

// Et tal med to cifre: 9 -> "09"
function twoDigits(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return `${number}`;
}

// Tidspunkterne man kan vælge: "00:00-01:00" … "23:00-00:00".
// value er starttidspunktet, fx "14:00".
const SLOTS = [];
for (let hour = 0; hour < 24; hour++) {
  let endHour = hour + 1;
  if (endHour === 24) {
    endHour = 0;
  }
  SLOTS.push({
    value: `${twoDigits(hour)}:00`,
    label: `${twoDigits(hour)}:00-${twoDigits(endHour)}:00`,
  });
}

// Valgmulighederne under "Gentag"
const REPEAT_OPTIONS = [
  { value: "aldrig", label: "Aldrig" },
  { value: "dagligt", label: "Hver dag" },
  { value: "ugentligt", label: "Hver uge" },
  { value: "maanedligt", label: "Hver måned" },
  { value: "aarligt", label: "Hvert år" },
];

// Valgmulighederne under "Påmindelse" for en begivenhed (i minutter)
const REMINDER_OPTIONS = [
  { value: "", label: "Ingen" },
  { value: "15", label: "15 min før" },
  { value: "30", label: "30 min før" },
  { value: "60", label: "1 time før" },
  { value: "1440", label: "1 dag før" },
];

// Stickerne. left og top placerer ikonet i sin kasse, præcis som i Figma.
const STICKERS = [
  { name: "stjerne", width: 27.086, height: 27.086, left: 8.51, top: 8.51 },
  { name: "blomst", width: 27.8599, height: 27.8597, left: 10.44, top: 8.12 },
  { name: "sol", width: 27.086, height: 27.086, left: 8.51, top: 8.51 },
  { name: "hjerte", width: 27.8598, height: 27.9104, left: 8.12, top: 8.12 },
  { name: "flag", width: 27.086, height: 27.086, left: 9.29, top: 8.51 },
  { name: "taco", width: 27.8598, height: 27.8599, left: 8.12, top: 8.12 },
];

// Et usynligt datofelt, der ligger oven på teksten "Fre 13. nov".
// Når man trykker på teksten, åbner telefonens eller browserens egen datovælger.
function DateInput({ date, onChange }) {
  function handleChange(event) {
    // Feltet kan blive tomt, hvis man rydder det – så beholder vi den gamle dato
    if (event.target.value) {
      onChange(event.target.value);
    }
  }

  function openPicker(event) {
    // showPicker() findes ikke i alle browsere
    if (event.currentTarget.showPicker) {
      event.currentTarget.showPicker();
    }
  }

  return (
    <input
      type="date"
      name="date"
      value={date}
      required
      className={styles.dateInput}
      onChange={handleChange}
      onClick={openPicker}
    />
  );
}

// Rullemenuen med tidspunkter
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

// Felterne når "Påmindelse" er valgt
function ReminderFields({ date, setDate }) {
  return (
    <>
      <div className={styles.list}>
        <label className={styles.row}>
          <Icon src="/icons/opret/calendar.svg" width={18} height={18} />
          <span className={styles.rowText}>{formatShortDate(parseIsoDate(date))}</span>
          <DateInput date={date} onChange={setDate} />
        </label>
        <div className={styles.row}>
          <Icon src="/icons/opret/time.svg" width={18} height={18} />
          <SlotSelect className={`${styles.slot} ${styles.slotPlain}`} />
        </div>
        <label className={`${styles.row} ${styles.spread}`}>
          <span className={styles.rowLabel}>
            <Icon src="/icons/opret/bell.svg" width={18} height={18} />
            <span className={styles.interText}>Alarm</span>
          </span>
          <Toggle name="alarm" />
        </label>
      </div>

      <label className={`${styles.card} ${styles.repeat}`}>
        <span className={styles.repeatLabel}>
          <span className={styles.repeatIcon}>
            <Icon src="/icons/opret/repeat.svg" width={20} height={22} />
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
            <Icon src="/icons/opret/arrow-up.svg" width={24} height={24} color="var(--reminder-dato)" className={styles.arrowUp} />
            <Icon src="/icons/opret/arrow-down.svg" width={24} height={24} color="var(--reminder-dato)" className={styles.arrowDown} />
          </span>
        </span>
      </label>
    </>
  );
}

// Felterne når "Note" er valgt.
// Noten gemmes på den dag, man kom fra (?dato= i adressen).
function NoteFields({ date }) {
  return (
    <div className={`${styles.card} ${styles.noteCard}`}>
      <input type="hidden" name="date" value={date} />
      <textarea name="content" className={styles.noteText} placeholder="Skriv din note her…" aria-label="Note" />
    </div>
  );
}

// Felterne når "Begivenhed" er valgt
function EventFields({ date, setDate }) {
  return (
    <>
      <div className={styles.list}>
        <div className={`${styles.row} ${styles.spread}`}>
          <label className={styles.rowLabel}>
            <Icon src="/icons/opret/calendar.svg" width={18} height={18} />
            <span className={styles.rowText}>{formatShortDate(parseIsoDate(date))}</span>
            <DateInput date={date} onChange={setDate} />
          </label>
          <SlotSelect className={styles.slot} />
        </div>
        <label className={`${styles.row} ${styles.tight}`}>
          <Icon src="/icons/opret/location.svg" width={21} height={21} />
          <input name="location" className={`${styles.interText} ${styles.textInput}`} placeholder="Tilføj sted" />
        </label>
        <label className={`${styles.row} ${styles.spread}`}>
          <span className={styles.rowLabel}>
            <Icon src="/icons/opret/bell.svg" width={18} height={18} />
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
            <Icon src="/icons/opret/people.svg" width={19} height={19} />
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

// Hele formularen på /opret.
//
//   initialType – den knap der er valgt fra start, fx "note"
//   initialDate – den dag der oprettes på, fx "2026-11-13"
export default function CreateForm({ initialType, initialDate }) {
  const router = useRouter();

  // Hvad man er ved at oprette, og på hvilken dag
  const [type, setType] = useState(initialType);
  const [date, setDate] = useState(initialDate);

  // Når man trykker "Gem", sendes formularen til createItem() i app/opret/actions.js.
  // state er svaret (fx en fejlbesked), og pending er true, mens der gemmes.
  const [state, formAction, pending] = useActionState(createItem, {});

  // "Annuller" går tilbage til siden før – eller til forsiden, hvis der ikke er nogen
  function cancel() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  let saveText = "Gem";
  if (pending) {
    saveText = "Gemmer…";
  }

  // Overskriften følger det valgte, fx "Opret note"
  let headingText = "Opret påmindelse";
  if (type === "note") {
    headingText = "Opret note";
  } else if (type === "begivenhed") {
    headingText = "Opret begivenhed";
  }

  return (
    <form action={formAction} className={styles.page}>
      <input type="hidden" name="type" value={type} />

      {/* Overskrift til skærmlæsere. Se .skjult i app/globals.css */}
      <h1 className="skjult">{headingText}</h1>

      <header className={styles.header}>
        <button type="button" className={styles.cancel} onClick={cancel}>
          Annuller
        </button>
        <button type="submit" className={styles.save} disabled={pending}>
          {saveText}
        </button>
      </header>

      <div className={styles.segment} role="radiogroup" aria-label="Hvad vil du oprette?">
        {TYPES.map((option) => {
          const isActive = type === option.id;

          let buttonClass = styles.segmentButton;
          if (isActive) {
            buttonClass = `${styles.segmentButton} ${styles.segmentActive}`;
          }

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={buttonClass}
              onClick={() => setType(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <label className={`${styles.card} ${styles.titleCard}`}>
        <span className={styles.titleLabel}>Titel</span>
        <input name="title" className={styles.titleInput} autoComplete="off" required />
      </label>

      {/* Felterne skifter alt efter hvad der er valgt øverst */}
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
