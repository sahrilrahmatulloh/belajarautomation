import {
  CheckCircle2,
  Lock,
  Wrench,
} from "lucide-react";

import { formatRupiah } from "@/lib/format";
import { Project } from "@/types/Project";

interface ProjectCardProps {
  project: Project;
  price: number;
  isOwned: boolean;
}

export default function ProjectCard({
  project,
  price,
  isOwned,
}: ProjectCardProps) {
  const Icon = project.icon;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-6 w-6" />
        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {isOwned ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          {isOwned ? "Dimiliki" : "Terkunci"}
        </span>
      </div>

      <div className="mt-5 flex-1">
        <span className="text-xs font-medium text-muted-foreground">
          {project.category}
        </span>

        <h2 className="mt-2 text-lg font-semibold">
          {project.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs font-medium text-muted-foreground">
          {project.difficulty}
        </span>

        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wrench className="h-3.5 w-3.5" />
          Lab Project
        </span>
      </div>

      <button
        type="button"
        disabled
        className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground"
      >
        {isOwned ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        {isOwned ? "Unduhan belum tersedia" : `Project Terkunci · ${formatRupiah(price)}`}
      </button>
    </article>
  );
}
