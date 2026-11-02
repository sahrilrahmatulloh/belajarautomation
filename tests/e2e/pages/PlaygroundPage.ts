import { Locator, Page } from "@playwright/test";

import { CatalogPage } from "./CatalogPage";

export class PlaygroundPage extends CatalogPage {
  readonly cards: Locator;

  constructor(page: Page) {
    super(page, "/playground", "Daftar challenge", "Cari challenge");
    this.cards = this.list.getByRole("article");
  }

  card(title: string) {
    return this.cards.filter({ has: this.page.getByRole("heading", { name: title, exact: true }) });
  }

  relatedCourseLink(challengeTitle: string) {
    return this.card(challengeTitle).getByRole("link", { name: /^Course: / });
  }
}
