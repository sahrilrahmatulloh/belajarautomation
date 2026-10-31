"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { DUMMY_ACCOUNTS } from "@/data/dummy/accounts";
import { sessionActions } from "@/lib/session";
import { isValidEmail } from "@/lib/validation";

import AuthField from "./AuthField";

const MIN_PASSWORD_LENGTH = 8;

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agree?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DUMMY: akun tidak disimpan di server. Pendaftar baru selalu ber-role User;
  // role lain hanya bisa diberikan Admin.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors: RegisterErrors = {};

    if (!name.trim()) nextErrors.name = "Nama wajib diisi.";
    if (!normalizedEmail) nextErrors.email = "Email wajib diisi.";
    else if (!isValidEmail(normalizedEmail)) nextErrors.email = "Format email belum benar.";
    else if (DUMMY_ACCOUNTS.some((account) => account.email === normalizedEmail)) {
      nextErrors.email = "Email sudah terdaftar. Silakan masuk.";
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`;
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Konfirmasi password tidak sama.";
    }
    if (!agree) nextErrors.agree = "Kamu perlu menyetujui syarat dan ketentuan.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      sessionActions.signIn({
        name: name.trim(),
        email: normalizedEmail,
        role: "user",
      });
      router.replace("/");
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <AuthField
        id="name"
        label="Nama lengkap"
        value={name}
        onChange={setName}
        autoComplete="name"
        placeholder="Nama kamu"
        error={errors.name}
      />

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
        autoComplete="new-password"
        placeholder="Buat password"
        error={errors.password}
        hint={`Minimal ${MIN_PASSWORD_LENGTH} karakter.`}
      />

      <AuthField
        id="confirm-password"
        label="Konfirmasi password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        placeholder="Ulangi password"
        error={errors.confirmPassword}
      />

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(event) => setAgree(event.target.checked)}
            aria-invalid={errors.agree ? true : undefined}
            aria-describedby={errors.agree ? "agree-error" : undefined}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <span className="text-muted-foreground">
            Saya menyetujui syarat dan ketentuan serta kebijakan privasi belajarautomation.id.
          </span>
        </label>
        {errors.agree && (
          <p id="agree-error" className="mt-1.5 text-xs font-medium text-destructive">
            {errors.agree}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Memproses..." : "Buat Akun"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
