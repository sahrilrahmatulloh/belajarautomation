"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";

import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import { runContentAction } from "@/lib/content";
import { formatRupiah } from "@/lib/format";
import { GatewayResult } from "@/types/Commerce";

import ReasonDialog from "./ReasonDialog";
import TransactionStatusBadge, { TRANSACTION_STATUS_LABELS } from "./TransactionStatusBadge";
import { formatDateTime, useAdminData } from "./useAdminData";

const panelClass = "rounded-2xl border border-border bg-card p-5";
const GATEWAY_RESULTS: GatewayResult[] = ["berhasil", "gagal", "kedaluwarsa"];

// Detail transaksi (PRD FR-16 E). Admin hanya bisa melakukan refund; status lain datang dari gateway.
export default function TransactionDetailPage({ transactionId }: { transactionId: string }) {
  const { userId, data } = useAdminData();
  const [isRefunding, setIsRefunding] = useState(false);
  const [dialogError, setDialogError] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat transaksi...</p>;

  const transaction = data.transactions.find((item) => item.id === transactionId);
  if (!transaction) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Transaksi tidak ditemukan</h1>
        <Link href="/admin/transaksi" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">Kembali ke Transaksi</Link>
      </div>
    );
  }

  const refund = async (alasan: string) => {
    const result = await runContentAction((repository) => repository.refundTransaction(userId, transactionId, alasan));
    if (result.ok) setIsRefunding(false);
    else setDialogError(result.message);
  };

  const simulate = (status: GatewayResult) => void runContentAction((repository) => repository.simulateGateway(transactionId, status));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <PrototypeNotice />

      <Link href="/admin/transaksi" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Transaksi
      </Link>

      <header className="flex flex-wrap items-center gap-3">
        <h1 className="min-w-0 text-2xl font-bold tracking-tight [overflow-wrap:anywhere] sm:text-3xl">{transaction.id}</h1>
        <TransactionStatusBadge status={transaction.status} />
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="info-transaksi" className={`${panelClass} text-sm`}>
          <h2 id="info-transaksi" className="font-bold">Info Transaksi</h2>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Pengguna</dt>
              <dd><Link href={`/admin/pengguna/${transaction.userId}`} className="font-medium text-primary-accent underline-offset-2 hover:underline">{userName(data.users, transaction.userId)}</Link></dd>
            </div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Paket atau produk</dt><dd className="text-right">{transaction.itemTitle}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Nominal</dt><dd>{formatRupiah(transaction.amount)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Metode</dt><dd>{transaction.method}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Tanggal</dt><dd className="text-right">{formatDateTime(transaction.createdAt)}</dd></div>
          </dl>
        </section>

        <section aria-labelledby="timeline-transaksi" className={panelClass}>
          <h2 id="timeline-transaksi" className="font-bold">Timeline Status</h2>
          <ol aria-label="Timeline status" className="mt-3 space-y-3 border-l-2 border-border pl-4 text-sm">
            {[...transaction.history].reverse().map((change) => (
              <li key={`${change.status}-${change.at}`}>
                <p className="font-semibold">{TRANSACTION_STATUS_LABELS[change.status]}</p>
                <p className="text-muted-foreground">
                  {change.source === "gateway" ? "Payment gateway" : userName(data.users, change.actorId)} · {formatDateTime(change.at)}
                </p>
                {change.alasan && <p className="mt-0.5">Alasan: {change.alasan}</p>}
              </li>
            ))}
          </ol>
        </section>
      </div>

      {transaction.status === "berhasil" && (
        <section aria-labelledby="refund-transaksi" className={panelClass}>
          <h2 id="refund-transaksi" className="font-bold">Refund</h2>
          <p role="note" className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Kebijakan refund belum final (PRD Bagian 12). Refund mencabut hak akses dari transaksi ini.
          </p>
          <button
            type="button"
            onClick={() => {
              setDialogError("");
              setIsRefunding(true);
            }}
            className="mt-3 min-h-10 rounded-xl border border-destructive/40 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            Refund transaksi
          </button>
        </section>
      )}

      {transaction.status === "menunggu" && (
        <section aria-labelledby="simulasi-gateway" className="rounded-2xl border border-dashed border-amber-500/50 p-5">
          <h2 id="simulasi-gateway" className="font-bold">Simulasi gateway (DEV)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Bukan aksi Admin dan tidak masuk Log. Tombol ini meniru kabar dari payment gateway, dan hanya ada selama belum ada gateway sungguhan.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {GATEWAY_RESULTS.map((status) => (
              <button key={status} type="button" onClick={() => simulate(status)} className="min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent">
                Simulasi gateway: {TRANSACTION_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </section>
      )}

      {isRefunding && (
        <ReasonDialog
          title="Refund transaksi ini?"
          description={`Status menjadi Refund dan hak akses "${transaction.itemTitle}" dari transaksi ini dicabut. Kebijakan refund belum final (PRD Bagian 12).`}
          confirmLabel="Refund"
          reasonLabel="Alasan refund"
          isDestructive
          error={dialogError}
          onConfirm={(alasan) => void refund(alasan)}
          onClose={() => setIsRefunding(false)}
        />
      )}
    </div>
  );
}
