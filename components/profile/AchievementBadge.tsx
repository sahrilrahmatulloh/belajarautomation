import {
  BookOpen,
  Bot,
  BrainCircuit,
  Bug,
  ClipboardList,
  Crown,
  Flame,
  Footprints,
  GraduationCap,
  LucideIcon,
  Map,
  Swords,
  Target,
} from "lucide-react";

import { AchievementCategory, AchievementIcon } from "@/types/Achievement";

const ICONS: Record<AchievementIcon, LucideIcon> = {
  Footprints,
  GraduationCap,
  BookOpen,
  BrainCircuit,
  Bug,
  ClipboardList,
  Bot,
  Swords,
  Target,
  Flame,
  Map,
  Crown,
};

const CATEGORY_COLORS: Record<AchievementCategory, string> = {
  Belajar: "#2563EB",
  Testing: "#0891B2",
  Automation: "#4F46E5",
  Challenge: "#DB2777",
  Konsistensi: "#EA580C",
  Milestone: "#0D9488",
};

// Badge achievement berbentuk heksagon agar tidak tertukar dengan emblem tameng
// rank (PRD FR-14). Berwarna sesuai kategori, abu-abu bila belum diperoleh.
export default function AchievementBadge({
  icon,
  category,
  earned,
  size = 56,
}: {
  icon: AchievementIcon;
  category: AchievementCategory;
  earned: boolean;
  size?: number;
}) {
  const Icon = ICONS[icon];

  return (
    <span aria-hidden="true" className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <polygon
          points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5"
          strokeWidth="4"
          strokeLinejoin="round"
          className={earned ? "stroke-white/35" : "fill-muted stroke-border"}
          style={earned ? { fill: CATEGORY_COLORS[category] } : undefined}
        />
      </svg>
      <Icon
        className={`relative ${earned ? "text-white" : "text-muted-foreground"}`}
        style={{ width: size * 0.42, height: size * 0.42 }}
      />
    </span>
  );
}
