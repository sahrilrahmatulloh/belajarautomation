// Batas XP rank sesuai PRD FR-05. Ditinjau ulang setiap kali jumlah konten
// berubah signifikan. Aturan perolehan XP ada di data/xp.ts.
// Warna rank sengaja hex tetap: identitas rank tidak ikut mode terang/gelap.
// Warna terang (silver, gold) dipakai untuk lencana/border, bukan teks di latar terang.
export interface Rank {
  name: string;
  minXp: number;
  color: string;
  // Warna aksen tambahan, saat ini hanya Master (gold).
  accentColor?: string;
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
    color: "#9333EA",
    stars: 5,
    emblem: "/ranks/expert.webp",
    description: "Menyelesaikan sebagian besar jalur automation",
  },
  {
    name: "Master",
    minXp: 5500,
    color: "#B91C1C",
    accentColor: "#F59E0B",
    stars: 6,
    emblem: "/ranks/master.webp",
    description: "Menyelesaikan hampir seluruh konten dan challenge",
  },
];

export function getRank(xp: number) {
  return [...RANKS].reverse().find((rank) => xp >= rank.minXp) ?? RANKS[0];
}

export function getNextRank(xp: number) {
  return RANKS.find((rank) => rank.minXp > xp);
}

// Progres menuju rank berikutnya. Untuk Master, nextRank undefined dan
// tidak ada progress bar yang perlu ditampilkan.
export function getRankProgress(xp: number) {
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  if (!nextRank) return { rank, nextRank, xpToNext: 0, percent: 100 };

  // Dibulatkan ke bawah agar tidak tampil 100% sebelum benar-benar naik rank.
  const percent = Math.floor(((xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100);
  return { rank, nextRank, xpToNext: nextRank.minXp - xp, percent };
}
