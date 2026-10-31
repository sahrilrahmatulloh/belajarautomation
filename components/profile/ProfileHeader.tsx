import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";

import { DEFAULT_AVATAR } from "@/data/profile";

export default function ProfileHeader() {
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

        </div>

        <Link href="/settings" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent">
          <Settings2 className="h-4 w-4" aria-hidden="true" />
          Pengaturan
        </Link>
      </div>
    </section>
  );
}
