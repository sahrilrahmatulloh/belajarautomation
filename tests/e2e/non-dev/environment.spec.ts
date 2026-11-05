import AxeBuilder from "@axe-core/playwright";

import { expect, test } from "../fixtures/auth";
import { BLOG, ROLE_MODE } from "../fixtures/testData";
import { BlogPage } from "../pages/BlogPage";
import { LoginPage } from "../pages/LoginPage";
import { RoleDashboardPage } from "../pages/RoleDashboardPage";

test.describe("Halaman login di luar DEV", () => {
  test("akun dan password demo tidak tampil", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.submitButton).toBeEnabled();

    await expect(loginPage.demoAccounts).toBeHidden();
    await expect(page.getByText("demo1234")).toHaveCount(0);
  });
});

test.describe("Dashboard peran di luar DEV", () => {
  test.use({ role: "creator" });

  test("banner pratinjau tidak tampil", async ({ page }) => {
    const dashboard = new RoleDashboardPage(page, "creator");
    await dashboard.goto();
    await expect(dashboard.greeting).toBeVisible();

    await expect(dashboard.previewNotice).toBeHidden();
  });
});

test.describe("Halaman Creator di luar DEV", () => {
  test.use({ role: "creator" });

  for (const { path, title } of ROLE_MODE.creatorPages) {
    test(`${title} tetap halaman informasi Google Docs tanpa istilah Git`, async ({ page }) => {
      await page.goto(path);
      const main = page.getByRole("main");
      await expect(main.getByRole("heading", { level: 1, name: title })).toBeVisible();

      await expect(main.getByRole("heading", { name: "Sementara, konten ditulis di Google Docs" })).toBeVisible();
      await expect(main.getByRole("table").getByRole("rowheader")).toHaveText([...ROLE_MODE.googleDocsStages]);
      await expect(page.getByRole("region", { name: "Panduan singkat menulis" }).getByRole("listitem")).toHaveCount(ROLE_MODE.writingStepCount);
      await expect(page.getByRole("button", { name: ROLE_MODE.templateDisabledLabel })).toBeDisabled();
      await expect(main).not.toContainText(/github|\bgit\b|branch|pull request|\bPR\b|\bMDX\b/i);

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
    });
  }

  for (const path of ["/creator/buat/artikel", "/creator/konten/1", "/creator/revisi/3"]) {
    test(`prototipe ${path} tidak tersedia`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(404);
    });
  }
});

test.describe("Halaman Reviewer di luar DEV", () => {
  test.use({ role: "reviewer" });

  for (const { path, title } of [
    { path: "/reviewer/antrean", title: "Antrean Review" },
    { path: "/reviewer/riwayat", title: "Riwayat Review" },
  ]) {
    test(`${title} tetap halaman informasi Google Docs`, async ({ page }) => {
      await page.goto(path);
      const main = page.getByRole("main");

      await expect(main.getByRole("heading", { level: 1, name: title })).toBeVisible();
      await expect(main.getByRole("heading", { level: 2, name: "Sementara, review dilakukan di Google Docs" })).toBeVisible();

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
    });
  }

  test("halaman review tidak tersedia", async ({ page }) => {
    const response = await page.goto("/reviewer/review/konten-pemula");

    expect(response?.status()).toBe(404);
  });
});

test.describe("Halaman Admin di luar DEV", () => {
  test.use({ role: "admin" });

  for (const { path, title } of [
    { path: "/admin/konten", title: "Semua Konten" },
    { path: "/admin/pengguna", title: "Kelola Peran" },
  ]) {
    test(`${title} tetap halaman informasi dengan tautan panduan`, async ({ page }) => {
      await page.goto(path);
      const main = page.getByRole("main");

      await expect(main.getByRole("heading", { level: 1, name: title })).toBeVisible();
      await expect(main.getByRole("heading", { level: 2, name: "Sementara, Admin menerbitkan lewat pull request" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Buka Panduan Admin" })).toHaveAttribute("href", /\/docs\/CONTENT_GUIDE\.md$/);

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
    });
  }

  test("dashboard Admin tetap tampilan lama tanpa ringkasan data dummy alur konten", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.getByRole("heading", { level: 1, name: /^Halo, / })).toBeVisible();
    await expect(page.getByRole("region", { name: "Terbit Terbaru" })).toHaveCount(0);
  });
});

test.describe("Lingkungan UAT", () => {
  test('label lingkungan bertuliskan "UAT"', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.environmentBadge).toHaveText("UAT");
  });

  test("artikel draf tidak tampil dan menghasilkan 404", async ({ page }) => {
    const blog = new BlogPage(page);
    await blog.goto();

    await expect(blog.main.getByRole("heading", { name: "Belum ada artikel" })).toBeVisible();
    await expect(blog.draftBadges).toHaveCount(0);

    const response = await page.goto(`/blog/${BLOG.article.slug}`);
    expect(response?.status()).toBe(404);
  });

  test("halaman pratinjau video tidak tersedia", async ({ page }) => {
    const response = await page.goto("/dev/video-referensi");

    expect(response?.status()).toBe(404);
  });

  test("halaman tetap noindex", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  });
});
