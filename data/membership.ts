import { MembershipPlan, MembershipTier } from "@/types/Membership";

// Membership sesuai PRD FR-10 (v2.0). Harga Pro dan Premium adalah harga simulasi,
// belum final. Pro dan Premium memakai model Lifetime untuk course premium yang
// tersedia pada saat pembelian.
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    tier: "basic",
    name: "Basic",
    tagline: "Belajar dari nol tanpa biaya.",
    price: null,
    ebookCredits: 0,
    projectCredits: 0,
    highlights: [
      "Semua course gratis",
      "Kuis dan challenge course gratis",
      "XP, rank hingga Master, dan leaderboard",
      "Avatar dan tema banner gratis",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    tagline: "Buka materi lanjutan untuk naik level.",
    price: 199000,
    ebookCredits: 1,
    projectCredits: 1,
    recommended: true,
    highlights: [
      "Semua benefit Basic",
      "Course premium yang tersedia saat pembelian",
      "Kuis dan challenge course premium",
      "Avatar dan tema banner berbayar sesuai paket",
      "1 kredit eBook dan 1 kredit project",
    ],
  },
  {
    tier: "premium",
    name: "Premium",
    tagline: "Paket terlengkap dengan kredit produk terbanyak.",
    price: 399000,
    ebookCredits: 3,
    projectCredits: 3,
    highlights: [
      "Semua benefit Pro",
      "Course premium yang tersedia saat pembelian",
      "Avatar dan tema banner berbayar sesuai paket",
      "3 kredit eBook dan 3 kredit project",
    ],
  },
];

export function getMembershipPlan(tier: MembershipTier) {
  return MEMBERSHIP_PLANS.find((plan) => plan.tier === tier)!;
}

// Tabel perbandingan PRD FR-10. Nilai boolean ditampilkan sebagai ikon.
export const MEMBERSHIP_COMPARISON: {
  feature: string;
  values: Record<MembershipTier, string | boolean>;
}[] = [
  { feature: "Course gratis", values: { basic: true, pro: true, premium: true } },
  { feature: "Course premium (yang tersedia saat pembelian)", values: { basic: "Katalog dan cuplikan", pro: true, premium: true } },
  { feature: "Kuis dan challenge course gratis", values: { basic: true, pro: true, premium: true } },
  { feature: "Kuis dan challenge course premium", values: { basic: false, pro: true, premium: true } },
  { feature: "XP, rank, dan leaderboard", values: { basic: "Ya, hingga Master", pro: true, premium: true } },
  { feature: "Avatar dan tema banner gratis", values: { basic: true, pro: true, premium: true } },
  { feature: "Avatar dan tema banner berbayar", values: { basic: false, pro: "Sesuai paket", premium: "Sesuai paket" } },
  { feature: "Kredit eBook", values: { basic: "0", pro: "1", premium: "3" } },
  { feature: "Kredit project", values: { basic: "0", pro: "1", premium: "3" } },
  { feature: "Beli eBook dan project terpisah", values: { basic: true, pro: true, premium: true } },
  { feature: "Bonus XP atau rank karena pembayaran", values: { basic: false, pro: false, premium: false } },
];
