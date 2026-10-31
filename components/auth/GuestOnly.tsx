"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ROLE_HOME } from "@/data/navigation";
import { useSession } from "@/lib/session";
import { useHydrated } from "@/lib/useHydrated";

import AuthLoading from "./AuthLoading";

// Halaman masuk/daftar: pengguna yang sudah login langsung ke dashboard role-nya.
export default function GuestOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useSession();
  const isHydrated = useHydrated();
  const redirectTo = isHydrated && session ? ROLE_HOME[session.role] : null;

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (redirectTo) {
    return <AuthLoading />;
  }

  return children;
}
