import { STATUS_LABELS } from "@/lib/content/document";
import { ContentStatusId } from "@/types/ContentWorkflow";

const STATUS_STYLES: Record<ContentStatusId, string> = {
  draf: "bg-muted text-muted-foreground",
  "menunggu-review": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "perlu-revisi": "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  disetujui: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  terbit: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export default function ContentStatusBadge({ status }: { status: ContentStatusId }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
