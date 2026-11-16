// Date helpers for the calendar.
// Dates are handled as "YYYY-MM-DD" strings and UTC Date objects,
// so the server's time zone never shifts a day.

const TIME_ZONE = "Europe/Copenhagen";

export const WEEKDAY_LABELS = ["man", "tir", "ons", "tor", "fre", "lør", "søn"];

export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function parseIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00Z`);
  // Rejects dates like 2026-02-31
  return toIsoDate(date) === value ? date : null;
}

export function today() {
  // en-CA formats as YYYY-MM-DD
  const value = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());
  return parseIsoDate(value);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

// All days shown in the month view: whole weeks from Monday to Sunday.
export function getMonthGrid(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const lastOfMonth = new Date(Date.UTC(year, month + 1, 0));

  // getUTCDay() is 0 for Sunday – we want Monday as the first day
  const start = addDays(firstOfMonth, -((firstOfMonth.getUTCDay() + 6) % 7));
  const end = addDays(lastOfMonth, (7 - lastOfMonth.getUTCDay()) % 7);

  const weeks = [];
  for (let day = start; day <= end; day = addDays(day, 1)) {
    if (weeks.length === 0 || weeks.at(-1).length === 7) {
      weeks.push([]);
    }
    weeks.at(-1).push({
      date: day,
      iso: toIsoDate(day),
      inMonth: day.getUTCMonth() === month,
    });
  }

  return { weeks, start: toIsoDate(start), end: toIsoDate(end) };
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// "November"
export function formatMonth(date) {
  const month = new Intl.DateTimeFormat("da-DK", { month: "long", timeZone: "UTC" }).format(date);
  return capitalize(month);
}

// "Mandag 9 november"
export function formatLongDate(date) {
  const parts = new Intl.DateTimeFormat("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type).value;
  return `${capitalize(get("weekday"))} ${get("day")} ${get("month")}`;
}

// "14:00:00" -> "14:00"
export function formatTime(time) {
  return time ? time.slice(0, 5) : null;
}

// Minutes since midnight right now in Denmark, e.g. 14:30 -> 870
export function nowInMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
  }).formatToParts(new Date());
  const get = (type) => Number(parts.find((part) => part.type === type).value);
  return get("hour") * 60 + get("minute");
}

// "14:00:00" -> 840
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// The selected day with three days on each side
export function getWeekStrip(date) {
  return [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
    const day = addDays(date, offset);
    return { date: day, iso: toIsoDate(day) };
  });
}

// "Man"
export function formatShortWeekday(date) {
  return capitalize(WEEKDAY_LABELS[(date.getUTCDay() + 6) % 7]);
}

// "Mandag 9."
export function formatDayTitle(date) {
  const weekday = new Intl.DateTimeFormat("da-DK", { weekday: "long", timeZone: "UTC" }).format(date);
  return `${capitalize(weekday)} ${date.getUTCDate()}.`;
}

// ISO week number: weeks start on Monday, and a week belongs to the year its Thursday is in
export function isoWeek(date) {
  const thursday = addDays(date, 3 - ((date.getUTCDay() + 6) % 7));
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  return Math.floor((thursday - yearStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
}

// "Nov" – the short month names used in the year overview
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

export function formatShortMonth(monthIndex) {
  return SHORT_MONTHS[monthIndex];
}

// "juli"
export function formatMonthName(monthIndex) {
  return new Intl.DateTimeFormat("da-DK", { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(2026, monthIndex, 1)),
  );
}

// "Fre 13. nov"
export function formatShortDate(date) {
  const month = new Intl.DateTimeFormat("da-DK", { month: "short", timeZone: "UTC" }).format(date);
  return `${formatShortWeekday(date)} ${date.getUTCDate()}. ${month.replace(".", "")}`;
}
