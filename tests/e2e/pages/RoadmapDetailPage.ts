import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class RoadmapDetailPage extends BasePage {
  readonly branchHeadings: Locator;
  readonly recommendedLabels: Locator;

  constructor(page: Page, slug: string) {
    super(page, `/roadmap/${slug}`);
    this.branchHeadings = page.getByRole("heading", { name: "Pilih salah satu jalur" });
    this.recommendedLabels = page.getByText("Rekomendasi", { exact: true });
  }

  materialLink(courseTitle: string) {
    return this.page.getByRole("link", { name: `Lihat materi ${courseTitle}`, exact: true });
  }
}
