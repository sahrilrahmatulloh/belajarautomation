"use client";

import { useState } from "react";
import { Globe2, LucideIcon, Trophy } from "lucide-react";

import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { DUMMY_PROFILE } from "@/data/dummy/profile";

function PrivacyToggle({
  id,
  icon: Icon,
  label,
  description,
  checked,
  onToggle,
}: {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <p id={id} className="text-sm font-semibold">
          {label}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute left-0 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function PrivacySettings() {
  // Nilai awal dari data dummy; perubahan hanya di state halaman ini.
  const [isVisible, setIsVisible] = useState(DUMMY_ACCOUNT.showOnLeaderboard);
  const [isProfilePublic, setIsProfilePublic] = useState(DUMMY_PROFILE.isProfilePublic);

  return (
    <section id="privasi" className="scroll-mt-20 rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">Privasi</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Atur apa yang dapat dilihat pengguna lain.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Pengaturan ini belum tersimpan permanen dan kembali ke nilai awal saat halaman dimuat ulang.
      </p>

      <div className="mt-6 space-y-5">
        <PrivacyToggle
          id="leaderboard-visibility-label"
          icon={Trophy}
          label="Tampilkan saya di leaderboard"
          description="Jika dimatikan, nama kamu tidak terlihat oleh pengguna lain. Kamu tetap dapat melihat posisimu sendiri."
          checked={isVisible}
          onToggle={() => setIsVisible((value) => !value)}
        />

        <PrivacyToggle
          id="profile-visibility-label"
          icon={Globe2}
          label="Profil dapat dilihat publik"
          description='Jika dimatikan, pengguna lain hanya melihat keterangan "Profil ini privat".'
          checked={isProfilePublic}
          onToggle={() => setIsProfilePublic((value) => !value)}
        />
      </div>
    </section>
  );
}
