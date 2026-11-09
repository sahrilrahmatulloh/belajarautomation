"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { markDraftsInterrupted, useAccountKey } from "@/lib/challengeDrafts";

import MaintenanceScreen from "./MaintenanceScreen";
import { useMaintenance } from "./useMaintenance";

// Halaman yang tetap terbuka selama maintenance Aktif: login (agar Admin bisa masuk) dan
// halaman maintenance itu sendiri.
const OPEN_PATHS = ["/login", "/maintenance"];

// Menutup seluruh situs selama maintenance Aktif, kecuali untuk Admin (PRD FR-16 K). Halaman
// maintenance tampil di alamat yang sama, jadi pengguna kembali ke halamannya saat selesai.
// PENTING: ini simulasi DEV. Saat backend tersedia, penutupan wajib di server dengan kode 503 (PRD 8.3).
export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const account = useAccountKey();
  const { current, phase, isAdmin } = useMaintenance();
  const blockedWindow = phase === "aktif" && !isAdmin && !OPEN_PATHS.includes(pathname) ? current : null;

  useEffect(() => {
    if (blockedWindow) markDraftsInterrupted(account, blockedWindow.id);
  }, [account, blockedWindow]);

  return blockedWindow ? <MaintenanceScreen window={blockedWindow} /> : children;
}
