// Batas XP dan warna masih sementara; sesuaikan dengan PRD FR-05.
// Warna rank sengaja hex tetap agar tidak ikut tema.
export interface Rank {
  name: string;
  minXp: number;
  color: string;
  emblem?: string;
}

export const RANKS: Rank[] = [
  { name: "Trainee", minXp: 0, color: "#C8794A", emblem: "/ranks/trainee.png" },
  { name: "Apprentice", minXp: 500, color: "#9CA3AF" },
  { name: "Practitioner", minXp: 1500, color: "#EAB308" },
  { name: "Specialist", minXp: 3500, color: "#14B8A6" },
  { name: "Expert", minXp: 7000, color: "#6366F1" },
  { name: "Master", minXp: 12000, color: "#E11D48" },
];

export function getRank(xp: number) {
  return [...RANKS].reverse().find((rank) => xp >= rank.minXp) ?? RANKS[0];
}

export function getNextRank(xp: number) {
  return RANKS.find((rank) => rank.minXp > xp);
}
