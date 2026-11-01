import { ROADMAPS } from "@/data/roadmap";
import { getRoadmapCourseNodes } from "@/lib/roadmap";

// Roadmap aktif yang memuat course tertentu, termasuk di dalam cabang.
export function getRoadmapsForCourse(courseSlug: string) {
  return ROADMAPS.filter(
    (roadmap) =>
      roadmap.status === "active" &&
      getRoadmapCourseNodes(roadmap).some((node) => node.courseSlug === courseSlug)
  ).map((roadmap) => ({ id: roadmap.id, title: roadmap.title }));
}
