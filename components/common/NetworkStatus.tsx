"use client";

import { useEffect } from "react";

import { notify } from "@/lib/notify";

const NETWORK_ID = "status-jaringan";
export const OFFLINE_MESSAGE = "Koneksi internet terputus. Perubahan belum bisa disimpan sampai koneksi kembali.";
export const ONLINE_MESSAGE = "Koneksi internet kembali.";

// Memberi tahu saat koneksi internet terputus dan tersambung lagi (PRD 4.6).
// Alert offline tetap tampil sampai koneksi kembali, lalu diganti alert sukses.
export default function NetworkStatus() {
  useEffect(() => {
    let wasOffline = false;

    const handleOffline = () => {
      wasOffline = true;
      notify.warning(OFFLINE_MESSAGE, { id: NETWORK_ID, persistent: true });
    };
    const handleOnline = () => {
      if (!wasOffline) return;
      wasOffline = false;
      notify.success(ONLINE_MESSAGE, { id: NETWORK_ID });
    };

    if (!navigator.onLine) handleOffline();
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}
