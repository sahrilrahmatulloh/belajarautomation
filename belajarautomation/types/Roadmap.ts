import { LucideIcon } from "lucide-react";

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  level: string;
  modules: number;
  duration: string;
  status: "active" | "coming-soon";
  featured?: boolean;
}