"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, LogIn } from "lucide-react";

import { useMaintenance } from "@/components/maintenance/useMaintenance";
import { DUMMY_ACCOUNTS, DUMMY_PASSWORD } from "@/data/dummy/accounts";
import { ROLE_HOME, ROLE_LABELS } from "@/data/navigation";
import { isDemoLoginEnabled, isSupabaseConfigured } from "@/lib/auth/mode";
import { resendVerificationEmail, signInWithEmail } from "@/lib/auth/supabaseAuth";
import { getNextTarget, withNextParam } from "@/lib/authRedirect";
import { isDev } from "@/lib/env";
import { maintenanceLoginNotice } from "@/lib/maintenanceRules";
import { getContentRepository } from "@/lib/content";
import { loadSupabaseAccount, sessionActions } from "@/lib/session";
import { useHydrated } from "@/lib/useHydrated";
import { isValidEmail } from "@/lib/validation";
import { Session } from "@/types/Auth";

import AuthField from "./AuthField";

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

// Pesan dari tautan email (/auth/callback) atau halaman lain, lewat ?auth=.
const AUTH_NOTICES: Record<string, { tone: "success" | "error"; text: string }> = {
  verified: { tone: "success", text: "Email sudah terverifikasi. Silakan masuk." },
  "link-invalid": { tone: "error", text: "Tautan verifikasi tidak valid atau sudah kedaluwarsa. Masuk untuk mengirim ulang tautan." },
  "reset-invalid": { tone: "error", text: "Tautan reset password tidak valid atau sudah kedaluwarsa. Minta tautan baru." },
};

const DEACTIVATED_MESSAGE = "Akun ini dinonaktifkan. Hubungi Admin.";

export default function LoginForm() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const maintenance = useMaintenance();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("auth");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pesan dibaca sekali dari alamat setelah hidrasi
    if (reason && AUTH_NOTICES[reason]) setNotice(AUTH_NOTICES[reason]);
  }, []);

  const fail = (message: string) => {
    setErrors({ form: message });
    setIsSubmitting(false);
  };

  // Selama maintenance Aktif hanya Admin yang dapat masuk (PRD FR-16 K). Pengguna lain diberi
  // tahu alasan dan perkiraan selesainya.
  const blockedByMaintenance = (roles: Session["roles"]) =>
    maintenance.current && maintenance.isActiveNow() && !roles.includes("admin") ? maintenanceLoginNotice(maintenance.current) : null;

  const finish = (role: Session["role"]) => router.replace(getNextTarget() ?? ROLE_HOME[role]);

  // DUMMY: dicocokkan dengan akun demo di browser, bukan ke server.
  const signInDemo = async (account: (typeof DUMMY_ACCOUNTS)[number]) => {
    if (password !== DUMMY_PASSWORD) return fail("Email atau password salah.");

    // Peran terkini, karena Admin bisa mengubahnya lewat Kelola Peran.
    const users = await getContentRepository().listUsers();
    const user = users.find((item) => item.id === account.userId);
    if (user?.status === "nonaktif") return fail(DEACTIVATED_MESSAGE);
    const roles = user?.roles ?? account.roles;
    const maintenanceNotice = blockedByMaintenance(roles);
    if (maintenanceNotice) return fail(maintenanceNotice);
    // Akun dengan peran tambahan mulai di mode perannya (PRD FR-15).
    const extraRoles = roles.filter((item) => item !== "user");
    const role = extraRoles.find((item) => item === account.role) ?? extraRoles[0] ?? "user";
    sessionActions.signIn({ name: account.name, email: account.email, userId: account.userId, role, roles });
    finish(role);
  };

  const signInSupabase = async (normalizedEmail: string) => {
    const result = await signInWithEmail(normalizedEmail, password);
    if (!result.ok) {
      if (result.code === "email_not_confirmed") setUnverifiedEmail(normalizedEmail);
      return fail(result.message);
    }

    const account = await loadSupabaseAccount(result.data);
    if (account.status === "deactivated") return fail(DEACTIVATED_MESSAGE);
    if (account.status === "missing") {
      sessionActions.signOut();
      return fail("Data akun tidak dapat dimuat. Coba lagi beberapa saat lagi.");
    }
    const maintenanceNotice = blockedByMaintenance(account.session.roles);
    if (maintenanceNotice) {
      sessionActions.signOut();
      return fail(maintenanceNotice);
    }
    finish(account.session.role);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors: LoginErrors = {};
    if (!normalizedEmail) nextErrors.email = "Email wajib diisi.";
    else if (!isValidEmail(normalizedEmail)) nextErrors.email = "Format email belum benar.";
    if (!password) nextErrors.password = "Password wajib diisi.";

    setErrors(nextErrors);
    setNotice(null);
    setUnverifiedEmail(null);
    setResendState("idle");
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    const demoAccount = isDemoLoginEnabled ? DUMMY_ACCOUNTS.find((item) => item.email === normalizedEmail) : undefined;
    if (demoAccount) {
      // Jeda singkat agar status memuat terlihat seperti permintaan ke server.
      setTimeout(() => void signInDemo(demoAccount), 600);
      return;
    }
    if (isSupabaseConfigured) {
      await signInSupabase(normalizedEmail);
      return;
    }
    setTimeout(() => fail("Email atau password salah."), 600);
  };

  const handleResend = async () => {
    if (!unverifiedEmail) return;
    setResendState("sending");
    const result = await resendVerificationEmail(unverifiedEmail, getNextTarget() ?? "/");
    if (!result.ok) {
      setResendState("idle");
      setErrors({ form: result.message });
      return;
    }
    setResendState("sent");
  };

  const fillDemoAccount = (accountEmail: string) => {
    setEmail(accountEmail);
    setPassword(DUMMY_PASSWORD);
    setErrors({});
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {notice && !errors.form && (
          <p
            role={notice.tone === "error" ? "alert" : "status"}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${
              notice.tone === "error"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            }`}
          >
            {notice.tone === "error" ? (
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            {notice.text}
          </p>
        )}

        {errors.form && (
          <div
            role="alert"
            className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
          >
            <p className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {errors.form}
            </p>
            {unverifiedEmail && resendState !== "sent" && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendState === "sending"}
                className="font-semibold text-primary-accent underline-offset-2 hover:underline disabled:cursor-wait disabled:opacity-70"
              >
                {resendState === "sending" ? "Mengirim..." : "Kirim ulang email verifikasi"}
              </button>
            )}
          </div>
        )}

        {resendState === "sent" && (
          <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Email verifikasi dikirim ulang. Cek kotak masuk atau folder spam.
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
            isSupabaseConfigured ? (
              <Link href="/forgot-password" className="text-xs font-semibold text-primary-accent hover:underline">
                Lupa password?
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground" title="Segera hadir">
                Lupa password? (segera hadir)
              </span>
            )
          }
        />

        <button
          type="submit"
          // Sebelum halaman siap, klik akan memuat ulang halaman dan menghapus isian.
          disabled={isSubmitting || !isHydrated}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href={isHydrated ? withNextParam("/register") : "/register"} className="font-semibold text-primary-accent hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </form>

      {/* Akun demo per role, hanya untuk pengembangan. */}
      {isDev && (
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
                key={account.email}
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
      )}
    </div>
  );
}
