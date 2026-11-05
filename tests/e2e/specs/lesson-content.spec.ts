import AxeBuilder from "@axe-core/playwright";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { expect, test } from "../fixtures/auth";
import { LESSON_CONTENT } from "../fixtures/testData";
import { CourseDetailPage } from "../pages/CourseDetailPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LessonPage } from "../pages/LessonPage";
import { ProfilePage } from "../pages/ProfilePage";

const { courseSlug, courseTitle, lessonSlug, lessonTitle, nextLessonSlug, moduleTitle, totalLessons } = LESSON_CONTENT;

test.describe("Lesson yang sudah punya isi", () => {
  test.use({ role: "user" });

  let lesson: LessonPage;

  test.beforeEach(async ({ page }) => {
    lesson = new LessonPage(page, courseSlug, lessonSlug);
    await lesson.goto();
    await expect(lesson.title).toHaveText(lessonTitle);
  });

  test("menampilkan isi dengan komponen artikel, sumber, dan penulis", async ({ page }) => {
    const main = page.getByRole("main");

    await expect(lesson.writingNotice).toBeHidden();
    await expect(main.getByRole("heading", { level: 2, name: "Apa itu client dan server?" })).toBeVisible();
    await expect(main.getByRole("group", { name: "Kode ts" })).toBeVisible();
    await expect(main.getByRole("button", { name: "Salin" })).toBeVisible();
    await expect(main.getByText("Tips", { exact: true })).toBeVisible();
    await expect(main.getByText("Peringatan", { exact: true })).toBeVisible();
    await expect(main.getByRole("table")).toBeVisible();
    await expect(main.getByRole("img", { name: "Sampul course Dasar Web dan API" })).toBeVisible();
    await expect(main.getByRole("region", { name: "Sumber" }).getByRole("link")).toHaveCount(1);
    await expect(main.getByText("Oleh Tim BelajarAutomation")).toBeVisible();
    await expect(main.getByText("Draf", { exact: true })).toBeVisible();
  });

  test("tandai selesai memperbarui progres dan bertahan setelah dimuat ulang", async ({ page }) => {
    await lesson.completeButton.click();
    await expect(lesson.completedStatus).toContainText("Lesson selesai.");
    await expect(lesson.completeButton).toBeHidden();

    await page.reload();
    await expect(lesson.completedStatus).toBeVisible();

    const course = new CourseDetailPage(page, courseSlug);
    await course.goto();
    await expect(course.progressText).toHaveText(`1 / ${totalLessons} materi`);
    await expect(course.completedMark(lessonTitle)).toBeAttached();
  });

  test("XP hanya bertambah sekali dan tampil di dashboard", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const xp = page.getByRole("region", { name: "Statistik belajar" }).getByRole("heading", { level: 3, name: "Total XP" }).locator("xpath=following-sibling::p");
    await expect(xp).not.toBeEmpty();
    const expected = (Number((await xp.innerText()).replace(/\D/g, "")) + 10).toLocaleString("id-ID");

    await lesson.goto();
    await lesson.completeButton.click();
    await expect(lesson.completedStatus).toBeVisible();

    await dashboard.goto();
    await expect(xp).toHaveText(expected);
    await expect(dashboard.continueLearning).toContainText(courseTitle);

    await lesson.goto();
    await expect(lesson.completedStatus).toBeVisible();
    await dashboard.goto();
    await expect(xp).toHaveText(expected);
  });

  test("lesson selesai ikut terhitung di profil", async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();
    const lessons = profile.stats.getByRole("article").filter({ hasText: "Materi Selesai" });
    await expect(lessons).toBeVisible();
    const before = Number((await lessons.innerText()).replace(/\D/g, ""));

    await lesson.goto();
    await lesson.completeButton.click();
    await expect(lesson.completedStatus).toBeVisible();
    await profile.goto();

    await expect(lessons).toContainText(String(before + 1));
    await expect(page.getByRole("heading", { name: "Progres Belajar" }).locator("..")).toContainText(courseTitle);
  });

  test("lesson berikutnya yang belum ditulis tidak punya tombol selesai", async ({ page }) => {
    await lesson.nextLink.click();
    await expect(page).toHaveURL(`/learn/${courseSlug}/${nextLessonSlug}`);

    await expect(lesson.writingNotice).toBeVisible();
    await expect(lesson.completeButton).toBeHidden();
  });

  test("lesson terbuka dari daftar modul", async ({ page }) => {
    const course = new CourseDetailPage(page, courseSlug);
    await course.goto();
    await expect(course.moduleLessons(moduleTitle).first()).toBeVisible();

    await course.moduleLessons(moduleTitle).first().click();

    await expect(page).toHaveURL(`/learn/${courseSlug}/${lessonSlug}`);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`aksesibilitas mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("tanpa pelanggaran critical dan serious", async ({ page }) => {
        await lesson.completeButton.click();
        await expect(lesson.completedStatus).toBeVisible();

        const { violations } = await new AxeBuilder({ page }).analyze();

        expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
      });
    });
  }
});

test.describe("Lesson bagi tamu", () => {
  test("tamu diarahkan ke halaman login", async ({ page }) => {
    await new LessonPage(page, courseSlug, lessonSlug).goto();

    await expect(page).toHaveURL("/login");
  });
});

test.describe("npm run check:lessons", () => {
  const VALID = "---\nstatus: draft\n---\n\nIsi lesson.\n";
  let dir: string;

  const write = (course: string, lesson: string, content: string) => {
    mkdirSync(path.join(dir, course), { recursive: true });
    writeFileSync(path.join(dir, course, `${lesson}.mdx`), content);
  };
  const run = () => spawnSync(process.execPath, ["scripts/check-lessons.mjs", dir], { encoding: "utf8" });

  test.beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "lesson-"));
  });

  test.afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  test("lesson valid lulus", () => {
    write(courseSlug, lessonSlug, VALID);

    expect(run().status).toBe(0);
  });

  for (const { name, course, lesson, content, message } of [
    { name: "course tidak dikenal", course: "tidak-ada", lesson: lessonSlug, content: VALID, message: "course tidak ada" },
    { name: "lesson tidak dikenal", course: courseSlug, lesson: "tidak-ada", content: VALID, message: 'lesson "tidak-ada" tidak ada' },
    { name: "status tidak valid", course: courseSlug, lesson: lessonSlug, content: "---\nstatus: siap\n---\n\nIsi.\n", message: '"status" harus' },
    { name: "isi kosong", course: courseSlug, lesson: lessonSlug, content: "---\nstatus: draft\n---\n", message: "isi lesson kosong" },
    { name: "sumber tidak valid", course: courseSlug, lesson: lessonSlug, content: "---\nstatus: draft\nsources:\n  - title: x\n    url: bukan-link\n---\n\nIsi.\n", message: '"sources"' },
    {
      name: "lebih dari 3 video",
      course: courseSlug,
      lesson: lessonSlug,
      content: `---\nstatus: draft\n---\n\n${'<VideoYouTube id="abcdefghij1" judul="x" channel="y" durasi="1:00" />\n\n'.repeat(4)}`,
      message: "maksimal 3 video per lesson",
    },
  ]) {
    test(`menolak ${name}`, () => {
      write(course, lesson, content);

      const result = run();

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(message);
    });
  }
});
