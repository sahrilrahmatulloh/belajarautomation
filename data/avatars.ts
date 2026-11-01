import { CatAvatar } from "@/types/Appearance";

// Avatar kucing (PRD FR-12). Menambah avatar baru cukup dengan menaruh PNG di
// public/profile, menjalankan npm run optimize:images, lalu menambah satu entri.
//
// Menurut PRD, avatar bawaan final adalah Kucing Putih Basic. Kucing Oren menjadi
// avatar bawaan sementara sampai aset kucing putih tersedia; saat itu ganti
// DEFAULT_AVATAR_ID ke id avatar kucing putih.
export const AVATARS: CatAvatar[] = [
  {
    id: "kucing-oren",
    name: "Kucing Oren",
    catType: "oren",
    style: "Basic",
    image: "/profile/kucing-oren.webp",
    access: "free",
    includedIn: [],
  },
];

export const DEFAULT_AVATAR_ID = "kucing-oren";

export function getAvatar(id: string) {
  return AVATARS.find((avatar) => avatar.id === id);
}
