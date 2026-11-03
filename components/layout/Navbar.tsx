"use client";

import Link from "next/link";
import { Menu, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import CartButton from "@/components/cart/CartButton";
import NotificationBell from "@/components/notifications/NotificationBell";
import ProfileDropdown from "@/components/profile/ProfileDropdown";
import { useSession } from "@/lib/session";
import { useHydrated } from "@/lib/useHydrated";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({
  onToggleSidebar,
}: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const session = useSession();
  const isHydrated = useHydrated();

  const toggleTheme = () => {
    setTheme(
      resolvedTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:px-5 lg:px-7">
      {/* Left */}
      <div className="flex min-w-0 flex-1 items-center">
        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-accent active:scale-95"
          aria-label="Buka atau tutup sidebar"
        >
          <Menu size={20} />
        </button>

      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-4">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-accent active:scale-95"
          aria-label="Ganti tema"
        >
          <SunMoon size={20} aria-hidden="true" />
        </button>

        {session ? (
          <>
            {/* Cart */}
            <CartButton />

            {/* Notifications */}
            <NotificationBell />

            {/* User Profile Dropdown */}
            <ProfileDropdown />
          </>
        ) : (
          // Sesi baru terbaca di browser; ditunda agar pengguna yang sudah login tidak
          // sekilas melihat tombol ini saat halaman dimuat.
          isHydrated && (
            <>
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold transition-colors hover:bg-accent"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Daftar
              </Link>
            </>
          )
        )}
      </div>
    </header>
  );
}
