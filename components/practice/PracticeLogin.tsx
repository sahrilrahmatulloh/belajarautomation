"use client";

import { FormEvent, useState } from "react";

import { Input } from "@/components/ui/input";

const PRACTICE_PASSWORD = "latihan123";

// Bug yang ditanam (data/challengeDetails.ts, bug-hunt-form-login):
// - tombol Masuk tetap aktif dan form diterima walau email kosong;
// - pesan error password salah ketik.
export default function PracticeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<"success" | "wrong-password" | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setResult(password === PRACTICE_PASSWORD ? "success" : "wrong-password");
  };

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      data-practice-id="login-form"
      className="mx-auto max-w-sm space-y-4"
    >
      <div>
        <h2 data-practice-id="login-title" className="text-xl font-bold">
          Masuk ke TokoLatihan
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Akun latihan: siswa@contoh.test, password {PRACTICE_PASSWORD}
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="off"
          placeholder="nama@contoh.test"
          data-practice-id="login-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="login-password" className="text-sm font-medium">
            Password
          </label>
          <a
            href="#lupa-password"
            data-practice-id="login-forgot"
            onClick={(event) => event.preventDefault()}
            className="text-xs font-medium text-primary hover:underline"
          >
            Lupa password?
          </a>
        </div>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="new-password"
          data-practice-id="login-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="remember" data-practice-id="login-remember" className="h-4 w-4 accent-primary" />
        Ingat saya
      </label>

      {result === "wrong-password" && (
        <p role="alert" data-practice-id="login-error" className="text-sm font-medium text-destructive">
          Pasword salah.
        </p>
      )}
      {result === "success" && (
        <p role="status" data-practice-id="login-success" className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Berhasil masuk ke TokoLatihan.
        </p>
      )}

      <button
        type="submit"
        data-practice-id="login-submit"
        className="min-h-10 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Masuk
      </button>

      <button
        type="button"
        data-practice-id="login-sso"
        className="min-h-10 w-full rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
      >
        Masuk dengan SSO
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <a
          href="#daftar"
          data-practice-id="login-register"
          onClick={(event) => event.preventDefault()}
          className="font-medium text-primary hover:underline"
        >
          Daftar
        </a>
      </p>
    </form>
  );
}
