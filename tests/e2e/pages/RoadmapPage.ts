import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class RoadmapPage extends BasePage {
  readonly cards: Locator;

  constructor(page: Page) {
    super(page, "/roadmap");
    this.cards = page.getByRole("article");
  }
}
