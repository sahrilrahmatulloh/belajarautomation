export type BookLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export interface Book {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  level: BookLevel;
  format: "PDF";
  price: number;
  cover: string;
  owned: boolean;

  pages: number;
  updatedAt: string;
  topics: string[];
}