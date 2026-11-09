"use client";

import type { User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

import { normalizeUsername, type UsernameCheck } from "./username";

// Aksi Supabase Auth untuk form masuk, daftar, dan password (PRD 4.5).
// Semua pesan untuk pengguna dalam Bahasa Indonesia.

export type AuthResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

interface AuthErrorLike {
  code?: string;
  status?: number;
  name?: string;
  message?: string;
}

export const NOT_CONFIGURED_MESSAGE = "Layanan akun belum tersedia. Coba lagi nanti.";
const NETWORK_MESSAGE = "Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.";
const GENERIC_MESSAGE = "Terjadi kesalahan. Coba lagi beberapa saat lagi.";

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Email atau password salah.",
  email_not_confirmed: "Email belum diverifikasi. Buka tautan verifikasi di email kamu, atau kirim ulang emailnya.",
  over_request_rate_limit: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.",
  over_email_send_rate_limit: "Terlalu banyak email dikirim. Coba lagi beberapa menit lagi.",
  weak_password: "Password terlalu lemah. Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.",
  same_password: "Password baru tidak boleh sama dengan password lama.",
  user_banned: "Akun ini dinonaktifkan. Hubungi Admin.",
  session_not_found: "Sesi sudah berakhir. Minta tautan reset password yang baru.",
  session_expired: "Sesi sudah berakhir. Minta tautan reset password yang baru.",
  username_tidak_tersedia: "Username sudah dipakai. Pilih yang lain.",
};

function toFailure(error: AuthErrorLike): { ok: false; code: string; message: string } {
  const code = error.code ?? "";
  if (MESSAGES[code]) return { ok: false, code, message: MESSAGES[code] };
  if (error.status === 429) return { ok: false, code: "over_request_rate_limit", message: MESSAGES.over_request_rate_limit };
  if (error.name === "AuthRetryableFetchError" || error.status === 0 || error.name === "TypeError") {
    return { ok: false, code: "network", message: NETWORK_MESSAGE };
  }
  return { ok: false, code: code || "unknown", message: GENERIC_MESSAGE };
}

function notConfigured(): { ok: false; code: string; message: string } {
  return { ok: false, code: "not_configured", message: NOT_CONFIGURED_MESSAGE };
}

// Alamat kembali dari email. Halaman /auth/callback menukar kode menjadi sesi.
function callbackUrl(next: string) {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult<User>> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user) return toFailure(error ?? {});
    return { ok: true, data: data.user };
  } catch (error) {
    return toFailure(error as AuthErrorLike);
  }
}

export async function checkUsername(username: string): Promise<AuthResult<UsernameCheck>> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { data, error } = await client.rpc("check_username", { candidate: normalizeUsername(username) });
    if (error) return toFailure(error);
    return { ok: true, data: data as UsernameCheck };
  } catch (error) {
    return toFailure(error as AuthErrorLike);
  }
}

interface SignUpInput {
  name: string;
  username: string;
  email: string;
  password: string;
  next: string;
}

// Akun baru belum punya sesi sampai email diverifikasi. Untuk email yang sudah
// terdaftar, Supabase tetap menjawab sukses agar keberadaan akun tidak bocor.
export async function signUpWithEmail(input: SignUpInput): Promise<AuthResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { error } = await client.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: callbackUrl(input.next),
        data: { full_name: input.name, username: normalizeUsername(input.username) },
      },
    });
    if (!error) return { ok: true, data: undefined };
    // Trigger pembuatan akun menolak username yang keburu dipakai orang lain.
    if (error.code === "unexpected_failure" || /database error saving new user/i.test(error.message)) {
      return { ok: false, code: "username_tidak_tersedia", message: MESSAGES.username_tidak_tersedia };
    }
    return toFailure(error);
  } catch (error) {
    return toFailure(error as AuthErrorLike);
  }
}

export async function resendVerificationEmail(email: string, next = "/"): Promise<AuthResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { error } = await client.auth.resend({ type: "signup", email, options: { emailRedirectTo: callbackUrl(next) } });
    return error ? toFailure(error) : { ok: true, data: undefined };
  } catch (error) {
    return toFailure(error as AuthErrorLike);
  }
}

// Selalu tampil sukses ke pengguna, terdaftar atau tidak, agar email tidak bisa ditebak.
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl("/reset-password") });
    if (error && (error.status === 429 || error.code?.startsWith("over_"))) return toFailure(error);
    return { ok: true, data: undefined };
  } catch (error) {
    return toFailure(error as AuthErrorLike);
  }
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return notConfigured();
  try {
    const { error } = await client.auth.updateUser({ password });
    return error ? toFailure(error) : { ok: true, data: undefined };
  } catch (error) {
    return toFailure(error as AuthErrorLike);
  }
}
