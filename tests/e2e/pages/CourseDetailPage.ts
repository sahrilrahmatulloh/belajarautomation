import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class CourseDetailPage extends BasePage {
  readonly title: Locator;
  readonly preparingNotice: Locator;
  readonly lessonLinks: Locator;
  readonly progressText: Locator;
  readonly completedMarks: Locator;

  constructor(page: Page, slug: string) {
    super(page, `/learn/${slug}`);
    // Logo di sidebar juga berupa h1.
    this.title = page.getByRole("main").getByRole("heading", { level: 1 });
    this.preparingNotice = page.getByRole("heading", { name: "Materi sedang disiapkan" });
    this.lessonLinks = page.locator(`a[href^="/learn/${slug}/"]`);
    this.progressText = page.getByText(/^\d+ \/ \d+ materi$/);
    // Lesson di modul yang tertutup tetap dihitung.
    this.completedMarks = this.lessonLinks.getByRole("img", { name: "Selesai", includeHidden: true });
  }

  completedMark(lessonTitle: string) {
    return this.lessonLinks
      .filter({ hasText: lessonTitle })
      .getByRole("img", { name: "Selesai", includeHidden: true });
  }

  module(title: string) {
    return this.page.locator("details").filter({ hasText: title });
  }

  // Judul modul berada di dalam elemen summary yang membuka dan menutup modul.
  moduleToggle(title: string) {
    return this.module(title).locator("summary");
  }

  moduleLessons(title: string) {
    return this.module(title).getByRole("link");
  }
}
