import { BadgeCheck, CheckCircle2, Clock3, FilePen, RotateCcw } from "lucide-react";

import { ContentItem, ContentStatusId } from "@/types/ContentWorkflow";

// Jumlah konten per status, mengikuti alur penerbitan (PRD FR-15).
export function getCreatorStats(contents: ContentItem[]) {
  const count = (status: ContentStatusId) => String(contents.filter((content) => content.status === status).length);

  return [
    {
      label: "Draf",
      value: count("draf"),
      detail: "Belum dikirim ke reviewer",
      icon: FilePen,
      iconStyle: "bg-muted text-muted-foreground",
    },
    {
      label: "Menunggu Review",
      value: count("menunggu-review"),
      detail: "Sedang di antrean reviewer",
      icon: Clock3,
      iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    },
    {
      label: "Perlu Revisi",
      value: count("perlu-revisi"),
      detail: "Ada catatan dari reviewer",
      icon: RotateCcw,
      iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
    },
    {
      label: "Disetujui",
      value: count("disetujui"),
      detail: "Menunggu diterbitkan Admin",
      icon: BadgeCheck,
      iconStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    },
    {
      label: "Terbit",
      value: count("terbit"),
      detail: "Sudah bisa dipelajari pengguna",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    },
  ];
}
