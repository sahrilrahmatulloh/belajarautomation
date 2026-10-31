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

export function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}
