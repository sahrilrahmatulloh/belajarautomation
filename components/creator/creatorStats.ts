import { BadgeCheck, CheckCircle2, Clock3, FilePen, RotateCcw } from "lucide-react";

import { DUMMY_CREATOR_CONTENTS } from "@/data/dummy/creator";
import { ContentStatus } from "@/types/Content";

function countByStatus(status: ContentStatus) {
  return DUMMY_CREATOR_CONTENTS.filter((content) => content.status === status).length;
}

// Jumlah konten per status, mengikuti alur penerbitan (PRD FR-15).
export const CREATOR_STATS = [
  {
    label: "Draf",
    value: String(countByStatus("draft")),
    detail: "Belum dikirim ke reviewer",
    icon: FilePen,
    iconStyle: "bg-muted text-muted-foreground",
  },
  {
    label: "Menunggu Review",
    value: String(countByStatus("in-review")),
    detail: "Sedang di antrean reviewer",
    icon: Clock3,
    iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  {
    label: "Perlu Revisi",
    value: String(countByStatus("needs-revision")),
    detail: "Ada catatan dari reviewer",
    icon: RotateCcw,
    iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
  {
    label: "Disetujui",
    value: String(countByStatus("approved")),
    detail: "Menunggu diterbitkan Admin",
    icon: BadgeCheck,
    iconStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  {
    label: "Terbit",
    value: String(countByStatus("published")),
    detail: "Sudah bisa dipelajari pengguna",
    icon: CheckCircle2,
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
];
