import { ContentItem } from "@/types/ContentWorkflow";

import { STATUS_STAGES } from "./contentMeta";

// Jumlah konten per status, mengikuti alur penerbitan (PRD FR-15). Ikon dan warna sama dengan
// Dashboard Creator.
export function getCreatorStats(contents: ContentItem[]) {
  return STATUS_STAGES.map(({ status, label, detail, icon, iconStyle }) => ({
    label,
    value: String(contents.filter((content) => content.status === status).length),
    detail,
    icon,
    iconStyle,
  }));
}
