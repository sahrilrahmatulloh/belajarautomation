"use client";

import { DEFAULT_AVATAR_ID } from "@/data/avatars";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { ACTIVE_AVATAR, ACTIVE_THEME } from "@/data/dummy/appearance";
import { DEFAULT_THEME_ID } from "@/data/themes";
import { resolveAvatar, resolveTheme } from "@/lib/appearance";
import { useSession } from "@/lib/session";
import { BannerTheme, CatAvatar } from "@/types/Appearance";
import { MembershipTier } from "@/types/Membership";

export interface Appearance {
  avatar: CatAvatar;
  theme: BannerTheme;
  // Tingkat membership untuk menentukan item yang boleh dipakai.
  tier: MembershipTier;
  // Benar untuk akun Supabase: pilihan dapat disimpan ke akun.
  canSave: boolean;
}

// Avatar dan tema yang sedang dipakai (PRD FR-12).
// - Akun Supabase: pilihan tersimpan di akun; kosong berarti Kucing Putih dan tema bawaan.
//   Tingkat membership dari database (pemberian manual Admin atau pembayaran).
// - Akun demo dan tamu: data dummy.
export function useAppearance(): Appearance {
  const session = useSession();
  if (session?.source === "supabase") {
    const tier: MembershipTier = session.membership ?? "basic";
    return {
      avatar: resolveAvatar(session.avatarId ?? DEFAULT_AVATAR_ID, tier),
      theme: resolveTheme(session.themeId ?? DEFAULT_THEME_ID, tier),
      tier,
      canSave: true,
    };
  }
  return { avatar: ACTIVE_AVATAR, theme: ACTIVE_THEME, tier: DUMMY_ACCOUNT.membership, canSave: false };
}
