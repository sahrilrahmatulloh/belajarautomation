"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { refreshSupabaseAccount } from "@/lib/session";

import { NOT_CONFIGURED_MESSAGE, type AuthResult } from "./supabaseAuth";
import { normalizeUsername } from "./username";

// Pengaturan Informasi Profil untuk akun Supabase (PRD FR-13).
// Aturan ditegakkan di fungsi database; pesan di sini hanya menerjemahkannya.

export const DISPLAY_NAME_MAX = 100;
export const BIO_MAX = 160;
export const USERNAME_COOLDOWN_DAYS = 30;

interface DbError {
  code?: string;
  message?: string;
  details?: string | null;
  status?: number;
  name?: string;
}

const MESSAGES: Record<string, string> = {
  nama_wajib: "Nama tampilan wajib diisi.",
  nama_terlalu_panjang: `Nama tampilan maksimal ${DISPLAY_NAME_MAX} karakter.`,
  bio_terlalu_panjang: `Tentang saya maksimal ${BIO_MAX} karakter.`,
  akun_tidak_aktif: "Akun ini dinonaktifkan. Hubungi Admin.",
  tidak_login: "Sesi sudah berakhir. Silakan masuk lagi.",
  username_sama: "Username baru sama dengan username sekarang.",
  username_format: "Username hanya boleh huruf kecil, angka, dan garis bawah (_).",
  username_cadangan: "Username ini tidak dapat dipakai. Pilih yang lain.",
  username_dipakai: "Username sudah dipakai. Pilih yang lain.",
  item_terkunci: "Avatar atau tema ini terkunci untuk paketmu.",
  avatar_tidak_dikenal: "Avatar tidak dikenal. Muat ulang halaman lalu coba lagi.",
  tema_tidak_dikenal: "Tema tidak dikenal. Muat ulang halaman lalu coba lagi.",
};

const NETWORK_MESSAGE = "Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.";
const GENERIC_MESSAGE = "Perubahan belum tersimpan. Coba lagi beberapa saat lagi.";

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(
    new Date(value)
  );
}

function toFailure(error: DbError): { ok: false; code: string; message: string } {
  const code = error.message ?? "";
  if (code === "username_jeda" && error.details) {
    return {
      ok: false,
      code,
      message: `Username baru bisa diganti lagi mulai ${formatDate(error.details)}.`,
    };
  }
  if (MESSAGES[code]) return { ok: false, code, message: MESSAGES[code] };
  // Dua orang memilih username yang sama di saat bersamaan.
  if (error.code === "23505") return { ok: false, code: "username_dipakai", message: MESSAGES.username_dipakai };
  if (error.name === "TypeError" || error.status === 0) return { ok: false, code: "network", message: NETWORK_MESSAGE };
  return { ok: false, code: error.code ?? "unknown", message: GENERIC_MESSAGE };
}

function notConfigured(): { ok: false; code: string; message: string } {
  return { ok: false, code: "not_configured", message: NOT_CONFIGURED_MESSAGE };
}

export async function saveProfile(displayName: string, bio: string): Promise<AuthResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { error } = await client.rpc("update_profile", { new_display_name: displayName, new_bio: bio });
    if (error) return toFailure(error);
    await refreshSupabaseAccount();
    return { ok: true, data: undefined };
  } catch (error) {
    return toFailure(error as DbError);
  }
}

// Mengembalikan waktu paling cepat untuk mengganti username lagi.
export async function changeUsername(username: string): Promise<AuthResult<string>> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { data, error } = await client.rpc("change_username", { new_username: normalizeUsername(username) });
    if (error) return toFailure(error);
    await refreshSupabaseAccount();
    return { ok: true, data: data as string };
  } catch (error) {
    return toFailure(error as DbError);
  }
}

// Menyimpan avatar dan tema pilihan (PRD FR-12). Hak pakai diperiksa di database.
export async function saveAppearance(avatarId: string, themeId: string): Promise<AuthResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { error } = await client.rpc("set_appearance", { new_avatar_id: avatarId, new_theme_id: themeId });
    if (error) return toFailure(error);
    await refreshSupabaseAccount();
    return { ok: true, data: undefined };
  } catch (error) {
    return toFailure(error as DbError);
  }
}

// Supabase mengirim tautan konfirmasi ke email lama dan baru (Secure email change).
// Email baru berlaku setelah keduanya dikonfirmasi.
export async function changeEmail(email: string): Promise<AuthResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/settings?email=dikonfirmasi")}`;
    const { error } = await client.auth.updateUser({ email }, { emailRedirectTo: redirect });
    if (error) {
      if (error.code === "email_exists") return { ok: false, code: error.code, message: "Email ini sudah dipakai akun lain." };
      if (error.status === 429 || error.code?.startsWith("over_")) {
        return { ok: false, code: "rate_limit", message: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi." };
      }
      return toFailure({ ...error, message: error.code ?? error.message });
    }
    await refreshSupabaseAccount();
    return { ok: true, data: undefined };
  } catch (error) {
    return toFailure(error as DbError);
  }
}

// Waktu paling cepat username boleh diganti; null jika sudah boleh.
export function nextUsernameChange(changedAt: string | null | undefined, now = Date.now()): Date | null {
  if (!changedAt) return null;
  const next = new Date(new Date(changedAt).getTime() + USERNAME_COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
  return next.getTime() > now ? next : null;
}
