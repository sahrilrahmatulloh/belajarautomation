import { DEFAULT_AVATAR_ID, getAvatar } from "@/data/avatars";

// Gambar avatar bawaan (PRD FR-12) untuk pengguna yang belum punya pilihan avatar.
export const DEFAULT_AVATAR = getAvatar(DEFAULT_AVATAR_ID)!.image;
