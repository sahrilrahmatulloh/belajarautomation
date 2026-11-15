// Aturan XP sesuai PRD FR-05 (v2.47).
// XP hanya diberikan saat aktivitas diselesaikan pertama kali; mengulang lesson,
// kuis, atau challenge tidak menambah XP. XP dihitung dan dicatat di server
// (transaksi XP dapat dilacak), bukan dipercayakan kepada frontend.
// XP materi diberikan per modul selesai, bukan per lesson.

export const XP_PER_MODULE = 10;
export const XP_PER_COURSE_COMPLETION = 50;
export const XP_PER_QUIZ = 30;
export const XP_PER_CHALLENGE = 75;

export const XP_REWARDS = [
  { activity: "Menyelesaikan seluruh lesson dalam satu modul", xp: XP_PER_MODULE },
  { activity: "Bonus menyelesaikan seluruh lesson dalam satu course", xp: XP_PER_COURSE_COMPLETION },
  { activity: "Lulus kuis", xp: XP_PER_QUIZ },
  { activity: "Menyelesaikan challenge yang tervalidasi", xp: XP_PER_CHALLENGE },
] as const;
