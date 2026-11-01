"use client";

import { ReactNode } from "react";
import { History, LayoutDashboard, Palette, Trophy } from "lucide-react";

import { useUrlFilters } from "@/lib/useUrlFilters";

// Tab profil sesuai PRD FR-13. Tab aktif disimpan di URL (?tab=).
export const PROFILE_TABS = [
  { value: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { value: "aktivitas", label: "Aktivitas", icon: History },
  { value: "pencapaian", label: "Pencapaian", icon: Trophy },
  // Hanya terlihat oleh pemilik profil.
  { value: "kustomisasi", label: "Kustomisasi", icon: Palette },
] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number]["value"];

const FILTER_KEYS = ["tab"] as const;

export default function ProfileTabs({ panels }: { panels: Record<ProfileTab, ReactNode> }) {
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);
  // Nilai URL yang tidak dikenal dianggap Ringkasan.
  const tab: ProfileTab = PROFILE_TABS.some((item) => item.value === values.tab)
    ? (values.tab as ProfileTab)
    : "ringkasan";

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Bagian profil"
        className="grid grid-cols-4 gap-1 rounded-2xl border border-border bg-card p-1.5"
      >
        {PROFILE_TABS.map((item) => {
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
              // Mobile: ikon di atas label agar keempat tab muat tanpa digeser.
              className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold transition-colors sm:min-h-11 sm:flex-row sm:gap-2 sm:px-4 sm:text-sm ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="max-w-full truncate">{item.label}</span>
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
