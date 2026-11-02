import { expect, test } from "../fixtures/auth";
import { AVAILABLE_COURSE_SLUGS } from "../fixtures/testData";
import { CourseDetailPage } from "../pages/CourseDetailPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "../pages/ProfilePage";

test.use({ role: "user" });

test.describe("Progres di halaman detail course", () => {
  test("course yang sedang dipelajari menandai lesson yang selesai", async ({ page }) => {
    const course = new CourseDetailPage(page, "qa-fundamentals");
    await course.goto();

    await expect(course.progressText).toHaveText("8 / 16 materi");
    await expect(course.completedMarks).toHaveCount(8);
    await expect(course.completedMark("QA vs QC")).toBeVisible();
    await expect(course.completedMark("Membuat Test Case")).toBeHidden();
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

  test("jumlah lesson selesai di semua course sama dengan statistik profil", async ({ page }) => {
    let total = 0;
    for (const slug of AVAILABLE_COURSE_SLUGS) {
      const course = new CourseDetailPage(page, slug);
      await course.goto();
      await expect(course.lessonLinks.first()).toBeVisible();
      total += await course.completedMarks.count();
    }

    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.stats.getByRole("article").filter({ hasText: "Materi Selesai" })).toContainText(String(total));
    expect(total).toBe(19);
  });
});
