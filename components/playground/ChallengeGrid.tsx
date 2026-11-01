"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import FilterResultBar from "@/components/filters/FilterResultBar";
import { COURSE_CATEGORIES } from "@/data/courseCategories";
import { CHALLENGES } from "@/data/challenges";
import { LEVEL_OPTIONS, matchesKeyword, toFilterSlug, validFilterValue } from "@/lib/filters";
import { useUrlFilters } from "@/lib/useUrlFilters";
import { ChallengeType } from "@/types/Challenge";

import ChallengeCard from "./ChallengeCard";
import ChallengeFilters from "./ChallengeFilters";

const FILTER_KEYS = ["q", "kategori", "level", "jenis"] as const;

const TYPE_LABELS: Record<ChallengeType, { value: string; label: string }> = {
  challenge: { value: "challenge", label: "Challenge" },
  "multiple-choice": { value: "pilihan-ganda", label: "Pilihan Ganda" },
};

// Hanya kategori yang punya challenge, mengikuti urutan Learning Center.
const categoryOptions = [
  { value: "", label: "Semua" },
  ...COURSE_CATEGORIES.filter((category) =>
    CHALLENGES.some((challenge) => challenge.category === category)
  ).map((category) => ({ value: toFilterSlug(category), label: category })),
];

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
  const { values, setFilters, resetFilters } = useUrlFilters(FILTER_KEYS);
  // Teks pencarian disimpan lokal agar input tetap responsif; URL ikut diperbarui.
  const [search, setSearch] = useState(values.q);

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

  function handleSearchChange(value: string) {
    setSearch(value);
    setFilters({ q: value.trim() });
  }

  function handleReset() {
    setSearch("");
    resetFilters();
  }

  return (
    <section className="space-y-6">
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
        onSearchChange={handleSearchChange}
        onCategoryChange={(value) => setFilters({ kategori: value })}
        onLevelChange={(value) => setFilters({ level: value })}
        onTypeChange={(value) => setFilters({ jenis: value })}
      />

      <FilterResultBar
        count={filteredChallenges.length}
        noun="challenge"
        canReset={hasActiveFilter}
        onReset={handleReset}
      />

      {filteredChallenges.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="Challenge tidak ditemukan"
          description="Coba kata kunci, kategori, atau level lain, atau reset filter."
        />
      )}
    </section>
  );
}
