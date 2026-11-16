import Image from "next/image";
import { formatTime } from "@/lib/calendar";
import styles from "./PlanCard.module.css";

// plan: an event or a reminder, see getPlans() in app/dag/page.js
export default function PlanCard({ plan, label }) {
  const start = formatTime(plan.start);
  const end = formatTime(plan.end);

  return (
    <div className={styles.plan}>
      <div className={styles.heading}>
        {label && <p className={styles.label}>{label}</p>}
        <p className={styles.title}>{plan.title}</p>
      </div>

      {(start || plan.location) && (
        <div className={styles.details}>
          {start && (
            <p className={styles.detail}>
              <Image src="/icons/time.svg" alt="Tidspunkt" width={18} height={18} />
              {end ? `${start} - ${end}` : start}
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
