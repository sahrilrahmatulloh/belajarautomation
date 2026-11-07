"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, MailCheck, Send } from "lucide-react";

import { requestPasswordReset } from "@/lib/auth/supabaseAuth";
import { useHydrated } from "@/lib/useHydrated";
import { isValidEmail } from "@/lib/validation";

import AuthField from "./AuthField";

// Meminta tautan reset password (PRD 4.5). Pesan sukses sama untuk email
// terdaftar maupun tidak, agar keberadaan akun tidak bisa ditebak.
export default function ForgotPasswordForm() {
  const isHydrated = useHydrated();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    setFormError(null);
    if (!normalizedEmail) return setError("Email wajib diisi.");
    if (!isValidEmail(normalizedEmail)) return setError("Format email belum benar.");
    setError(null);

    setIsSubmitting(true);
    const result = await requestPasswordReset(normalizedEmail);
    setIsSubmitting(false);
    if (!result.ok) return setFormError(result.message);
    setSentTo(normalizedEmail);
  };

  if (sentTo) {
    return (
      <section aria-labelledby="reset-sent" className="space-y-4 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary-accent">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 id="reset-sent" className="text-lg font-semibold">
          Cek email kamu
        </h2>
        <p className="text-sm text-muted-foreground">
          Jika <span className="font-semibold text-foreground">{sentTo}</span> terdaftar, kami sudah mengirim tautan untuk
          membuat password baru. Tautan hanya berlaku sebentar, jadi segera buka.
        </p>
        <p className="text-xs text-muted-foreground">Buka tautan di browser yang sama dengan halaman ini.</p>
        <Link
          href="/login"
          className="flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-accent"
        >
          Kembali ke halaman masuk
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </p>
      )}

      <AuthField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="nama@email.com"
        error={error ?? undefined}
      />

      <button
        type="submit"
        disabled={isSubmitting || !isHydrated}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Mengirim..." : "Kirim tautan reset"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Ingat password?{" "}
        <Link href="/login" className="font-semibold text-primary-accent hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
