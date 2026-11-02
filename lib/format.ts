// timeZone UTC agar hasil server dan browser sama (tanpa hydration mismatch).
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function toUtcDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`);
}

export function formatDate(isoDate: string) {
  return dateFormatter.format(toUtcDate(isoDate));
}

export function daysBetween(fromIsoDate: string, toIsoDate: string) {
  const diff = toUtcDate(toIsoDate).getTime() - toUtcDate(fromIsoDate).getTime();
  return Math.max(0, Math.round(diff / 86_400_000));
}

// Tanggal lokal N hari sebelum tanggal acuan.
export function dateFromDaysAgo(today: Date, daysAgo: number) {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
}

// Label relatif yang tidak bergantung pada jam, jadi aman dirender di server.
export function formatDaysAgo(daysAgo: number) {
  if (daysAgo === 0) return "hari ini";
  if (daysAgo === 1) return "kemarin";
  return `${daysAgo} hari lalu`;
}

export function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number) {
  return rupiahFormatter.format(value);
}
