"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";

import { DUMMY_ACCOUNT } from "@/data/dummy/account";

export default function PrivacySettings() {
  // Nilai awal dari data dummy; perubahan hanya di state halaman ini.
  const [isVisible, setIsVisible] = useState(DUMMY_ACCOUNT.showOnLeaderboard);

  return (
    <section id="privasi" className="scroll-mt-20 rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">Privasi</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Atur apa yang dapat dilihat pengguna lain.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Pengaturan ini belum tersimpan permanen dan kembali ke nilai awal saat halaman dimuat ulang.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Trophy className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <p id="leaderboard-visibility-label" className="text-sm font-semibold">
            Tampilkan saya di leaderboard
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Jika dimatikan, nama kamu tidak terlihat oleh pengguna lain. Kamu tetap
            dapat melihat posisimu sendiri.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isVisible}
          aria-labelledby="leaderboard-visibility-label"
          onClick={() => setIsVisible((value) => !value)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            isVisible ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`absolute left-0 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              isVisible ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </section>
  );
}
