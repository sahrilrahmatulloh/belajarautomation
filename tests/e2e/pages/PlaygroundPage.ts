import { Locator, Page } from "@playwright/test";

import { CatalogPage } from "./CatalogPage";

export class PlaygroundPage extends CatalogPage {
  readonly cards: Locator;
  readonly typeFilter: Locator;

  constructor(page: Page) {
    super(page, "/playground", "Daftar latihan", "Cari latihan");
    this.cards = this.list.getByRole("article");
    this.typeFilter = page.getByRole("group", { name: "Filter Jenis" });
  }

  card(title: string) {
    return this.cards.filter({ has: this.page.getByRole("heading", { name: title, exact: true }) });
  }

  async selectType(label: string) {
    await this.typeFilter.getByRole("button", { name: label, exact: true }).click();
  }

  actionLink(challengeTitle: string, action: string) {
    return this.card(challengeTitle).getByRole("link", { name: `${action}: ${challengeTitle}` });
  }

  relatedCourseLink(challengeTitle: string) {
    return this.card(challengeTitle).getByRole("link", { name: /^Course: / });
  }
}
