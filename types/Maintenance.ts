// Mode Maintenance (PRD FR-16 K dan 7.27).
// Status yang disimpan. Tahap Terjadwal, Persiapan, dan Aktif dihitung dari waktu (lib/maintenanceRules).
export type MaintenanceStatus = "terjadwal" | "selesai" | "dibatalkan";

export type MaintenancePhase = "terjadwal" | "persiapan" | "aktif";

export interface MaintenanceWindow {
  id: string;
  startAt: string;
  estimatedEndAt: string;
  prepMinutes: number;
  message: string;
  status: MaintenanceStatus;
  createdBy: string;
  createdAt: string;
  endedAt: string | null;
  endedBy: string | null;
}

export interface MaintenanceInput {
  // Format datetime-local.
  startAt: string;
  estimatedEndAt: string;
  prepMinutes: number;
  message: string;
}

// Hanya untuk tahap dummy: memajukan waktu agar tahap berikutnya bisa dicoba tanpa menunggu.
export type MaintenanceSimulation = "persiapan" | "menit-terakhir" | "aktif";
