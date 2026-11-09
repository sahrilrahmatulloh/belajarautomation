import { Locator, Page } from "@playwright/test";

import { RoleDashboardPage } from "./RoleDashboardPage";

export class CreatorDashboardPage extends RoleDashboardPage {
  readonly stats: Locator;
  readonly statTitles: Locator;
  readonly contentRows: Locator;
  readonly revisionNotes: Locator;

  constructor(page: Page) {
    super(page, "creator");
    this.stats = page.getByRole("region", { name: "Statistik konten" });
    this.statTitles = this.stats.getByRole("heading", { level: 3 });
    this.contentRows = page.getByRole("table").getByRole("row").filter({ has: page.getByRole("rowheader") });
    this.revisionNotes = page.getByRole("region", { name: "Catatan Revisi Terbaru" }).getByRole("listitem");
  }

  // Kartu statistik: judul, lalu angka tepat di bawahnya.
  statValue(label: string) {
    return this.stats.getByRole("heading", { level: 3, name: label }).locator("xpath=following-sibling::p");
  }

  contentRow(title: string) {
    return this.contentRows.filter({ hasText: title });
  }
}
