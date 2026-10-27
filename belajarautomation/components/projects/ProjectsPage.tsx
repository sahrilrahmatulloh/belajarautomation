import ProjectsHeader from "./ProjectsHeader";
import ProjectGrid from "./ProjectGrid";

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <ProjectsHeader />
      <ProjectGrid />
    </div>
  );
}