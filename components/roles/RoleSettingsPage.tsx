"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { saveProfile } from "@/lib/auth/profileActions";
import { updatePassword } from "@/lib/auth/supabaseAuth";
import { notify } from "@/lib/notify";
import { sessionActions, useSession } from "@/lib/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useHydrated } from "@/lib/useHydrated";

import { MfaStatusLine } from "@/components/admin/AdminProfilePage";
import { useMfaStatus } from "@/components/admin/useMfaStatus";

const panelClass = "scroll-mt-20 rounded-2xl border border-border bg-card p-5 sm:p-6";
const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-input/30";
const buttonClass = "inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const primaryButton = `${buttonClass} bg-primary text-primary-foreground enabled:hover:bg-primary-hover`;
const outlineButton = `${buttonClass} border border-border enabled:hover:bg-accent`;
const dangerButton = `${buttonClass} border border-destructive/40 text-destructive enabled:hover:bg-destructive/10`;
const MIN_PASSWORD = 8;
const DEMO_NOTE = "Akun demo DEV tidak dapat mengubah bagian ini.";

export type SettingsRole = "admin" | "reviewer" | "creator";

interface NotificationOption {
  id: string;
  label: string;
  detail: string;
}

// Isi khusus setiap peran (PRD FR-16 L untuk Admin, FR-15 untuk Reviewer). Pilihan notifikasi
// disimpan per browser sampai backend tersedia.
const ROLE_CONFIG: Record<
  SettingsRole,
  { title: string; description: string; nameHint: string; securityHint: string; notificationTitle: string; notifications: NotificationOption[] }
> = {
  admin: {
    title: "Pengaturan Admin",
    description: "Akun, keamanan, dan notifikasi untuk pekerjaan Admin.",
    nameHint: "Nama tampil di Log Aktivitas Admin dan riwayat tindakan.",
    securityHint: "Halaman Admin wajib memakai verifikasi dua langkah.",
    notificationTitle: "Notifikasi Admin",
    notifications: [
      { id: "moderasi", label: "Akun ditandai Moderasi", detail: "Pola XP tidak wajar yang perlu ditinjau." },
      { id: "review-lama", label: "Review menunggu lebih dari 3 hari", detail: "Konten Menunggu Review yang belum diproses." },
      { id: "menunggu-pembayaran", label: "Transaksi menunggu pembayaran", detail: "Transaksi yang belum ada kabar dari payment gateway." },
    ],
  },
  reviewer: {
    title: "Pengaturan Reviewer",
    description: "Akun, keamanan, dan notifikasi untuk pekerjaan review.",
    nameHint: "Nama tampil di catatan review dan riwayat keputusan.",
    securityHint: "Jaga keamanan akun yang dipakai untuk menyetujui konten.",
    notificationTitle: "Notifikasi Reviewer",
    notifications: [
      { id: "ditugaskan", label: "Konten baru ditugaskan kepadaku", detail: "Konten Menunggu Review yang ditugaskan Admin kepadamu." },
      { id: "kiriman-ulang", label: "Kiriman ulang dari Creator", detail: "Konten yang pernah kamu review dikirim ulang setelah diperbaiki." },
      { id: "belum-ditugaskan", label: "Antrean belum ditugaskan", detail: "Ada konten baru yang bisa diambil untuk review." },
    ],
  },
  // Notifikasi Creator mengikuti PRD FR-15 (grup Khusus role).
  creator: {
    title: "Pengaturan Creator",
    description: "Akun, keamanan, dan notifikasi untuk pekerjaan menulis.",
    nameHint: "Nama tampil sebagai penulis konten dan di catatan revisi.",
    securityHint: "Jaga keamanan akun yang dipakai untuk menulis konten.",
    notificationTitle: "Notifikasi Creator",
    notifications: [
      { id: "diminta-revisi", label: "Konten diminta revisi", detail: "Reviewer memberi catatan yang perlu kamu perbaiki." },
      { id: "disetujui", label: "Konten disetujui", detail: "Konten lolos review dan menunggu diterbitkan Admin." },
      { id: "diterbitkan", label: "Konten diterbitkan", detail: "Konten sudah tayang di website." },
      { id: "ditarik", label: "Konten ditarik dari website", detail: "Admin menarik konten terbit, beserta alasannya." },
    ],
  },
};

const notificationKey = (role: SettingsRole) => `belajarautomation-${role}-notifikasi`;

function readNotifications(role: SettingsRole): Record<string, boolean> {
  const defaults = Object.fromEntries(ROLE_CONFIG[role].notifications.map((item) => [item.id, true]));
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(notificationKey(role)) ?? "null");
    return parsed && typeof parsed === "object" ? { ...defaults, ...(parsed as Record<string, boolean>) } : defaults;
  } catch {
    return defaults;
  }
}

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-judul`} className={panelClass}>
      <h2 id={`${id}-judul`} className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

// Pengaturan peran Admin dan Reviewer (PRD FR-16 L, FR-15): tanpa bagian khusus pelajar (privasi profil publik, preferensi
// belajar, kustomisasi avatar, dan hapus akun).
export default function RoleSettingsPage({ role }: { role: SettingsRole }) {
  const session = useSession();
  const router = useRouter();
  const isHydrated = useHydrated();
  const isReal = session?.source === "supabase";
  const { mfa, refresh } = useMfaStatus();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(session?.name ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState<"nama" | "password" | null>(null);
  const [pending, setPending] = useState<"authenticator" | "keluar" | null>(null);
  const [dialogError, setDialogError] = useState("");
  const config = ROLE_CONFIG[role];
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hanya tersedia di browser
    setNotifications(readNotifications(role));
  }, [role]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- nama awal mengikuti sesi yang baru terbaca
    if (session?.name) setName(session.name);
  }, [session?.name]);

  if (!session) return null;

  const saveName = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving("nama");
    const result = await saveProfile(name.trim(), session.bio ?? "");
    setSaving(null);
    if (result.ok) notify.success("Nama tampilan tersimpan.");
    else notify.error(result.message);
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < MIN_PASSWORD) return setPasswordError(`Password minimal ${MIN_PASSWORD} karakter.`);
    if (password !== confirmPassword) return setPasswordError("Konfirmasi password tidak sama.");
    setPasswordError("");
    setSaving("password");
    const result = await updatePassword(password);
    setSaving(null);
    if (!result.ok) return setPasswordError(result.message);
    setPassword("");
    setConfirmPassword("");
    notify.success("Password diganti.");
  };

  const resetAuthenticator = async () => {
    const client = getSupabaseBrowserClient();
    if (!client || mfa.status !== "aktif") return;
    const { error } = await client.auth.mfa.unenroll({ factorId: mfa.factorId });
    if (error) return setDialogError("Authenticator gagal diatur ulang. Coba lagi beberapa saat lagi.");
    setPending(null);
    refresh();
    // Sesi yang sedang berjalan masih terverifikasi; keluar agar halaman Admin berikutnya pasti
    // meminta pendaftaran authenticator baru.
    sessionActions.signOut();
    notify.success("Authenticator diatur ulang. Masuk lagi, lalu pindai kode QR baru untuk membuka halaman Admin.");
    router.push("/login");
  };

  const signOutEverywhere = async () => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { error } = await client.auth.signOut({ scope: "global" });
    if (error) return setDialogError("Gagal keluar dari semua perangkat. Coba lagi beberapa saat lagi.");
    sessionActions.signOut();
    router.push("/login");
  };

  const toggleNotification = (id: string) => {
    setNotifications((current) => {
      const next = { ...current, [id]: !current[id] };
      try {
        window.localStorage.setItem(notificationKey(role), JSON.stringify(next));
      } catch {
        // Penyimpanan tidak tersedia; pilihan hanya berlaku di halaman ini.
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{config.title}</h1>
        <p className="mt-1 text-muted-foreground">{config.description}</p>
      </header>

      <Section id="informasi-akun" title="Informasi Akun" description={config.nameHint}>
        <form onSubmit={saveName} className="space-y-4">
          <label className="block text-sm font-medium">
            Nama tampilan
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} disabled={!isReal} className={inputClass} />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input value={session.email} readOnly className={`${inputClass} bg-muted/40`} />
          </label>
          {!isReal && <p className="text-xs text-muted-foreground">{DEMO_NOTE}</p>}
          <button type="submit" disabled={!isReal || !isHydrated || !name.trim() || name.trim() === session.name || saving === "nama"} className={primaryButton}>
            {saving === "nama" ? "Menyimpan..." : "Simpan nama"}
          </button>
        </form>
      </Section>

      <Section id="keamanan" title="Keamanan" description={config.securityHint}>
        <form onSubmit={savePassword} aria-label="Ganti password" noValidate className="space-y-4">
          <h3 className="text-sm font-semibold">Ganti password</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Password baru
              <input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={!isReal} className={inputClass} />
            </label>
            <label className="block text-sm font-medium">
              Konfirmasi password
              <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={!isReal} className={inputClass} />
            </label>
          </div>
          {passwordError && <p role="alert" className="text-sm font-medium text-destructive">{passwordError}</p>}
          <button type="submit" disabled={!isReal || !password || saving === "password"} className={primaryButton}>
            {saving === "password" ? "Menyimpan..." : "Ganti password"}
          </button>
        </form>

        {/* Verifikasi dua langkah hanya diwajibkan untuk Admin (PRD 8.3). */}
        {role === "admin" && (
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="text-sm font-semibold">Verifikasi dua langkah</h3>
          <div className="mt-2">
            <MfaStatusLine mfa={mfa} />
          </div>
          <button type="button" onClick={() => { setDialogError(""); setPending("authenticator"); }} disabled={mfa.status !== "aktif"} className={`${outlineButton} mt-3`}>
            Atur ulang authenticator
          </button>
        </div>
        )}

        <div className="mt-6 border-t border-border pt-5">
          <h3 className="text-sm font-semibold">Sesi login</h3>
          <p className="mt-1 text-sm text-muted-foreground">Keluar dari akun ini di semua browser dan perangkat, termasuk yang sekarang.</p>
          <button type="button" onClick={() => { setDialogError(""); setPending("keluar"); }} disabled={!isReal} className={`${dangerButton} mt-3`}>
            Keluar dari semua perangkat
          </button>
          {!isReal && <p className="mt-2 text-xs text-muted-foreground">{DEMO_NOTE}</p>}
        </div>
      </Section>

      <Section id="notifikasi-peran" title={config.notificationTitle} description="Pilih pemberitahuan pekerjaan yang ingin diterima. Disimpan di browser ini sampai backend tersedia.">
        <ul className="divide-y divide-border">
          {config.notifications.map((item) => (
            <li key={item.id} className="py-3 first:pt-0 last:pb-0">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={notifications[item.id] ?? true} onChange={() => toggleNotification(item.id)} className="mt-0.5 h-4 w-4 accent-primary" />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.detail}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="tampilan" title="Tampilan" description="Mode warna untuk akun ini di perangkat ini.">
        <fieldset>
          <legend className="sr-only">Mode warna</legend>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "light", label: "Terang" },
              { value: "dark", label: "Gelap" },
              { value: "system", label: "Ikuti sistem" },
            ].map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <input type="radio" name="mode-warna" value={option.value} checked={isHydrated && theme === option.value} onChange={() => setTheme(option.value)} className="accent-primary" />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </Section>

      {pending === "authenticator" && (
        <ConfirmDialog
          title="Atur ulang authenticator?"
          description="Authenticator yang sekarang tidak bisa dipakai lagi. Kamu akan keluar, lalu diminta memindai kode QR baru saat masuk ke halaman Admin."
          confirmLabel="Atur ulang"
          isDestructive
          error={dialogError}
          onConfirm={() => void resetAuthenticator()}
          onClose={() => setPending(null)}
        />
      )}
      {pending === "keluar" && (
        <ConfirmDialog
          title="Keluar dari semua perangkat?"
          description="Semua sesi akun ini berakhir, termasuk di browser ini. Kamu perlu masuk lagi."
          confirmLabel="Keluar dari semua perangkat"
          isDestructive
          error={dialogError}
          onConfirm={() => void signOutEverywhere()}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
}
