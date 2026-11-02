const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const pad = (value: number) => String(value).padStart(2, "0");
const clock = (date: Date) => `${pad(date.getHours())}.${pad(date.getMinutes())}`;

// Selisih hari kalender, bukan selisih 24 jam: pukul 23.00 dan 01.00 esoknya berselisih 1.
export function calendarDaysBetween(date: Date, now: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((end.getTime() - start.getTime()) / DAY);
}

// Kurang dari 24 jam: "5 menit lalu", "2 jam lalu". Di atas itu: "Kemarin, 20.14" atau "30 Okt, 14.22".
export function formatNotificationTime(createdAt: string, now = new Date()) {
  const date = new Date(createdAt);
  const elapsed = now.getTime() - date.getTime();

  if (elapsed < MINUTE) return "Baru saja";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} menit lalu`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)} jam lalu`;
  if (calendarDaysBetween(date, now) === 1) return `Kemarin, ${clock(date)}`;

  const year = date.getFullYear() === now.getFullYear() ? "" : ` ${date.getFullYear()}`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}${year}, ${clock(date)}`;
}

// Judul kelompok tanggal: "Hari ini", "Kemarin", lalu tanggal lengkap.
export function formatNotificationDay(createdAt: string, now = new Date()) {
  const date = new Date(createdAt);
  const days = calendarDaysBetween(date, now);
  if (days <= 0) return "Hari ini";
  if (days === 1) return "Kemarin";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
