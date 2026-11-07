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
  name: string;
  email: string;
  // Peran utama: menentukan halaman awal setelah login.
  role: UserRole;
  roles: UserRole[];
}
