import { MembershipTier } from "./Membership";
import { UserRole } from "./Role";

export interface DummyAccount {
  userId: string;
  name: string;
  email: string;
  // Peran utama: menentukan halaman awal setelah login.
  role: UserRole;
  roles: UserRole[];
}

// Sesi aplikasi; tidak menyimpan password.
export interface Session {
  // "supabase" untuk akun sungguhan, "demo" untuk akun demo di DEV.
  source?: "demo" | "supabase";
  // Kosong untuk akun yang baru mendaftar di tahap dummy.
  userId?: string;
  // Hanya untuk akun Supabase; kosong jika belum memilih username.
  username?: string | null;
  // Hanya akun Supabase: Tentang saya, waktu ganti username terakhir, dan email baru
  // yang menunggu konfirmasi.
  bio?: string;
  usernameChangedAt?: string | null;
  pendingEmail?: string | null;
  // Hanya akun Supabase: avatar dan tema pilihan; kosong berarti bawaan (PRD FR-12).
  avatarId?: string | null;
  themeId?: string | null;
  // Hanya akun Supabase: membership yang berlaku dari database (PRD FR-10, FR-16 E).
  membership?: MembershipTier;
  name: string;
  email: string;
  // Peran utama: menentukan halaman awal setelah login.
  role: UserRole;
  roles: UserRole[];
}
