import { ROADMAPS } from "@/data/roadmap";

// Roadmap aktif yang memuat course tertentu (dihitung dari data, bukan progress).
export function getRoadmapsForCourse(courseSlug: string) {
  return ROADMAPS.filter(
    (roadmap) =>
      roadmap.status === "active" &&
      roadmap.steps.some((step) => step.courseSlug === courseSlug)
  ).map((roadmap) => ({ id: roadmap.id, title: roadmap.title }));
}
