import { expect, Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

// Halaman artikel /blog/<slug>.
export class ArticlePage extends BasePage {
  readonly heading: Locator;
  readonly articleHeader: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly breadcrumb: Locator;
  readonly draftBadge: Locator;
  readonly toc: Locator;
  readonly tocToggle: Locator;
  readonly activeTocLink: Locator;
  readonly ctaSection: Locator;
  readonly sources: Locator;
  readonly shareSection: Locator;
  readonly shareButton: Locator;
  readonly sharePanel: Locator;
  readonly copiedMessage: Locator;
  readonly related: Locator;

  constructor(
    page: Page,
    readonly slug: string
  ) {
    super(page, `/blog/${slug}`);
    const main = page.getByRole("main");
    const header = page.getByRole("banner");
    this.heading = main.getByRole("heading", { level: 1 });
    this.loginLink = header.getByRole("link", { name: "Masuk" });
    this.registerLink = header.getByRole("link", { name: "Daftar" });
    this.breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    // Dibatasi ke header karena kartu Artikel Terkait juga punya badge dan waktu baca.
    this.articleHeader = main.locator("header");
    this.draftBadge = this.articleHeader.getByText("Draf", { exact: true });
    // Hanya satu yang tampil: panel di layar sempit, samping di layar lebar.
    this.toc = page.getByRole("navigation", { name: "Daftar Isi" }).locator("visible=true");
    this.tocToggle = this.toc.getByRole("button", { name: "Daftar Isi" });
    this.activeTocLink = this.toc.locator('[aria-current="location"]');
    this.ctaSection = page.getByRole("region", { name: "Ajakan" });
    this.sources = page.getByRole("region", { name: "Sumber" });
    this.shareSection = page.getByRole("region", { name: "Bagikan Artikel" });
    this.shareButton = page.getByRole("button", { name: "Bagikan", exact: true }).locator("visible=true");
    this.sharePanel = page.getByRole("dialog", { name: "Bagikan Artikel" });
    this.copiedMessage = page.getByRole("status").filter({ hasText: "Tautan disalin" });
    this.related = page.getByRole("region", { name: "Artikel Terkait" });
  }

  codeBlock(index = 0) {
    return this.page.getByRole("group", { name: /^Kode / }).nth(index);
  }

  copyCodeButton(index = 0) {
    return this.page.getByRole("main").getByRole("button", { name: "Salin", exact: true }).nth(index);
  }

  // Teks kode dibaca dari tombol sampai notifikasi, jadi halaman harus sudah siap.
  async expectReady() {
    await expect(this.loginLink.or(this.profileMenuButton)).toBeVisible();
  }

  async openToc() {
    if (await this.tocToggle.count()) await this.tocToggle.click();
  }
}
