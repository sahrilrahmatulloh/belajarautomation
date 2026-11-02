import { expect, test } from "../fixtures/auth";
import { AVAILABLE_COURSE_SLUGS } from "../fixtures/testData";
import { CourseDetailPage } from "../pages/CourseDetailPage";
import { LearnPage } from "../pages/LearnPage";
import { LessonPage } from "../pages/LessonPage";

const COURSE = "playwright";
const FIRST_LESSON = "apa-itu-playwright";
const LAST_LESSON = "api-testing";

test.describe("Halaman lesson setelah login", () => {
  test.use({ role: "user" });

  test("lesson dari halaman course terbuka dengan keterangan materi sedang ditulis", async ({ page }) => {
    const course = new CourseDetailPage(page, COURSE);
    await course.goto();
    await course.lessonLinks.first().click();

    await expect(page).toHaveURL(`/learn/${COURSE}/${FIRST_LESSON}`);

    const lesson = new LessonPage(page, COURSE, FIRST_LESSON);
    await expect(lesson.title).toBeVisible();
    await expect(lesson.writingNotice).toBeVisible();
  });

  test("lesson pertama bisa lanjut ke berikutnya dan tidak punya tautan sebelumnya", async ({ page }) => {
    const lesson = new LessonPage(page, COURSE, FIRST_LESSON);
    await lesson.goto();

    await expect(lesson.position).toHaveText("Materi 1 dari 8");
    await expect(lesson.previousLink).toBeHidden();

    await lesson.nextLink.click();

    await expect(lesson.position).toHaveText("Materi 2 dari 8");
    await expect(lesson.previousLink).toBeVisible();
  });

  test("lesson terakhir mengarah kembali ke daftar materi", async ({ page }) => {
    const lesson = new LessonPage(page, COURSE, LAST_LESSON);
    await lesson.goto();

    await expect(lesson.position).toHaveText("Materi 8 dari 8");
    await expect(lesson.nextLink).toBeHidden();

    await lesson.allLessonsLink.click();

    await expect(page).toHaveURL(`/learn/${COURSE}`);
  });

  test("semua tautan lesson di course yang tersedia tidak 404", async ({ page }) => {
    for (const slug of AVAILABLE_COURSE_SLUGS) {
      const course = new CourseDetailPage(page, slug);
      await course.goto();
      await expect(course.lessonLinks.first()).toBeVisible();

      const hrefs = await course.lessonLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href"))
      );

      for (const href of hrefs) {
        const response = await page.request.get(href!);
        expect(response.status(), href!).toBe(200);
      }
    }
  });

  test("lesson yang tidak ada menghasilkan 404", async ({ page }) => {
    const response = await new LessonPage(page, COURSE, "lesson-tidak-ada").goto();

    expect(response?.status()).toBe(404);
  });

  test('lesson dari course "Segera hadir" menghasilkan 404', async ({ page }) => {
    const response = await new LessonPage(page, "java", "pengenalan-java-jdk").goto();

    expect(response?.status()).toBe(404);
  });

  test("course yang isinya belum ditulis ditandai Draf di DEV", async ({ page }) => {
    const learn = new LearnPage(page);
    await learn.goto();

    for (const title of ["QA Fundamental", "Playwright"]) {
      await expect(learn.courseCard(title).getByText("Draf", { exact: true })).toBeVisible();
    }
  });
});

test.describe("Halaman lesson sebagai tamu", () => {
  test("tamu diarahkan ke halaman login", async ({ page }) => {
    await new LessonPage(page, COURSE, FIRST_LESSON).goto();

    await expect(page).toHaveURL("/login");
  });
});
