// Hasil pencatatan XP oleh server (PRD FR-05). Hanya ada untuk akun Supabase; akun demo
// memakai pencatatan lokal.
export interface XpOutcome {
  xpAwarded: number;
  totalXp: number;
}

export type LessonCompletionResult =
  | { ok: true; xpAwarded: number; courseBonus: boolean; totalXp: number; lessonsCompleted: number }
  | { ok: false; message: string };
