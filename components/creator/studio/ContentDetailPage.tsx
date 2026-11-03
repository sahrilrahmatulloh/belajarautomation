"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { useCreatorStudio } from "@/lib/creatorStudio";
import { formatDate } from "@/lib/format";

import ArticlePreview from "./ArticlePreview";
import PrototypeNotice from "./PrototypeNotice";

// Tampilan baca konten yang sedang direview atau menunggu terbit.
export default function ContentDetailPage({ contentId }: { contentId: number }) {
  const { contents } = useCreatorStudio();
  const content = contents.find((item) => item.id === contentId);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <PrototypeNotice />

      <Link href="/creator/konten" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Konten Saya
      </Link>

      {content ? (
        <>
          <header>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{content.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <ContentStatusBadge status={content.status} />
              <span>{content.type}</span>
              <span>Diperbarui {formatDate(content.updatedAt)}</span>
            </div>
          </header>
          <div className="rounded-2xl border border-border bg-card p-5">
            <ArticlePreview title={content.title} body={content.article?.body ?? ""} videos={content.article?.videos ?? []} />
          </div>
        </>
      ) : (
        <h1 className="text-2xl font-bold tracking-tight">Konten tidak ditemukan</h1>
      )}
    </div>
  );
}
