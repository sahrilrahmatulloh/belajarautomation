// DATA DUMMY — hapus sebelum rilis (PRD FR-12).
// Avatar dan tema aktif akun demo. Nanti diganti preferensi pengguna dari backend.
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { resolveAvatar, resolveTheme } from "@/lib/appearance";

export const DUMMY_APPEARANCE = {
  avatarId: "kucing-oren",
  themeId: "mountain-workspace",
};

export const ACTIVE_AVATAR = resolveAvatar(DUMMY_APPEARANCE.avatarId, DUMMY_ACCOUNT.membership);
export const ACTIVE_THEME = resolveTheme(DUMMY_APPEARANCE.themeId, DUMMY_ACCOUNT.membership);
