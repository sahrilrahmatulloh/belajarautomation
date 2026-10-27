import { LucideIcon } from "lucide-react";

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  isPremium: boolean;
  progress?: number;
  icon: LucideIcon;
}