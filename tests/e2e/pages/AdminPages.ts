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

export class AnnouncementsPageObject {
  readonly heading: Locator;
  readonly title: Locator;
  readonly body: Locator;
  readonly href: Locator;
  readonly group: Locator;
  readonly target: Locator;
  readonly preview: Locator;
  readonly history: Locator;
  readonly schedule: Locator;
  readonly sendNow: Locator;
  readonly saveDraft: Locator;
  readonly process: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Pengumuman" });
    this.title = page.getByRole("textbox", { name: "Judul" });
    this.body = page.getByRole("textbox", { name: "Isi", exact: true });
    this.href = page.getByRole("textbox", { name: /^Tautan tujuan/ });
    this.group = page.getByRole("combobox", { name: "Grup notifikasi" });
    this.target = page.getByRole("combobox", { name: "Target" });
    this.preview = page.getByRole("region", { name: "Pratinjau Notifikasi" });
    this.history = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar pengumuman" }).getByRole("listitem"));
    this.schedule = page.getByRole("checkbox", { name: "Jadwalkan" });
    this.sendNow = page.getByRole("button", { name: "Kirim Sekarang" });
    this.saveDraft = page.getByRole("button", { name: "Simpan Draf" });
    this.process = page.getByRole("button", { name: "Simulasi: Proses jadwal sekarang" });
    this.dialog = page.getByRole("dialog");
  }

  goto() {
    return this.page.goto("/admin/pengumuman");
  }

  row(title: string) {
    return this.history.filter({ hasText: title });
  }

  async fill(title: string, body: string) {
    await this.title.fill(title);
    await this.body.fill(body);
  }

  async targetRole(label: string) {
    await this.target.selectOption({ label: "Peran tertentu" });
    await this.page.getByRole("combobox", { name: "Peran" }).selectOption({ label });
  }

  async send() {
    await this.sendNow.click();
    await this.dialog.getByRole("button", { name: "Kirim", exact: true }).click();
    await this.page.getByRole("status").filter({ hasText: "Pengumuman terkirim." }).waitFor();
  }
}

export class ReportsPageObject {
  readonly heading: Locator;
  readonly exportButton: Locator;
  readonly sales: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Laporan" });
    this.exportButton = page.getByRole("button", { name: "Ekspor CSV" });
    this.sales = page
      .getByRole("group", { name: "Tabel penjualan" })
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar penjualan" }).getByRole("listitem"));
  }

  goto() {
    return this.page.goto("/admin/laporan");
  }

  stat(label: string) {
    return this.page.getByRole("heading", { level: 3, name: label }).locator("xpath=following-sibling::p");
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

export class MaintenancePageObject {
  readonly heading: Locator;
  readonly prep: Locator;
  readonly startAt: Locator;
  readonly estimatedEndAt: Locator;
  readonly message: Locator;
  readonly fillEarliest: Locator;
  readonly schedule: Locator;
  readonly current: Locator;
  readonly history: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Mode Maintenance" });
    this.prep = page.getByRole("combobox", { name: "Lama Persiapan" });
    this.startAt = page.getByLabel("Waktu mulai");
    this.estimatedEndAt = page.getByLabel("Perkiraan selesai");
    this.message = page.getByRole("textbox", { name: "Pesan untuk pengguna" });
    this.fillEarliest = page.getByRole("button", { name: "Isi waktu paling cepat" });
    this.schedule = page.getByRole("button", { name: "Jadwalkan Maintenance" });
    this.current = page.getByRole("region", { name: "Jadwal Berjalan" });
    this.history = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar maintenance" }).getByRole("listitem"));
    this.dialog = page.getByRole("dialog");
  }

  goto() {
    return this.page.goto("/admin/maintenance");
  }

  async confirmWithReason(button: string, reason = "Uji maintenance") {
    await this.dialog.getByRole("textbox", { name: "Alasan" }).fill(reason);
    await this.dialog.getByRole("button", { name: button, exact: true }).click();
  }

  async scheduleEarliest(prepMinutes: number, message: string) {
    await this.prep.selectOption({ label: `${prepMinutes} menit` });
    await this.fillEarliest.click();
    await this.message.fill(message);
    await this.schedule.click();
    await this.confirmWithReason("Jadwalkan");
  }
}

// Akun Admin dummy, untuk menjalankan aksi lewat repository tanpa membuka Panel Admin.
const ADMIN_ID = "user-admin";

// Menjadwalkan maintenance secepat mungkin (saat ini + Persiapan) lewat repository di browser.
export async function scheduleMaintenance(page: Page, message = "Perbaikan fitur blog.", prepMinutes = 5) {
  await page.waitForFunction(() => "__contentRepository" in window);
  await page.evaluate(
    async ({ adminId, message, prepMinutes }) => {
      const start = Date.now() + prepMinutes * 60_000 + 60_000;
      const repository = (window as unknown as { __contentRepository: { saveMaintenance: (...args: unknown[]) => Promise<unknown> } }).__contentRepository;
      await repository.saveMaintenance(adminId, null, { startAt: new Date(start).toISOString(), estimatedEndAt: new Date(start + 3_600_000).toISOString(), prepMinutes, message }, "Uji maintenance");
    },
    { adminId: ADMIN_ID, message, prepMinutes }
  );
}

// Memajukan waktu jadwal yang berjalan, seperti tombol simulasi di Panel Admin.
export async function simulateMaintenance(page: Page, target: "persiapan" | "menit-terakhir" | "aktif") {
  await page.evaluate(async (target) => {
    type Repository = { listMaintenance: () => Promise<{ id: string; status: string }[]>; simulateMaintenance: (id: string, target: string) => Promise<unknown> };
    const repository = (window as unknown as { __contentRepository: Repository }).__contentRepository;
    const current = (await repository.listMaintenance()).find((item) => item.status === "terjadwal");
    if (!current) throw new Error("Tidak ada maintenance terjadwal");
    await repository.simulateMaintenance(current.id, target);
  }, target);
}

export async function endMaintenance(page: Page) {
  await page.evaluate(async (adminId) => {
    type Repository = { listMaintenance: () => Promise<{ id: string; status: string }[]>; endMaintenance: (...args: unknown[]) => Promise<unknown> };
    const repository = (window as unknown as { __contentRepository: Repository }).__contentRepository;
    const current = (await repository.listMaintenance()).find((item) => item.status === "terjadwal");
    if (!current) throw new Error("Tidak ada maintenance terjadwal");
    await repository.endMaintenance(adminId, current.id, "Perbaikan selesai");
  }, ADMIN_ID);
}
