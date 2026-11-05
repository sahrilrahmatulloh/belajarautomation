"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import ListPagination, { pageSlice } from "@/components/common/ListPagination";
import { userName } from "@/components/creator/studio/useCreatorData";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import FilterChips from "@/components/filters/FilterChips";
import SearchField from "@/components/filters/SearchField";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { runContentAction } from "@/lib/content";
import { formatContentDate, KIND_LABELS } from "@/lib/content/document";
import { matchesKeyword } from "@/lib/filters";
import { ContentItem, ContentKind } from "@/types/ContentWorkflow";

import { reviewQueues, submissionLabel, useReviewerData, waitingDays } from "./useReviewerData";

const PAGE_SIZE = 10;
const KINDS = Object.keys(KIND_LABELS) as ContentKind[];
const actionClass = "whitespace-nowrap rounded font-medium text-primary-accent underline-offset-2 hover:underline";

type TabId = "ditugaskan" | "belum" | "riwayat";

// Antrian Review (PRD FR-15). Riwayat Review memakai halaman yang sama dengan tab terbuka.
export default function ReviewQueuePage({ initialTab = "ditugaskan" }: { initialTab?: TabId }) {
  const router = useRouter();
  const { userId, data } = useReviewerData();
  const [tab, setTab] = useState<TabId>(initialTab);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat antrean...</p>;

  const { assigned, unassigned, history } = reviewQueues(data, userId);
  const lists: Record<TabId, ContentItem[]> = { ditugaskan: assigned, belum: unassigned, riwayat: history };
  const filtered = lists[tab].filter((content) => (!kind || content.type === kind) && matchesKeyword(search, content.judul));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
  const isHistory = tab === "riwayat";

  const claim = async (content: ContentItem) => {
    const result = await runContentAction((repository) => repository.claimReview(userId, content.id));
    if (result.ok) router.push(`/reviewer/review/${content.id}`);
    else setError(result.message);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Antrean Review</h1>
        <p className="mt-1 text-muted-foreground">Periksa konten dari Creator sebelum diterbitkan.</p>
      </header>

      {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
        <SearchField
          label="Cari konten"
          value={search}
          placeholder="Cari judul konten..."
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <select
          aria-label="Filter jenis"
          value={kind}
          onChange={(event) => {
            setKind(event.target.value);
            setPage(1);
          }}
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card"
        >
          <option value="">Semua jenis</option>
          {KINDS.map((item) => <option key={item} value={item}>{KIND_LABELS[item]}</option>)}
        </select>
      </div>

      <FilterChips
        label="Antrean"
        layout="scroll"
        options={[
          { value: "ditugaskan", label: `Ditugaskan ke saya (${assigned.length})` },
          { value: "belum", label: `Belum ditugaskan (${unassigned.length})` },
          { value: "riwayat", label: `Riwayat (${history.length})` },
        ]}
        active={tab}
        onChange={(value) => {
          setTab(value as TabId);
          setPage(1);
        }}
      />

      {filtered.length > 0 ? (
        <>
          <div role="group" tabIndex={0} aria-label="Tabel antrean review" className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  {["Judul", "Jenis", "Creator", "Tanggal dikirim", "Kiriman", isHistory ? "Status" : "Lama menunggu", "Aksi"].map((heading) => (
                    <th key={heading} scope="col" className="px-4 py-2.5 font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageSlice(filtered, currentPage, PAGE_SIZE).map((content) => (
                  <tr key={content.id}>
                    <th scope="row" className="px-4 py-3 font-medium">{content.judul}</th>
                    <td className="px-4 py-3 text-muted-foreground">{KIND_LABELS[content.type]}</td>
                    <td className="px-4 py-3">{userName(data.users, content.authorId)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{content.submittedAt ? formatContentDate(content.submittedAt) : "-"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{submissionLabel(content.submissionCount)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {isHistory ? <ContentStatusBadge status={content.status} /> : `${waitingDays(content, data.loadedAt)} hari`}
                    </td>
                    <td className="px-4 py-3">
                      {tab === "belum" ? (
                        content.authorId === userId ? (
                          <span className="text-muted-foreground">Tulisanmu sendiri</span>
                        ) : (
                          <button type="button" onClick={() => void claim(content)} className={actionClass}>Ambil untuk review</button>
                        )
                      ) : (
                        <Link href={`/reviewer/review/${content.id}`} className={actionClass}>{isHistory ? "Lihat" : "Review"}</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ListPagination total={filtered.length} page={currentPage} pageSize={PAGE_SIZE} itemLabel="konten" onChange={setPage} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          {lists[tab].length === 0 ? "Belum ada konten di sini." : "Tidak ada konten yang cocok."}
        </p>
      )}
    </div>
  );
}
