import Image from "next/image";
import { formatTime } from "@/lib/calendar";
import styles from "./PlanCard.module.css";

// Indholdet på kortet under fanen "Planer".
//
//   plan  – en begivenhed eller påmindelse (se getPlans() i app/dag/page.js)
//   label – den lille tekst øverst, fx "Næste - om 2 timer" (kan være null)
export default function PlanCard({ plan, label }) {
  const start = formatTime(plan.start);
  const end = formatTime(plan.end);

  // "14:00 - 16:00", eller kun "14:00" hvis der ikke er et sluttidspunkt
  let time = start;
  if (start && end) {
    time = `${start} - ${end}`;
  }

  return (
    <div className={styles.plan}>
      <div className={styles.heading}>
        {label && <p className={styles.label}>{label}</p>}
        <p className={styles.title}>{plan.title}</p>
      </div>

      {(time || plan.location) && (
        <div className={styles.details}>
          {time && (
            <p className={styles.detail}>
              <Image src="/icons/time.svg" alt="Tidspunkt" width={18} height={18} />
              {time}
            </p>
          )}
          {plan.location && (
            <p className={`${styles.detail} ${styles.location}`}>
              <Image src="/icons/location.svg" alt="Sted" width={21} height={21} />
              {plan.location}
            </p>
          )}
        </div>
      )}

      {plan.description && <p className={styles.description}>{plan.description}</p>}
    </div>
  );
}
