import { BadgeCheck, CheckCircle2, Clock3, FilePen, RotateCcw } from "lucide-react";

import { ContentStatus } from "@/types/Content";
import { CreatorContent } from "@/types/RoleDashboard";

// Jumlah konten per status, mengikuti alur penerbitan (PRD FR-15).
export function getCreatorStats(contents: CreatorContent[]) {
  const count = (status: ContentStatus) => String(contents.filter((content) => content.status === status).length);

  return [
    {
      label: "Draf",
      value: count("draft"),
      detail: "Belum dikirim ke reviewer",
      icon: FilePen,
      iconStyle: "bg-muted text-muted-foreground",
    },
    {
      label: "Menunggu Review",
      value: count("in-review"),
      detail: "Sedang di antrean reviewer",
      icon: Clock3,
      iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    },
    {
      label: "Perlu Revisi",
      value: count("needs-revision"),
      detail: "Ada catatan dari reviewer",
      icon: RotateCcw,
      iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
    },
    {
      label: "Disetujui",
      value: count("approved"),
      detail: "Menunggu diterbitkan Admin",
      icon: BadgeCheck,
      iconStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    },
    {
      label: "Terbit",
      value: count("published"),
      detail: "Sudah bisa dipelajari pengguna",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    },
  ];
}
