import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class ProfilePage extends BasePage {
  readonly tabs: Locator;
  readonly header: Locator;
  readonly rankEmblem: Locator;
  readonly shareButton: Locator;
  readonly bannerActions: Locator;
  readonly editProfileLink: Locator;
  readonly settingsLink: Locator;
  readonly viewAsPublicLink: Locator;
  readonly customizeLink: Locator;
  readonly backToProfileLink: Locator;
  readonly cat3d: Locator;
  readonly stats: Locator;
  readonly xpProgress: Locator;
  readonly xpPeriodSelect: Locator;
  readonly achievementCard: Locator;
  readonly rankProgress: Locator;
  readonly recentActivity: Locator;
  readonly preview: Locator;
  readonly saveAppearanceButton: Locator;
  readonly activitySummary: Locator;
  readonly activityRows: Locator;
  readonly xpChart: Locator;
  readonly heatmap: Locator;
  readonly achievementTotal: Locator;

  constructor(page: Page) {
    super(page, "/profile");
    this.tabs = page.getByRole("tablist", { name: "Bagian profil" }).getByRole("tab");
    this.header = page
      .getByRole("main")
      .locator("section")
      .filter({ has: page.getByRole("heading", { level: 1 }) });
    this.rankEmblem = this.header.getByRole("img", { name: /^Emblem rank / });
    this.shareButton = page.getByRole("button", { name: "Bagikan profil" });
    this.bannerActions = page.getByRole("navigation", { name: "Aksi profil" });
    this.editProfileLink = this.bannerActions.getByRole("link", { name: "Edit profil" });
    this.settingsLink = this.bannerActions.getByRole("link", { name: "Pengaturan", exact: true });
    this.viewAsPublicLink = this.bannerActions.getByRole("link", { name: "Lihat sebagai publik" });
    this.customizeLink = this.header.getByRole("link", { name: "Ubah avatar dan tema" });
    this.backToProfileLink = page.getByRole("link", { name: "Kembali ke profil" });
    // Kucing 3D dekoratif (aria-hidden), jadi dicari lewat penanda datanya.
    this.cat3d = this.header.locator("[data-cat-3d]");
    this.stats = page.getByRole("region", { name: "Statistik belajar" });
    this.xpProgress = page.getByRole("region", { name: "Progres XP" });
    this.xpPeriodSelect = this.xpProgress.getByRole("combobox", { name: "Periode grafik XP" });
    this.achievementCard = page.getByRole("region", { name: "Achievement", exact: true });
    this.rankProgress = page.getByRole("region", { name: "Progress Rank" });
    this.recentActivity = page.getByRole("region", { name: "Aktivitas Terbaru" });
    this.preview = page.getByRole("region", { name: "Pratinjau Profil" });
    this.saveAppearanceButton = this.preview.getByRole("button", { name: "Simpan Pilihan" });
    this.activitySummary = page.getByRole("region", { name: /^Ringkasan \d+ hari terakhir$/ });
    this.activityRows = page.getByRole("region", { name: "Riwayat aktivitas" }).getByRole("listitem");
    this.xpChart = page.getByRole("region", { name: "XP 7 Hari Terakhir" });
    this.heatmap = page.getByRole("region", { name: "Konsistensi 30 Hari" });
    this.achievementTotal = page.getByRole("region", { name: "Progres total achievement" });
  }

  tab(name: string) {
    return this.page.getByRole("tab", { name, exact: true });
  }

  async gotoTab(tab: string) {
    await this.page.goto(`${this.path}?tab=${tab}`);
  }

  activityTypeChip(label: string) {
    return this.page
      .getByRole("group", { name: "Filter jenis aktivitas" })
      .getByRole("button", { name: label, exact: true });
  }

  activityPeriodChip(label: string) {
    return this.page
      .getByRole("group", { name: "Filter periode" })
      .getByRole("button", { name: label, exact: true });
  }

  achievementCategoryChip(label: string) {
    return this.page
      .getByRole("group", { name: "Filter kategori achievement" })
      .getByRole("button", { name: label, exact: true });
  }

  achievementSection(title: string) {
    return this.page.getByRole("region", { name: title, exact: true });
  }

  achievementProgress(name: string) {
    return this.page.getByRole("progressbar", { name: `Progres ${name}` });
  }
}
