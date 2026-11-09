import { AccountStatus } from "@/types/ContentWorkflow";

export default function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return status === "aktif" ? (
    <span className="inline-flex whitespace-nowrap rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">Aktif</span>
  ) : (
    <span className="inline-flex whitespace-nowrap rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-300">Nonaktif</span>
  );
}
