import { expect, Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

// Halaman daftar artikel /blog.
export class BlogPage extends BasePage {
  readonly heading: Locator;
  readonly main: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly menu: Locator;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly sortSelect: Locator;
  readonly featuredLink: Locator;
  readonly cards: Locator;
  readonly cardTitles: Locator;
  readonly emptyState: Locator;
  readonly resetButton: Locator;
  readonly draftBadges: Locator;

  constructor(page: Page) {
    super(page, "/blog");
    const header = page.getByRole("banner");
    this.main = page.getByRole("main");
    this.heading = this.main.getByRole("heading", { level: 1, name: "Blog" });
    this.loginLink = header.getByRole("link", { name: "Masuk" });
    this.registerLink = header.getByRole("link", { name: "Daftar" });
    this.menu = page.getByRole("navigation", { name: "Menu User" });
    this.searchInput = page.getByRole("textbox", { name: "Cari artikel" });
    this.categoryFilter = page.getByRole("group", { name: "Filter Kategori" });
    this.sortSelect = page.getByRole("combobox", { name: "Urutkan artikel" });
    this.featuredLink = this.main.getByRole("link", { name: /^Baca Artikel:/ });
    const latest = page.getByRole("region", { name: "Artikel Terbaru" });
    this.cards = latest.getByRole("article");
    this.cardTitles = latest.getByRole("heading", { level: 3 });
    this.emptyState = this.main.getByRole("heading", { name: "Artikel tidak ditemukan" });
    this.resetButton = this.main.getByRole("button", { name: "Reset filter" });
    this.draftBadges = this.main.getByText("Draf", { exact: true });
  }

  category(name: string) {
    return this.categoryFilter.getByRole("button", { name, exact: true });
  }

  gotoWithQuery(query: string) {
    return this.page.goto(`/blog?${query}`);
  }

  // Filter baru aktif setelah halaman siap, sedangkan isi dari server sudah tampil lebih dulu.
  async expectReady() {
    await expect(this.loginLink.or(this.page.getByRole("button", { name: "Buka menu profil" }))).toBeVisible();
  }
}
