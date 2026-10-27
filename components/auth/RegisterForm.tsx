"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import {
  registerAction,
  type RegisterState,
} from "@/actions/auth/register";

import { Input } from "@/components/ui/input";

const initialState: RegisterState = {
  success: false,
  message: "",
};

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [state, formAction, pending] =
    useActionState(registerAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/login");
    }
  }, [state.success, router]);

  return (
    <div className="w-full max-w-md">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Buat akun
        </h1>

        <p className="mt-2 text-muted-foreground">
          Daftar untuk mulai belajar QA Automation.
        </p>
      </div>

      <form
        action={formAction}
        className="mt-8 space-y-5"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium"
          >
            Nama
          </label>

          <div className="relative mt-2">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nama lengkap"
              className="h-12 pl-10"
              required
            />
          </div>
        </div>

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
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
              className="h-12 px-10"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium"
          >
            Konfirmasi Password
          </label>

          <div className="relative mt-2">
            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Ulangi password"
              className="h-12 px-10"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {state.message && !state.success && (
          <p className="text-sm text-destructive">
            {state.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Membuat akun..." : "Daftar"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}