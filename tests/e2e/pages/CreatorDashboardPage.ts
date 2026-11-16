import { Locator, Page } from "@playwright/test";

import { RoleDashboardPage } from "./RoleDashboardPage";

export class CreatorDashboardPage extends RoleDashboardPage {
  readonly stats: Locator;
  readonly statTitles: Locator;
  readonly flow: Locator;
  readonly flowItems: Locator;
  readonly weekly: Locator;
  readonly todo: Locator;
  readonly recent: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    super(page, "creator");
    this.stats = page.getByRole("region", { name: "Statistik konten" });
    this.statTitles = this.stats.getByRole("heading", { level: 3 });
    this.flow = page.getByRole("region", { name: "Alur Konten" });
    this.flowItems = this.flow.getByRole("list", { name: "Jumlah konten per tahap" }).getByRole("listitem");
    this.weekly = page.getByRole("region", { name: "Konten Dibuat per Minggu" });
    this.todo = page.getByRole("region", { name: "Perlu Dikerjakan" });
    this.recent = page.getByRole("list", { name: "Konten terbaru" }).getByRole("listitem");
    this.createButton = page.getByRole("main").getByRole("link", { name: "Buat Konten Baru" });
  }

  // Kartu statistik: judul, lalu angka tepat di bawahnya.
  statValue(label: string) {
    return this.stats.getByRole("heading", { level: 3, name: label }).locator("xpath=following-sibling::p");
  }

  // Jumlah satu tahap di Alur Konten.
  flowCount(label: string) {
    return this.flowItems.filter({ hasText: label }).getByRole("link");
  }
}
