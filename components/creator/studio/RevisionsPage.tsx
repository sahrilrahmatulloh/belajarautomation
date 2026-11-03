"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import FilterChips from "@/components/filters/FilterChips";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { DUMMY_REVISION_THREADS } from "@/data/dummy/creator";
import { countFixedNotes, useCreatorStudio } from "@/lib/creatorStudio";
import { formatDate } from "@/lib/format";

import PrototypeNotice from "./PrototypeNotice";

const OPEN = "";
const DONE = "selesai";

// Daftar Catatan Revisi per konten (PRD FR-15, tahap setelah backend), sebagai prototipe.
export default function RevisionsPage() {
  const { contents, notes } = useCreatorStudio();
  const [filter, setFilter] = useState(OPEN);

  const threads = DUMMY_REVISION_THREADS.map((thread) => ({
    thread,
    content: contents.find((content) => content.id === thread.contentId),
  })).filter((item) => item.content);
  const open = threads.filter(({ content }) => content?.status === "needs-revision");
  const done = threads.filter(({ content }) => content?.status !== "needs-revision");
  const visible = filter === DONE ? done : open;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Catatan Revisi</h1>
        <p className="mt-1 text-muted-foreground">Daftar catatan revisi dari Reviewer untuk setiap kontenmu.</p>
      </header>

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

      {visible.length > 0 ? (
        <ul className="space-y-3">
          {visible.map(({ thread, content }) => (
            <li key={thread.contentId}>
              <Link href={`/creator/revisi/${thread.contentId}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{content?.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {thread.reviewerName} · {formatDate(thread.date)} · {countFixedNotes(thread.contentId, notes)} dari {thread.notes.length} selesai
                  </span>
                </span>
                {content && <ContentStatusBadge status={content.status} />}
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
