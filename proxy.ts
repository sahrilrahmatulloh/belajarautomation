import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

// Next.js 16: "middleware" berganti nama menjadi "proxy".
// Saat ini hanya menyegarkan sesi Supabase. Pemeriksaan hak akses
// tetap dilakukan di server dan RLS, bukan di sini.
export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    // Semua halaman, kecuali aset statis dan gambar.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|webmanifest|woff2?)$).*)",
  ],
};
