// Halaman latihan untuk Bug Hunt dan Locator Challenge (PRD FR-04): aplikasi tiruan
// di dalam BelajarAutomation, bukan fitur sungguhan.
export const PRACTICE_PAGES = {
  login: "Halaman login",
  checkout: "Halaman checkout",
  registrasi: "Halaman registrasi",
} as const;

export type PracticePageId = keyof typeof PRACTICE_PAGES;
