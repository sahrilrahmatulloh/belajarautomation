import { LucideIcon } from "lucide-react";

// Judul halaman peran (Creator, Reviewer) dengan ikon fitur yang sama seperti di sidebar, agar mudah
// dikenali (PRD FR-15). Aksi opsional berada di kanan, dan turun ke bawah di layar kecil.
export default function RolePageHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-accent">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
      </div>
      {action}
    </header>
  );
}
