import { GitFork, GitMerge } from "lucide-react";

import { Course } from "@/types/Course";
import { RoadmapBranchOption } from "@/types/Roadmap";

import { LihatMateriLink, RoadmapCourseBadges } from "./RoadmapNode";

interface RoadmapBranchProps {
  options: RoadmapBranchOption[];
  courseBySlug: Map<string, Course>;
  step: number;
  isLast: boolean;
  nextOptional: boolean;
}

export default function RoadmapBranch({
  options,
  courseBySlug,
  step,
  isLast,
  nextOptional,
}: RoadmapBranchProps) {
  // Rel percabangan menghubungkan titik tengah opsi pertama dan terakhir
  // (hanya saat semua opsi tampil dalam satu baris, mulai xl).
  const railInset = `${50 / options.length}%`;

  return (
    <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 pb-6">
      {!isLast && (
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-5 top-10 -translate-x-1/2 border-l-2 border-primary/40 ${
            nextOptional ? "border-dashed" : ""
          }`}
        />
      )}

      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <GitFork className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Langkah {step}
        </p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">
          Pilih salah satu jalur
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Cukup selesaikan satu cabang, lalu lanjut ke langkah berikutnya.
        </p>

        <div className={`relative mt-4 xl:pt-6 ${isLast ? "" : "xl:pb-6"}`}>
          {/* Rel atas (percabangan) dan bawah (bergabung kembali), desktop lebar */}
          <span
            aria-hidden="true"
            className="absolute top-0 hidden border-t-2 border-primary/40 xl:block"
            style={{ left: railInset, right: railInset }}
          />
          {!isLast && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 hidden border-t-2 border-primary/40 xl:block"
              style={{ left: railInset, right: railInset }}
            />
          )}

          <ul
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(var(--branch-cols),minmax(0,1fr))] xl:gap-0"
            style={{ ["--branch-cols" as string]: options.length }}
          >
            {options.map((option) => (
              <li
                key={option.label}
                className={`relative xl:px-1.5 xl:before:absolute xl:before:-top-6 xl:before:left-1/2 xl:before:h-6 xl:before:border-l-2 xl:before:border-primary/40 ${
                  isLast
                    ? ""
                    : "xl:after:absolute xl:after:-bottom-6 xl:after:left-1/2 xl:after:h-6 xl:after:border-l-2 xl:after:border-primary/40"
                }`}
              >
                <div
                  className={`h-full rounded-2xl border p-3 ${
                    option.recommended
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{option.label}</p>
                    {option.recommended && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                        Rekomendasi
                      </span>
                    )}
                  </div>

                  <ol className="mt-3 space-y-3">
                    {option.nodes.map((node, index) => {
                      const course = courseBySlug.get(node.courseSlug);
                      if (!course) return null;
                      const isLastInOption = index === option.nodes.length - 1;

                      return (
                        <li key={node.courseSlug} className="relative pl-5">
                          {!isLastInOption && (
                            <span
                              aria-hidden="true"
                              className="absolute -bottom-3 left-[5px] top-4 border-l-2 border-primary/30"
                            />
                          )}
                          <span
                            aria-hidden="true"
                            className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 bg-background ${
                              course.availability === "coming-soon"
                                ? "border-dashed border-muted-foreground/60"
                                : "border-primary"
                            }`}
                          />

                          <p className="text-sm font-medium leading-5">
                            {course.title}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <RoadmapCourseBadges course={course} optional={node.optional} />
                            <LihatMateriLink course={course} size="sm" />
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <GitMerge className="h-3.5 w-3.5" aria-hidden="true" />
          {isLast
            ? "Akhir jalur: pilih cabang sesuai bahasa yang ingin kamu kuasai."
            : "Semua cabang bergabung kembali ke langkah berikutnya."}
        </p>
      </div>
    </li>
  );
}
