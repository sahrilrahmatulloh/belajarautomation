import { MaintenancePhase, MaintenanceWindow } from "@/types/Maintenance";

// Lama tahap Persiapan yang bisa dipilih Admin (PRD FR-16 K).
export const PREP_OPTIONS = [5, 10, 20, 30, 60] as const;
export const DEFAULT_PREP_MINUTES = 30;
// Peringatan yang lebih menonjol tampil di menit terakhir sebelum Aktif.
export const FINAL_WARNING_MS = 60_000;

const MINUTE_MS = 60_000;

export function prepStartTime(window: Pick<MaintenanceWindow, "startAt" | "prepMinutes">) {
  return Date.parse(window.startAt) - window.prepMinutes * MINUTE_MS;
}

// Waktu mulai paling cepat: saat ini ditambah lama Persiapan, dibulatkan ke menit berikutnya.
export function earliestStartTime(now: number, prepMinutes: number) {
  return Math.ceil((now + prepMinutes * MINUTE_MS) / MINUTE_MS) * MINUTE_MS;
}

// Tahap maintenance yang sedang berjalan, atau null bila tidak ada.
export function maintenancePhase(window: MaintenanceWindow | null | undefined, now: number): MaintenancePhase | null {
  if (!window || window.status !== "terjadwal") return null;
  if (now >= Date.parse(window.startAt)) return "aktif";
  if (now >= prepStartTime(window)) return "persiapan";
  return "terjadwal";
}

export function isFinalMinute(window: MaintenanceWindow | null | undefined, now: number) {
  return maintenancePhase(window, now) === "persiapan" && Date.parse(window!.startAt) - now <= FINAL_WARNING_MS;
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}` : `${minutes}:${seconds}`;
}

export function formatMaintenanceTime(iso: string) {
  return `${new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date(iso))} WIB`;
}

// Isi pengumuman otomatis ke semua pengguna (grup Akun dan sistem).
export function maintenanceAnnouncementBody(window: Pick<MaintenanceWindow, "startAt" | "estimatedEndAt" | "message">) {
  return `Situs tidak dapat diakses mulai ${formatMaintenanceTime(window.startAt)} sampai sekitar ${formatMaintenanceTime(window.estimatedEndAt)}. ${window.message}`;
}
