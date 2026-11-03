"use client";

import { useState } from "react";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import ListPagination, { pageSlice } from "@/components/common/ListPagination";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import SearchField from "@/components/filters/SearchField";
import { ROLE_LABELS } from "@/data/navigation";
import { runContentAction } from "@/lib/content";
import { matchesKeyword } from "@/lib/filters";
import { ContentUser, RoleChangeAction } from "@/types/ContentWorkflow";
import { UserRole } from "@/types/Role";

import { formatDateTime, useAdminData } from "./useAdminData";

const PAGE_SIZE = 10;
const MANAGED_ROLES: UserRole[] = ["creator", "reviewer", "admin"];

type Pending = { user: ContentUser; role: UserRole; action: RoleChangeAction } | null;

// Kelola Peran (PRD FR-15). Pelajar adalah peran dasar semua pengguna, jadi tidak dikelola di sini.
export default function ManageRolesPage() {
  const { userId, data } = useAdminData();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat pengguna...</p>;

  const { users, roleEvents } = data;
  const filtered = users.filter(
    (user) => (!roleFilter || user.roles.includes(roleFilter as UserRole)) && matchesKeyword(search, user.name, user.email)
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));

  const confirm = async () => {
    if (!pending) return;
    const result = await runContentAction((repository) => repository.setRole(userId, pending.user.id, pending.role, pending.action));
    if (result.ok) setPending(null);
    else setError(result.message);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Kelola Peran</h1>
        <p className="mt-1 text-muted-foreground">Tambah atau cabut peran pengguna. Perubahan berlaku saat pengguna masuk kembali.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
        <SearchField
          label="Cari pengguna"
          value={search}
          placeholder="Cari nama atau email..."
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <select
          aria-label="Filter peran"
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value);
            setPage(1);
          }}
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card"
        >
          <option value="">Semua peran</option>
          {MANAGED_ROLES.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
        </select>
      </div>

      {filtered.length > 0 ? (
        <>
          <div role="group" tabIndex={0} aria-label="Tabel pengguna" className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  {["Nama", "Email", "Peran", "Aksi"].map((heading) => (
                    <th key={heading} scope="col" className="px-4 py-2.5 font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageSlice(filtered, currentPage, PAGE_SIZE).map((user) => (
                  <tr key={user.id}>
                    <th scope="row" className="px-4 py-3 font-medium">{user.name}</th>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map((role) => (
                          <span key={role} className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">{ROLE_LABELS[role]}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {MANAGED_ROLES.map((role) => {
                          const action: RoleChangeAction = user.roles.includes(role) ? "cabut" : "tambah";
                          const label = `${action === "cabut" ? "Cabut" : "Tambah"} ${ROLE_LABELS[role]}`;
                          return (
                            <button
                              key={role}
                              type="button"
                              aria-label={`${label}: ${user.name}`}
                              onClick={() => {
                                setError("");
                                setPending({ user, role, action });
                              }}
                              className={`whitespace-nowrap rounded font-medium underline-offset-2 hover:underline ${action === "cabut" ? "text-destructive" : "text-primary-accent"}`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ListPagination total={filtered.length} page={currentPage} pageSize={PAGE_SIZE} itemLabel="pengguna" onChange={setPage} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          Tidak ada pengguna yang cocok.
        </p>
      )}

      <section aria-labelledby="riwayat-peran" className="rounded-2xl border border-border bg-card p-4">
        <h2 id="riwayat-peran" className="font-bold">Riwayat Perubahan Peran</h2>
        {roleEvents.length > 0 ? (
          <ul className="mt-2 divide-y divide-border">
            {[...roleEvents].reverse().map((event) => (
              <li key={event.id} className="py-2 text-sm">
                <span className="font-medium">{userName(users, event.actorId)}</span> {event.action === "tambah" ? "menambah" : "mencabut"} peran {ROLE_LABELS[event.role]} {event.action === "tambah" ? "untuk" : "dari"} <span className="font-medium">{userName(users, event.userId)}</span>
                <span className="block text-xs text-muted-foreground">{formatDateTime(event.at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Belum ada perubahan peran.</p>
        )}
      </section>

      {pending && (
        <ConfirmDialog
          title={`${pending.action === "cabut" ? "Cabut" : "Tambah"} peran ${ROLE_LABELS[pending.role]}?`}
          description={
            pending.action === "cabut"
              ? `${pending.user.name} tidak lagi memiliki peran ${ROLE_LABELS[pending.role]}.`
              : `${pending.user.name} akan memiliki peran ${ROLE_LABELS[pending.role]}.`
          }
          confirmLabel={pending.action === "cabut" ? "Cabut peran" : "Tambah peran"}
          isDestructive={pending.action === "cabut"}
          error={error}
          onConfirm={() => void confirm()}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
}
