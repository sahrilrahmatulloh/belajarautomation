import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { DEFAULT_AVATAR } from "@/data/profile";
import { getRank } from "@/data/ranks";
import { formatNumber } from "@/lib/format";

export default function ProfileHeader() {
  const rank = getRank(DUMMY_ACCOUNT.xp);

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <Image
          src={DEFAULT_AVATAR}
          alt="Foto profil"
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full"
        />

        {/* Information */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Profil belajar
          </h1>

          <p className="mt-1 text-muted-foreground">
            Kelola preferensi dan pengaturan akun kamu.
          </p>

          <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border bg-background/60 py-1.5 pl-1.5 pr-4" style={{ borderColor: `${rank.color}66` }}>
            <RankEmblem rank={rank} variant="full" size={48} />
            <div>
              <p className="text-xs text-muted-foreground">Rank</p>
              <p className="font-semibold">
                {rank.name}{" "}
                <span className="font-normal text-muted-foreground">· {formatNumber(DUMMY_ACCOUNT.xp)} XP</span>
              </p>
            </div>
          </div>

        </div>

        <Link href="/settings" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent">
          <Settings2 className="h-4 w-4" aria-hidden="true" />
          Pengaturan
        </Link>
      </div>
    </section>
  );
}
