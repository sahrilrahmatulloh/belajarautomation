"use client";

import { useSession } from "@/lib/session";

// Halaman Admin untuk akun sungguhan memakai data database (real); akun demo DEV memakai
// halaman dummy (children). Akses Admin akun sungguhan sudah dijaga AdminAccessGate.
export default function AdminRealSwitch({ real, children }: { real: React.ReactNode; children: React.ReactNode }) {
  const session = useSession();
  return session?.source === "supabase" ? real : children;
}
