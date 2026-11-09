"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck } from "lucide-react";

import { useSession } from "@/lib/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Penjaga halaman Admin untuk akun sungguhan (PRD 8.3): hanya peran Admin, dan wajib verifikasi
// dua langkah (TOTP dari aplikasi authenticator). Perlindungan sebenarnya ada di database:
// has_role('admin') hanya berlaku untuk sesi aal2. Komponen ini menyiapkan sesi itu.
// Akun demo (DEV) tidak melewati penjaga ini.

type GateState =
  | { status: "checking" }
  | { status: "ready" }
  | { status: "challenge"; factorId: string }
  | { status: "enroll" }
  | { status: "error" };

const VERIFY_FAILED = "Kode salah atau sudah kedaluwarsa. Periksa aplikasi authenticator, lalu coba lagi.";
const GENERIC_ERROR = "Verifikasi gagal. Coba lagi beberapa saat lagi.";

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-center font-mono text-xl tracking-[0.4em] outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30";
const buttonClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

function messageOf(error: { code?: string } | null) {
  return error?.code === "mfa_verification_failed" || error?.code === "mfa_challenge_expired" ? VERIFY_FAILED : GENERIC_ERROR;
}

// Kotak isian kode 6 digit beserta tombol kirim.
function CodeForm({ onSubmit, submitLabel }: { onSubmit: (code: string) => Promise<string | null>; submitLabel: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    setError(await onSubmit(code));
    setIsPending(false);
  };

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
      <label htmlFor="admin-mfa-code" className="block text-sm font-medium">
        Kode 6 digit
      </label>
      <input
        id="admin-mfa-code"
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-describedby={error ? "admin-mfa-error" : undefined}
        aria-invalid={error ? true : undefined}
        className={inputClass}
      />
      {error && (
        <p id="admin-mfa-error" role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <button type="submit" disabled={code.length !== 6 || isPending} className={buttonClass}>
        {isPending ? "Memeriksa..." : submitLabel}
      </button>
    </form>
  );
}

// Pendaftaran authenticator pertama kali: pindai QR, lalu masukkan kode untuk memastikannya.
function EnrollStep({ onVerified }: { onVerified: () => void }) {
  const [factor, setFactor] = useState<{ id: string; qrCode: string; secret: string } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let active = true;
    (async () => {
      // Pendaftaran yang belum selesai sebelumnya dihapus agar bisa memulai ulang.
      const { data: list } = await client.auth.mfa.listFactors();
      for (const item of list?.all ?? []) {
        if (item.factor_type === "totp" && item.status !== "verified") await client.auth.mfa.unenroll({ factorId: item.id });
      }
      const { data, error } = await client.auth.mfa.enroll({ factorType: "totp", friendlyName: "Authenticator Admin", issuer: "belajarautomation.com" });
      if (!active) return;
      if (error || !data || data.type !== "totp") {
        setFailed(true);
        return;
      }
      setFactor({ id: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
    })();
    return () => {
      active = false;
    };
  }, []);

  const verify = async (code: string) => {
    const client = getSupabaseBrowserClient();
    if (!client || !factor) return GENERIC_ERROR;
    const { error } = await client.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (error) return messageOf(error);
    onVerified();
    return null;
  };

  return (
    <>
      <h1 className="text-xl font-bold">Aktifkan verifikasi dua langkah</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Halaman Admin wajib memakai verifikasi dua langkah. Pasang aplikasi authenticator di HP (mis. Google Authenticator,
        Microsoft Authenticator, atau Authy), lalu pindai kode QR berikut.
      </p>
      {failed && (
        <p role="alert" className="mt-4 text-sm font-medium text-destructive">
          Kode QR gagal dibuat. Muat ulang halaman untuk mencoba lagi.
        </p>
      )}
      {!factor && !failed && (
        <p role="status" className="mt-4 text-sm text-muted-foreground">
          Menyiapkan kode QR...
        </p>
      )}
      {factor && (
        <>
          <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-3">
            {/* QR berupa SVG data URL dari Supabase. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={factor.qrCode} alt="Kode QR untuk aplikasi authenticator" width={180} height={180} />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Tidak bisa memindai? Masukkan kode ini di aplikasi:</p>
          <p className="mt-1 break-all text-center font-mono text-sm font-semibold">{factor.secret}</p>
          <CodeForm onSubmit={verify} submitLabel="Aktifkan dan masuk" />
        </>
      )}
    </>
  );
}

function ChallengeStep({ factorId, onVerified }: { factorId: string; onVerified: () => void }) {
  const verify = async (code: string) => {
    const client = getSupabaseBrowserClient();
    if (!client) return GENERIC_ERROR;
    const { error } = await client.auth.mfa.challengeAndVerify({ factorId, code });
    if (error) return messageOf(error);
    onVerified();
    return null;
  };

  return (
    <>
      <h1 className="text-xl font-bold">Verifikasi dua langkah</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Masukkan kode 6 digit dari aplikasi authenticator untuk membuka halaman Admin.
      </p>
      <CodeForm onSubmit={verify} submitLabel="Verifikasi" />
    </>
  );
}

function AdminMfa({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>({ status: "checking" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let active = true;
    (async () => {
      const { data: level, error } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
      if (!active) return;
      if (error || !level) return setState({ status: "error" });
      if (level.currentLevel === "aal2") return setState({ status: "ready" });
      const { data: factors } = await client.auth.mfa.listFactors();
      if (!active) return;
      const totp = factors?.totp[0];
      setState(totp ? { status: "challenge", factorId: totp.id } : { status: "enroll" });
    })();
    return () => {
      active = false;
    };
  }, [attempt]);

  const recheck = () => setAttempt((value) => value + 1);

  if (state.status === "ready") return children;

  return (
    <section aria-label="Verifikasi Admin" className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8">
      <ShieldCheck className="h-8 w-8 text-primary-accent" aria-hidden="true" />
      <div className="mt-3">
        {state.status === "checking" && (
          <p role="status" className="text-sm text-muted-foreground">
            Memeriksa keamanan akun...
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {GENERIC_ERROR}
          </p>
        )}
        {state.status === "enroll" && <EnrollStep onVerified={recheck} />}
        {state.status === "challenge" && <ChallengeStep factorId={state.factorId} onVerified={recheck} />}
      </div>
    </section>
  );
}

export default function AdminAccessGate({ children }: { children: React.ReactNode }) {
  const session = useSession();

  // Akun demo dan pratinjau DEV memakai halaman Admin dummy seperti sebelumnya.
  if (!session || session.source !== "supabase") return children;

  if (!session.roles.includes("admin")) {
    return (
      <section className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 text-center sm:p-8">
        <ShieldAlert className="mx-auto h-8 w-8 text-destructive" aria-hidden="true" />
        <h1 className="mt-3 text-xl font-bold">Halaman khusus Admin</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Akunmu tidak memiliki peran Admin.</p>
        <Link href="/" className={`${buttonClass} mt-5`}>
          Kembali ke dashboard
        </Link>
      </section>
    );
  }

  return <AdminMfa>{children}</AdminMfa>;
}
