import { expect, Locator, Page } from "@playwright/test";

// Elemen yang sama di semua halaman ber-layout dashboard.
export abstract class BasePage {
  readonly environmentBadge: Locator;
  readonly profileMenuButton: Locator;
  readonly cartLink: Locator;

  constructor(
    readonly page: Page,
    protected readonly path: string
  ) {
    this.environmentBadge = page.getByRole("status", { name: /^Lingkungan / });
    this.profileMenuButton = page.getByRole("button", { name: /^Buka menu profil/ });
    this.cartLink = page.getByRole("banner").getByRole("link", { name: /^Keranjang/ });
  }

  async goto() {
    return this.page.goto(this.path);
  }

  modeOption(name: string) {
    return this.page.getByRole("menuitemradio", { name });
  }

  async switchMode(name: string) {
    await this.profileMenuButton.click();
    await this.modeOption(name).click();
  }

  async logout() {
    await this.profileMenuButton.click();
    await this.page.getByRole("menuitem", { name: "Keluar" }).click();
  }

  // Yang digulir adalah <main>, sedangkan <html> hanya melebar bila layout rusak,
  // jadi keduanya diperiksa.
  async expectNoHorizontalScroll() {
    await expect
      .poll(() =>
        this.page.evaluate(() =>
          [document.documentElement, document.querySelector("main")].map((element) =>
            element ? element.scrollWidth - element.clientWidth : 0
          )
        )
      )
      .toEqual([0, 0]);
  }
}
