import { LucideIcon } from "lucide-react";

// Node course: selalu terhubung ke course di katalog (data/courses.ts).
export interface RoadmapCourseNode {
  type: "course";
  courseSlug: string;
  optional?: boolean;
}

// Satu pilihan jalur di dalam cabang, mis. "TypeScript".
export interface RoadmapBranchOption {
  label: string;
  recommended?: boolean;
  nodes: RoadmapCourseNode[];
}

// Cabang: pengguna memilih salah satu opsi, lalu bergabung kembali ke node berikutnya.
export interface RoadmapBranchNode {
  type: "branch";
  options: RoadmapBranchOption[];
}

export type RoadmapNode = RoadmapCourseNode | RoadmapBranchNode;

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  level: string;
  duration: string;
  // Path sampul di public/; kosong bila belum ada (tampil placeholder).
  cover?: string;
  status: "active" | "coming-soon";
  featured?: boolean;
  goals: string[];
  skills: string[];
  prerequisites: string[];
  nodes: RoadmapNode[];
}
