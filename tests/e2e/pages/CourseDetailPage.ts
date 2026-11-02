import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class CourseDetailPage extends BasePage {
  readonly title: Locator;
  readonly preparingNotice: Locator;

  constructor(page: Page, slug: string) {
    super(page, `/learn/${slug}`);
    this.title = page.getByRole("heading", { level: 1 });
    this.preparingNotice = page.getByRole("heading", { name: "Materi sedang disiapkan" });
  }
}
