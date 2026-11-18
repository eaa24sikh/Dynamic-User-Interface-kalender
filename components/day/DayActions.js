"use client";

// "use client" betyder, at knapperne kører i browseren.
// Det skal de, fordi skraldespanden spørger "Er du sikker?" (confirm), før der slettes.

import Image from "next/image";
import Link from "next/link";
import { deleteItem } from "@/app/dag/actions";
import styles from "./DayActions.module.css";

// Hvad der står i "Er du sikker?"-boksen for hver type
const NAMES = {
  begivenhed: "begivenheden",
  paamindelse: "påmindelsen",
  note: "noten",
};

// Skraldespanden og blyanten nederst på dagssiden.
//
//   type – "begivenhed", "paamindelse" eller "note"
//   id   – id'et i databasen
//   date – dagen, fx "2026-11-09"
//   tab  – fanen man står på, fx "planer"
export default function DayActions({ type, id, date, tab }) {
  // Spørg før der slettes. Trykker man "Annuller", sendes formularen ikke.
  function confirmDelete(event) {
    if (!window.confirm(`Vil du slette ${NAMES[type]}?`)) {
      event.preventDefault();
    }
  }

  return (
    <div className={styles.actions}>
      <form action={deleteItem} onSubmit={confirmDelete}>
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="tab" value={tab} />
        <button type="submit" className={styles.button} aria-label={`Slet ${NAMES[type]}`}>
          <Image src="/icons/dag/trash.svg" alt="" width={42} height={42} />
        </button>
      </form>

      <Link href={`/opret?type=${type}&id=${id}`} className={styles.button} aria-label={`Rediger ${NAMES[type]}`}>
        <Image src="/icons/dag/pencil.svg" alt="" width={30.3284} height={30.3284} />
      </Link>
    </div>
  );
}
