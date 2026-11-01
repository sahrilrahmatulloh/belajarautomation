import { COURSES } from "@/data/courses";
import { Roadmap, RoadmapCourseNode } from "@/types/Roadmap";

// Semua node course di roadmap, termasuk yang ada di dalam cabang.
export function getRoadmapCourseNodes(roadmap: Roadmap): RoadmapCourseNode[] {
  return roadmap.nodes.flatMap((node) =>
    node.type === "branch"
      ? node.options.flatMap((option) => option.nodes)
      : [node]
  );
}

// Jumlah course unik dan yang sudah tersedia, dihitung dari katalog (bukan progress).
export function getRoadmapCourseStats(roadmap: Roadmap) {
  const slugs = new Set(
    getRoadmapCourseNodes(roadmap).map((node) => node.courseSlug)
  );
  const available = COURSES.filter(
    (course) => slugs.has(course.slug) && course.availability === "available"
  ).length;

  return { total: slugs.size, available };
}
