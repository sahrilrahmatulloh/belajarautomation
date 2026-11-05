import { Locator, Page } from "@playwright/test";

import { DEMO_PASSWORD } from "../fixtures/testData";
import { LoginPage } from "./LoginPage";

export class AllContentsPageObject {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly statusFilter: Locator;
  readonly search: Locator;
  readonly creatorFilter: Locator;
  readonly reviewerFilter: Locator;
  readonly typeFilter: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Semua Konten" });
    this.rows = page.getByRole("table").getByRole("row").filter({ has: page.getByRole("rowheader") });
    this.statusFilter = page.getByRole("group", { name: "Filter Status" });
    this.search = page.getByRole("textbox", { name: "Cari konten" });
    this.creatorFilter = page.getByRole("combobox", { name: "Filter Creator" });
    this.reviewerFilter = page.getByRole("combobox", { name: "Filter Reviewer" });
    this.typeFilter = page.getByRole("combobox", { name: "Filter jenis" });
    this.dialog = page.getByRole("dialog");
  }

  goto(query = "") {
    return this.page.goto(`/admin/konten${query}`);
  }

  row(title: string) {
    return this.rows.filter({ hasText: title });
  }

  statusTab(name: RegExp) {
    return this.statusFilter.getByRole("button", { name });
  }
}

export class ManageRolesPageObject {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly search: Locator;
  readonly roleFilter: Locator;
  readonly history: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Kelola Peran" });
    this.rows = page.getByRole("table").getByRole("row").filter({ has: page.getByRole("rowheader") });
    this.search = page.getByRole("textbox", { name: "Cari pengguna" });
    this.roleFilter = page.getByRole("combobox", { name: "Filter peran" });
    this.history = page.getByRole("region", { name: "Riwayat Perubahan Peran" });
    this.dialog = page.getByRole("dialog");
  }

  goto() {
    return this.page.goto("/admin/pengguna");
  }

  row(name: string) {
    return this.rows.filter({ hasText: name });
  }

  roleAction(name: string, label: string) {
    return this.row(name).getByRole("button", { name: `${label}: ${name}` });
  }
}

// Berganti akun di browser yang sama, sehingga data dummy tetap sama.
export async function switchAccount(page: Page, email: string) {
  await page.evaluate(() => window.localStorage.removeItem("belajarautomation-session"));
  const login = new LoginPage(page);
  await login.goto();
  await login.login(email, DEMO_PASSWORD);
}
