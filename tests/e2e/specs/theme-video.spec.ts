import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { MOCK_STUDENT, mockSupabase, signInWithMock } from "../fixtures/supabaseMock";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "../pages/ProfilePage";

// Tema banner bergerak (PRD FR-12): gambar diam selalu ada, video tanpa suara diputar
// di atasnya, dan pengguna yang mengaktifkan "kurangi gerakan" hanya melihat gambar diam.
// Akun demo memakai tema diam Padang Rumput, jadi test ini memakai akun bertema Penerbangan Fuji.
const FUJI_ACCOUNT = { ...MOCK_STUDENT, themeId: "kucing-fuji" };

const themeVideo = (page: Page) => page.locator("video[data-theme-video]");

async function signInWithFuji(page: Page) {
  await mockSupabase(page, { accounts: [FUJI_ACCOUNT] });
  await signInWithMock(page, FUJI_ACCOUNT);
}

test.describe("Banner tema bergerak", () => {
  test("Welcome Banner memutar video tema tanpa suara dan berulang, di atas gambar diam", async ({ page }) => {
    await signInWithFuji(page);
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const video = themeVideo(page).first();
    await expect(video).toHaveAttribute("src", "/banner/kucing-fuji/banner.mp4");
    await expect(video).toHaveJSProperty("muted", true);
    await expect(video).toHaveJSProperty("loop", true);
    await expect(video).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator('img[src*="kucing-fuji%2Fbanner.webp"]').first()).toBeAttached();
  });

  test("header profil memakai video tema yang sama", async ({ page }) => {
    await signInWithFuji(page);
    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.header.locator("video[data-theme-video]")).toHaveAttribute("src", "/banner/kucing-fuji/banner.mp4");
  });
});

test.describe("Banner tema dengan pengaturan kurangi gerakan", () => {
  test.use({ reducedMotion: "reduce" });

  test("hanya menampilkan gambar diam", async ({ page }) => {
    await signInWithFuji(page);
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.greeting).toBeVisible();

    await expect(themeVideo(page)).toHaveCount(0);
    await expect(page.locator('img[src*="kucing-fuji%2Fbanner.webp"]').first()).toBeVisible();
  });
});

test.describe("Tema diam akun demo", () => {
  test.use({ role: "user" });

  test("Padang Rumput tidak memutar video", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.greeting).toBeVisible();

    await expect(themeVideo(page)).toHaveCount(0);
    await expect(page.locator('img[src*="padang-rumput%2Fbanner.webp"]').first()).toBeVisible();
  });
});
