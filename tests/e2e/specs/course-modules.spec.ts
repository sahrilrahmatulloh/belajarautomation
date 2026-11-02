import { expect, test } from "../fixtures/auth";
import { CourseDetailPage } from "../pages/CourseDetailPage";

test.use({ role: "user" });

test.describe("Modul di halaman detail course", () => {
  test("hanya modul yang sedang berjalan yang terbuka saat halaman dimuat", async ({ page }) => {
    const course = new CourseDetailPage(page, "qa-fundamentals");
    await course.goto();

    // Modul 1 dan 2 sudah tuntas, modul 3 masih menyisakan lesson.
    await expect(course.moduleLessons("Introduction to Quality Assurance").first()).toBeHidden();
    await expect(course.moduleLessons("Software Development Process").first()).toBeHidden();
    await expect(course.module("Testing Fundamentals")).toHaveJSProperty("open", true);
    await expect(course.moduleLessons("Testing Fundamentals").first()).toBeVisible();
    await expect(page.locator("details[open]")).toHaveCount(1);
  });

  test("modul bisa dibuka dan ditutup", async ({ page }) => {
    const course = new CourseDetailPage(page, "qa-fundamentals");
    await course.goto();
    const title = "Introduction to Quality Assurance";

    await course.moduleToggle(title).click();
    await expect(course.moduleLessons(title).first()).toBeVisible();

    await course.moduleToggle(title).click();
    await expect(course.moduleLessons(title).first()).toBeHidden();
  });

  test("modul bisa dibuka dengan keyboard", async ({ page }) => {
    const course = new CourseDetailPage(page, "qa-fundamentals");
    await course.goto();
    const title = "Introduction to Quality Assurance";

    await course.moduleToggle(title).focus();
    await page.keyboard.press("Enter");

    await expect(course.moduleLessons(title).first()).toBeVisible();
  });

  test("beberapa modul bisa terbuka bersamaan", async ({ page }) => {
    const course = new CourseDetailPage(page, "qa-fundamentals");
    await course.goto();

    await course.moduleToggle("Introduction to Quality Assurance").click();

    await expect(page.locator("details[open]")).toHaveCount(2);
  });

  test("judul modul menampilkan jumlah materi selesai", async ({ page }) => {
    const course = new CourseDetailPage(page, "qa-fundamentals");
    await course.goto();

    await expect(course.moduleToggle("Introduction to Quality Assurance")).toContainText("3 materi · 3 selesai");
  });

  test("course yang tuntas membuka modul pertama", async ({ page }) => {
    const course = new CourseDetailPage(page, "bug-reporting");
    await course.goto();

    await expect(page.locator("details[open]")).toHaveCount(1);
    await expect(page.locator("details").first()).toHaveJSProperty("open", true);
  });

  test("halaman tanpa scroll horizontal", async ({ page }) => {
    const course = new CourseDetailPage(page, "qa-fundamentals");
    await course.goto();
    await expect(course.title).toBeVisible();

    await course.expectNoHorizontalScroll();
  });
});
