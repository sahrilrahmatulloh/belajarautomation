import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

// Pola filter bersama halaman Belajar dan Playground (components/filters).
export abstract class CatalogPage extends BasePage {
  readonly list: Locator;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly filterButton: Locator;

  constructor(page: Page, path: string, listName: string, searchLabel: string) {
    super(page, path);
    this.list = page.getByRole("region", { name: listName });
    this.searchInput = page.getByRole("textbox", { name: searchLabel });
    this.categoryFilter = page.getByRole("group", { name: "Filter Kategori" });
    this.filterButton = page.getByRole("button", { name: /^Filter/ });
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
  }

  async selectCategory(label: string) {
    await this.categoryFilter.getByRole("button", { name: label, exact: true }).click();
  }

  // Popover di desktop dan sheet di mobile, keduanya tertutup dengan Escape.
  async selectPanelFilter(group: string, label: string) {
    await this.filterButton.click();
    await this.page
      .getByRole("group", { name: `Filter ${group}` })
      .getByRole("button", { name: label, exact: true })
      .click();
    await this.page.keyboard.press("Escape");
  }
}
