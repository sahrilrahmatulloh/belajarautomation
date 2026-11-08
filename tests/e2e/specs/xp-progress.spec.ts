import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { MockAccount, SUPABASE_TEST_URL, mockSupabase, signInWithMock, uniqueMockAccount } from "../fixtures/supabaseMock";
import { CHALLENGE_KEYS, LESSON_CONTENT, QA_FUNDAMENTAL } from "../fixtures/testData";
import { ChallengePage } from "../pages/ChallengePage";
import { DashboardPage } from "../pages/DashboardPage";
import { LessonPage } from "../pages/LessonPage";
import { NotificationsPage } from "../pages/NotificationsPage";

// Perhitungan XP, materi selesai, challenge selesai, dan rank untuk akun Supabase (PRD FR-05).
// XP dicatat server Next.js ke Supabase tiruan (tests/e2e/mock-supabase-server.mjs); setiap test
// memakai akun dengan id unik agar progresnya tidak bercampur.

const { courseSlug, lessonSlug } = LESSON_CONTENT;
const { quiz, testCase } = CHALLENGE_KEYS;

function statValue(dashboard: DashboardPage, label: string) {
  return dashboard.stats.getByRole("heading", { level: 3, name: label }).locator("xpath=following-sibling::p");
}

// Membuka lesson dan menunggu progres akun termuat, agar perubahan XP sesudahnya terbaca.
async function openLesson(page: Page, course: string = courseSlug, slug: string = lessonSlug) {
  const lesson = new LessonPage(page, course, slug);
  const progressLoaded = page.waitForResponse((response) => response.url().endsWith("/rest/v1/rpc/get_my_progress"));
  await lesson.goto();
  await progressLoaded;
  return lesson;
}

// Klik Berikutnya dan tunggu Server Action pencatat lesson selesai, agar pindah halaman
// sesudahnya tidak memotong penyimpanan.
async function completeAndNext(page: Page, lesson: LessonPage) {
  const saved = page.waitForResponse((response) => response.request().method() === "POST" && Boolean(response.request().headers()["next-action"]));
  await lesson.completeAndNext();
  await saved;
}

async function signIn(page: Page, account: MockAccount) {
  await mockSupabase(page, { accounts: [account] });
  await signInWithMock(page, account);
}

async function passQuiz(page: Page, slug: string = quiz.slug, answers: readonly number[] = quiz.answers) {
  const challenge = new ChallengePage(page, slug);
  await challenge.goto();
  await challenge.answerQuiz(answers);
  await challenge.submitAnswerButton.click();
  await expect(challenge.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
  return challenge;
}

test.describe("XP akun Supabase", () => {
  test("lesson selesai memberi +10 XP sekali dan menambah materi selesai di dashboard", async ({ page }) => {
    await signIn(page, uniqueMockAccount());
    const dashboard = new DashboardPage(page);
    await expect(statValue(dashboard, "Total XP")).toHaveText("0");
    await expect(statValue(dashboard, "Materi Selesai")).toHaveText("0");

    const lesson = await openLesson(page);
    await expect(lesson.completeHint).toBeVisible();
    await completeAndNext(page, lesson);
    await expect(page).toHaveURL(`/learn/${courseSlug}/${LESSON_CONTENT.nextLessonSlug}`);
    await expect(page.getByText("Lesson selesai, +10 XP.")).toBeVisible();

    await dashboard.goto();
    await expect(statValue(dashboard, "Total XP")).toHaveText("10");
    await expect(statValue(dashboard, "Materi Selesai")).toHaveText("1");

    // Lesson yang sudah selesai tidak memberi XP lagi.
    await lesson.goto();
    await expect(lesson.completedStatus).toBeVisible();
    await expect(lesson.nextLink).not.toContainText("+10 XP");
  });

  test("kuis lulus memberi +30 XP sekali; mengulang boleh tanpa XP tambahan", async ({ page }) => {
    await signIn(page, uniqueMockAccount());

    const challenge = await passQuiz(page);
    await expect(challenge.result).toContainText("+30 XP");

    await challenge.goto();
    await challenge.answerQuiz(quiz.answers);
    await challenge.submitAnswerButton.click();
    await expect(challenge.result).toContainText("Tidak ada XP tambahan");

    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(statValue(dashboard, "Total XP")).toHaveText("30");
    await expect(statValue(dashboard, "Challenge Selesai")).toHaveText("1");
  });

  test("Test Case lulus tidak memberi XP tetapi tercatat sebagai challenge selesai", async ({ page }) => {
    await signIn(page, uniqueMockAccount());
    const challenge = new ChallengePage(page, testCase.slug);
    await challenge.goto();
    await challenge.answerInput.fill("Judul: Login berhasil\nLangkah: isi email dan password");
    await challenge.submitAnswerButton.click();
    for (const label of testCase.required) await challenge.checklistItem(label).check();
    await challenge.finishCheckButton.click();

    await expect(challenge.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Test Case dinilai sendiri, jadi tidak memberi XP.");

    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(statValue(dashboard, "Total XP")).toHaveText("0");
    await expect(statValue(dashboard, "Challenge Selesai")).toHaveText("1");
  });

  test("naik rank menampilkan perayaan dan menambah notifikasi", async ({ page, request }) => {
    const account = uniqueMockAccount();
    // 290 XP: satu lesson lagi (+10) mencapai Apprentice (300 XP).
    await request.post(`${SUPABASE_TEST_URL}/__test/seed`, { data: { user: account.id, totalXp: 290 } });
    await signIn(page, account);

    const lesson = await openLesson(page);
    await completeAndNext(page, lesson);

    const celebration = page.getByRole("dialog", { name: "Selamat, kamu naik rank!" });
    await expect(celebration).toBeVisible();
    await expect(celebration).toContainText("Apprentice");

    const { violations } = await new AxeBuilder({ page }).include("[role=dialog]").analyze();
    expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);

    await celebration.getByRole("button", { name: "Lanjut belajar" }).click();
    await expect(celebration).toBeHidden();

    const notifications = new NotificationsPage(page);
    await notifications.goto();
    await expect(notifications.item("Naik rank ke Apprentice")).toBeVisible();
  });

  test("QA Fundamental: 16 lesson memberi 160 XP plus bonus course 50, lalu kuisnya +30", async ({ page }) => {
    test.slow();
    await signIn(page, uniqueMockAccount());

    const lessons = QA_FUNDAMENTAL.lessons;
    for (const slug of lessons.slice(0, -1)) {
      const lesson = await openLesson(page, QA_FUNDAMENTAL.courseSlug, slug);
      await expect(lesson.writingNotice).toBeHidden();
      await completeAndNext(page, lesson);
    }

    // Lesson terakhir: "Selesaikan course" menandai selesai, memberi bonus, lalu kembali ke course.
    const last = await openLesson(page, QA_FUNDAMENTAL.courseSlug, lessons.at(-1)!);
    await expect(last.nextLink).toBeHidden();
    await expect(last.finishButton).toContainText("Selesaikan course");
    await expect(last.finishButton).toContainText("+60 XP termasuk bonus course");
    await last.scrollToEnd();
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
    await last.finishButton.click();
    await expect(page).toHaveURL(`/learn/${QA_FUNDAMENTAL.courseSlug}`);
    await expect(page.getByText("Course QA Fundamental tuntas! +60 XP termasuk bonus course.")).toBeVisible();

    const challenge = await passQuiz(page, quiz.alreadyPassed.slug, quiz.alreadyPassed.answers);
    await expect(challenge.result).toContainText("+30 XP");

    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(statValue(dashboard, "Total XP")).toHaveText("240");
    await expect(statValue(dashboard, "Materi Selesai")).toHaveText("16");
    await expect(statValue(dashboard, "Challenge Selesai")).toHaveText("1");
  });
});
