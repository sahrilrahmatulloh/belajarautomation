"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Check, Copy, Download, RotateCcw, Share2, X } from "lucide-react";

import { getRank } from "@/data/ranks";
import { formatNumber } from "@/lib/format";
import { createShareCard, SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH } from "@/lib/shareCard";

interface ShareProfileDialogProps {
  displayName: string;
  username: string;
  avatarImage: string;
  themeImage: string;
  xp: number;
  lessons: number;
  challenges: number;
  achievements: number;
  isProfilePublic: boolean;
}

type CardState =
  | { status: "idle" | "loading" | "error" }
  | { status: "ready"; file: File; url: string; canShareFile: boolean };

const socialButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-3 text-sm font-medium transition-colors hover:bg-accent";

// Modal berbagi profil: unduh kartu PNG, bagikan gambarnya lewat menu bawaan
// perangkat, atau bagikan tautan profil ke media sosial.
export default function ShareProfileDialog({
  displayName,
  username,
  avatarImage,
  themeImage,
  xp,
  lessons,
  challenges,
  achievements,
  isProfilePublic,
}: ShareProfileDialogProps) {
  const [card, setCard] = useState<CardState>({ status: "idle" });
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [origin, setOrigin] = useState("");

  const cardUrl = card.status === "ready" ? card.url : null;
  useEffect(() => {
    if (!cardUrl) return;
    return () => URL.revokeObjectURL(cardUrl);
  }, [cardUrl]);

  const rank = getRank(xp);

  const generateCard = async () => {
    setCard({ status: "loading" });
    try {
      const blob = await createShareCard({
        displayName,
        username,
        avatarImage,
        themeImage,
        rank,
        xp,
        lessons,
        challenges,
        achievements,
      });
      const file = new File([blob], `profil-${username}.png`, { type: "image/png" });
      setCard({
        status: "ready",
        file,
        url: URL.createObjectURL(blob),
        // Tidak semua browser mendukung berbagi file, jadi tombolnya bersyarat.
        canShareFile: typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }),
      });
    } catch {
      setCard({ status: "error" });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCopyStatus("idle");
      return;
    }
    setOrigin(window.location.origin);
    // Gambar hanya dibuat sekali; isinya tidak berubah selama halaman terbuka.
    if (card.status !== "ready") void generateCard();
  };

  const profileUrl = `${origin}/u/${username}`;
  const shareText = `Lihat profil belajar QA saya di BelajarAutomation! Rank ${rank.name}, ${formatNumber(xp)} XP.`;
  const encodedUrl = encodeURIComponent(profileUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialLinks = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}` },
    { label: "X", href: `https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
  ];

  const shareImage = async () => {
    if (card.status !== "ready") return;
    try {
      await navigator.share({ files: [card.file], text: shareText });
    } catch {
      // Pengguna menutup menu bagikan; tidak perlu pesan.
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        aria-label="Bagikan profil"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/40 text-white backdrop-blur-sm transition-colors hover:bg-slate-950/60"
      >
        <Share2 className="h-5 w-5" aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl transition duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-lg font-bold">Bagikan Profil</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-muted-foreground">
                Unduh kartu profilmu atau bagikan ke media sosial.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Tutup"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>
          </div>

          {/* Pratinjau kartu */}
          <div
            className="mt-4 overflow-hidden rounded-xl border border-border bg-muted"
            style={{ aspectRatio: `${SHARE_CARD_WIDTH} / ${SHARE_CARD_HEIGHT}` }}
          >
            {card.status === "ready" && (
              // Gambar berasal dari blob lokal, jadi next/image tidak bisa dipakai.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.url}
                alt={`Kartu profil ${displayName}: rank ${rank.name}, ${formatNumber(xp)} XP`}
                className="h-full w-full object-cover"
              />
            )}
            {card.status === "loading" && (
              <div role="status" className="flex h-full animate-pulse items-center justify-center text-sm text-muted-foreground">
                Menyiapkan gambar…
              </div>
            )}
            {card.status === "error" && (
              <div role="alert" className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm">
                Gambar gagal dibuat.
                <button
                  type="button"
                  onClick={() => void generateCard()}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 font-medium transition-colors hover:bg-accent"
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
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Unduh PNG
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground opacity-50"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Unduh PNG
              </button>
            )}
            {card.status === "ready" && card.canShareFile && (
              <button
                type="button"
                onClick={() => void shareImage()}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Bagikan Gambar
              </button>
            )}
          </div>

          {isProfilePublic ? (
            <div className="mt-5">
              <h3 className="text-sm font-semibold">Bagikan tautan profil</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
                    {link.label}
                  </a>
                ))}
                <button type="button" onClick={() => void copyLink()} className={`${socialButtonClass} gap-1.5`}>
                  {copyStatus === "copied" ? (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  {copyStatus === "copied" ? "Tersalin" : "Salin tautan"}
                </button>
              </div>
              <p aria-live="polite" className="mt-2 text-xs leading-5 text-muted-foreground">
                {copyStatus === "failed"
                  ? "Tautan gagal disalin. Coba lagi."
                  : "Tombol di atas membagikan tautan. Untuk membagikan gambarnya, misalnya ke Instagram, unduh PNG lalu unggah."}
              </p>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
              Profilmu sedang privat, jadi hanya gambar yang bisa dibagikan.
            </p>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
