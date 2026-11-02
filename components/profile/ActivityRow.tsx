import {
  Award,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LucideIcon,
  Target,
  TrendingUp,
} from "lucide-react";

import { COURSES } from "@/data/courses";
import { ActivityEntry, ActivityType } from "@/types/Activity";

const TYPE_STYLES: Record<ActivityType, { icon: LucideIcon; label: string; className: string }> = {
  lesson: { icon: BookOpen, label: "Materi selesai", className: "bg-brand-blue/10 text-brand-blue" },
  course_complete: {
    icon: GraduationCap,
    label: "Course selesai",
    className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  },
  quiz: { icon: ClipboardCheck, label: "Lulus kuis", className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300" },
  challenge: { icon: Target, label: "Challenge selesai", className: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  achievement: { icon: Award, label: "Achievement diperoleh", className: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
  rank_up: { icon: TrendingUp, label: "Naik rank", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
};

// Satu baris riwayat aktivitas. `whenLabel` menggantikan jam bila barisnya tidak
// berada di dalam kelompok tanggal.
export default function ActivityRow({ entry, whenLabel }: { entry: ActivityEntry; whenLabel?: string }) {
  const { icon: Icon, label, className } = TYPE_STYLES[entry.type];
  const courseTitle =
    entry.type === "lesson" ? COURSES.find((course) => course.slug === entry.courseSlug)?.title : undefined;

  return (
    <li className="flex items-center gap-3 py-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${className}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{entry.title}</p>
        <p className="truncate text-xs text-muted-foreground">{courseTitle ?? label}</p>
      </div>
      <div className="shrink-0 text-right">
        {entry.xp > 0 && <p className="text-sm font-semibold tabular-nums text-primary">+{entry.xp} XP</p>}
        <p className="text-xs tabular-nums text-muted-foreground">{whenLabel ?? entry.time}</p>
      </div>
    </li>
  );
}
