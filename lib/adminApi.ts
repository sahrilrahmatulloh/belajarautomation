"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { MembershipTier } from "@/types/Membership";

// Pemanggil fungsi Admin di database (PRD FR-16 C, D, E). Hak akses diperiksa di database:
// hanya Admin dengan sesi verifikasi dua langkah (aal2). Setiap aksi dicatat di log Admin.

export interface AdminUserRow {
  user_id: string;
  display_name: string;
  username: string | null;
  email: string;
  total_xp: number;
  tier: MembershipTier;
  roles: string[];
  status: "active" | "deactivated";
  created_at: string;
}

export interface AdminMembershipGrant {
  id: number;
  tier: "pro" | "premium";
  source: "manual" | "payment";
  reason: string;
  starts_at: string;
  ends_at: string | null;
  revoked_at: string | null;
  revoke_reason: string | null;
}

export interface AdminUserDetail extends Omit<AdminUserRow, "roles"> {
  roles: string[];
  lessons_completed: number;
  challenges_completed: number;
  xp_corrections: { amount: number; reason: string; created_at: string }[];
  memberships: AdminMembershipGrant[];
}

const MESSAGES: Record<string, string> = {
  bukan_admin: "Sesi Admin belum terverifikasi. Muat ulang halaman lalu masukkan kode authenticator.",
  alasan_wajib: "Alasan wajib diisi, minimal 5 karakter.",
  jumlah_tidak_valid: "Jumlah XP harus berupa angka selain 0, maksimal 100.000.",
  xp_negatif: "Koreksi ditolak karena total XP akan kurang dari 0.",
  pengguna_tidak_ditemukan: "Pengguna tidak ditemukan.",
  tier_tidak_valid: "Pilih paket Pro atau Premium.",
  durasi_tidak_valid: "Durasi harus antara 1 hari dan 10 tahun.",
  tidak_ada_membership_manual: "Pengguna ini tidak punya membership manual yang masih berlaku.",
};

const FALLBACK = "Perubahan belum tersimpan. Coba lagi beberapa saat lagi.";

export type AdminResult<T> = { ok: true; data: T } | { ok: false; message: string };

async function call<T>(fn: string, args: Record<string, unknown>): Promise<AdminResult<T>> {
  const client = getSupabaseBrowserClient();
  if (!client) return { ok: false, message: FALLBACK };
  const { data, error } = await client.rpc(fn, args);
  if (error) return { ok: false, message: MESSAGES[error.message] ?? FALLBACK };
  return { ok: true, data: data as T };
}

export const adminApi = {
  searchUsers: (query: string) => call<AdminUserRow[]>("admin_search_users", { p_query: query }),
  getUser: (userId: string) => call<AdminUserDetail>("admin_get_user", { p_user: userId }),
  adjustXp: (userId: string, amount: number, reason: string) =>
    call<number>("admin_adjust_xp", { p_user: userId, p_amount: amount, p_reason: reason }),
  grantMembership: (userId: string, tier: "pro" | "premium", days: number | null, reason: string) =>
    call<{ tier: MembershipTier; ends_at: string | null }>("admin_grant_membership", { p_user: userId, p_tier: tier, p_days: days, p_reason: reason }),
  revokeMembership: (userId: string, reason: string) => call<MembershipTier>("admin_revoke_membership", { p_user: userId, p_reason: reason }),
};

export const TIER_LABEL: Record<MembershipTier, string> = { basic: "Basic", pro: "Pro", premium: "Premium" };
