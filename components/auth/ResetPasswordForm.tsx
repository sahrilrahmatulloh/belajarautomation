"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, KeyRound } from "lucide-react";

import { ROLE_HOME } from "@/data/navigation";
import { updatePassword } from "@/lib/auth/supabaseAuth";
import { useSession, useSessionReady } from "@/lib/session";
import { useHydrated } from "@/lib/useHydrated";

import AuthField from "./AuthField";
import AuthLoading from "./AuthLoading";

const MIN_PASSWORD_LENGTH = 8;

// Membuat password baru setelah membuka tautan reset dari email. Tautan itu
// memberi sesi sementara; tanpa sesi Supabase, halaman meminta tautan baru.
export default function ResetPasswordForm() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const isSessionReady = useSessionReady();
  const session = useSession();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated || !isSessionReady) return <AuthLoading />;

  if (session?.source !== "supabase") {
    return (
      <section aria-labelledby="reset-expired" className="space-y-4 text-center">
        <h2 id="reset-expired" className="text-lg font-semibold">
          Tautan tidak valid
        </h2>
        <p className="text-sm text-muted-foreground">
          Tautan reset password tidak valid atau sudah kedaluwarsa. Minta tautan baru untuk membuat password baru.
        </p>
        <Link
          href="/forgot-password"
          className="flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Minta tautan baru
        </Link>
      </section>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (password.length < MIN_PASSWORD_LENGTH) nextErrors.password = `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`;
    if (confirmPassword !== password) nextErrors.confirmPassword = "Konfirmasi password tidak sama.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await updatePassword(password);
    if (!result.ok) {
      setIsSubmitting(false);
      setErrors({ form: result.message });
      return;
    }
    router.replace(ROLE_HOME[session.role]);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.form && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {errors.form}
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        Membuat password baru untuk <span className="font-semibold text-foreground">{session.email}</span>.
      </p>

      <AuthField
        id="password"
        label="Password baru"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        placeholder="Buat password baru"
        error={errors.password}
        hint={`Minimal ${MIN_PASSWORD_LENGTH} karakter.`}
      />

      <AuthField
        id="confirm-password"
        label="Konfirmasi password baru"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        placeholder="Ulangi password baru"
        error={errors.confirmPassword}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
      >
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Menyimpan..." : "Simpan password baru"}
      </button>
    </form>
  );
}
