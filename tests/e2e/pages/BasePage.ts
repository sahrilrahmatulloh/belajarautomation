import { expect, Locator, Page } from "@playwright/test";

// Elemen yang sama di semua halaman ber-layout dashboard.
export abstract class BasePage {
  readonly environmentBadge: Locator;
  readonly profileMenuButton: Locator;

  constructor(
    readonly page: Page,
    protected readonly path: string
  ) {
    this.environmentBadge = page.getByRole("status", { name: /^Lingkungan / });
    this.profileMenuButton = page.getByRole("button", { name: "Buka menu profil" });
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async logout() {
    await this.profileMenuButton.click();
    await this.page.getByRole("menuitem", { name: "Keluar" }).click();
  }

  async expectNoHorizontalScroll() {
    await expect
      .poll(() =>
        this.page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
      )
      .toBeLessThanOrEqual(0);
  }
}
