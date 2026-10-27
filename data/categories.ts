import { Category } from "@/types/Category";
import {
  Bot,
  Code2,
  GitBranch,
  Globe,
  Smartphone,
 Workflow,
} from "lucide-react";

export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: "Playwright",
    lessons: 24,
    level: "Beginner",
    icon: Code2,
  },
  {
    id: 2,
    title: "Selenium",
    lessons: 18,
    level: "Intermediate",
    icon: Globe,
  },
  {
    id: 3,
    title: "Appium",
    lessons: 15,
    level: "Intermediate",
    icon: Smartphone,
  },
  {
    id: 4,
    title: "API Testing",
    lessons: 12,
    level: "Beginner",
    icon: Workflow,
  },
  {
    id: 5,
    title: "AI Automation",
    lessons: 8,
    level: "Advanced",
    icon: Bot,
  },
  {
    id: 6,
    title: "CI/CD",
    lessons: 10,
    level: "Advanced",
    icon: GitBranch,
  },
];