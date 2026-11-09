"use client";

import { FolderKanban } from "lucide-react";

import { PROJECTS } from "@/data/projects";
import { useProductCatalog } from "@/lib/content";
import { useSession } from "@/lib/session";
import { Project } from "@/types/Project";

import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  const session = useSession();
  const catalog = useProductCatalog("project", session?.userId);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Koleksi Project
        </h2>

        <p className="mt-1 text-muted-foreground">
          Project akan tersedia secara bertahap.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {(catalog?.products ?? []).map((product) => {
          // Produk dari Panel Admin; detail teknisnya masih dari data katalog.
          const base = PROJECTS.find((item) => `project-${item.id}` === product.id);
          const project: Project = {
            id: base?.id ?? 0,
            category: base?.category ?? "Project",
            difficulty: base?.difficulty ?? "Beginner",
            techStack: base?.techStack ?? [],
            icon: base?.icon ?? FolderKanban,
            status: "locked",
            title: product.title,
            description: product.description,
          };

          return <ProjectCard key={product.id} project={project} price={product.price} isOwned={catalog?.ownedIds.has(product.id) ?? false} />;
        })}
      </div>
    </section>
  );
}
