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

// Opsi level yang dipakai bersama oleh halaman Belajar dan Playground.
export const LEVEL_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

// Nilai filter dari URL yang tidak dikenal (atau nonaktif) dianggap "Semua".
export function validFilterValue(
  value: string,
  options: { value: string; disabled?: boolean }[]
) {
  return options.some((option) => option.value === value && !option.disabled)
    ? value
    : "";
}

// Opsi chip kategori: "Semua" lalu kategori yang punya item, mengikuti urutan
// Learning Center. Kategori tanpa item (mis. Security Testing) disembunyikan.
export function getCategoryOptions(
  orderedCategories: readonly string[],
  presentCategories: Iterable<string>
) {
  const present = new Set(presentCategories);
  return [
    { value: "", label: "Semua" },
    ...orderedCategories
      .filter((category) => present.has(category))
      .map((category) => ({ value: toFilterSlug(category), label: category })),
  ];
}
