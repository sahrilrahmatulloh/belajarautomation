import { TransactionStatus } from "@/types/Commerce";

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  menunggu: "Menunggu Pembayaran",
  berhasil: "Berhasil",
  gagal: "Gagal",
  kedaluwarsa: "Kedaluwarsa",
  refund: "Refund",
};

const STYLES: Record<TransactionStatus, string> = {
  menunggu: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  berhasil: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  gagal: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  kedaluwarsa: "bg-muted text-muted-foreground",
  refund: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

export default function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}>{TRANSACTION_STATUS_LABELS[status]}</span>;
}
