import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { supabaseUrl } from "./env";

// Klien service role untuk tugas server yang tidak boleh dilakukan browser, mis. mencatat XP
// setelah jawaban dinilai (PRD FR-05). Melewati RLS, jadi hanya dipakai di Server Action atau
// Route Handler dan tidak pernah diimpor komponen klien (dijaga oleh "server-only").
//
// SUPABASE_SERVICE_ROLE_KEY diisi pemilik di .env.local dan Vercel (secret key / service_role
// dari dashboard Supabase). Tanpa awalan NEXT_PUBLIC_, jadi tidak pernah dikirim ke browser.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isAdminConfigured = supabaseUrl.length > 0 && serviceRoleKey.length > 0;

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isAdminConfigured) return null;
  adminClient ??= createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
