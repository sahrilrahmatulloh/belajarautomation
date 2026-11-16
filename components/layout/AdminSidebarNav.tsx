"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import AuthLink from "@/components/auth/AuthLink";
import { NavItem } from "@/types/Navigation";

// Kelompok menu yang dibuka atau ditutup pengguna, disimpan per browser.
const STORAGE_KEY = "belajarautomation-admin-menu";

function readStored(): Record<string, boolean> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    return parsed && typeof parsed === "object" ? (parsed as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

// Menu sidebar Admin (PRD FR-16 Navigasi): setiap kelompok menjadi dropdown agar sidebar ringkas
// tanpa perlu disembunyikan. Kelompok halaman yang sedang dibuka selalu terbuka saat dimuat.
export default function AdminSidebarNav({ items, isActive }: { items: NavItem[]; isActive: (item: NavItem) => boolean }) {
  const groups = items.reduce<{ name: string; items: NavItem[] }[]>((result, item) => {
    const name = item.group ?? "";
    const last = result.at(-1);
    if (last && last.name === name) last.items.push(item);
    else result.push({ name, items: [item] });
    return result;
  }, []);
  const activeGroup = groups.find((group) => group.items.some(isActive))?.name;

  const [open, setOpen] = useState<Record<string, boolean>>(() => (activeGroup ? { [activeGroup]: true } : {}));

  // Pilihan tersimpan baru dibaca di browser; kelompok aktif tetap terbuka.
  useEffect(() => {
    const stored = readStored();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hanya tersedia di browser
    setOpen({ ...stored, ...(activeGroup ? { [activeGroup]: true } : {}) });
  }, [activeGroup]);

  const toggle = (name: string) => {
    setOpen((current) => {
      const next = { ...current, [name]: !current[name] };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Penyimpanan tidak tersedia; pilihan hanya berlaku di halaman ini.
      }
      return next;
    });
  };

  return (
    <ul className="space-y-1">
      {groups.map((group) => {
        const isOpen = Boolean(open[group.name]);
        const panelId = `menu-admin-${group.name.toLowerCase().replace(/\s+/g, "-")}`;
        return (
          <li key={group.name}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(group.name)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {group.name}
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <ul id={panelId} hidden={!isOpen} className="mt-1 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <li key={item.label}>
                    <AuthLink
                      href={item.href ?? "#"}
                      aria-current={active ? "page" : undefined}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                        active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span className="font-medium">{item.label}</span>
                    </AuthLink>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
