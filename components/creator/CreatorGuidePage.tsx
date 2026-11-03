import { ExternalLink, LucideIcon } from "lucide-react";

import { ARTICLE_TEMPLATE_URL, GOOGLE_DOCS_FLOW, WRITING_STEPS } from "@/data/contentGuide";

interface CreatorGuidePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Halaman informasi menu Creator selama konten ditulis di Google Docs (PRD FR-15). Creator
// tidak memakai GitHub, jadi halaman ini tidak boleh memuat istilah Git.
export default function CreatorGuidePage({ title, description, icon: Icon }: CreatorGuidePageProps) {
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

      <section aria-labelledby="alur-konten" className="rounded-2xl border border-border bg-card p-5">
        <h2 id="alur-konten" className="text-lg font-bold">
          Sementara, konten ditulis di Google Docs
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Editor di aplikasi tersedia setelah backend siap. Untuk saat ini, setiap tahap dilakukan di dokumen Google
          Docs:
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Tahap</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Yang kamu lakukan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {GOOGLE_DOCS_FLOW.map(({ stage, action }) => (
                <tr key={stage}>
                  <th scope="row" className="px-4 py-2.5 align-top font-medium">{stage}</th>
                  <td className="px-4 py-2.5 text-muted-foreground">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          {ARTICLE_TEMPLATE_URL ? (
            <a
              href={ARTICLE_TEMPLATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Buka Template Artikel
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex min-h-10 cursor-not-allowed items-center rounded-xl bg-muted px-4 text-left text-sm font-semibold text-foreground"
            >
              Template sedang disiapkan. Hubungi Admin.
            </button>
          )}
        </div>
      </section>

      <section aria-labelledby="panduan-menulis" className="rounded-2xl border border-border bg-card p-5">
        <h2 id="panduan-menulis" className="text-lg font-bold">
          Panduan singkat menulis
        </h2>
        <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-sm leading-6">
          {WRITING_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
