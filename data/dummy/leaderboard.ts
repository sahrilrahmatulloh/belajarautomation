// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Peserta leaderboard contoh (tanpa email atau data pribadi lain). Rank tiap
// pengguna dihitung dari totalXp dengan getRank, tidak ditulis manual.
// Dibentuk deterministik agar hasil server dan browser sama.
//
// Komposisi (tampil): Master 2, Expert 3, Specialist 4, Practitioner 6,
// Apprentice 50, Trainee 12, ditambah 3 pengguna yang memilih tidak tampil.
// Dengan akun dummy (Apprentice, 320 XP), pengguna berada di luar 50 besar
// Global (#51) tetapi di dalam 50 besar tab Apprentice (#36), dan tab
// Apprentice berisi lebih dari 50 orang.

import { AVATARS, DEFAULT_AVATAR_ID } from "@/data/avatars";

export interface LeaderboardUser {
  id: string;
  displayName: string;
  totalXp: number;
  // Avatar kucing aktif (PRD FR-12). Selama baru ada satu avatar, semua memakai avatar bawaan.
  avatarId: string;
  showOnLeaderboard: boolean;
  // Untuk profil publik /u/<username> (PRD FR-13).
  username: string;
  bio: string;
  isProfilePublic: boolean;
}

const FIRST_NAMES = [
  "Rina", "Dimas", "Ayu", "Fajar", "Nadia", "Bagas", "Citra", "Yoga", "Intan", "Raka",
  "Putri", "Hendra", "Laras", "Galih", "Salsa", "Wahyu", "Dewi", "Arif", "Maya", "Teguh",
];

const LAST_NAMES = [
  "Kartika", "Pratama", "Lestari", "Nugroho", "Safitri", "Saputra", "Maharani", "Permana",
  "Permata", "Aditya", "Anjani", "Wijaya", "Ningsih", "Setiawan", "Hidayat", "Utami", "Kusuma",
];

const BIOS = [
  "Manual tester yang sedang belajar automation.",
  "Suka menemukan bug sebelum pengguna menemukannya.",
  "Belajar Playwright sedikit demi sedikit setiap hari.",
  "Fresh graduate yang menyiapkan karier sebagai QA Engineer.",
];

// Daftar XP per kelompok, dari tertinggi, mengikuti batas rank PRD FR-05 v2.47.
const range = (count: number, start: number, step: number) =>
  Array.from({ length: count }, (_, index) => start - index * step);

const VISIBLE_XP = [
  ...[5600, 4900], // Master
  ...[4200, 3700, 3250], // Expert
  ...[3000, 2600, 2300, 2000], // Specialist
  ...[1800, 1550, 1320, 1150, 1000, 920], // Practitioner
  ...range(35, 880, 14), // Apprentice di atas akun dummy: 880–404
  ...range(15, 318, 1), // Apprentice di bawah akun dummy: 318–304
  ...range(12, 290, 22), // Trainee: 290–48
];

// Memilih tidak ditampilkan di leaderboard (opsi privasi).
const HIDDEN_XP = [1500, 610, 120];

export const DUMMY_LEADERBOARD_USERS: LeaderboardUser[] = [...VISIBLE_XP, ...HIDDEN_XP].map(
  (totalXp, index) => ({
    id: `user-${index + 1}`,
    displayName: `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[(index * 7) % LAST_NAMES.length]}`,
    // Nama bisa sama, jadi username diberi nomor agar tetap unik.
    username: `${FIRST_NAMES[index % FIRST_NAMES.length]}-${LAST_NAMES[(index * 7) % LAST_NAMES.length]}-${index + 1}`.toLowerCase(),
    bio: BIOS[index % BIOS.length],
    // Setiap pengguna ke-9 memilih profil privat.
    isProfilePublic: index % 9 !== 8,
    totalXp,
    // Avatar bervariasi agar leaderboard dummy menampilkan seluruh koleksi.
    avatarId: AVATARS[index % AVATARS.length]?.id ?? DEFAULT_AVATAR_ID,
    showOnLeaderboard: index < VISIBLE_XP.length,
  })
);
