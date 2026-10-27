"use client";

import { useMemo, useState } from "react";

import { CHALLENGES } from "@/data/challenges";

import ChallengeCard from "./ChallengeCard";
import ChallengeFilters, {
  ChallengeFilter,
} from "./ChallengeFilters";

export default function ChallengeGrid() {
  const [activeCategory, setActiveCategory] =
    useState<ChallengeFilter>("All");

  const filteredChallenges = useMemo(() => {
    if (activeCategory === "All") {
      return CHALLENGES;
    }

    return CHALLENGES.filter(
      (challenge) =>
        challenge.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Challenges
        </h2>

        <p className="mt-1 text-muted-foreground">
          Pilih challenge dan kumpulkan RP untuk
          meningkatkan rank Playground.
        </p>
      </div>

      <ChallengeFilters
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
          />
        ))}
      </div>
    </section>
  );
}