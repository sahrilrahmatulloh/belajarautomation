// Logika filter bersama untuk halaman katalog (Belajar, Playground).

// Cocok bila kata kunci kosong atau ada di salah satu teks.
export function matchesKeyword(keyword: string, ...texts: string[]) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return true;
  return texts.some((text) => text.toLowerCase().includes(normalized));
}

// "Web Automation" -> "web-automation", untuk nilai filter di URL.
export function toFilterSlug(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
