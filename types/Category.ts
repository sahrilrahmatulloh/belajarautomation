import { LucideIcon } from "lucide-react";

export interface Category {
  id: number;
  title: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  icon: LucideIcon;
}