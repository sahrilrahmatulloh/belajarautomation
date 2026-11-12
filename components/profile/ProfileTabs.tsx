"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, History, LayoutDashboard, Trophy } from "lucide-react";

import { useUrlFilters } from "@/lib/useUrlFilters";

// Tab profil sesuai PRD FR-13. Tab aktif disimpan di URL (?tab=).
export const PROFILE_TABS = [
  { value: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { value: "aktivitas", label: "Aktivitas", icon: History },
  { value: "pencapaian", label: "Pencapaian", icon: Trophy },
] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number]["value"];

// Kustomisasi bukan tab: dibuka dari ikon pensil pada avatar di alamat ?tab=kustomisasi.
export const CUSTOMIZATION_TAB = "kustomisasi";

const FILTER_KEYS = ["tab"] as const;

// Hanya tab yang punya isi yang ditampilkan; profil publik tidak mengirim Aktivitas dan
// Kustomisasi, sehingga keduanya tidak bisa dibuka lewat URL.
export default function ProfileTabs({
  panels,
  customization,
  backHref = "/profile",
}: {
  panels: Partial<Record<ProfileTab, ReactNode>>;
  // Tampilan Kustomisasi, hanya untuk pemilik profil.
  customization?: ReactNode;
  backHref?: string;
}) {
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);

  if (customization && values.tab === CUSTOMIZATION_TAB) {
    return (
      <div className="space-y-4">
        <Link
          href={backHref}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke profil
        </Link>
        {customization}
      </div>
    );
  }

  const tabs = PROFILE_TABS.filter((item) => panels[item.value] !== undefined);
  // Nilai URL yang tidak dikenal dianggap Ringkasan.
  const tab: ProfileTab = tabs.some((item) => item.value === values.tab)
    ? (values.tab as ProfileTab)
    : "ringkasan";

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Bagian profil"
        className={`grid gap-1 rounded-2xl border border-border bg-card p-1.5 ${tabs.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
      >
        {tabs.map((item) => {
          const isActive = item.value === tab;
          const Icon = item.icon;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`profil-tab-${item.value}`}
              aria-selected={isActive}
              aria-controls="profil-panel"
              // Ringkasan tidak ditulis ke URL karena merupakan tab bawaan.
              onClick={() => setFilters({ tab: item.value === "ringkasan" ? "" : item.value })}
              className={`flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold transition-colors sm:px-4 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div id="profil-panel" role="tabpanel" aria-labelledby={`profil-tab-${tab}`}>
        {panels[tab]}
      </div>
    </div>
  );
}
