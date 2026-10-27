"use client";

import {
  useActionState,
  useState,
} from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  loginAction,
  type LoginState,
} from "@/actions/auth/login";

import { Input } from "@/components/ui/input";

const initialState: LoginState = {
  success: false,
  message: "",
};

export default function LoginForm() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [state, formAction, pending] =
    useActionState(
      loginAction,
      initialState
    );

  return (
    <div className="w-full max-w-md">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat datang kembali
        </h1>

        <p className="mt-2 text-muted-foreground">
          Masuk untuk melanjutkan perjalanan belajarmu.
        </p>
      </div>

      <form
        action={formAction}
        className="mt-8 space-y-5"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              className="h-12 pl-10"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium"
          >
            Password
          </label>

          <div className="relative mt-2">
            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Masukkan password"
              className="h-12 px-10"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={
                showPassword
                  ? "Sembunyikan password"
                  : "Tampilkan password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              name="rememberMe"
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-primary"
            />

            Ingat saya
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        {/* Error */}
        {state.message && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">
              {state.message}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Masuk..." : "Masuk"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}