"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, LogIn } from "lucide-react";

import { DUMMY_ACCOUNTS, DUMMY_PASSWORD } from "@/data/dummy/accounts";
import { ROLE_HOME, ROLE_LABELS } from "@/data/navigation";
import { sessionActions } from "@/lib/session";
import { isValidEmail } from "@/lib/validation";

import AuthField from "./AuthField";

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DUMMY: dicocokkan dengan akun demo di browser, bukan ke server.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};
    if (!email.trim()) nextErrors.email = "Email wajib diisi.";
    else if (!isValidEmail(email)) nextErrors.email = "Format email belum benar.";
    if (!password) nextErrors.password = "Password wajib diisi.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    // Jeda singkat agar status memuat terlihat seperti permintaan ke server.
    setTimeout(() => {
      const account = DUMMY_ACCOUNTS.find(
        (item) => item.email === email.trim().toLowerCase()
      );

      if (!account || password !== DUMMY_PASSWORD) {
        setErrors({ form: "Email atau password salah." });
        setIsSubmitting(false);
        return;
      }

      sessionActions.signIn({
        name: account.name,
        email: account.email,
        role: account.role,
      });
      router.replace(ROLE_HOME[account.role]);
    }, 600);
  };

  const fillDemoAccount = (accountEmail: string) => {
    setEmail(accountEmail);
    setPassword(DUMMY_PASSWORD);
    setErrors({});
  };

  return (
    <div className="space-y-8">
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

        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="nama@email.com"
          error={errors.email}
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Masukkan password"
          error={errors.password}
          action={
            <span className="text-xs text-muted-foreground" title="Segera hadir">
              Lupa password? (segera hadir)
            </span>
          }
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </form>

      {/* Akun demo per role */}
      <section
        aria-labelledby="demo-accounts"
        className="rounded-2xl border border-dashed border-border bg-muted/30 p-4"
      >
        <h2 id="demo-accounts" className="text-sm font-semibold">
          Akun demo
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Pilih role untuk mengisi form otomatis. Password semua akun:{" "}
          <span className="font-mono font-semibold text-foreground">{DUMMY_PASSWORD}</span>
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {DUMMY_ACCOUNTS.map((account) => (
            <button
              key={account.role}
              type="button"
              onClick={() => fillDemoAccount(account.email)}
              aria-pressed={email === account.email}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                email === account.email
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:bg-accent"
              }`}
            >
              <span className="block font-semibold">{ROLE_LABELS[account.role]}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {account.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
