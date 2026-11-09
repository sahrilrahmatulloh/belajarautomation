// Tanggal artikel berformat YYYY-MM-DD, tanpa jam, jadi dibaca sebagai UTC agar tidak
// bergeser hari mengikuti zona waktu. Mis. "28 Okt 2026".
export function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${date}T00:00:00Z`))
    .replace(".", "");
}
