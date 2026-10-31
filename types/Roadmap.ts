import { LucideIcon } from "lucide-react";

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  // Slug course di /learn; kosong jika materinya belum tersedia.
  courseSlug?: string;
  // Id step lain di jalur yang sama yang sebaiknya diselesaikan lebih dulu.
  prerequisites: string[];
  // Hanya "not-started" yang dipakai sampai ada data progress pengguna nyata.
  status: "completed" | "current" | "not-started";
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  level: string;
  duration: string;
  status: "active" | "coming-soon";
  featured?: boolean;
  goals: string[];
  skills: string[];
  prerequisites: string[];
  steps: RoadmapStep[];
}
