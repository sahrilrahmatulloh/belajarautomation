// Popup promosi yang tampil setelah pengguna masuk (PRD 4.7). Diubah lewat file ini sampai
// pengelolaannya tersedia di Panel Admin (Fase 6).
//
// - Ganti id setiap kali isi promosi diganti: popup dengan id baru tampil lagi, walaupun
//   pengguna pernah memilih "Jangan tampilkan lagi" untuk promosi sebelumnya.
// - Isi harus sesuai kondisi nyata; jangan mempromosikan fitur yang belum tersedia.
// - Isi null bila sedang tidak ada promosi.

export interface PromoPopup {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  cta?: { label: string; href: string };
}

export const ACTIVE_PROMO: PromoPopup | null = {
  id: "tema-neon-night-2026-11",
  eyebrow: "Tema baru",
  title: "Tema bergerak Neon Night",
  description: "Kota cyberpunk malam dengan kucing yang asyik ngoding. Gratis untuk semua pengguna, pasang di Kustomisasi profil.",
  image: "/banner/kucing-cyberpunk/banner.webp",
  cta: { label: "Pasang tema", href: "/profile?tab=kustomisasi" },
};
