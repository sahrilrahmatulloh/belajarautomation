import { COURSES } from "@/data/courses";
import { RoadmapStep } from "@/types/Roadmap";

import RoadmapNode from "./RoadmapNode";

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
}

const availableCourseSlugs = new Set(
  COURSES.map((course) => course.slug)
);

export default function RoadmapTimeline({
  steps,
}: RoadmapTimelineProps) {
  const titleById = new Map(
    steps.map((step) => [step.id, step.title])
  );

  return (
    <ol>
      {steps.map((step, index) => (
        <RoadmapNode
          key={step.id}
          step={step}
          index={index}
          isLast={index === steps.length - 1}
          prerequisiteTitles={step.prerequisites
            .map((id) => titleById.get(id))
            .filter((title): title is string => Boolean(title))}
          courseHref={
            step.courseSlug && availableCourseSlugs.has(step.courseSlug)
              ? `/learn/${step.courseSlug}`
              : undefined
          }
        />
      ))}
    </ol>
  );
}
