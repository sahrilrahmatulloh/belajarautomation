"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { PartyPopper } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { Rank } from "@/data/ranks";
import { addRankUpNotification } from "@/lib/rankUpNotifications";
import { onRankUp } from "@/lib/realProgress";
import { useSession } from "@/lib/session";

// Popup perayaan saat pengguna naik rank (PRD FR-05, ekspresi maskot "merayakan" FR-12),
// sekaligus mencatat notifikasi di kelompok Progres.
export default function RankUpCelebration() {
  const session = useSession();
  const [rank, setRank] = useState<Rank | null>(null);
  const account = session?.userId;

  useEffect(() => {
    if (!account) return;
    return onRankUp((nextRank) => {
      addRankUpNotification(account, nextRank.name);
      setRank(nextRank);
    });
  }, [account]);

  if (!rank) return null;

  return (
    <Dialog.Root open onOpenChange={(open) => !open && setRank(null)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card text-center text-foreground shadow-xl">
          <div
            className="flex flex-col items-center px-6 pb-2 pt-8"
            style={{ background: `linear-gradient(to bottom, ${rank.color}33, transparent)` }}
          >
            <PartyPopper className="h-6 w-6 text-primary-accent" aria-hidden="true" />
            <RankEmblem rank={rank} variant="full" size={112} className="mt-3 animate-in zoom-in-50 duration-500" />
          </div>
          <div className="px-6 pb-6">
            <Dialog.Title className="text-xl font-bold">Selamat, kamu naik rank!</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              Sekarang kamu <strong className="text-foreground">{rank.name}</strong>. Terus belajar untuk mencapai rank berikutnya.
            </Dialog.Description>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/rank"
                onClick={() => setRank(null)}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Lihat detail rank
              </Link>
              <Dialog.Close className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent">
                Lanjut belajar
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
