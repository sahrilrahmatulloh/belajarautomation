// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Peserta leaderboard contoh. Dibentuk secara deterministik agar hasil
// server dan browser sama, dan cukup banyak untuk menguji batas 50 teratas.

export interface LeaderboardMember {
  id: string;
  name: string;
  // Total XP (periode Sepanjang Waktu).
  xp: number;
  // XP minggu berjalan (periode Mingguan).
  weeklyXp: number;
  // Memilih tidak ditampilkan di leaderboard (opsi privasi).
  hidden?: boolean;
}

// Minggu berjalan: Senin 00.00 WIB sampai Minggu.
export const DUMMY_LEADERBOARD_WEEK = { start: "2026-10-26", end: "2026-11-01" };

const FIRST_NAMES = [
  "Rina", "Dimas", "Ayu", "Fajar", "Nadia", "Bagas", "Citra", "Yoga", "Intan", "Raka",
  "Putri", "Hendra", "Laras", "Galih", "Salsa", "Wahyu", "Dewi", "Arif", "Maya", "Teguh",
];

const LAST_NAMES = [
  "Kartika", "Pratama", "Lestari", "Nugroho", "Safitri", "Saputra", "Maharani", "Permana",
  "Permata", "Aditya", "Anjani", "Wijaya", "Ningsih", "Setiawan", "Hidayat", "Utami", "Kusuma",
];

const roundTo5 = (value: number) => Math.round(value / 5) * 5;

export const DUMMY_LEADERBOARD_MEMBERS: LeaderboardMember[] = Array.from(
  { length: 70 },
  (_, index) => {
    const xp = roundTo5(6400 * 0.955 ** index);
    return {
      id: `member-${index + 1}`,
      name: `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[(index * 7) % LAST_NAMES.length]}`,
      xp,
      weeklyXp: Math.min(xp, ((index * 37) % 23) * 15),
      hidden: index === 3 || index === 41,
    };
  }
);
