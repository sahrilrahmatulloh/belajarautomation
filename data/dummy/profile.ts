// DATA DUMMY — hapus sebelum rilis (PRD FR-13, aturan bisnis #16).
// Profil akun demo. Nama tampilan mengikuti akun agar sama di semua halaman.
import { DUMMY_ACCOUNT } from "@/data/dummy/account";

export const DUMMY_PROFILE = {
  displayName: DUMMY_ACCOUNT.name,
  username: "sobatqa",
  bio: "Sedang belajar QA dari dasar menuju automation testing.",
  // Nilai awal opsi "Profil dapat dilihat publik" (PRD FR-13).
  isProfilePublic: true,
};
