import { BannerTheme, CatAvatar } from "@/types/Appearance";

// Model 3D kucing untuk banner profil (PRD FR-12, Model 3D kucing). Kunci mengikuti
// CatAvatar.catType; gaya kostum memakai model jenis kucingnya. Menambah model: taruh file
// GLB di public/models/<jenis-kucing>.glb (sebaiknya < 2 MB), lalu tambah satu baris di sini.
const CAT_MODELS: Record<string, string> = {
  putih: "/models/kucing-putih.glb",
};

// Model 3D yang tampil di banner, atau undefined bila jenis kucing avatar belum punya model
// atau ilustrasi tema sudah memuat kucing sendiri (agar banner tidak berisi dua kucing).
export function getCatModel(avatar: Pick<CatAvatar, "catType"> | undefined, theme: Pick<BannerTheme, "hasCharacter"> | undefined) {
  if (!avatar || theme?.hasCharacter) return undefined;
  return CAT_MODELS[avatar.catType];
}
