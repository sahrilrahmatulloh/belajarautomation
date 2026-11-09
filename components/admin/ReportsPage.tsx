"use client";

import { Download } from "lucide-react";

import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { formatContentDate } from "@/lib/content/document";
import { buildReport, reportToCsv } from "@/lib/content/reports";
import { formatRupiah } from "@/lib/format";
import { useUrlFilters } from "@/lib/useUrlFilters";

import AdminList from "./AdminList";
import { useAdminData } from "./useAdminData";

const FILTER_KEYS = ["dari", "sampai"] as const;
const inputClass = "mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-8 text-center text-sm text-muted-foreground">{text}</p>;
}

// Laporan (PRD FR-16 I). Dihitung dari data dummy yang ada.
export default function ReportsPage() {
  const { data } = useAdminData();
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat laporan...</p>;

  const report = buildReport({ users: data.users, transactions: data.transactions, contents: data.contents, events: data.events, now: data.loadedAt, from: values.dari, to: values.sampai });

  const exportCsv = () => {
    // BOM agar Excel membaca huruf dengan benar.
    const url = URL.createObjectURL(new Blob(["﻿", reportToCsv(report)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-belajarautomation.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PrototypeNotice />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Laporan</h1>
          <p className="mt-1 text-muted-foreground">Dihitung dari data dummy yang ada.</p>
        </div>
        <button type="button" onClick={exportCsv} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
          <Download className="h-4 w-4" aria-hidden="true" />
          Ekspor CSV
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Dari tanggal
          <input type="date" value={values.dari} onChange={(event) => setFilters({ dari: event.target.value })} className={inputClass} />
        </label>
        <label className="text-sm font-medium">
          Sampai tanggal
          <input type="date" value={values.sampai} onChange={(event) => setFilters({ sampai: event.target.value })} className={inputClass} />
        </label>
      </div>

      <section aria-labelledby="laporan-pengguna" className="space-y-3">
        <h2 id="laporan-pengguna" className="text-lg font-bold">Pengguna</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Pengguna baru" value={report.newUsers} />
          <Stat label="Aktif 7 hari" value={report.active7} />
          <Stat label="Aktif 30 hari" value={report.active30} />
        </div>
        <p className="text-sm text-muted-foreground">Pengguna aktif selalu dihitung dari hari ini, tidak mengikuti rentang tanggal.</p>
      </section>

      <section aria-labelledby="laporan-penjualan" className="space-y-3">
        <h2 id="laporan-penjualan" className="text-lg font-bold">Penjualan per Paket dan Produk</h2>
        {report.sales.length > 0 ? (
          <AdminList
            label="penjualan"
            rows={report.sales}
            rowKey={(item) => item.title}
            columns={[
              { header: "Paket atau produk", cell: (item) => item.title },
              { header: "Terjual", cell: (item) => item.count },
              { header: "Pendapatan", cell: (item) => formatRupiah(item.revenue) },
            ]}
          />
        ) : (
          <Empty text="Belum ada penjualan pada rentang ini." />
        )}
      </section>

      <section aria-labelledby="laporan-course" className="space-y-3">
        <h2 id="laporan-course" className="text-lg font-bold">Course Dimulai dan Diselesaikan</h2>
        {report.courses.length > 0 ? (
          <AdminList
            label="course"
            rows={report.courses}
            rowKey={(item) => item.title}
            columns={[
              { header: "Course", cell: (item) => item.title },
              { header: "Dimulai", cell: (item) => item.started },
              { header: "Diselesaikan", cell: (item) => item.completed },
            ]}
          />
        ) : (
          <Empty text="Belum ada course pada rentang ini." />
        )}
      </section>

      <section aria-labelledby="laporan-terbit" className="space-y-3">
        <h2 id="laporan-terbit" className="text-lg font-bold">Konten Terbit ({report.published.length})</h2>
        {report.published.length > 0 ? (
          <AdminList
            label="konten terbit"
            rows={report.published}
            rowKey={(item) => item.id}
            columns={[
              { header: "Judul", cell: (item) => item.title },
              { header: "Tanggal terbit", cell: (item) => <span className="whitespace-nowrap">{formatContentDate(item.at)}</span> },
            ]}
          />
        ) : (
          <Empty text="Belum ada konten terbit pada rentang ini." />
        )}
      </section>
    </div>
  );
}
