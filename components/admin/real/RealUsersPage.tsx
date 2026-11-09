"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

import IconAction from "@/components/common/IconAction";
import SearchField from "@/components/filters/SearchField";
import { getRank } from "@/data/ranks";
import { adminApi, AdminUserRow, TIER_LABEL } from "@/lib/adminApi";
import { formatNumber } from "@/lib/format";

import AdminList, { AdminColumn } from "../AdminList";

// Pengguna dan Peran untuk akun sungguhan (PRD FR-16 C): daftar dari database, dicari dari
// nama, username, atau email. Detail pengguna memuat koreksi XP dan membership manual.
export default function RealUsersPage() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<AdminUserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pencarian ditunda sebentar agar tidak memanggil database di setiap ketikan.
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      const result = await adminApi.searchUsers(query);
      if (!active) return;
      if (result.ok) {
        setRows(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const columns: AdminColumn<AdminUserRow>[] = [
    { header: "Nama", cell: (user) => user.display_name || "-" },
    { header: "Username", cell: (user) => (user.username ? `@${user.username}` : "-") },
    { header: "Email", cell: (user) => user.email },
    { header: "XP", cell: (user) => `${formatNumber(user.total_xp)} XP · ${getRank(user.total_xp).name}` },
    { header: "Membership", cell: (user) => TIER_LABEL[user.tier] },
    {
      header: "Aksi",
      cell: (user) => (
        <IconAction label={`Lihat detail ${user.display_name || user.email}`} tooltip="Lihat detail" icon={Eye} href={`/admin/pengguna/${user.user_id}`} />
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pengguna dan Peran</h1>
        <p className="mt-1 text-muted-foreground">Cari pengguna untuk mengoreksi XP atau memberi membership manual.</p>
      </header>

      <SearchField label="Cari pengguna" value={query} placeholder="Cari nama, username, atau email..." onChange={setQuery} />

      {error && (
        <p role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      {!rows && !error && (
        <p role="status" className="py-10 text-center text-sm text-muted-foreground">
          Memuat pengguna...
        </p>
      )}
      {rows && rows.length > 0 && <AdminList label="pengguna" rows={rows} columns={columns} rowKey={(user) => user.user_id} />}
      {rows && rows.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Tidak ada pengguna yang cocok.</p>
      )}
    </div>
  );
}
