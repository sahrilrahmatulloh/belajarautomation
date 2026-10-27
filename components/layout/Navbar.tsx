"use client";

import Link from "next/link";
import { Bell, Menu, Search, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import ProfileDropdown from "@/components/profile/ProfileDropdown";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({
  onToggleSidebar,
}: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(
      resolvedTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-2 border-b border-border bg-background px-3 sm:px-4 lg:px-6">
      {/* Left */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="shrink-0 rounded-lg p-2 transition-colors hover:bg-accent"
          aria-label="Buka atau tutup sidebar"
        >
          <Menu size={20} />
        </button>

        <Link
          href="/learn"
          className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Cari materi"
        >
          <Search size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Cari materi</span>
        </Link>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-4">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 transition-colors hover:bg-accent"
          aria-label="Ganti tema"
        >
          <SunMoon size={20} aria-hidden="true" />
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative rounded-lg p-2 transition-colors hover:bg-accent"
          aria-label="Notifikasi"
        >
          <Bell size={20} />

          {/* Unread Badge */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Link>

        {/* User Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
