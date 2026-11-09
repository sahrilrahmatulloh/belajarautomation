import AxeBuilder from "@axe-core/playwright";

import { expect, test } from "../fixtures/auth";
import { BLOG, ROLE_MODE } from "../fixtures/testData";
import { BlogPage } from "../pages/BlogPage";
import { LessonPage } from "../pages/LessonPage";
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

test.describe("Panel promosi halaman login di luar DEV", () => {
  test('slide eBook berlabel "Segera hadir" karena eBook belum tersedia', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const panel = page.getByRole("region", { name: "Promosi belajarautomation.com" });

    await panel.getByRole("button", { name: /^Slide 3:/ }).click();

    const slide = panel.getByRole("group", { name: /^3 dari 3:/ });
    await expect(slide).toContainText("Segera hadir");
    await expect(slide).not.toContainText("Baru");
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
    { path: "/admin", title: "Ringkasan" },
    { path: "/admin/konten", title: "Semua Konten" },
    { path: "/admin/pengguna", title: "Pengguna dan Peran" },
    { path: "/admin/log", title: "Log Aktivitas Admin" },
    { path: "/admin/transaksi", title: "Transaksi" },
    { path: "/admin/produk", title: "Produk Digital" },
    { path: "/admin/katalog", title: "Katalog Belajar" },
    { path: "/admin/moderasi", title: "Moderasi" },
    { path: "/admin/pengumuman", title: "Pengumuman" },
    { path: "/admin/laporan", title: "Laporan" },
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

  test("detail transaksi tidak tersedia", async ({ page }) => {
    const response = await page.goto("/admin/transaksi/trx-sobat-ebook");

    expect(response?.status()).toBe(404);
  });

  // Detail pengguna dipakai Admin akun sungguhan (koreksi XP dan membership, PRD FR-16 D dan E),
  // jadi route-nya ada di luar DEV. Akun demo hanya melihat halaman informasi tanpa data dummy.
  test("detail pengguna untuk akun demo hanya halaman informasi", async ({ page }) => {
    await page.goto("/admin/pengguna/user-sobat");
    const main = page.getByRole("main");

    await expect(main.getByRole("heading", { level: 1, name: "Detail Pengguna" })).toBeVisible();
    await expect(main.getByRole("form")).toHaveCount(0);
    await expect(main).not.toContainText("Koreksi XP");
  });
});

test.describe("eBook dan Project di luar DEV", () => {
  test.use({ role: "user" });

  for (const { path, title } of [
    { path: "/ebooks", title: "eBook" },
    { path: "/projects", title: "Project" },
  ]) {
    test(`${title} tetap Segera hadir`, async ({ page }) => {
      await page.goto(path);
      const main = page.getByRole("main");

      await expect(main.getByText("Segera hadir", { exact: true })).toBeVisible();
      await expect(main.getByRole("heading", { level: 1, name: title })).toBeVisible();
    });
  }
});

// Lesson draf tampil dan bisa diselesaikan di UAT agar alur belajar bisa diuji pemilik produk
// (PRD 13.3); di Production tetap tersembunyi.
test.describe("Lesson draf di UAT", () => {
  test.use({ role: "user" });

  test("isi draf tampil berlabel Draf dan Berikutnya memberi XP", async ({ page }) => {
    const lesson = new LessonPage(page, "dasar-web-api", "client-server");
    await lesson.goto();
    await expect(lesson.writingNotice).toBeHidden();
    await expect(page.getByRole("main").getByRole("heading", { level: 2, name: "Apa itu client dan server?" })).toBeVisible();
    await expect(page.getByRole("main").getByText("Draf", { exact: true })).toBeVisible();

    await lesson.completeAndNext();

    await expect(page).toHaveURL("/learn/dasar-web-api/apa-itu-http");
    await expect(page.getByText("Lesson selesai, +10 XP.")).toBeVisible();
  });
});

test.describe("Panduan menulis lesson dan kuis di luar DEV", () => {
  test.use({ role: "creator" });

  test("tampil tanpa istilah teknis, dan tombol template nonaktif selama link kosong", async ({ page }) => {
    await page.goto("/creator/buat");
    const main = page.getByRole("main");

    await expect(main.getByRole("heading", { level: 2, name: "Menulis lesson" })).toBeVisible();
    await expect(main.getByRole("heading", { level: 2, name: "Menulis kuis" })).toBeVisible();
    await expect(main.getByRole("button", { name: "Template Lesson sedang disiapkan. Hubungi Admin." })).toBeDisabled();
    await expect(main.getByRole("button", { name: "Template Kuis sedang disiapkan. Hubungi Admin." })).toBeDisabled();
    await expect(main).not.toContainText(/github|\bgit\b|branch|pull request|\bPR\b|\bMDX\b/i);
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
