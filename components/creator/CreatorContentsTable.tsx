"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { DUMMY_CREATOR_CONTENTS } from "@/data/dummy/creator";
import { formatDate } from "@/lib/format";

// Tabel konten. Notifikasi mengarah ke ?konten=<id> untuk menandai konten terkait,
// karena halaman detail konten baru ada setelah backend tersedia (PRD FR-15).
export default function CreatorContentsTable() {
  const highlightedId = useSearchParams().get("konten");
  const highlightedRow = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    highlightedRow.current?.scrollIntoView({ block: "center" });
  }, [highlightedId]);

  return (
    <div role="group" tabIndex={0} aria-label="Tabel konten" className="relative -mx-4 overflow-x-auto sm:-mx-5">
      <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="sr-only">Daftar konten milik creator beserta status penerbitannya</caption>
        <thead className="border-y border-border bg-muted/40 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Judul</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Jenis</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
            <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Diperbarui</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {DUMMY_CREATOR_CONTENTS.map((content) => {
            const isHighlighted = String(content.id) === highlightedId;

            return (
              <tr
                key={content.id}
                ref={isHighlighted ? highlightedRow : undefined}
                aria-current={isHighlighted ? "true" : undefined}
                className={isHighlighted ? "bg-primary/10" : undefined}
              >
                <th scope="row" className="px-4 py-3 font-medium sm:px-5">{content.title}</th>
                <td className="px-3 py-3 text-muted-foreground">{content.type}</td>
                <td className="px-3 py-3">
                  <ContentStatusBadge status={content.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground sm:px-5">
                  {formatDate(content.updatedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
