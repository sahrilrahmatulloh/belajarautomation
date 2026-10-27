import { LucideIcon } from "lucide-react";

export type CareerResourceStatus =
  | "available"
  | "coming-soon";

export interface CareerSection {
  title: string;
  description: string;
  items: string[];
}

export interface CareerResource {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  href: string;
  status: CareerResourceStatus;
  sections: CareerSection[];
}