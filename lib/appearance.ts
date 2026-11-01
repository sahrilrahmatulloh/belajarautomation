import { AVATARS, DEFAULT_AVATAR_ID, getAvatar } from "@/data/avatars";
import { DEFAULT_THEME_ID, getTheme, THEMES } from "@/data/themes";
import { CatAvatar, BannerTheme } from "@/types/Appearance";
import { MembershipTier } from "@/types/Membership";

// Pemeriksaan ini hanya untuk tampilan. Hak pakai avatar dan tema wajib
// diverifikasi di backend nanti, bukan hanya berdasarkan data di browser
// (PRD FR-12, bagian Akses).
function canUse(item: CatAvatar | BannerTheme, tier: MembershipTier) {
  return item.access === "free" || item.includedIn.includes(tier);
}

export function canUseAvatar(avatarId: string, tier: MembershipTier) {
  const avatar = getAvatar(avatarId);
  return avatar !== undefined && canUse(avatar, tier);
}

export function canUseTheme(themeId: string, tier: MembershipTier) {
  const theme = getTheme(themeId);
  return theme !== undefined && canUse(theme, tier);
}

// Pilihan yang tidak dikenal atau tidak lagi boleh dipakai kembali ke bawaan.
export function resolveAvatar(avatarId: string, tier: MembershipTier): CatAvatar {
  return canUseAvatar(avatarId, tier) ? getAvatar(avatarId)! : getAvatar(DEFAULT_AVATAR_ID) ?? AVATARS[0];
}

export function resolveTheme(themeId: string, tier: MembershipTier): BannerTheme {
  return canUseTheme(themeId, tier) ? getTheme(themeId)! : getTheme(DEFAULT_THEME_ID) ?? THEMES[0];
}
