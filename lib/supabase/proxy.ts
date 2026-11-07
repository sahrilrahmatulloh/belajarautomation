import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./env";

// Cookie sesi Supabase selalu diawali "sb-" (mis. sb-<ref>-auth-token).
export function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(({ name }) => name.startsWith("sb-"));
}

// Menyegarkan token sesi Supabase sebelum halaman dirender, lalu menulis
// cookie baru ke browser. Tamu tanpa cookie sesi dilewati tanpa memanggil
// Supabase, agar halaman publik tetap secepat halaman statis (PRD 8.2).
export async function updateSupabaseSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured || !hasSupabaseSessionCookie(request)) return response;

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  // getClaims memverifikasi JWT dan memicu penyegaran token bila kedaluwarsa.
  // Jangan menaruh kode lain di antara createServerClient dan baris ini.
  await supabase.auth.getClaims();

  return response;
}
