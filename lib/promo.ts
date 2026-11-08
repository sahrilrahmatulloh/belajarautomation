"use client";

// Status popup promosi (PRD 4.7), di browser karena belum ada backend.
// - "pending": ditandai saat login berhasil, dipakai sekali di halaman pertama setelah login.
// - "dismissed": promosi yang dipilih "Jangan tampilkan lagi", per akun.

const PENDING_KEY = "belajarautomation-promo-pending";
const DISMISSED_KEY = "belajarautomation-promo-dismissed";

export function markPromoPending() {
  try {
    window.sessionStorage.setItem(PENDING_KEY, "1");
  } catch {
    // Penyimpanan tidak tersedia; popup tidak tampil.
  }
}

// Benar sekali setelah login; tanda langsung dihapus agar popup tidak muncul lagi saat pindah halaman.
export function consumePromoPending() {
  try {
    const pending = window.sessionStorage.getItem(PENDING_KEY) === "1";
    window.sessionStorage.removeItem(PENDING_KEY);
    return pending;
  } catch {
    return false;
  }
}

function readDismissed(): Record<string, string[]> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(DISMISSED_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string[]>) : {};
  } catch {
    return {};
  }
}

export function isPromoDismissed(account: string, promoId: string) {
  return (readDismissed()[account] ?? []).includes(promoId);
}

export function dismissPromo(account: string, promoId: string) {
  const all = readDismissed();
  const next = { ...all, [account]: [...new Set([...(all[account] ?? []), promoId])] };
  try {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan tidak tersedia; pilihan hanya berlaku sampai halaman dimuat ulang.
  }
}
