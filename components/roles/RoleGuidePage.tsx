import { CircleCheck, ExternalLink, LucideIcon } from "lucide-react";

import { CONTENT_GUIDE_URL, ROLE_GUIDES } from "@/data/contentGuide";

interface RoleGuidePageProps {
  role: keyof typeof ROLE_GUIDES;
  title: string;
  description: string;
  icon: LucideIcon;
}

// Halaman informasi menu Reviewer dan Admin sebelum backend tersedia (PRD FR-15).
export default function RoleGuidePage({ role, title, description, icon: Icon }: RoleGuidePageProps) {
  const guide = ROLE_GUIDES[role];

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
          {guide.flowTitle}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{guide.intro}</p>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Tahap</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Yang kamu lakukan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guide.flow.map(({ stage, action }) => (
                <tr key={stage}>
                  <th scope="row" className="px-4 py-2.5 align-top font-medium">{stage}</th>
                  <td className="px-4 py-2.5 text-muted-foreground">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {role === "admin" && (
          <a
            href={CONTENT_GUIDE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Buka Panduan Admin
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </section>

      <section aria-labelledby="daftar-periksa" className="rounded-2xl border border-border bg-card p-5">
        <h2 id="daftar-periksa" className="text-lg font-bold">
          {guide.checklistTitle}
        </h2>
        <ul className="mt-3 space-y-2.5 text-sm leading-6">
          {guide.checklist.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CircleCheck className="mt-1 h-4 w-4 shrink-0 text-primary-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
