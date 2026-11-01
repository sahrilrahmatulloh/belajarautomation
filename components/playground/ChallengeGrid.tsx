"use client";

import { useMemo } from "react";

import FilterEmptyState from "@/components/filters/FilterEmptyState";
import FilterResultBar from "@/components/filters/FilterResultBar";
import { COURSE_CATEGORIES } from "@/data/courseCategories";
import { CHALLENGES } from "@/data/challenges";
import {
  getCategoryOptions,
  LEVEL_OPTIONS,
  matchesKeyword,
  toFilterSlug,
  validFilterValue,
} from "@/lib/filters";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { ChallengeType } from "@/types/Challenge";

import ChallengeCard from "./ChallengeCard";
import ChallengeFilters from "./ChallengeFilters";

const FILTER_KEYS = ["q", "kategori", "level", "jenis"] as const;

const TYPE_LABELS: Record<ChallengeType, { value: string; label: string }> = {
  challenge: { value: "challenge", label: "Challenge" },
  "multiple-choice": { value: "pilihan-ganda", label: "Pilihan Ganda" },
};

// Hanya kategori yang punya challenge, mengikuti urutan Learning Center.
const categoryOptions = getCategoryOptions(
  COURSE_CATEGORIES,
  CHALLENGES.map((challenge) => challenge.category)
);

// Jenis tanpa data tetap tampil, tetapi nonaktif.
const typeOptions = [
  { value: "", label: "Semua" },
  ...(Object.keys(TYPE_LABELS) as ChallengeType[]).map((type) => {
    const hasData = CHALLENGES.some((challenge) => challenge.type === type);
    return {
      ...TYPE_LABELS[type],
      disabled: !hasData,
      note: hasData ? undefined : "Segera hadir",
    };
  }),
];

export default function ChallengeGrid() {
  const { values, search, setSearch, setFilters, reset } = useCatalogFilters(FILTER_KEYS);

  const category = validFilterValue(values.kategori, categoryOptions);
  const level = validFilterValue(values.level, LEVEL_OPTIONS);
  const type = validFilterValue(values.jenis, typeOptions);

  const filteredChallenges = useMemo(
    () =>
      CHALLENGES.filter(
        (challenge) =>
          matchesKeyword(search, challenge.title, challenge.description) &&
          (!category || toFilterSlug(challenge.category) === category) &&
          (!level || challenge.difficulty.toLowerCase() === level) &&
          (!type || TYPE_LABELS[challenge.type].value === type)
      ),
    [search, category, level, type]
  );

  const hasActiveFilter = Boolean(search.trim() || category || level || type);

  return (
    <section aria-label="Daftar challenge" className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Daftar Challenge</h2>

        <p className="mt-1 text-muted-foreground">
          Pilih challenge dan kumpulkan RP untuk meningkatkan rank Playground.
        </p>
      </div>

      <ChallengeFilters
        search={search}
        categoryOptions={categoryOptions}
        typeOptions={typeOptions}
        category={category}
        level={level}
        type={type}
        onSearchChange={setSearch}
        onCategoryChange={(value) => setFilters({ kategori: value })}
        onLevelChange={(value) => setFilters({ level: value })}
        onTypeChange={(value) => setFilters({ jenis: value })}
      />

      <FilterResultBar
        count={filteredChallenges.length}
        noun="challenge"
        canReset={hasActiveFilter}
        onReset={reset}
      />

      {filteredChallenges.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <FilterEmptyState
          title="Challenge tidak ditemukan"
          description="Coba kata kunci, kategori, level, atau jenis lain."
          onReset={reset}
        />
      )}
    </section>
  );
}
