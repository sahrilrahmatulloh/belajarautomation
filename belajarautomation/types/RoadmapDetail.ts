import { LucideIcon } from "lucide-react";

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  status: "completed" | "current" | "locked";
}

export interface RoadmapTrack {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  steps: string[];
}