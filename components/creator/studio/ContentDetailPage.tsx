"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ContentArticleView from "@/components/content/ContentArticleView";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { useSession } from "@/lib/session";

import PrototypeNotice from "./PrototypeNotice";
import { useCreatorData } from "./useCreatorData";

// Tampilan baca konten yang sedang direview, menunggu terbit, atau terbit (simulasi).
export default function ContentDetailPage({ contentId }: { contentId: string }) {
  const session = useSession();
  const { data } = useCreatorData();
  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat konten...</p>;

  const content = data.contents.find((item) => item.id === contentId);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <PrototypeNotice />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/creator/konten" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Konten Saya
        </Link>
        {content && <ContentStatusBadge status={content.status} />}
      </div>

      {content ? (
        <ContentArticleView content={content} authorName={session?.name ?? ""} />
      ) : (
        <h1 className="text-2xl font-bold tracking-tight">Konten tidak ditemukan</h1>
      )}
    </div>
  );
}
