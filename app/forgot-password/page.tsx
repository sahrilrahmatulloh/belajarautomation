import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import GuestOnly from "@/components/auth/GuestOnly";

export const metadata: Metadata = {
  title: "Lupa Password | belajarautomation.com",
};

export default function Page() {
  return (
    <GuestOnly>
      <AuthShell
        title="Lupa password"
        description="Masukkan email akunmu. Kami akan mengirim tautan untuk membuat password baru."
      >
        <ForgotPasswordForm />
      </AuthShell>
    </GuestOnly>
  );
}
