import { LucideIcon } from "lucide-react";

export type CourseCategory =
  | "Fundamental"
  | "Manual Testing"
  | "Web Automation"
  | "Mobile Testing"
  | "API Testing"
  | "Performance Testing"
  | "Security Testing"
  | "Programming";

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  estimatedDuration: string;
  thumbnail?: string;
  progress?: number;
  icon: LucideIcon;
}
