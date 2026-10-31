"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getRoleFromPath, ROLE_HOME } from "@/data/navigation";
import { useSession } from "@/lib/session";
import { useHydrated } from "@/lib/useHydrated";

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

  const pageRole = getRoleFromPath(pathname);
  let redirectTo: string | null = null;

  if (isHydrated) {
    if (!session) {
      redirectTo = "/login";
    } else if (pageRole !== "user" && session.role !== pageRole) {
      // Halaman Creator/Reviewer/Admin hanya untuk role tersebut.
      redirectTo = ROLE_HOME[session.role];
    }
  }

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (!isHydrated || redirectTo) {
    return <AuthLoading />;
  }

  return children;
}
