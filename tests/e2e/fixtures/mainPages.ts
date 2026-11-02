import { expect, Locator, Page } from "@playwright/test";

import { BasePage } from "../pages/BasePage";
import { DashboardPage } from "../pages/DashboardPage";
import { LeaderboardPage } from "../pages/LeaderboardPage";
import { LearnPage } from "../pages/LearnPage";
import { LessonPage } from "../pages/LessonPage";
import { PlaygroundPage } from "../pages/PlaygroundPage";
import { ProfilePage } from "../pages/ProfilePage";
import { PublicProfilePage } from "../pages/PublicProfilePage";
import { RoadmapPage } from "../pages/RoadmapPage";
import { OWN_USERNAME } from "./testData";

// Halaman memuat isinya di browser setelah sesi terbaca, jadi pemeriksaan
// seluruh halaman (layout, aksesibilitas) harus menunggu isinya tampil dulu.
async function open<T extends BasePage>(
  pageObject: T,
  content: (pageObject: T) => Locator,
  navigate: (pageObject: T) => Promise<unknown> = (p) => p.goto()
) {
  await navigate(pageObject);
  await expect(content(pageObject)).toBeVisible();
  return pageObject;
}

export const MAIN_PAGES: { name: string; open: (page: Page) => Promise<BasePage> }[] = [
  { name: "Dashboard", open: (page) => open(new DashboardPage(page), (p) => p.greeting) },
  { name: "Belajar", open: (page) => open(new LearnPage(page), (p) => p.courseTitles.first()) },
  { name: "Lesson", open: (page) => open(new LessonPage(page, "playwright", "apa-itu-playwright"), (p) => p.writingNotice) },
  { name: "Roadmap", open: (page) => open(new RoadmapPage(page), (p) => p.cards.first()) },
  { name: "Playground", open: (page) => open(new PlaygroundPage(page), (p) => p.cards.first()) },
  { name: "Leaderboard", open: (page) => open(new LeaderboardPage(page), (p) => p.topList.first()) },
  { name: "Profil", open: (page) => open(new ProfilePage(page), (p) => p.featuredAchievements) },
  {
    name: "Profil tab Aktivitas",
    open: (page) => open(new ProfilePage(page), (p) => p.activityRows.first(), (p) => p.gotoTab("aktivitas")),
  },
  {
    name: "Profil tab Pencapaian",
    open: (page) => open(new ProfilePage(page), (p) => p.achievementTotal, (p) => p.gotoTab("pencapaian")),
  },
  {
    name: "Profil publik",
    open: (page) => open(new PublicProfilePage(page, OWN_USERNAME), (p) => p.stats),
  },
];
