import { MembershipTier } from "@/types/Membership";

// Avatar dan tema banner bersifat kosmetik (PRD FR-12): tidak memengaruhi XP,
// rank, maupun leaderboard.
export type AppearanceAccess = "free" | "paid";

interface AppearanceItem {
  id: string;
  name: string;
  access: AppearanceAccess;
  // Tier membership yang membuka item berbayar. Kosong untuk item gratis.
  includedIn: MembershipTier[];
}

export interface CatAvatar extends AppearanceItem {
  // Jenis kucing, mis. "putih", "oren", "hitam-putih", "abu-abu".
  catType: string;
  // Gaya avatar, mis. "Basic", "Developer", "Scholar".
  style: string;
  image: string;
}

export interface BannerTheme extends AppearanceItem {
  image: string;
  thumbnail: string;
  // true bila ilustrasi tema sudah memuat karakter kucing sendiri.
  hasCharacter?: boolean;
}
