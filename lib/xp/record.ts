import "server-only";

import { XP_PER_CHALLENGE, XP_PER_QUIZ } from "@/data/xp";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ChallengeDetail } from "@/types/ChallengeDetail";
import { XpOutcome } from "@/types/Xp";

// Pencatat XP di server (PRD FR-05). Identitas pengguna diambil dari sesi Supabase di cookie
// (diverifikasi ke server Auth), lalu XP dicatat lewat service role. Browser tidak pernah
// mengirim jumlah XP; nilainya ditentukan di sini dari aturan PRD.

export async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

// XP per jenis latihan. Test Case dinilai sendiri oleh pengguna, jadi tidak memberi XP
// (PRD FR-05: XP hanya untuk challenge yang tervalidasi).
export function challengeXp(type: ChallengeDetail["type"]) {
  if (type === "quiz") return XP_PER_QUIZ;
  if (type === "test-case") return 0;
  return XP_PER_CHALLENGE;
}

interface ChallengeRecordRow {
  xp_awarded: number;
  total_xp: number;
}

// Mengembalikan null untuk tamu, akun demo, atau bila pencatatan belum dikonfigurasi;
// penilaian tetap dikembalikan ke pengguna.
export async function recordChallengeAttempt(
  slug: string,
  type: ChallengeDetail["type"],
  score: number,
  passed: boolean
): Promise<XpOutcome | null> {
  const userId = await getAuthenticatedUserId();
  const admin = getSupabaseAdminClient();
  if (!userId || !admin) return null;

  const { data, error } = await admin.rpc("record_challenge_attempt", {
    p_user: userId,
    p_slug: slug,
    p_type: type,
    p_score: Math.max(0, Math.min(100, Math.round(score))),
    p_passed: passed,
    p_xp: challengeXp(type),
  });
  if (error || !data) return null;
  const row = data as ChallengeRecordRow;
  return { xpAwarded: row.xp_awarded, totalXp: row.total_xp };
}
