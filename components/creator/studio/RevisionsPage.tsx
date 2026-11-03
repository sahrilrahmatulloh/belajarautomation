"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import FilterChips from "@/components/filters/FilterChips";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { formatContentDate } from "@/lib/content/document";
import { latestRoundNotes, needsCreatorAction } from "@/lib/content/rules";

import PrototypeNotice from "./PrototypeNotice";
import { useCreatorData, userName } from "./useCreatorData";

const OPEN = "";
const DONE = "selesai";

// Daftar Catatan Revisi per konten (PRD FR-15).
export default function RevisionsPage() {
  const { data } = useCreatorData();
  const [filter, setFilter] = useState(OPEN);
  const [contentFilter, setContentFilter] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat catatan...</p>;

  const threads = data.contents
    .map((content) => ({ content, notes: latestRoundNotes(data.notes.filter((note) => note.contentId === content.id)) }))
    .filter(({ notes }) => notes.length > 0);
  const open = threads.filter(({ content, notes }) => needsCreatorAction(content, notes));
  const done = threads.filter(({ content, notes }) => !needsCreatorAction(content, notes));
  const visible = (filter === DONE ? done : open).filter(({ content }) => !contentFilter || content.id === contentFilter);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Catatan Revisi</h1>
        <p className="mt-1 text-muted-foreground">Daftar catatan revisi dari Reviewer untuk setiap kontenmu.</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          label="Catatan"
          layout="scroll"
          options={[
            { value: OPEN, label: `Perlu ditangani (${open.length})` },
            { value: DONE, label: `Selesai (${done.length})` },
          ]}
          active={filter}
          onChange={setFilter}
        />
        <select
          aria-label="Filter konten"
          value={contentFilter}
          onChange={(event) => setContentFilter(event.target.value)}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium sm:w-64 dark:bg-card"
        >
          <option value="">Semua konten</option>
          {threads.map(({ content }) => <option key={content.id} value={content.id}>{content.judul}</option>)}
        </select>
      </div>

      {visible.length > 0 ? (
        <ul className="space-y-3">
          {visible.map(({ content, notes }) => (
            <li key={content.id}>
              <Link href={`/creator/revisi/${content.id}`} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
                <span className="min-w-0 flex-1 basis-56">
                  <span className="block font-semibold">{content.judul}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {userName(data.users, notes[0].reviewerId)} · {formatContentDate(notes[0].createdAt)} · {notes.filter((note) => note.markedFixed).length} dari {notes.length} selesai
                  </span>
                </span>
                <ContentStatusBadge status={content.status} />
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          {filter === DONE ? "Belum ada catatan yang selesai." : "Tidak ada catatan yang perlu ditangani."}
        </p>
      )}
    </div>
  );
}
