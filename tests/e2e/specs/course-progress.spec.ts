import { expect, test } from "../fixtures/auth";
import { AVAILABLE_COURSE_SLUGS } from "../fixtures/testData";
import { CourseDetailPage } from "../pages/CourseDetailPage";
import { DashboardPage } from "../pages/DashboardPage";

test.use({ role: "user" });

test.describe("Progres di halaman detail course", () => {
  test("course yang sedang dipelajari menandai lesson yang selesai", async ({ page }) => {
    const course = new CourseDetailPage(page, "qa-fundamentals");
    await course.goto();

    await expect(course.progressText).toHaveText("8 / 16 materi");
    await expect(course.completedMarks).toHaveCount(8);
    await expect(course.completedMark("QA vs QC")).toBeAttached();
    await expect(course.completedMark("Membuat Test Case")).toHaveCount(0);
  });

  test("course yang tuntas menandai semua lesson", async ({ page }) => {
    const course = new CourseDetailPage(page, "bug-reporting");
    await course.goto();

    await expect(course.progressText).toHaveText("7 / 7 materi");
    await expect(course.completedMarks).toHaveCount(7);
  });

  test("course yang belum dipelajari tidak menandai lesson apa pun", async ({ page }) => {
    const course = new CourseDetailPage(page, "javascript");
    await course.goto();

    await expect(course.progressText).toHaveText("0 / 10 materi");
    await expect(course.completedMarks).toHaveCount(0);
  });

  test("progres sama dengan kartu Lanjutkan Belajar di dashboard", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.continueLearning).toContainText("8 dari 16 lesson");

    await dashboard.continueButton.click();

    await expect(new CourseDetailPage(page, "qa-fundamentals").progressText).toHaveText("8 / 16 materi");
  });

  test("jumlah lesson selesai di semua course sama dengan statistik dashboard", async ({ page }) => {
    let total = 0;
    for (const slug of AVAILABLE_COURSE_SLUGS) {
      const course = new CourseDetailPage(page, slug);
      await course.goto();
      await expect(course.lessonLinks.first()).toBeAttached();
      total += await course.completedMarks.count();
    }

    // Ringkasan profil tidak lagi memuat kartu statistik (PRD FR-13 v2.46).
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.statValue("Materi Selesai")).toContainText(String(total));
    expect(total).toBe(19);
  });
});
