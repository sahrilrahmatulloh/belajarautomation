"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import ProfileDropdown from "@/components/profile/ProfileDropdown";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({
  onToggleSidebar,
}: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;

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

        {/* Search - Tablet & Desktop */}
        <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-[420px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder="Cari materi, roadmap, artikel..."
            className="w-full pl-10"
          />
        </div>

        {/* Search Icon - Mobile */}
        <button
          type="button"
          className="shrink-0 rounded-lg p-2 transition-colors hover:bg-accent sm:hidden"
          aria-label="Cari"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-4">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          disabled={!mounted}
          className="rounded-lg p-2 transition-colors hover:bg-accent disabled:cursor-default"
          aria-label="Ganti tema"
        >
          {!mounted ? (
            <span className="block h-5 w-5" />
          ) : resolvedTheme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
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