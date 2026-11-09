"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, MailCheck, UserPlus } from "lucide-react";

import { DUMMY_ACCOUNTS } from "@/data/dummy/accounts";
import { isSupabaseConfigured } from "@/lib/auth/mode";
import { checkUsername, resendVerificationEmail, signUpWithEmail } from "@/lib/auth/supabaseAuth";
import {
  normalizeUsername,
  USERNAME_CHECK_MESSAGES,
  USERNAME_MAX,
  USERNAME_MIN,
  usernameFormatError,
} from "@/lib/auth/username";
import { getNextTarget, withNextParam } from "@/lib/authRedirect";
import { sessionActions } from "@/lib/session";
import { useHydrated } from "@/lib/useHydrated";
import { isValidEmail } from "@/lib/validation";

import AuthField from "./AuthField";

const MIN_PASSWORD_LENGTH = 8;

interface RegisterErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agree?: string;
  form?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");

  const validate = (normalizedEmail: string) => {
    const nextErrors: RegisterErrors = {};
    if (!name.trim()) nextErrors.name = "Nama wajib diisi.";
    const usernameError = usernameFormatError(username);
    if (usernameError) nextErrors.username = usernameError;
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
    return nextErrors;
  };

  // Akun sungguhan: dibuat di Supabase dan aktif setelah email diverifikasi.
  const registerSupabase = async (normalizedEmail: string) => {
    const availability = await checkUsername(username);
    if (!availability.ok) {
      setErrors({ form: availability.message });
      return;
    }
    if (availability.data !== "tersedia") {
      setErrors({ username: USERNAME_CHECK_MESSAGES[availability.data] });
      return;
    }

    const result = await signUpWithEmail({
      name: name.trim(),
      username,
      email: normalizedEmail,
      password,
      next: getNextTarget() ?? "/",
    });
    if (!result.ok) {
      setErrors(result.code === "username_tidak_tersedia" ? { username: result.message } : { form: result.message });
      return;
    }
    setSentTo(normalizedEmail);
  };

  // DUMMY: tanpa Supabase, akun tidak disimpan di server. Pendaftar baru selalu
  // ber-role User; role lain hanya bisa diberikan Admin.
  const registerDemo = (normalizedEmail: string) => {
    sessionActions.signIn({
      name: name.trim(),
      email: normalizedEmail,
      role: "user",
      roles: ["user"],
    });
    router.replace(getNextTarget() ?? "/");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors = validate(normalizedEmail);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    if (isSupabaseConfigured) {
      await registerSupabase(normalizedEmail);
      setIsSubmitting(false);
      return;
    }
    setTimeout(() => registerDemo(normalizedEmail), 600);
  };

  const handleResend = async () => {
    if (!sentTo) return;
    setResendState("sending");
    const result = await resendVerificationEmail(sentTo, getNextTarget() ?? "/");
    if (!result.ok) {
      setResendState("idle");
      setErrors({ form: result.message });
      return;
    }
    setResendState("sent");
  };

  if (sentTo) {
    return (
      <section aria-labelledby="register-sent" className="space-y-4 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary-accent">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 id="register-sent" className="text-lg font-semibold">
          Cek email kamu
        </h2>
        <p className="text-sm text-muted-foreground">
          Kami mengirim tautan verifikasi ke <span className="font-semibold text-foreground">{sentTo}</span>. Buka tautan itu
          untuk mengaktifkan akun, lalu masuk.
        </p>
        <p className="text-xs text-muted-foreground">Tidak ada di kotak masuk? Cek folder spam atau promosi.</p>

        {errors.form && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {errors.form}
          </p>
        )}
        {resendState === "sent" ? (
          <p role="status" className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Email verifikasi dikirim ulang.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendState === "sending"}
            className="text-sm font-semibold text-primary-accent hover:underline disabled:cursor-wait disabled:opacity-70"
          >
            {resendState === "sending" ? "Mengirim..." : "Kirim ulang email verifikasi"}
          </button>
        )}

        <Link
          href={withNextParam("/login")}
          className="flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-accent"
        >
          Ke halaman masuk
        </Link>
      </section>
    );
  }

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
        id="username"
        label="Username"
        value={username}
        onChange={(value) => setUsername(normalizeUsername(value))}
        autoComplete="username"
        placeholder="mis. sobat_qa"
        error={errors.username}
        hint={`${USERNAME_MIN}–${USERNAME_MAX} karakter: huruf kecil, angka, dan garis bawah (_). Dipakai di profil publik.`}
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
            Saya menyetujui syarat dan ketentuan serta kebijakan privasi belajarautomation.com.
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
        disabled={isSubmitting || !isHydrated}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Memproses..." : "Buat Akun"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href={isHydrated ? withNextParam("/login") : "/login"} className="font-semibold text-primary-accent hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
