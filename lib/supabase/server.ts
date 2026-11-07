import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./env";

// Klien Supabase untuk Server Component, Server Action, dan Route Handler.
// Dibuat baru di setiap permintaan; jangan disimpan di variabel modul.
// Memakai sesi pengguna dari cookie, jadi seluruh akses tetap dibatasi RLS.
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component tidak dapat menulis cookie. Penyegaran sesi
          // sudah ditangani proxy.ts, jadi kegagalan di sini aman diabaikan.
        }
      },
    },
  });
}
