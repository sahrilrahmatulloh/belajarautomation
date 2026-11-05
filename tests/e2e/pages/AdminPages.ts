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
    this.rows = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar semua konten" }).getByRole("listitem"));
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

export class UsersPageObject {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly search: Locator;
  readonly roleFilter: Locator;
  readonly statusFilter: Locator;
  readonly membershipFilter: Locator;
  readonly noAgreementFilter: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Pengguna dan Peran" });
    this.rows = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar pengguna" }).getByRole("listitem"));
    this.search = page.getByRole("textbox", { name: "Cari pengguna" });
    this.roleFilter = page.getByRole("combobox", { name: "Filter peran" });
    this.statusFilter = page.getByRole("combobox", { name: "Filter status akun" });
    this.membershipFilter = page.getByRole("combobox", { name: "Filter membership" });
    this.noAgreementFilter = page.getByRole("checkbox", { name: "Creator tanpa kesepakatan" });
  }

  goto(query = "") {
    return this.page.goto(`/admin/pengguna${query}`);
  }

  row(name: string) {
    return this.rows.filter({ hasText: name });
  }
}

export class UserDetailPageObject {
  readonly roles: Locator;
  readonly status: Locator;
  readonly agreement: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.roles = page.getByRole("region", { name: "Peran", exact: true });
    this.status = page.getByRole("region", { name: "Status Akun" });
    this.agreement = page.getByRole("region", { name: "Kesepakatan Creator" });
    this.dialog = page.getByRole("dialog");
  }

  goto(userId: string) {
    return this.page.goto(`/admin/pengguna/${userId}`);
  }

  // Aksi yang wajib alasan: tombol konfirmasi aktif setelah alasan diisi.
  async confirmWithReason(confirmLabel: string, reason = "Alasan uji.") {
    const confirm = this.dialog.getByRole("button", { name: confirmLabel });
    await this.dialog.getByRole("textbox", { name: "Alasan" }).fill(reason);
    await confirm.click();
  }

  async changeRole(label: string, confirmLabel: string) {
    await this.roles.getByRole("button", { name: label }).click();
    await this.confirmWithReason(confirmLabel);
  }

  async recordAgreement(date: string, documentNote: string) {
    await this.agreement.getByLabel("Tanggal kesepakatan").fill(date);
    await this.agreement.getByRole("textbox", { name: "Tautan atau keterangan dokumen" }).fill(documentNote);
    await this.agreement.getByRole("button", { name: /kesepakatan$/ }).click();
  }
}

export class AuditLogPageObject {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly search: Locator;
  readonly adminFilter: Locator;
  readonly actionFilter: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Log Aktivitas Admin" });
    this.rows = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar log aktivitas" }).getByRole("listitem"));
    this.search = page.getByRole("textbox", { name: "Cari log" });
    this.adminFilter = page.getByRole("combobox", { name: "Filter Admin" });
    this.actionFilter = page.getByRole("combobox", { name: "Filter jenis aksi" });
    this.dialog = page.getByRole("dialog");
  }

  goto() {
    return this.page.goto("/admin/log");
  }
}

// Berganti akun di browser yang sama, sehingga data dummy tetap sama.
export async function switchAccount(page: Page, email: string) {
  await page.evaluate(() => window.localStorage.removeItem("belajarautomation-session"));
  const login = new LoginPage(page);
  await login.goto();
  await login.login(email, DEMO_PASSWORD);
}
