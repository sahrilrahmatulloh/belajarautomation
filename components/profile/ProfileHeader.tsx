import Link from "next/link";
import { Settings2, UserRound } from "lucide-react";

export default function ProfileHeader() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
          <UserRound className="h-10 w-10" aria-hidden="true" />
        </div>

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
