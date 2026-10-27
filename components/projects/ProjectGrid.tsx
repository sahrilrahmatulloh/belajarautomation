import { PROJECTS } from "@/data/projects";

import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Project Library
        </h2>

        <p className="mt-1 text-muted-foreground">
          Project akan tersedia secara bertahap.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}