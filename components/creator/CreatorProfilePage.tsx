"use client";

import Link from "next/link";
import { Settings } from "lucide-react";

import { initialsOf } from "@/components/admin/useMfaStatus";
import EmptyState from "@/components/common/EmptyState";
import { useCreatorData } from "@/components/creator/studio/useCreatorData";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { ROLE_LABELS } from "@/data/navigation";
import { formatContentDate, KIND_LABELS } from "@/lib/content/document";
import { useSession } from "@/lib/session";

import { KIND_ICONS } from "./contentMeta";
import { getCreatorStats } from "./creatorStats";

const panelClass = "rounded-2xl border border-border bg-card p-5";

// Profil Creator (PRD FR-15 Profil per mode): identitas tanpa foto, jumlah konten per status, dan
// konten yang sudah terbit. XP, rank, dan kustomisasi tetap di profil Mode Belajar.
export default function CreatorProfilePage() {
  const session = useSession();
  const { userId, data } = useCreatorData();
  if (!session) return null;

  const contents = data?.contents ?? [];
  const published = contents.filter((content) => content.status === "terbit");
  const joinedAt = data?.users.find((user) => user.id === userId)?.joinedAt;
  const roles = session.roles.filter((role) => role !== "user");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex items-center gap-4">
        <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {initialsOf(session.name)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{session.name}</h1>
          <p className="text-sm text-muted-foreground">Profil Creator</p>
        </div>
      </header>

      <section aria-labelledby="creator-info-akun" className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="creator-info-akun" className="font-bold">Info Akun</h2>
          <Link href="/creator/pengaturan" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline">
            <Settings className="h-4 w-4" aria-hidden="true" />
            Pengaturan
          </Link>
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="min-w-0 text-right font-medium [overflow-wrap:anywhere]">{session.email}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
            <dt className="text-muted-foreground">Bergabung</dt>
            <dd className="font-medium">{joinedAt ? formatContentDate(joinedAt) : "–"}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
            <dt className="text-muted-foreground">Peran</dt>
            <dd className="inline-flex flex-wrap justify-end gap-1.5">
              {roles.map((role) => (
                <span key={role} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-accent">{ROLE_LABELS[role]}</span>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="statistik-peran">
        <h2 id="statistik-peran" className="mb-3 text-lg font-bold">Konten per Status</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {getCreatorStats(contents).map((stat) => (
            <RoleStatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section aria-labelledby="konten-terbit" className={panelClass}>
        <h2 id="konten-terbit" className="font-bold">Konten Terbit</h2>
        {published.length > 0 ? (
          <ul className="mt-2 divide-y divide-border">
            {published.map((content) => {
              const KindIcon = KIND_ICONS[content.type];
              return (
                <li key={content.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-accent">
                      <KindIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{content.judul}</p>
                      <p className="text-sm text-muted-foreground">{KIND_LABELS[content.type]}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatContentDate(content.updatedAt)}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title="Belum ada konten terbit" description="Konten yang sudah diterbitkan Admin akan muncul di sini." />
        )}
      </section>
    </div>
  );
}
