import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Masuk | belajarautomation.id",
};

// Satu halaman masuk untuk semua role (User, Creator, Reviewer, Admin).
export default function Page() {
  return (
    <AuthShell
      title="Selamat datang kembali"
      description="Masuk untuk melanjutkan belajar atau mengelola konten sesuai role kamu."
    >
      <LoginForm />
    </AuthShell>
  );
}
