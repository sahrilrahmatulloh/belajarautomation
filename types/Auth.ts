import { UserRole } from "./Role";

export interface DummyAccount {
  userId: string;
  name: string;
  email: string;
  // Peran utama: menentukan halaman awal setelah login.
  role: UserRole;
  roles: UserRole[];
  // Label pilihan di halaman login, bila berbeda dari nama peran utama.
  label?: string;
}

// Sesi dummy di browser; tidak menyimpan password.
export interface Session {
  // Kosong untuk akun yang baru mendaftar di tahap dummy.
  userId?: string;
  name: string;
  email: string;
  // Peran utama: menentukan halaman awal setelah login.
  role: UserRole;
  roles: UserRole[];
}
