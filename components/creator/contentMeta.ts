import { BadgeCheck, CheckCircle2, ClipboardList, Clock3, FilePen, GraduationCap, LucideIcon, Newspaper, RotateCcw } from "lucide-react";

import { ContentKind, ContentStatusId } from "@/types/ContentWorkflow";

// Ikon jenis konten, dipakai di Dashboard, Konten Saya, dan Buat Konten agar mudah dikenali (PRD FR-15).
export const KIND_ICONS: Record<ContentKind, LucideIcon> = {
  artikel: Newspaper,
  lesson: GraduationCap,
  soal: ClipboardList,
};

// Tahap alur penerbitan beserta ikon dan warnanya, berurutan dari Draf ke Terbit (PRD FR-15).
// Warna batang Alur Konten divalidasi skrip dataviz: tingkat terang untuk mode terang dan
// tingkat sendiri untuk mode gelap (bukan dibalik otomatis).
export const STATUS_STAGES: {
  status: ContentStatusId;
  label: string;
  detail: string;
  icon: LucideIcon;
  iconStyle: string;
  barClass: string;
}[] = [
  {
    status: "draf",
    label: "Draf",
    detail: "Belum dikirim ke reviewer",
    icon: FilePen,
    iconStyle: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    barClass: "bg-[#8b5cf6]",
  },
  {
    status: "menunggu-review",
    label: "Menunggu Review",
    detail: "Sedang di antrean reviewer",
    icon: Clock3,
    iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    barClass: "bg-[#f59e0b] dark:bg-[#d97706]",
  },
  {
    status: "perlu-revisi",
    label: "Perlu Revisi",
    detail: "Ada catatan dari reviewer",
    icon: RotateCcw,
    iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
    barClass: "bg-[#f43f5e] dark:bg-[#db2777]",
  },
  {
    status: "disetujui",
    label: "Disetujui",
    detail: "Menunggu diterbitkan Admin",
    icon: BadgeCheck,
    iconStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    barClass: "bg-[#0ea5e9] dark:bg-[#0284c7]",
  },
  {
    status: "terbit",
    label: "Terbit",
    detail: "Sudah bisa dibaca pengguna",
    icon: CheckCircle2,
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    barClass: "bg-[#10b981] dark:bg-[#059669]",
  },
];
