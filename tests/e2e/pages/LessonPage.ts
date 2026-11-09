import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class LessonPage extends BasePage {
  readonly title: Locator;
  readonly writingNotice: Locator;
  readonly position: Locator;
  readonly previousLink: Locator;
  readonly nextLink: Locator;
  readonly allLessonsLink: Locator;
  readonly finishButton: Locator;
  readonly nav: Locator;
  readonly completedStatus: Locator;
  readonly completeHint: Locator;

  constructor(page: Page, courseSlug: string, lessonSlug: string) {
    super(page, `/learn/${courseSlug}/${lessonSlug}`);
    // Logo di sidebar juga berupa h1.
    this.title = page.getByRole("main").getByRole("heading", { level: 1 });
    this.writingNotice = page.getByRole("heading", { name: "Materi sedang ditulis" });
    this.position = page.getByText(/^Materi \d+ dari \d+$/);
    this.finishButton = page.getByRole("button", { name: /Selesaikan course|Selesai, lihat semua materi/ });
    this.completedStatus = page.getByRole("main").getByRole("status").filter({ hasText: "Lesson selesai" });
    this.completeHint = page.getByText("Gulir sampai akhir materi agar lesson ini tercatat selesai.");

    const nav = page.getByRole("navigation", { name: "Navigasi lesson" });
    this.nav = nav;
    this.previousLink = nav.getByRole("link", { name: /^Sebelumnya/ });
    this.nextLink = nav.getByRole("link", { name: /^Berikutnya/ });
    this.allLessonsLink = nav.getByRole("link", { name: "Lihat semua materi" });
  }

  // Lesson tercatat selesai saat "Berikutnya" diklik setelah isinya digulir sampai akhir.
  async scrollToEnd() {
    await this.nav.scrollIntoViewIfNeeded();
    await this.completeHint.waitFor({ state: "hidden" });
  }

  async completeAndNext() {
    await this.scrollToEnd();
    await this.nextLink.click();
  }

  async finishCourse() {
    await this.scrollToEnd();
    await this.finishButton.click();
  }
}
