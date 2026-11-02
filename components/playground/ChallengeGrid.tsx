"use client";

import { useMemo } from "react";

import FilterChips from "@/components/filters/FilterChips";
import FilterEmptyState from "@/components/filters/FilterEmptyState";
import FilterPanel from "@/components/filters/FilterPanel";
import FilterResultBar from "@/components/filters/FilterResultBar";
import SearchField from "@/components/filters/SearchField";
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

import ChallengeCard from "./ChallengeCard";
import { CHALLENGE_TYPES } from "./challengeTypes";

const FILTER_KEYS = ["q", "kategori", "level", "jenis"] as const;

// Hanya kategori yang punya latihan, mengikuti urutan Learning Center.
const categoryOptions = getCategoryOptions(
  COURSE_CATEGORIES,
  CHALLENGES.map((challenge) => challenge.category)
);

const typeOptions = [
  { value: "", label: "Semua" },
  ...Object.values(CHALLENGE_TYPES).map(({ value, label }) => ({ value, label })),
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
          (!type || CHALLENGE_TYPES[challenge.type].value === type)
      ),
    [search, category, level, type]
  );

  const hasActiveFilter = Boolean(search.trim() || category || level || type);

  return (
    <section aria-label="Daftar latihan" className="space-y-4">
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center">
        <div className="min-w-0 xl:flex-1">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Cari latihan..."
            inputClassName="rounded-full"
          />
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <FilterChips
              label="Jenis"
              layout="scroll"
              options={typeOptions}
              active={type}
              onChange={(value) => setFilters({ jenis: value })}
            />
          </div>
          <div className="shrink-0 pb-1">
            <FilterPanel
              groups={[
                {
                  label: "Level",
                  options: LEVEL_OPTIONS,
                  value: level,
                  onChange: (value) => setFilters({ level: value }),
                },
                {
                  label: "Kategori",
                  options: categoryOptions,
                  value: category,
                  onChange: (value) => setFilters({ kategori: value }),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <FilterResultBar
        count={filteredChallenges.length}
        noun="latihan tersedia"
        canReset={hasActiveFilter}
        onReset={reset}
        prominent
      />

      {filteredChallenges.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.slug} challenge={challenge} />
          ))}
        </div>
      ) : (
        <FilterEmptyState
          title="Latihan tidak ditemukan"
          description="Coba kata kunci, jenis, level, atau kategori lain."
          onReset={reset}
        />
      )}
    </section>
  );
}
