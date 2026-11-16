// Hjælpefunktioner til datoer i kalenderen.
//
// En dato gemmes på to måder:
// - som tekst: "2026-11-09" (det er sådan Supabase gemmer datoer)
// - som et Date-objekt, når vi skal regne med den
//
// Vi bruger altid UTC-funktionerne (getUTCDate osv.), så serverens
// tidszone aldrig kan få en dato til at rykke sig en dag.

const TIME_ZONE = "Europe/Copenhagen";

export const WEEKDAY_LABELS = ["man", "tir", "ons", "tor", "fre", "lør", "søn"];
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

const ONE_DAY = 24 * 60 * 60 * 1000;

// Gør første bogstav stort: "mandag" -> "Mandag"
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Date -> "2026-11-09"
export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

// "2026-11-09" -> Date. Giver null hvis teksten ikke er en rigtig dato.
export function parseIsoDate(value) {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);

  // Ugyldige datoer som "hej" eller "2026-02-31" giver ikke den samme tekst tilbage
  if (isNaN(date.getTime()) || toIsoDate(date) !== value) {
    return null;
  }

  return date;
}

// Dagens dato i Danmark
export function today() {
  // "en-CA" skriver datoen som "2026-11-09"
  const text = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());
  return parseIsoDate(text);
}

// Lægger et antal dage til en dato (eller trækker fra, hvis tallet er negativt)
function addDays(date, days) {
  return new Date(date.getTime() + days * ONE_DAY);
}

// Hvilken plads dagen har i ugen: mandag = 0, tirsdag = 1 … søndag = 6.
// (JavaScripts egen getUTCDay() starter med søndag = 0)
function weekdayNumber(date) {
  const day = date.getUTCDay();
  if (day === 0) {
    return 6;
  }
  return day - 1;
}

// Alle dage i månedsoversigten, delt op i uger fra mandag til søndag.
// Dage fra måneden før og efter er med, så alle uger er hele.
export function getMonthGrid(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const lastOfMonth = new Date(Date.UTC(year, month + 1, 0));

  // Gå tilbage til mandagen før den 1., og frem til søndagen efter den sidste
  const start = addDays(firstOfMonth, -weekdayNumber(firstOfMonth));
  const end = addDays(lastOfMonth, 6 - weekdayNumber(lastOfMonth));

  const weeks = [];
  let week = [];
  let day = start;

  while (day <= end) {
    week.push({
      date: day,
      iso: toIsoDate(day),
      inMonth: day.getUTCMonth() === month,
    });

    // Når ugen har 7 dage, starter vi en ny
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }

    day = addDays(day, 1);
  }

  return {
    weeks: weeks,
    start: toIsoDate(start),
    end: toIsoDate(end),
  };
}

// Den valgte dag med tre dage på hver side (til ugebåndet på dagssiden)
export function getWeekStrip(date) {
  const days = [];
  for (let offset = -3; offset <= 3; offset++) {
    const day = addDays(date, offset);
    days.push({ date: day, iso: toIsoDate(day) });
  }
  return days;
}

// "November"
export function formatMonth(date) {
  const month = new Intl.DateTimeFormat("da-DK", { month: "long", timeZone: "UTC" }).format(date);
  return capitalize(month);
}

// 6 -> "juli"
export function formatMonthName(monthIndex) {
  const date = new Date(Date.UTC(2026, monthIndex, 1));
  return new Intl.DateTimeFormat("da-DK", { month: "long", timeZone: "UTC" }).format(date);
}

// 10 -> "Nov"
export function formatShortMonth(monthIndex) {
  return SHORT_MONTHS[monthIndex];
}

// "Man"
export function formatShortWeekday(date) {
  return capitalize(WEEKDAY_LABELS[weekdayNumber(date)]);
}

// "Mandag"
function formatWeekday(date) {
  const weekday = new Intl.DateTimeFormat("da-DK", { weekday: "long", timeZone: "UTC" }).format(date);
  return capitalize(weekday);
}

// "Mandag 9 november"
export function formatLongDate(date) {
  const month = new Intl.DateTimeFormat("da-DK", { month: "long", timeZone: "UTC" }).format(date);
  return `${formatWeekday(date)} ${date.getUTCDate()} ${month}`;
}

// "Mandag 9."
export function formatDayTitle(date) {
  return `${formatWeekday(date)} ${date.getUTCDate()}.`;
}

// "Fre 13. nov"
export function formatShortDate(date) {
  const month = new Intl.DateTimeFormat("da-DK", { month: "short", timeZone: "UTC" }).format(date);
  // Fjern punktummet i "nov."
  const monthWithoutDot = month.replace(".", "");
  return `${formatShortWeekday(date)} ${date.getUTCDate()}. ${monthWithoutDot}`;
}

// "14:00:00" -> "14:00". Giver null hvis der ikke er noget tidspunkt.
export function formatTime(time) {
  if (!time) {
    return null;
  }
  return time.slice(0, 5);
}

// "14:00:00" -> 840 (minutter efter midnat)
export function timeToMinutes(time) {
  const hours = Number(time.slice(0, 2));
  const minutes = Number(time.slice(3, 5));
  return hours * 60 + minutes;
}

// Hvor mange minutter efter midnat klokken er lige nu i Danmark, fx 14:30 -> 870
export function nowInMinutes() {
  // "en-GB" med hourCycle "h23" skriver klokken som "14:30"
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
  }).format(new Date());

  return timeToMinutes(time);
}

// Ugenummer som i en dansk kalender.
// En uge hører til det år, som ugens torsdag ligger i.
export function isoWeek(date) {
  const thursday = addDays(date, 3 - weekdayNumber(date));
  const firstDayOfYear = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const daysSinceNewYear = (thursday.getTime() - firstDayOfYear.getTime()) / ONE_DAY;
  return Math.floor(daysSinceNewYear / 7) + 1;
}

// Et tidspunkt fra databasen, fx "2026-11-13T13:00:00+00:00", omregnet til dansk tid.
// Giver { date: "2026-11-13", time: "14:00:00" }
export function toDanishDateAndTime(timestamp) {
  // "en-CA" skriver det som "2026-11-13, 14:00"
  const text = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
  }).format(new Date(timestamp));

  return {
    date: text.slice(0, 10),
    time: `${text.slice(12, 17)}:00`,
  };
}

// En dato og et klokkeslæt i dansk tid, skrevet så databasen forstår det.
// Fx ("2026-11-13", "14:00") -> "2026-11-13 14:00:00 Europe/Copenhagen"
export function toDatabaseTimestamp(date, time) {
  return `${date} ${time}:00 ${TIME_ZONE}`;
}
