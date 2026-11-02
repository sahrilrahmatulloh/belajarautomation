import { BookOpen, CreditCard, LucideIcon, PencilLine, Settings, Trophy } from "lucide-react";

import { NotificationGroup } from "@/types/Notification";

// Ikon dan warna kelompok notifikasi (PRD 4.4), dipakai popover, halaman, dan modal.
export const NOTIFICATION_GROUPS: Record<
  NotificationGroup,
  { label: string; icon: LucideIcon; iconStyle: string }
> = {
  content: {
    label: "Konten baru",
    icon: BookOpen,
    iconStyle: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  progress: {
    label: "Progres belajar",
    icon: Trophy,
    iconStyle: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  transaction: {
    label: "Transaksi",
    icon: CreditCard,
    iconStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  system: {
    label: "Akun dan sistem",
    icon: Settings,
    iconStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  role: {
    label: "Khusus role",
    icon: PencilLine,
    iconStyle: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  },
};
