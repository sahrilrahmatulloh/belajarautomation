import { expect, Locator, Page } from "@playwright/test";

import { ArticlePage } from "../pages/ArticlePage";
import { BasePage } from "../pages/BasePage";
import { BlogPage } from "../pages/BlogPage";
import { ChallengePage } from "../pages/ChallengePage";
import { DashboardPage } from "../pages/DashboardPage";
import { LeaderboardPage } from "../pages/LeaderboardPage";
import { LearnPage } from "../pages/LearnPage";
import { LessonPage } from "../pages/LessonPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { PlaygroundPage } from "../pages/PlaygroundPage";
import { ProfilePage } from "../pages/ProfilePage";
import { PublicProfilePage } from "../pages/PublicProfilePage";
import { RoadmapPage } from "../pages/RoadmapPage";
import { RoleDashboardPage } from "../pages/RoleDashboardPage";
import { SettingsPage } from "../pages/SettingsPage";
import { BLOG, OWN_USERNAME, Role } from "./testData";

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
  { name: "Pengerjaan Kuis", open: (page) => open(new ChallengePage(page, "kuis-dasar-web-api"), (p) => p.quiz) },
  { name: "Pengerjaan Bug Hunt", open: (page) => open(new ChallengePage(page, "find-checkout-bug"), (p) => p.findingsPanel) },
  { name: "Pengerjaan Test Case", open: (page) => open(new ChallengePage(page, "login-test-case"), (p) => p.answerInput) },
  { name: "Pengerjaan Locator", open: (page) => open(new ChallengePage(page, "locator-form-registrasi"), (p) => p.selectorPanel) },
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
  { name: "Blog", open: (page) => open(new BlogPage(page), (p) => p.featuredLink) },
  { name: "Artikel blog", open: (page) => open(new ArticlePage(page, BLOG.article.slug), (p) => p.heading) },
  { name: "Notifikasi", open: (page) => open(new NotificationsPage(page), (p) => p.list) },
  { name: "Pengaturan", open: (page) => open(new SettingsPage(page), (p) => p.notificationSection) },
];

// Halaman yang dibuka dalam mode peran.
export const ROLE_PAGES: { role: Exclude<Role, "user">; name: string; path: string }[] = [
  { role: "creator", name: "Dashboard Creator", path: "/creator" },
  { role: "creator", name: "Konten Saya", path: "/creator/konten" },
  { role: "creator", name: "Buat Konten", path: "/creator/buat" },
  { role: "creator", name: "Catatan Revisi", path: "/creator/revisi" },
  { role: "creator", name: "Editor Artikel", path: "/creator/buat/artikel" },
  { role: "creator", name: "Detail Catatan Revisi", path: "/creator/revisi/konten-bug-report" },
  { role: "creator", name: "Profil Creator", path: "/profile" },
  { role: "creator", name: "Ajakan Mode Belajar", path: "/membership" },
  { role: "reviewer", name: "Dashboard Reviewer", path: "/reviewer" },
  { role: "reviewer", name: "Antrean Review", path: "/reviewer/antrean" },
  { role: "reviewer", name: "Halaman Review", path: "/reviewer/review/konten-pemula" },
  { role: "reviewer", name: "Profil Reviewer", path: "/profile" },
  { role: "admin", name: "Dashboard Admin", path: "/admin" },
  { role: "admin", name: "Konten Admin", path: "/admin/konten" },
  { role: "admin", name: "Pengguna dan Peran", path: "/admin/pengguna" },
  { role: "admin", name: "Log Aktivitas Admin", path: "/admin/log" },
  { role: "admin", name: "Profil Admin", path: "/profile" },
];

export async function openRolePage(page: Page, role: Exclude<Role, "user">, path: string) {
  await page.goto(path);
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
  return new RoleDashboardPage(page, role);
}
