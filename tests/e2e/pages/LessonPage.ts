import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class LessonPage extends BasePage {
  readonly title: Locator;
  readonly writingNotice: Locator;
  readonly position: Locator;
  readonly previousLink: Locator;
  readonly nextLink: Locator;
  readonly allLessonsLink: Locator;
  readonly completeButton: Locator;
  readonly completedStatus: Locator;
  readonly completeHint: Locator;

  constructor(page: Page, courseSlug: string, lessonSlug: string) {
    super(page, `/learn/${courseSlug}/${lessonSlug}`);
    // Logo di sidebar juga berupa h1.
    this.title = page.getByRole("main").getByRole("heading", { level: 1 });
    this.writingNotice = page.getByRole("heading", { name: "Materi sedang ditulis" });
    this.position = page.getByText(/^Materi \d+ dari \d+$/);
    this.completeButton = page.getByRole("button", { name: /^Tandai selesai/ });
    this.completedStatus = page.getByRole("main").getByRole("status").filter({ hasText: "Lesson selesai" });
    this.completeHint = page.getByText("Gulir sampai akhir materi untuk menandai lesson selesai.");

    const nav = page.getByRole("navigation", { name: "Navigasi lesson" });
    this.previousLink = nav.getByRole("link", { name: /^Sebelumnya/ });
    this.nextLink = nav.getByRole("link", { name: /^Berikutnya/ });
    this.allLessonsLink = nav.getByRole("link", { name: "Lihat semua materi" });
  }

  // Tombol selesai baru aktif setelah akhir isi lesson terlihat, jadi gulir ke sana dulu.
  async complete() {
    await this.completeButton.scrollIntoViewIfNeeded();
    await this.completeButton.click();
  }
}
