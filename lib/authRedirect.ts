// Mengarahkan tamu ke login lalu kembali ke tujuan semula (PRD FR-07).
const NEXT_PARAM = "next";

// Halaman yang bisa dibuka tanpa login.
const PUBLIC_PATHS = ["/blog"];

export function isPublicPath(href: string) {
  return PUBLIC_PATHS.some((path) => href === path || href.startsWith(`${path}/`));
}

export function loginHref(target: string) {
  return target === "/" ? "/login" : `/login?${NEXT_PARAM}=${encodeURIComponent(target)}`;
}

// Hanya alamat di dalam situs ini, agar tautan login tidak bisa dipakai untuk
// mengarahkan pengguna ke situs lain setelah masuk.
function isSafeTarget(target: string) {
  return /^\/(?![/\\])/.test(target) && !target.includes("\\") && !/^\/(login|register)\b/.test(target);
}

// Tujuan setelah login dari alamat saat ini. Hanya dipanggil di browser.
export function getNextTarget() {
  const target = new URLSearchParams(window.location.search).get(NEXT_PARAM);
  return target && isSafeTarget(target) ? target : null;
}

// Tautan antara halaman masuk dan daftar, agar tujuan semula tidak hilang.
export function withNextParam(path: string) {
  const target = getNextTarget();
  return target ? `${path}?${NEXT_PARAM}=${encodeURIComponent(target)}` : path;
}
