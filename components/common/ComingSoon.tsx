import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Layar pengganti untuk fitur yang belum dibuka bagi pengguna.
export default function ComingSoon({ title, description, icon: Icon }: ComingSoonProps) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="mt-5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
        Segera hadir
      </span>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Dashboard
      </Link>
    </section>
  );
}
