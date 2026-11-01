// Konfigurasi awal rank dan XP sesuai PRD FR-05.
// Batas XP ditinjau ulang setiap kali jumlah konten berubah signifikan.
// Warna rank sengaja hex tetap: identitas rank tidak ikut mode terang/gelap.
export interface Rank {
  name: string;
  minXp: number;
  color: string;
  // Jumlah bintang di emblem; penanda tingkat selain warna.
  stars: number;
  emblem: string;
  description: string;
}

export const RANKS: Rank[] = [
  {
    name: "Trainee",
    minXp: 0,
    color: "#C8794A",
    stars: 1,
    emblem: "/ranks/trainee.webp",
    description: "Baru mulai belajar",
  },
  {
    name: "Apprentice",
    minXp: 300,
    color: "#9CA3AF",
    stars: 2,
    emblem: "/ranks/apprentice.webp",
    description: "Menyelesaikan roadmap Fundamental",
  },
  {
    name: "Practitioner",
    minXp: 1000,
    color: "#EAB308",
    stars: 3,
    emblem: "/ranks/practitioner.webp",
    description: "Menyelesaikan satu roadmap lengkap",
  },
  {
    name: "Specialist",
    minXp: 2200,
    color: "#10B981",
    stars: 4,
    emblem: "/ranks/specialist.webp",
    description: "Menyelesaikan sekitar dua roadmap",
  },
  {
    name: "Expert",
    minXp: 3800,
    color: "#A855F7",
    stars: 5,
    emblem: "/ranks/expert.webp",
    description: "Menyelesaikan sebagian besar jalur automation",
  },
  {
    name: "Master",
    minXp: 5500,
    color: "#DC2626",
    stars: 6,
    emblem: "/ranks/master.webp",
    description: "Menyelesaikan hampir seluruh konten dan challenge",
  },
];

// XP hanya diberikan saat aktivitas diselesaikan pertama kali.
export const XP_REWARDS = [
  { activity: "Menyelesaikan satu lesson", xp: 10 },
  { activity: "Bonus menyelesaikan seluruh lesson dalam satu course", xp: 50 },
  { activity: "Lulus kuis", xp: 30 },
  { activity: "Menyelesaikan challenge yang tervalidasi", xp: 75 },
] as const;

export const XP_PER_LESSON = XP_REWARDS[0].xp;
export const XP_PER_COURSE_BONUS = XP_REWARDS[1].xp;
export const XP_PER_QUIZ = XP_REWARDS[2].xp;
export const XP_PER_CHALLENGE = XP_REWARDS[3].xp;

export function getRank(xp: number) {
  return [...RANKS].reverse().find((rank) => xp >= rank.minXp) ?? RANKS[0];
}

export function getNextRank(xp: number) {
  return RANKS.find((rank) => rank.minXp > xp);
}
