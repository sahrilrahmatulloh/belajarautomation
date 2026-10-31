import { ContentStatus } from "@/types/Content";

const statusMeta: Record<ContentStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  "in-review": {
    label: "Menunggu Review",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  "needs-revision": {
    label: "Perlu Revisi",
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  approved: {
    label: "Disetujui",
    className: "bg-brand-sky/10 text-brand-sky",
  },
  published: {
    label: "Terbit",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
};

export default function ContentStatusBadge({
  status,
}: {
  status: ContentStatus;
}) {
  const meta = statusMeta[status];

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}
