import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

// Aplikasi tiruan di dalam bingkai "Halaman latihan" (components/practice).
export class PracticeSite extends BasePage {
  readonly frame: Locator;

  constructor(page: Page, challengeSlug: string) {
    super(page, `/playground/${challengeSlug}`);
    this.frame = page.getByRole("region", { name: /^Halaman latihan: / });
  }

  element(practiceId: string) {
    return this.frame.locator(`[data-practice-id="${practiceId}"]`);
  }
}
