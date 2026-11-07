// Aturan username (PRD FR-13). Sama dengan private.is_valid_username di database;
// pemeriksaan di sini hanya untuk pesan cepat di form, database tetap penentunya.
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;

const USERNAME_PATTERN = /^[a-z_][a-z0-9_]{2,19}$/;

export type UsernameCheck = "tersedia" | "format" | "cadangan" | "dipakai";

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

// Pesan untuk isian username; null jika format sudah benar.
export function usernameFormatError(value: string): string | null {
  const username = normalizeUsername(value);
  if (!username) return "Username wajib diisi.";
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `Username ${USERNAME_MIN}–${USERNAME_MAX} karakter.`;
  }
  if (/^[0-9]/.test(username)) return "Username tidak boleh diawali angka.";
  if (!USERNAME_PATTERN.test(username)) {
    return "Username hanya boleh huruf kecil, angka, dan garis bawah (_).";
  }
  return null;
}

export const USERNAME_CHECK_MESSAGES: Record<Exclude<UsernameCheck, "tersedia">, string> = {
  format: "Username hanya boleh huruf kecil, angka, dan garis bawah (_).",
  cadangan: "Username ini tidak dapat dipakai. Pilih yang lain.",
  dipakai: "Username sudah dipakai. Pilih yang lain.",
};
