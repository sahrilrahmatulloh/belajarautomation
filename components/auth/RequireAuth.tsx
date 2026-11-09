"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getRoleFromPath, ROLE_HOME } from "@/data/navigation";
import { useSession, useSessionReady } from "@/lib/session";
import { useHydrated } from "@/lib/useHydrated";
import { useViewMode, viewModeActions } from "@/lib/viewMode";

import AuthLoading from "./AuthLoading";

// Alur tampilan saja: mengarahkan tamu ke /login dan role yang tidak sesuai
// ke dashboard miliknya. BUKAN proteksi keamanan karena sesi masih dummy di
// browser; otorisasi sungguhan wajib di backend sebelum rilis (PRD 8.3).
export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const isHydrated = useHydrated();
  const isSessionReady = useSessionReady();
  const { activeRole, isRoleMode, hasRole } = useViewMode();

  const pageRole = getRoleFromPath(pathname);
  let redirectTo: string | null = null;

  // Menunggu status login Supabase agar pengguna yang sudah login tidak sempat diarahkan ke /login.
  if (isHydrated && isSessionReady) {
    if (!session) {
      redirectTo = "/login";
    } else if (pageRole !== "user" && !session.roles.includes(pageRole)) {
      // Halaman Creator/Reviewer/Admin hanya untuk role tersebut.
      redirectTo = ROLE_HOME[session.role];
    } else if (pathname === "/" && isRoleMode) {
      // Halaman utama mengikuti mode aktif (PRD FR-15).
      redirectTo = ROLE_HOME[session.role];
    }
  }

  // Membuka halaman peran dari Mode Belajar, mis. lewat tautan, berarti kembali ke mode peran.
  // Hanya sekali per halaman: saat beralih ke Mode Belajar dari menu profil, halaman peran
  // masih terbuka sampai perpindahan selesai dan modenya tidak boleh dibalikkan.
  const isOnOwnRolePage = pageRole !== "user" && Boolean(session?.roles.includes(pageRole));
  const checkedPath = useRef<string | null>(null);
  useEffect(() => {
    if (!isHydrated || checkedPath.current === pathname) return;
    checkedPath.current = pathname;
    if (session && isOnOwnRolePage && hasRole && activeRole !== pageRole) viewModeActions.switchToRole(session.email, pageRole);
  }, [isHydrated, pathname, isOnOwnRolePage, hasRole, activeRole, pageRole, session]);

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (!isHydrated || !isSessionReady || redirectTo) {
    return <AuthLoading />;
  }

  return children;
}
