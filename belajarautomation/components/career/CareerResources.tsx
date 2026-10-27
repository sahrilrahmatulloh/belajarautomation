import { CAREER_RESOURCES } from "@/data/careerResources";

import CareerResourceCard from "./CareerResourceCard";

export default function CareerResources() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Career Resources
        </h2>

        <p className="mt-1 text-muted-foreground">
          Resource praktis untuk membantu kamu mempersiapkan karier di bidang QA Automation.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {CAREER_RESOURCES.map((resource) => (
          <CareerResourceCard
            key={resource.id}
            resource={resource}
          />
        ))}
      </div>
    </section>
  );
}