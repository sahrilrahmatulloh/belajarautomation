export type ActivityType =
  | "lesson"
  // Seluruh lesson dalam satu modul selesai; sumber XP materi (PRD FR-05 v2.47).
  | "module_complete"
  | "course_complete"
  | "quiz"
  | "challenge"
  | "achievement"
  | "rank_up"
  // Koreksi XP oleh Admin (PRD FR-16 D); bisa bernilai negatif.
  | "correction";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  // Judul lesson, course, challenge, achievement, atau rank sesuai data aslinya.
  title: string;
  xp: number;
  // Jumlah hari sebelum hari ini, agar riwayat selalu berada di 30 hari terakhir.
  daysAgo: number;
  // Jam aktivitas, format "HH:mm".
  time: string;
  courseSlug?: string;
  lessonSlug?: string;
  challengeSlug?: string;
  achievementId?: string;
}
