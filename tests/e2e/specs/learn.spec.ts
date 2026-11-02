import { expect, test } from "../fixtures/auth";
import { CourseDetailPage } from "../pages/CourseDetailPage";
import { LearnPage } from "../pages/LearnPage";

test.use({ role: "user" });

test.describe("Halaman Belajar", () => {
  let learn: LearnPage;

  test.beforeEach(async ({ page }) => {
    learn = new LearnPage(page);
    await learn.goto();
    await expect(learn.courseTitles.first()).toBeVisible();
  });

  test('ajakan "Tidak tahu mulai dari mana?" ada di atas daftar dan menuju /roadmap', async ({ page }) => {
    await expect(learn.roadmapCta).toContainText("Tidak tahu mulai dari mana?");

    const cta = await learn.roadmapCta.boundingBox();
    const list = await learn.list.boundingBox();
    expect(cta!.y + cta!.height).toBeLessThanOrEqual(list!.y);

    await learn.roadmapCtaLink.click();

    await expect(page).toHaveURL("/roadmap");
  });

  test('pencarian "playwright" menemukan course Playwright', async ({ page }) => {
    await learn.search("playwright");

    await expect(learn.courseTitle("Playwright")).toBeVisible();
    await expect(learn.courseTitle("Cypress")).toBeHidden();
    await expect(page).toHaveURL(/[?&]q=playwright/);
  });

  test("filter kategori API Testing hanya menampilkan course API Testing", async () => {
    await learn.selectCategory("API Testing");

    await expect(learn.courseTitles).toHaveText([
      "API Testing dengan Postman",
      "API Automation (Playwright & REST Assured)",
    ]);
  });

  test("filter bahasa Java menyertakan API Automation", async ({ page }) => {
    await learn.selectPanelFilter("Bahasa", "Java");

    await expect(learn.courseTitle("API Automation (Playwright & REST Assured)")).toBeVisible();
    await expect(learn.courseTitle("Java untuk Tester")).toBeVisible();
    await expect(learn.courseTitle("Cypress")).toBeHidden();
    await expect(page).toHaveURL(/[?&]bahasa=java/);
  });

  test('toggle "Hanya yang tersedia" menyembunyikan course "Segera hadir"', async () => {
    await expect(learn.comingSoonBadges.first()).toBeVisible();

    await learn.toggleAvailableOnly();

    await expect(learn.comingSoonBadges).toHaveCount(0);
    await expect(learn.courseTitle("Playwright")).toBeVisible();
  });

  test("filter tetap berlaku setelah halaman dimuat ulang", async ({ page }) => {
    await learn.selectCategory("API Testing");
    await expect(page).toHaveURL(/[?&]kategori=api-testing/);

    await page.reload();

    await expect(learn.categoryFilter.getByRole("button", { name: "API Testing" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(learn.courseTitles).toHaveCount(2);
  });
});

test.describe('Detail course "Segera hadir"', () => {
  test('tidak 404 dan menampilkan "Materi sedang disiapkan"', async ({ page }) => {
    const course = new CourseDetailPage(page, "postman");
    const response = await course.goto();

    expect(response?.status()).toBe(200);
    await expect(course.title).toHaveText("API Testing dengan Postman");
    await expect(course.preparingNotice).toBeVisible();
  });
});
