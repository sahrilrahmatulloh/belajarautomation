import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Buat Password Baru | belajarautomation.com",
};

// Dibuka dari tautan reset di email (lewat /auth/callback), jadi tidak memakai GuestOnly:
// tautan itu memberi sesi sementara untuk mengganti password.
export default function Page() {
  return (
    <AuthShell title="Buat password baru" description="Gunakan password yang belum pernah kamu pakai di sini.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
