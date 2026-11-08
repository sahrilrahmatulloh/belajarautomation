"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowLeft, Download, RotateCcw, Share2 } from "lucide-react";

import ShareLinks from "@/components/common/ShareLinks";
import { Rank } from "@/data/ranks";
import { formatNumber } from "@/lib/format";
import { createRankUpCard } from "@/lib/rankUpShareCard";

type CardState =
  | { status: "loading" | "error" }
  | { status: "ready"; file: File; url: string; canShareFile: boolean };

interface RankUpShareProps {
  rank: Rank;
  xp: number;
  displayName: string;
  username: string | null;
  image: string;
  onBack: () => void;
}

// Tampilan bagikan pencapaian di dalam popup naik rank: kartu gambar 1080x1080 yang bisa
// diunduh atau dibagikan lewat menu bawaan perangkat, serta tautan profil ke media sosial.
export default function RankUpShare({ rank, xp, displayName, username, image, onBack }: RankUpShareProps) {
  const [card, setCard] = useState<CardState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    createRankUpCard({ rank, displayName, username, xp, image })
      .then((blob) => {
        if (!active) return;
        const file = new File([blob], `naik-rank-${rank.name.toLowerCase()}.png`, { type: "image/png" });
        setCard({
          status: "ready",
          file,
          url: URL.createObjectURL(blob),
          canShareFile: typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }),
        });
      })
      .catch(() => {
        if (active) setCard({ status: "error" });
      });
    return () => {
      active = false;
    };
  }, [rank, displayName, username, xp, image, attempt]);

  const cardUrl = card.status === "ready" ? card.url : null;
  useEffect(() => {
    if (!cardUrl) return;
    return () => URL.revokeObjectURL(cardUrl);
  }, [cardUrl]);

  const shareText = `Aku baru naik ke rank ${rank.name} di BelajarAutomation! Total ${formatNumber(xp)} XP.`;
  const profileUrl = username ? `${window.location.origin}/u/${username}` : null;

  const shareImage = async () => {
    if (card.status !== "ready") return;
    try {
      await navigator.share({ files: [card.file], text: shareText });
    } catch {
      // Pengguna menutup menu bagikan; tidak perlu pesan.
    }
  };

  const retry = () => {
    setCard({ status: "loading" });
    setAttempt((value) => value + 1);
  };

  return (
    <div className="p-5 text-left">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali
      </button>
      <Dialog.Title className="mt-2 text-lg font-bold">Bagikan Pencapaian</Dialog.Title>
      <Dialog.Description className="mt-0.5 text-sm text-slate-300">
        Unduh kartu naik rank-mu atau bagikan ke media sosial.
      </Dialog.Description>

      <div className="mx-auto mt-4 aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-white/15 bg-white/5">
        {card.status === "ready" && (
          // Gambar berasal dari blob lokal, jadi next/image tidak bisa dipakai.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.url} alt={`Kartu naik rank ${displayName} ke ${rank.name}, ${formatNumber(xp)} XP`} className="h-full w-full object-cover" />
        )}
        {card.status === "loading" && (
          <div role="status" className="flex h-full animate-pulse items-center justify-center text-sm text-slate-300">
            Menyiapkan gambar…
          </div>
        )}
        {card.status === "error" && (
          <div role="alert" className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm">
            Gambar gagal dibuat.
            <button
              type="button"
              onClick={retry}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/30 px-3 font-medium transition-colors hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Coba lagi
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {card.status === "ready" ? (
          <a
            href={card.url}
            download={card.file.name}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Unduh PNG
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white opacity-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Unduh PNG
          </button>
        )}
        {card.status === "ready" && card.canShareFile && (
          <button
            type="button"
            onClick={() => void shareImage()}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/40 px-4 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Bagikan Gambar
          </button>
        )}
      </div>

      {profileUrl && <ShareLinks title="Bagikan tautan profil" url={profileUrl} text={shareText} />}
    </div>
  );
}
