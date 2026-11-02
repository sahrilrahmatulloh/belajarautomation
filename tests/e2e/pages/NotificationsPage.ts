import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

const BELL_NAME = /^Notifikasi(, \d+ belum dibaca)?$/;

// Halaman notifikasi, beserta lonceng dan popover yang tampil di semua halaman dashboard.
export class NotificationsPage extends BasePage {
  readonly bell: Locator;
  readonly bellBadge: Locator;
  readonly popover: Locator;
  readonly popoverEntries: Locator;
  readonly popoverMarkAllButton: Locator;
  readonly seeAllLink: Locator;
  readonly heading: Locator;
  readonly backButton: Locator;
  readonly list: Locator;
  readonly entries: Locator;
  readonly dayHeadings: Locator;
  readonly statusFilter: Locator;
  readonly groupFilter: Locator;
  readonly markAllButton: Locator;
  readonly unavailableMessage: Locator;
  readonly closeMessageButton: Locator;
  readonly announcement: Locator;

  constructor(page: Page) {
    super(page, "/notifications");
    // Mobile berupa tautan, desktop berupa tombol popover; yang tersembunyi tidak ikut terpilih.
    this.bell = page.getByRole("link", { name: BELL_NAME }).or(page.getByRole("button", { name: BELL_NAME }));
    this.bellBadge = this.bell.getByText(/^(\d+|9\+)$/);
    this.popover = page.getByRole("dialog", { name: "Notifikasi" });
    this.popoverEntries = this.popover.getByRole("listitem");
    this.popoverMarkAllButton = this.popover.getByRole("button", { name: "Tandai semua dibaca" });
    this.seeAllLink = this.popover.getByRole("link", { name: "Lihat semua notifikasi" });
    this.heading = page.getByRole("heading", { level: 1, name: "Notifikasi" });
    this.backButton = page.getByRole("button", { name: "Kembali" });
    this.list = page.getByRole("region", { name: "Daftar notifikasi" });
    this.entries = this.list.getByRole("article");
    this.dayHeadings = this.list.getByRole("heading", { level: 2 });
    this.statusFilter = page.getByRole("group", { name: "Filter Status" });
    this.groupFilter = page.getByRole("combobox", { name: "Filter kelompok" });
    this.markAllButton = page.getByRole("main").getByRole("button", { name: "Tandai semua dibaca" });
    this.unavailableMessage = page.getByRole("alert").filter({ hasText: "Konten ini sudah tidak tersedia" });
    this.closeMessageButton = page.getByRole("button", { name: "Tutup pesan" });
    this.announcement = page.getByRole("dialog").filter({ has: page.getByRole("button", { name: "Mengerti" }) });
  }

  // Baris di halaman: tautan bila punya tujuan, tombol bila membuka modal atau gabungan.
  item(title: string) {
    return this.list.getByRole("link", { name: title }).or(this.list.getByRole("button", { name: title }));
  }

  popoverItem(title: string) {
    return this.popover.getByRole("link", { name: title }).or(this.popover.getByRole("button", { name: title }));
  }

  statusTab(name: string) {
    return this.statusFilter.getByRole("button", { name, exact: true });
  }

  gotoWithQuery(query: string) {
    return this.page.goto(`/notifications?${query}`);
  }
}
