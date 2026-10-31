// DATA DUMMY untuk demo tampilan. Bukan data pengguna nyata.
// Hapus file ini saat auth, penyimpanan progress, dan sistem XP tersedia.

export const DUMMY_ACCOUNT = {
  name: "Sobat QA",
  xp: 320,
  completedLessons: 12,
  completedChallenges: 4,
  streakDays: 5,
};

export interface LeaderboardEntry {
  name: string;
  xp: number;
  isCurrentUser?: boolean;
}

// Diurutkan dari XP tertinggi.
export const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
  { name: "Rina Kartika", xp: 12840 },
  { name: "Dimas Pratama", xp: 9310 },
  { name: "Ayu Lestari", xp: 7425 },
  { name: "Fajar Nugroho", xp: 5120 },
  { name: "Nadia Safitri", xp: 3980 },
  { name: "Bagas Saputra", xp: 2760 },
  { name: "Citra Maharani", xp: 1890 },
  { name: "Yoga Permana", xp: 1240 },
  { name: "Intan Permata", xp: 860 },
  { name: "Raka Aditya", xp: 540 },
  { name: "Putri Anjani", xp: 410 },
  { name: DUMMY_ACCOUNT.name, xp: DUMMY_ACCOUNT.xp, isCurrentUser: true },
  { name: "Hendra Wijaya", xp: 180 },
  { name: "Laras Ningsih", xp: 95 },
];
