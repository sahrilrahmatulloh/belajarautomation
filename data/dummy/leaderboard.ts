// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Peserta leaderboard contoh (tanpa email atau data pribadi lain). Rank tiap
// pengguna dihitung dari totalXp dengan getRank, tidak ditulis manual.
// Dibentuk deterministik agar hasil server dan browser sama.
//
// Komposisi (tampil): Master 2, Expert 3, Specialist 4, Practitioner 6,
// Apprentice 50, Trainee 12, ditambah 3 pengguna yang memilih tidak tampil.
// Dengan akun dummy (Apprentice, 420 XP), pengguna berada di luar 50 besar
// Global (#51) tetapi di dalam 50 besar tab Apprentice (#36), dan tab
// Apprentice berisi lebih dari 50 orang.

import { DEFAULT_AVATAR_ID } from "@/data/avatars";

export interface LeaderboardUser {
  id: string;
  displayName: string;
  totalXp: number;
  // Avatar kucing aktif (PRD FR-12). Selama baru ada satu avatar, semua memakai avatar bawaan.
  avatarId: string;
  showOnLeaderboard: boolean;
}

const FIRST_NAMES = [
  "Rina", "Dimas", "Ayu", "Fajar", "Nadia", "Bagas", "Citra", "Yoga", "Intan", "Raka",
  "Putri", "Hendra", "Laras", "Galih", "Salsa", "Wahyu", "Dewi", "Arif", "Maya", "Teguh",
];

const LAST_NAMES = [
  "Kartika", "Pratama", "Lestari", "Nugroho", "Safitri", "Saputra", "Maharani", "Permana",
  "Permata", "Aditya", "Anjani", "Wijaya", "Ningsih", "Setiawan", "Hidayat", "Utami", "Kusuma",
];

// Daftar XP per kelompok, dari tertinggi.
const range = (count: number, start: number, step: number) =>
  Array.from({ length: count }, (_, index) => start - index * step);

const VISIBLE_XP = [
  ...[6400, 5820], // Master
  ...[5300, 4600, 3950], // Expert
  ...[3650, 3100, 2700, 2300], // Specialist
  ...[2100, 1820, 1560, 1340, 1180, 1050], // Practitioner
  ...range(35, 995, 16), // Apprentice di atas akun dummy: 995–451
  ...range(15, 415, 8), // Apprentice di bawah akun dummy: 415–303
  ...range(12, 290, 22), // Trainee: 290–48
];

// Memilih tidak ditampilkan di leaderboard (opsi privasi).
const HIDDEN_XP = [1500, 610, 120];

export const DUMMY_LEADERBOARD_USERS: LeaderboardUser[] = [...VISIBLE_XP, ...HIDDEN_XP].map(
  (totalXp, index) => ({
    id: `user-${index + 1}`,
    displayName: `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[(index * 7) % LAST_NAMES.length]}`,
    totalXp,
    avatarId: DEFAULT_AVATAR_ID,
    showOnLeaderboard: index < VISIBLE_XP.length,
  })
);
