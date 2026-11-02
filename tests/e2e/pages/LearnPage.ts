import { Locator, Page } from "@playwright/test";

import { CatalogPage } from "./CatalogPage";

export class LearnPage extends CatalogPage {
  readonly roadmapCta: Locator;
  readonly roadmapCtaLink: Locator;
  readonly courseTitles: Locator;
  readonly availableOnlySwitch: Locator;
  readonly comingSoonBadges: Locator;

  constructor(page: Page) {
    super(page, "/learn", "Daftar course", "Cari course");
    this.roadmapCta = page.getByRole("region", { name: "Ajakan roadmap" });
    this.roadmapCtaLink = this.roadmapCta.getByRole("link", { name: "Lihat Roadmap" });
    this.courseTitles = this.list.getByRole("heading", { level: 2 });
    this.availableOnlySwitch = page.getByRole("switch", { name: "Hanya yang tersedia" });
    this.comingSoonBadges = this.list.getByText("Segera hadir", { exact: true });
  }

  courseTitle(title: string) {
    return this.list.getByRole("heading", { level: 2, name: title, exact: true });
  }

  courseCard(title: string) {
    return this.list
      .getByRole("link")
      .filter({ has: this.page.getByRole("heading", { level: 2, name: title, exact: true }) });
  }

  async toggleAvailableOnly() {
    await this.filterButton.click();
    await this.availableOnlySwitch.click();
    await this.page.keyboard.press("Escape");
  }
}
