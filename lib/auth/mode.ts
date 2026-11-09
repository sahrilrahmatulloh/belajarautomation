import { isDev } from "@/lib/env";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Akun demo hanya dipakai di DEV, atau selama Supabase belum dipasang di
// lingkungan tersebut. Di UAT dan Production dengan Supabase, login hanya
// lewat Supabase Auth.
export const isDemoLoginEnabled = isDev || !isSupabaseConfigured;

export { isSupabaseConfigured };
