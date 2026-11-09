"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import IconAction from "@/components/common/IconAction";
import ListPagination, { pageSlice } from "@/components/common/ListPagination";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import SearchField from "@/components/filters/SearchField";
import { formatContentDate } from "@/lib/content/document";
import { matchesKeyword } from "@/lib/filters";
import { formatRupiah } from "@/lib/format";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { Transaction, TransactionStatus } from "@/types/Commerce";

import AdminList, { AdminColumn } from "./AdminList";
import TransactionStatusBadge, { TRANSACTION_STATUS_LABELS } from "./TransactionStatusBadge";
import { isToday, useAdminData } from "./useAdminData";

const PAGE_SIZE = 10;
const FILTER_KEYS = ["q", "status", "dari", "sampai", "hari"] as const;
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";

// Transaksi (PRD FR-16 E).
export default function TransactionsPage() {
  const { data } = useAdminData();
  const { values, search, setSearch, setFilters } = useCatalogFilters(FILTER_KEYS);
  const [page, setPage] = useState(1);

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat transaksi...</p>;

  const { transactions, users, loadedAt } = data;
  const filtered = transactions.filter(
    (item) =>
      (!values.status || item.status === values.status) &&
      (!values.dari || item.createdAt.slice(0, 10) >= values.dari) &&
      (!values.sampai || item.createdAt.slice(0, 10) <= values.sampai) &&
      (values.hari !== "ini" || isToday(item.createdAt, loadedAt)) &&
      matchesKeyword(values.q, item.id, item.itemTitle, userName(users, item.userId))
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));

  const updateFilter = (key: (typeof FILTER_KEYS)[number], value: string) => {
    setFilters({ [key]: value });
    setPage(1);
  };

  const columns: AdminColumn<Transaction>[] = [
    { header: "ID", cell: (item) => item.id },
    { header: "Pengguna", cell: (item) => userName(users, item.userId) },
    { header: "Paket atau produk", cell: (item) => item.itemTitle },
    { header: "Nominal", cell: (item) => <span className="whitespace-nowrap">{formatRupiah(item.amount)}</span> },
    { header: "Metode", cell: (item) => item.method },
    { header: "Tanggal", cell: (item) => <span className="whitespace-nowrap">{formatContentDate(item.createdAt)}</span> },
    { header: "Status", cell: (item) => <TransactionStatusBadge status={item.status} /> },
    {
      header: "Aksi",
      cell: (item) => (
        <IconAction label={`Lihat detail ${item.id}`} tooltip="Lihat detail" icon={Eye} href={`/admin/transaksi/${item.id}`} />
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Transaksi</h1>
        <p className="mt-1 text-muted-foreground">Status pembayaran hanya berubah dari payment gateway.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SearchField
          label="Cari transaksi"
          value={search}
          placeholder="Cari ID, pengguna, atau produk..."
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <select aria-label="Filter status" value={values.status} onChange={(event) => updateFilter("status", event.target.value)} className={selectClass}>
          <option value="">Semua status</option>
          {(Object.keys(TRANSACTION_STATUS_LABELS) as TransactionStatus[]).map((status) => <option key={status} value={status}>{TRANSACTION_STATUS_LABELS[status]}</option>)}
        </select>
        <label className="text-sm font-medium">
          Dari tanggal
          <input type="date" value={values.dari} onChange={(event) => updateFilter("dari", event.target.value)} className={`${selectClass} mt-1`} />
        </label>
        <label className="text-sm font-medium">
          Sampai tanggal
          <input type="date" value={values.sampai} onChange={(event) => updateFilter("sampai", event.target.value)} className={`${selectClass} mt-1`} />
        </label>
      </div>

      {values.hari === "ini" && (
        <p className="flex flex-wrap items-center gap-3 text-sm">
          Hanya transaksi hari ini.
          <button type="button" onClick={() => updateFilter("hari", "")} className="font-medium text-primary-accent underline-offset-2 hover:underline">Hapus filter ini</button>
        </p>
      )}

      {filtered.length > 0 ? (
        <>
          <AdminList label="transaksi" rows={pageSlice(filtered, currentPage, PAGE_SIZE)} columns={columns} rowKey={(item) => item.id} />
          <ListPagination total={filtered.length} page={currentPage} pageSize={PAGE_SIZE} itemLabel="transaksi" onChange={setPage} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Tidak ada transaksi yang cocok.</p>
      )}
    </div>
  );
}
