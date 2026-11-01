import { COURSES } from "@/data/courses";
import { RoadmapNode as RoadmapNodeData } from "@/types/Roadmap";

import RoadmapBranch from "./RoadmapBranch";
import RoadmapNode from "./RoadmapNode";

interface RoadmapTimelineProps {
  nodes: RoadmapNodeData[];
}

const courseBySlug = new Map(
  COURSES.map((course) => [course.slug, course])
);

export default function RoadmapTimeline({
  nodes,
}: RoadmapTimelineProps) {
  return (
    <ol>
      {nodes.map((node, index) => {
        const next = nodes[index + 1];
        const nextOptional = next?.type === "course" && Boolean(next.optional);
        const isLast = index === nodes.length - 1;
        const step = index + 1;

        if (node.type === "branch") {
          return (
            <RoadmapBranch
              key={`branch-${index}`}
              options={node.options}
              courseBySlug={courseBySlug}
              step={step}
              isLast={isLast}
              nextOptional={nextOptional}
            />
          );
        }

        const course = courseBySlug.get(node.courseSlug);
        // Slug yang hilang sudah dicegah oleh npm run check:roadmaps.
        if (!course) return null;

        return (
          <RoadmapNode
            key={node.courseSlug}
            course={course}
            step={step}
            optional={node.optional}
            isLast={isLast}
            nextOptional={nextOptional}
          />
        );
      })}
    </ol>
  );
}
