import { ExternalLink, LucideIcon } from "lucide-react";

import { CONTENT_GUIDE_URL, GITHUB_FLOW } from "@/data/contentGuide";

interface RoleGuidePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  // Judul bagian alur GitHub, mengikuti tugas peran yang membukanya.
  flowTitle: string;
}

// Halaman informasi menu peran selama konten masih dikelola lewat GitHub (PRD FR-15).
export default function RoleGuidePage({ title, description, icon: Icon, flowTitle }: RoleGuidePageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <header className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-accent">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>
      </header>

      <section aria-labelledby="alur-github" className="rounded-2xl border border-border bg-card p-5">
        <h2 id="alur-github" className="text-lg font-bold">
          {flowTitle}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Fitur di aplikasi tersedia setelah backend siap. Untuk saat ini, setiap tahap konten berlangsung di
          repository:
        </p>

        <div role="group" tabIndex={0} aria-label="Alur konten di GitHub" className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Tahap</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Bentuk di GitHub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {GITHUB_FLOW.map(({ stage, github }) => (
                <tr key={stage}>
                  <th scope="row" className="px-4 py-2.5 font-medium">{stage}</th>
                  <td className="px-4 py-2.5 text-muted-foreground">{github}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a
          href={CONTENT_GUIDE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Buka Panduan Kontribusi
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
