import Link from "next/link";
import {
  ArrowRight,
  Clock3,
} from "lucide-react";

import { CareerResource } from "@/types/CareerResource";

interface CareerResourceCardProps {
  resource: CareerResource;
}

export default function CareerResourceCard({
  resource,
}: CareerResourceCardProps) {
  const Icon = resource.icon;
  const isComingSoon =
    resource.status === "coming-soon";

  return (
    <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-6 w-6" />
        </div>

        {isComingSoon && (
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            Coming Soon
          </span>
        )}
      </div>

      <div className="mt-5 flex-1">
        <span className="text-xs font-medium text-muted-foreground">
          {resource.category}
        </span>

        <h2 className="mt-2 text-lg font-semibold">
          {resource.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {resource.description}
        </p>
      </div>

      {isComingSoon ? (
        <button
          type="button"
          disabled
          className="mt-6 flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground"
        >
          Belum Tersedia
          <Clock3 className="h-4 w-4" />
        </button>
      ) : (
        <Link
          href={resource.href}
          className="group mt-6 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          Pelajari

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </article>
  );
}