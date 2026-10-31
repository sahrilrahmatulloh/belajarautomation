import { LucideIcon } from "lucide-react";

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  // Hanya "not-started" yang dipakai sampai ada data progress pengguna nyata.
  status: "completed" | "current" | "not-started";
}

export interface RoadmapTrack {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  steps: string[];
}