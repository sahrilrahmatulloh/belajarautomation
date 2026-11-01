// Aturan XP awal sesuai PRD FR-05.
// XP hanya diberikan saat aktivitas diselesaikan pertama kali; mengulang lesson,
// kuis, atau challenge tidak menambah XP. Nantinya XP wajib dihitung dan dicatat
// di backend (transaksi XP dapat dilacak), bukan dipercayakan kepada frontend.

export const XP_PER_LESSON = 10;
export const XP_PER_COURSE_COMPLETION = 50;
export const XP_PER_QUIZ = 30;
export const XP_PER_CHALLENGE = 75;

export const XP_REWARDS = [
  { activity: "Menyelesaikan satu lesson", xp: XP_PER_LESSON },
  { activity: "Bonus menyelesaikan seluruh lesson dalam satu course", xp: XP_PER_COURSE_COMPLETION },
  { activity: "Lulus kuis", xp: XP_PER_QUIZ },
  { activity: "Menyelesaikan challenge yang tervalidasi", xp: XP_PER_CHALLENGE },
] as const;
