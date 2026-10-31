import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import GuestOnly from "@/components/auth/GuestOnly";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar | belajarautomation.id",
};

export default function Page() {
  return (
    <GuestOnly>
      <AuthShell
        title="Buat akun baru"
        description="Gratis untuk mulai belajar QA Automation dari dasar."
      >
        <RegisterForm />
      </AuthShell>
    </GuestOnly>
  );
}
