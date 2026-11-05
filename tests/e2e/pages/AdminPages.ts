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

export class TransactionsPageObject {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly search: Locator;
  readonly statusFilter: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Transaksi" });
    this.rows = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar transaksi" }).getByRole("listitem"));
    this.search = page.getByRole("textbox", { name: "Cari transaksi" });
    this.statusFilter = page.getByRole("combobox", { name: "Filter status" });
  }

  goto(query = "") {
    return this.page.goto(`/admin/transaksi${query}`);
  }
}

export class TransactionDetailPageObject {
  readonly timeline: Locator;
  readonly refundButton: Locator;
  readonly gateway: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.timeline = page.getByRole("list", { name: "Timeline status" }).getByRole("listitem");
    this.refundButton = page.getByRole("button", { name: "Refund transaksi" });
    this.gateway = page.getByRole("region", { name: "Simulasi gateway (DEV)" });
    this.dialog = page.getByRole("dialog");
  }

  goto(id: string) {
    return this.page.goto(`/admin/transaksi/${id}`);
  }

  gatewayButton(status: string) {
    return this.gateway.getByRole("button", { name: `Simulasi gateway: ${status}` });
  }
}

export class ProductsPageObject {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly search: Locator;
  readonly typeFilter: Locator;
  readonly statusFilter: Locator;
  readonly addButton: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Produk Digital" });
    this.rows = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar produk" }).getByRole("listitem"));
    this.search = page.getByRole("textbox", { name: "Cari produk" });
    this.typeFilter = page.getByRole("combobox", { name: "Filter jenis" });
    this.statusFilter = page.getByRole("combobox", { name: "Filter status" });
    this.addButton = page.getByRole("button", { name: "Tambah Produk" });
    this.dialog = page.getByRole("dialog");
  }

  goto() {
    return this.page.goto("/admin/produk");
  }

  row(title: string) {
    return this.rows.filter({ hasText: title });
  }

  async openEdit(title: string) {
    await this.search.fill(title);
    await this.row(title).getByRole("button", { name: `Ubah ${title}` }).click();
  }
}

export class CatalogPageObject {
  readonly heading: Locator;
  readonly banner: Locator;
  readonly indicator: Locator;
  readonly rows: Locator;
  readonly itemRows: Locator;
  readonly search: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Katalog Belajar" });
    this.banner = page.getByRole("note").filter({ hasText: "Simulasi — perubahan katalog sungguhan dilakukan lewat PR" });
    this.indicator = page.getByRole("region", { name: "XP dari materi gratis" });
    this.rows = page
      .getByRole("group", { name: "Tabel course" })
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar course" }).getByRole("listitem"));
    this.itemRows = page
      .getByRole("group", { name: "Tabel roadmap dan latihan" })
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar roadmap dan latihan" }).getByRole("listitem"));
    this.search = page.getByRole("textbox", { name: "Cari course" });
    this.dialog = page.getByRole("dialog");
  }

  goto() {
    return this.page.goto("/admin/katalog");
  }

  row(title: string) {
    return this.rows.filter({ hasText: title });
  }

  async change(title: string, field: "Status katalog" | "Status konten" | "Tingkat akses", label: string) {
    await this.search.fill(title);
    await this.row(title).getByRole("button", { name: `Ubah ${title}` }).click();
    await this.dialog.getByRole("combobox", { name: field }).selectOption({ label });
    await this.dialog.getByRole("textbox", { name: "Alasan" }).fill("Alasan uji.");
    await this.dialog.getByRole("button", { name: "Simpan" }).click();
  }
}

export class ModerationPageObject {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly statusFilter: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Moderasi" });
    this.rows = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar akun ditandai" }).getByRole("listitem"));
    this.statusFilter = page.getByRole("combobox", { name: "Filter status" });
    this.dialog = page.getByRole("dialog");
  }

  goto(query = "") {
    return this.page.goto(`/admin/moderasi${query}`);
  }

  row(name: string) {
    return this.rows.filter({ hasText: name });
  }
}

// Berganti akun di browser yang sama, sehingga data dummy tetap sama.
export async function switchAccount(page: Page, email: string) {
  // localStorage belum bisa dibaca sebelum halaman membuka alamat situs.
  if (page.url() === "about:blank") await page.goto("/login");
  await page.evaluate(() => window.localStorage.removeItem("belajarautomation-session"));
  const login = new LoginPage(page);
  await login.goto();
  await login.login(email, DEMO_PASSWORD);
}
