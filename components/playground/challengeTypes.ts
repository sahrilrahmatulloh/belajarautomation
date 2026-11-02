import { Bug, ClipboardList, Crosshair, FileCheck2, LucideIcon } from "lucide-react";

import { ChallengeType } from "@/types/Challenge";

// Nilai URL, label, dan ikon tiap jenis latihan (PRD FR-04).
export const CHALLENGE_TYPES: Record<
  ChallengeType,
  { value: string; label: string; icon: LucideIcon }
> = {
  quiz: { value: "kuis", label: "Kuis", icon: ClipboardList },
  "bug-hunt": { value: "bug-hunt", label: "Bug Hunt", icon: Bug },
  "test-case": { value: "test-case", label: "Test Case Writing", icon: FileCheck2 },
  locator: { value: "locator", label: "Locator Challenge", icon: Crosshair },
};
