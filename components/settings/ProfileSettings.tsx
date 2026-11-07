"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, AtSign, CheckCircle2, Mail, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ACTIVE_AVATAR } from "@/data/dummy/appearance";
import {
  BIO_MAX,
  changeEmail,
  changeUsername,
  DISPLAY_NAME_MAX,
  formatDate,
  nextUsernameChange,
  saveProfile,
  USERNAME_COOLDOWN_DAYS,
} from "@/lib/auth/profileActions";
import { normalizeUsername, USERNAME_MAX, USERNAME_MIN, usernameFormatError } from "@/lib/auth/username";
import { useSession } from "@/lib/session";
import { isValidEmail } from "@/lib/validation";

type Status = { tone: "success" | "error"; text: string } | null;

function StatusMessage({ status }: { status: Status }) {
  if (!status) return null;
  const isError = status.tone === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  return (
    <p
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-2 text-sm font-medium ${
        isError ? "text-destructive" : "text-emerald-700 dark:text-emerald-300"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {status.text}
    </p>
  );
}

function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: React.ReactNode }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-destructive">
        {error}
      </p>
    );
  }
  if (!hint) return null;
  return (
    <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
      {hint}
    </p>
  );
}

const SAVE_BUTTON =
  "inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50";

// Pengaturan Informasi Profil (PRD FR-13): nama tampilan, Tentang saya, username, dan email.
// Hanya akun sungguhan (Supabase) yang dapat menyimpan; akun demo melihat isian tanpa tombol aktif.
export default function ProfileSettings() {
  const session = useSession();
  const isRealAccount = session?.source === "supabase";

  const [name, setName] = useState(session?.name ?? "");
  const [bio, setBio] = useState(session?.bio ?? "");
  const [username, setUsername] = useState(session?.username ?? "");
  const [email, setEmail] = useState(session?.email ?? "");

  const [profileErrors, setProfileErrors] = useState<{ name?: string; bio?: string }>({});
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [profileStatus, setProfileStatus] = useState<Status>(null);
  const [usernameStatus, setUsernameStatus] = useState<Status>(null);
  const [emailStatus, setEmailStatus] = useState<Status>(null);
  const [saving, setSaving] = useState<"profile" | "username" | "email" | null>(null);

  // Isian mengikuti akun setelah sesi termuat atau berganti.
  const sessionKey = `${session?.userId}:${session?.name}:${session?.bio}:${session?.username}:${session?.email}`;
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- menyalin data akun ke isian form saat akun berubah */
    setName(session?.name ?? "");
    setBio(session?.bio ?? "");
    setUsername(session?.username ?? "");
    setEmail(session?.email ?? "");
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  // Kembali dari tautan konfirmasi ganti email (/auth/callback).
  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("email");
    /* eslint-disable react-hooks/set-state-in-effect -- pesan dibaca sekali dari alamat setelah hidrasi */
    if (result === "dikonfirmasi") {
      setEmailStatus({ tone: "success", text: "Konfirmasi diterima. Jika diminta, buka juga tautan di email lainnya." });
    } else if (result === "gagal") {
      setEmailStatus({ tone: "error", text: "Tautan konfirmasi email tidak valid atau sudah kedaluwarsa. Coba ganti email lagi." });
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const nextChange = nextUsernameChange(session?.usernameChangedAt);
  const isUsernameLocked = Boolean(nextChange && session?.username);
  const avatarInitial = (session?.name ?? "A").charAt(0).toUpperCase();

  const handleProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: typeof profileErrors = {};
    if (!name.trim()) errors.name = "Nama tampilan wajib diisi.";
    else if (name.trim().length > DISPLAY_NAME_MAX) errors.name = `Nama tampilan maksimal ${DISPLAY_NAME_MAX} karakter.`;
    if (bio.trim().length > BIO_MAX) errors.bio = `Tentang saya maksimal ${BIO_MAX} karakter.`;
    setProfileErrors(errors);
    setProfileStatus(null);
    if (Object.keys(errors).length > 0) return;

    setSaving("profile");
    const result = await saveProfile(name, bio);
    setSaving(null);
    setProfileStatus(result.ok ? { tone: "success", text: "Profil tersimpan." } : { tone: "error", text: result.message });
  };

  const handleUsername = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameStatus(null);
    const formatError = usernameFormatError(username);
    if (formatError) return setUsernameError(formatError);
    if (normalizeUsername(username) === session?.username) return setUsernameError("Username baru sama dengan username sekarang.");
    setUsernameError(undefined);

    setSaving("username");
    const result = await changeUsername(username);
    setSaving(null);
    if (!result.ok) {
      if (result.code.startsWith("username_") && result.code !== "username_jeda") setUsernameError(result.message);
      else setUsernameStatus({ tone: "error", text: result.message });
      return;
    }
    setUsernameStatus({
      tone: "success",
      text: `Username diganti. Bisa diganti lagi mulai ${formatDate(result.data)}.`,
    });
  };

  const handleEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailStatus(null);
    const normalized = email.trim().toLowerCase();
    if (!isValidEmail(normalized)) return setEmailError("Format email belum benar.");
    if (normalized === session?.email) return setEmailError("Email baru sama dengan email sekarang.");
    setEmailError(undefined);

    setSaving("email");
    const result = await changeEmail(normalized);
    setSaving(null);
    setEmailStatus(
      result.ok
        ? { tone: "success", text: `Tautan konfirmasi dikirim ke ${session?.email} dan ${normalized}. Buka keduanya untuk menyelesaikan.` }
        : { tone: "error", text: result.message }
    );
  };

  const profileChanged = name.trim() !== (session?.name ?? "") || bio.trim() !== (session?.bio ?? "");

  return (
    <section aria-labelledby="informasi-profil" className="rounded-3xl border border-border bg-card p-6">
      <h2 id="informasi-profil" className="text-xl font-bold">
        Informasi Profil
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Perbarui informasi yang ditampilkan pada profil kamu.</p>

      {!isRealAccount && (
        <p className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Akun demo tidak dapat diubah. Daftar akun untuk menyimpan perubahan profil.
        </p>
      )}

      <div className="mt-6 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={ACTIVE_AVATAR.image} alt="Foto profil" />
          <AvatarFallback>{avatarInitial}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Foto profil</p>
          <Link href="/profile?tab=kustomisasi" className="text-sm font-semibold text-primary-accent hover:underline">
            Ganti avatar di Kustomisasi
          </Link>
        </div>
      </div>

      {/* Nama tampilan dan Tentang saya */}
      <form onSubmit={handleProfile} noValidate aria-label="Profil" className="mt-8 space-y-5">
        <div>
          <label htmlFor="profile-name" className="text-sm font-medium">
            Nama tampilan
          </label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={DISPLAY_NAME_MAX}
            disabled={!isRealAccount}
            aria-invalid={profileErrors.name ? true : undefined}
            aria-describedby={profileErrors.name ? "profile-name-error" : undefined}
            className="mt-2"
          />
          <FieldMessage id="profile-name" error={profileErrors.name} />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="profile-bio" className="text-sm font-medium">
              Tentang saya
            </label>
            <span className={`text-xs tabular-nums ${bio.length > BIO_MAX ? "text-destructive" : "text-muted-foreground"}`}>
              {bio.length}/{BIO_MAX}
            </span>
          </div>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={BIO_MAX}
            rows={3}
            disabled={!isRealAccount}
            placeholder="Ceritakan sedikit tentang dirimu, mis. sedang belajar Playwright."
            aria-invalid={profileErrors.bio ? true : undefined}
            aria-describedby={profileErrors.bio ? "profile-bio-error" : "profile-bio-hint"}
            className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30"
          />
          <FieldMessage
            id="profile-bio"
            error={profileErrors.bio}
            hint="Opsional. Tautan yang diawali http:// atau https:// dapat diklik di profil."
          />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StatusMessage status={profileStatus} />
          <button type="submit" disabled={!isRealAccount || !profileChanged || saving === "profile"} className={`${SAVE_BUTTON} sm:ml-auto`}>
            {saving === "profile" ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      </form>

      {/* Username */}
      <form onSubmit={handleUsername} noValidate aria-label="Username" className="mt-8 border-t border-border pt-6">
        <label htmlFor="profile-username" className="flex items-center gap-2 text-sm font-medium">
          <AtSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Username
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            id="profile-username"
            value={username}
            onChange={(event) => setUsername(normalizeUsername(event.target.value))}
            maxLength={USERNAME_MAX}
            disabled={!isRealAccount || isUsernameLocked}
            aria-invalid={usernameError ? true : undefined}
            aria-describedby={usernameError ? "profile-username-error" : "profile-username-hint"}
          />
          <button
            type="submit"
            disabled={!isRealAccount || isUsernameLocked || username === (session?.username ?? "") || saving === "username"}
            className={`${SAVE_BUTTON} shrink-0`}
          >
            {saving === "username" ? "Menyimpan..." : "Ganti Username"}
          </button>
        </div>
        <FieldMessage
          id="profile-username"
          error={usernameError}
          hint={
            isUsernameLocked && nextChange
              ? `Username bisa diganti lagi mulai ${formatDate(nextChange)}.`
              : `${USERNAME_MIN}–${USERNAME_MAX} karakter: huruf kecil, angka, dan garis bawah (_). Bisa diganti ${USERNAME_COOLDOWN_DAYS} hari sekali.`
          }
        />
        <div className="mt-2">
          <StatusMessage status={usernameStatus} />
        </div>
      </form>

      {/* Email */}
      <form onSubmit={handleEmail} noValidate aria-label="Email" className="mt-8 border-t border-border pt-6">
        <label htmlFor="profile-email" className="flex items-center gap-2 text-sm font-medium">
          <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Email
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            disabled={!isRealAccount}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "profile-email-error" : "profile-email-hint"}
          />
          <button
            type="submit"
            disabled={!isRealAccount || email.trim().toLowerCase() === (session?.email ?? "") || saving === "email"}
            className={`${SAVE_BUTTON} shrink-0`}
          >
            {saving === "email" ? "Mengirim..." : "Ganti Email"}
          </button>
        </div>
        <FieldMessage
          id="profile-email"
          error={emailError}
          hint="Tautan konfirmasi dikirim ke email lama dan email baru. Email baru berlaku setelah keduanya dikonfirmasi."
        />
        {session?.pendingEmail && (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Menunggu konfirmasi ke {session.pendingEmail}. Email akun tetap {session.email} sampai dikonfirmasi.
          </p>
        )}
        <div className="mt-2">
          <StatusMessage status={emailStatus} />
        </div>
      </form>
    </section>
  );
}
