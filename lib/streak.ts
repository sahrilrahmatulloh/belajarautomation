// Jumlah hari berturut-turut (zona WIB) yang memiliki aktivitas, berakhir hari ini atau kemarin.
// Bila hari ini belum ada aktivitas, streak kemarin tetap dihitung agar tidak langsung putus.
const DAY_MS = 24 * 60 * 60 * 1000;
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function wibDay(value: string | number) {
  return Math.floor((new Date(value).getTime() + WIB_OFFSET_MS) / DAY_MS);
}

export function learningStreak(timestamps: string[], now = Date.now()) {
  const days = new Set(timestamps.map(wibDay));
  const today = wibDay(now);
  let day = days.has(today) ? today : today - 1;
  let streak = 0;
  while (days.has(day)) {
    streak += 1;
    day -= 1;
  }
  return streak;
}
