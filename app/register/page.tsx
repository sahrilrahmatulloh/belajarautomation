import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar | belajarautomation.id",
};

export default function Page() {
  return (
    <AuthShell
      title="Buat akun baru"
      description="Gratis untuk mulai belajar QA Automation dari dasar."
    >
      <RegisterForm />
    </AuthShell>
  );
}
