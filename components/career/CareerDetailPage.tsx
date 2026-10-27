import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { CareerResource } from "@/types/CareerResource";

interface CareerDetailPageProps {
  resource: CareerResource;
}

export default function CareerDetailPage({
  resource,
}: CareerDetailPageProps) {
  const Icon = resource.icon;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Back */}
      <Link
        href="/career"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Career
      </Link>

      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-7 w-7" />
        </div>

        <p className="mt-6 text-sm font-medium text-muted-foreground">
          {resource.category}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {resource.title}
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          {resource.description}
        </p>
      </section>

      {/* Content */}
      <div className="space-y-6">
        {resource.sections.map((section, index) => (
          <section
            key={section.title}
            className="rounded-3xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {section.title}
                </h2>

                <p className="mt-2 leading-7 text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-muted-foreground" />

                  <span className="text-sm font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}