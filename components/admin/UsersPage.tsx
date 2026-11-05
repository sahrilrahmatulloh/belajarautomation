"use client";

import { useState } from "react";
import Link from "next/link";

import ListPagination, { pageSlice } from "@/components/common/ListPagination";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import SearchField from "@/components/filters/SearchField";
import { ROLE_LABELS } from "@/data/navigation";
import { matchesKeyword } from "@/lib/filters";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { ContentUser } from "@/types/ContentWorkflow";
import { UserRole } from "@/types/Role";

import AccountStatusBadge from "./AccountStatusBadge";
import AdminList, { AdminColumn } from "./AdminList";
import { MEMBERSHIP_LABELS, NEW_USER_DAYS, isNewUser, useAdminData } from "./useAdminData";

const PAGE_SIZE = 10;
const FILTER_KEYS = ["q", "peran", "membership", "status", "kesepakatan", "baru"] as const;
const FILTERED_ROLES: UserRole[] = ["creator", "reviewer", "admin"];
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";

// Pengguna dan Peran (PRD FR-16 C).
export default function UsersPage() {
  const { data } = useAdminData();
  const { values, search, setSearch, setFilters } = useCatalogFilters(FILTER_KEYS);
  const [page, setPage] = useState(1);

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat pengguna...</p>;

  const { users, agreements, loadedAt } = data;
  const hasAgreement = (user: ContentUser) => agreements.some((item) => item.userId === user.id);

  const filtered = users.filter(
    (user) =>
      (!values.peran || user.roles.includes(values.peran as UserRole)) &&
      (!values.membership || user.membership === values.membership) &&
      (!values.status || user.status === values.status) &&
      (!values.kesepakatan || (user.roles.includes("creator") && !hasAgreement(user))) &&
      (!values.baru || isNewUser(user, loadedAt)) &&
      matchesKeyword(values.q, user.name, user.username, user.email)
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));

  const updateFilter = (key: (typeof FILTER_KEYS)[number], value: string) => {
    setFilters({ [key]: value });
    setPage(1);
  };

  const columns: AdminColumn<ContentUser>[] = [
    { header: "Nama", cell: (user) => user.name },
    { header: "Username", cell: (user) => user.username },
    { header: "Email", cell: (user) => user.email },
    {
      header: "Peran",
      cell: (user) => (
        <span className="flex flex-wrap gap-1.5">
          {user.roles.map((role) => (
            <span key={role} className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">{ROLE_LABELS[role]}</span>
          ))}
        </span>
      ),
    },
    { header: "Membership", cell: (user) => MEMBERSHIP_LABELS[user.membership] },
    { header: "Status", cell: (user) => <AccountStatusBadge status={user.status} /> },
    {
      header: "Aksi",
      cell: (user) => (
        <Link href={`/admin/pengguna/${user.id}`} aria-label={`Lihat detail ${user.name}`} className="whitespace-nowrap font-medium text-primary-accent underline-offset-2 hover:underline">
          Lihat detail
        </Link>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pengguna dan Peran</h1>
        <p className="mt-1 text-muted-foreground">Kelola peran, status akun, dan kesepakatan Creator.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="sm:col-span-2 xl:col-span-4">
          <SearchField
            label="Cari pengguna"
            value={search}
            placeholder="Cari nama, username, atau email..."
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </div>
        <select aria-label="Filter peran" value={values.peran} onChange={(event) => updateFilter("peran", event.target.value)} className={selectClass}>
          <option value="">Semua peran</option>
          {FILTERED_ROLES.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
        </select>
        <select aria-label="Filter membership" value={values.membership} onChange={(event) => updateFilter("membership", event.target.value)} className={selectClass}>
          <option value="">Semua membership</option>
          {Object.entries(MEMBERSHIP_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select aria-label="Filter status akun" value={values.status} onChange={(event) => updateFilter("status", event.target.value)} className={selectClass}>
          <option value="">Semua status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <label className="flex h-11 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card">
          <input type="checkbox" checked={values.kesepakatan === "tanpa"} onChange={(event) => updateFilter("kesepakatan", event.target.checked ? "tanpa" : "")} className="h-4 w-4 accent-primary" />
          Creator tanpa kesepakatan
        </label>
      </div>

      {values.baru && (
        <p className="flex flex-wrap items-center gap-3 text-sm">
          Hanya pengguna baru {NEW_USER_DAYS} hari terakhir.
          <button type="button" onClick={() => updateFilter("baru", "")} className="font-medium text-primary-accent underline-offset-2 hover:underline">Hapus filter ini</button>
        </p>
      )}

      {filtered.length > 0 ? (
        <>
          <AdminList label="pengguna" rows={pageSlice(filtered, currentPage, PAGE_SIZE)} columns={columns} rowKey={(user) => user.id} />
          <ListPagination total={filtered.length} page={currentPage} pageSize={PAGE_SIZE} itemLabel="pengguna" onChange={setPage} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Tidak ada pengguna yang cocok.</p>
      )}
    </div>
  );
}
