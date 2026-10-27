import { LucideIcon } from "lucide-react";

export type ProjectDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: ProjectDifficulty;
  techStack: string[];
  icon: LucideIcon;
  status: "locked";
}