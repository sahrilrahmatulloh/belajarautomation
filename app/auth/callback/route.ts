import { NextResponse, type NextRequest } from "next/server";

import { isSafeTarget } from "@/lib/authRedirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Tujuan tautan di email verifikasi dan reset password (PRD 4.5).
// Menukar kode dari Supabase menjadi sesi, lalu mengarahkan ke tujuan.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const nextParam = url.searchParams.get("next") ?? "/";
  const next = isSafeTarget(nextParam) ? nextParam : "/";
  const isRecovery = next === "/reset-password";
  const loginWith = (reason: string) => NextResponse.redirect(new URL(`/login?auth=${reason}`, url.origin));

  // Tautan kedaluwarsa atau sudah dipakai.
  if (url.searchParams.get("error") || url.searchParams.get("error_code")) {
    return loginWith(isRecovery ? "reset-invalid" : "link-invalid");
  }

  const code = url.searchParams.get("code");
  const supabase = await createSupabaseServerClient();
  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }

  // Penukaran gagal biasanya karena tautan dibuka di browser lain. Untuk
  // verifikasi, email tetap sudah terverifikasi, jadi cukup masuk ulang.
  return loginWith(isRecovery ? "reset-invalid" : "verified");
}
