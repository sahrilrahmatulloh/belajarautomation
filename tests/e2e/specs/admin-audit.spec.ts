import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { ADMIN_COMMERCE } from "../fixtures/testData";
import { AuditLogPageObject, TransactionDetailPageObject, TransactionsPageObject, UserDetailPageObject, UsersPageObject } from "../pages/AdminPages";

// Perbaikan hasil audit Panel Admin akun demo (PRD FR-16): kelengkapan Dashboard, koreksi XP dari
// detail pengguna, durasi membership manual, dan tanggal WIB yang konsisten.

const { learnerId, pendingTransactionId } = ADMIN_COMMERCE;

test.use({ role: "admin" });

const section = (page: Page, name: string) => page.getByRole("region", { name: new RegExp(`^${name}`) });

test.describe("Dashboard Admin akun demo", () => {
  test("memuat total pengguna, membership aktif, total XP, sebaran rank, dan aksi Admin terbaru", async ({ page }) => {
    await page.goto("/admin");
    const users = section(page, "Pengguna");
    await expect(users.getByRole("link", { name: /^Total Pengguna \d+/ })).toBeVisible();
    await expect(users.getByRole("link", { name: /^Membership Aktif \d+/ })).toContainText(/Pro \d+ · Premium \d+/);
    await expect(users.getByRole("link", { name: /^Total XP Terkumpul/ })).toBeVisible();
    await expect(section(page, "Sebaran Rank").getByRole("listitem")).toHaveCount(6);
    await expect(section(page, "Aksi Admin Terbaru")).toContainText("Belum ada aksi Admin");

    // Setiap angka menuju daftar yang sudah terfilter (PRD FR-16 A).
    await users.getByRole("link", { name: /^Membership Aktif/ }).click();
    await expect(page).toHaveURL(/membership=berbayar/);
    const list = new UsersPageObject(page);
    await expect(list.membershipFilter).toHaveValue("berbayar");
    await expect(list.rows.first()).toBeVisible();
    await expect(list.rows.filter({ hasText: "Basic" })).toHaveCount(0);
  });

  test("grafik pertumbuhan pengguna dan pendapatan per minggu, dengan tooltip keyboard dan tabel data", async ({ page }) => {
    await page.goto("/admin");
    const growth = section(page, "Pertumbuhan Pengguna");
    const revenue = section(page, "Pendapatan per Minggu");

    // 12 dan 8 minggu terakhir; tabel data untuk pembaca layar.
    await expect(growth.getByRole("table").getByRole("row")).toHaveCount(13);
    await expect(revenue.getByRole("table").getByRole("row")).toHaveCount(9);
    // Minggu terakhir pertumbuhan sama dengan Total Pengguna.
    await expect(growth.getByRole("table").getByRole("row").last()).toContainText("88 pengguna");
    await expect(revenue).toContainText(/8 minggu terakhir: Rp\s?[\d.]+\./);

    // Tooltip mengikuti tombol panah saat grafik difokus.
    const chart = revenue.getByRole("img", { name: /^Pendapatan transaksi Berhasil per minggu/ });
    await chart.focus();
    const tooltip = revenue.locator("[data-chart-tooltip]");
    await expect(tooltip).toContainText("transaksi berhasil");
    const lastWeek = await tooltip.innerText();
    await page.keyboard.press("ArrowLeft");
    await expect(tooltip).not.toHaveText(lastWeek);
    await expect(tooltip).toContainText(/Rp\s?[\d.]+/);
    await chart.blur();
    await expect(tooltip).toHaveCount(0);
  });

  test("aksi Admin terbaru menampilkan aksi yang baru dilakukan", async ({ page }) => {
    const user = new UserDetailPageObject(page);
    await user.goto(learnerId);
    await page.getByRole("button", { name: "Koreksi XP" }).click();
    await user.dialog.getByRole("spinbutton", { name: /Jumlah koreksi/ }).fill("50");
    await user.confirmWithReason("Simpan koreksi", "Bonus acara komunitas.");

    await page.goto("/admin");
    await expect(section(page, "Aksi Admin Terbaru").getByRole("listitem").first()).toContainText("Koreksi XP");
  });
});

test.describe("Koreksi XP dari detail pengguna", () => {
  test("mengubah XP dan rank, tercatat di riwayat dan log", async ({ page }) => {
    const user = new UserDetailPageObject(page);
    await user.goto(learnerId);
    const summary = page.getByRole("region", { name: "Ringkasan Belajar" });
    const before = Number((await summary.getByText(/^\d[\d.]*$/).first().innerText()).replace(/\D/g, ""));

    await summary.getByRole("button", { name: "Koreksi XP" }).click();
    await expect(user.dialog.getByRole("button", { name: "Simpan koreksi" })).toBeDisabled();
    await user.dialog.getByRole("spinbutton", { name: /Jumlah koreksi/ }).fill("100");
    await user.confirmWithReason("Simpan koreksi", "Kompensasi lesson bermasalah.");

    await expect(summary).toContainText((before + 100).toLocaleString("id-ID"));
    await expect(page.getByRole("list", { name: "Koreksi XP" })).toContainText("Kompensasi lesson bermasalah.");
    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.rows.filter({ hasText: "Koreksi XP" }).first()).toContainText("Kompensasi lesson bermasalah.");
  });
});

test.describe("Durasi membership manual", () => {
  test("menyediakan durasi, menampilkan masa berlaku, dan pemberian baru menggantikan yang lama", async ({ page }) => {
    const user = new UserDetailPageObject(page);
    await user.goto(learnerId);
    const access = page.getByRole("region", { name: "Membership dan Hak Akses" });
    const list = access.getByRole("list", { name: "Daftar hak akses" });

    await access.getByRole("button", { name: "Berikan hak akses manual" }).click();
    const duration = user.dialog.getByRole("combobox", { name: "Durasi" });
    await expect(duration.getByRole("option")).toHaveText(["30 hari", "90 hari", "1 tahun", "Tanpa batas"]);
    await user.dialog.getByRole("combobox", { name: "Item" }).selectOption({ label: "Membership Pro" });
    await duration.selectOption({ label: "90 hari" });

    // Alasan membership manual minimal 5 karakter (PRD FR-16 E).
    await user.confirmWithReason("Berikan akses", "Ok");
    await expect(user.dialog.getByRole("alert")).toContainText("minimal 5 karakter");
    await user.confirmWithReason("Berikan akses", "Hadiah lomba.");
    await expect(list.getByRole("listitem").filter({ hasText: "Membership Pro" })).toContainText("Aktif sampai");

    await access.getByRole("button", { name: "Berikan hak akses manual" }).click();
    await user.dialog.getByRole("combobox", { name: "Item" }).selectOption({ label: "Membership Premium" });
    await user.dialog.getByRole("combobox", { name: "Durasi" }).selectOption({ label: "Tanpa batas" });
    await user.confirmWithReason("Berikan akses", "Naik paket sebagai kompensasi.");

    await expect(list).toContainText("Aktif tanpa batas");
    await expect(list).toContainText("Digantikan");
    await expect(access).toContainText("Premium");
  });
});

test.describe("Tombol aksi Moderasi", () => {
  test("berupa tombol berteks dengan nama yang menyebut akun", async ({ page }) => {
    await page.goto("/admin/moderasi");
    // Tabel di layar lebar, kartu di layar kecil; pakai yang sedang tampil.
    const row = page.getByRole("main").getByRole("row").or(page.getByRole("main").getByRole("listitem")).filter({ hasText: "Rina Kartika", visible: true }).first();

    for (const [name, text] of [
      ["Abaikan Rina Kartika", "Abaikan"],
      ["Koreksi XP Rina Kartika", "Koreksi XP"],
      ["Sembunyikan dari leaderboard: Rina Kartika", "Sembunyikan"],
    ]) {
      await expect(row.getByRole("button", { name })).toHaveText(text);
    }
  });
});

test.describe("Periode Laporan", () => {
  test("tanpa rentang tanggal ditulis sepanjang waktu, dan mengikuti rentang yang dipilih", async ({ page }) => {
    await page.goto("/admin/laporan");
    await expect(page.getByText("Periode: sepanjang waktu")).toBeVisible();
    await expect(page.getByText("Pengguna baru (sepanjang waktu)")).toBeVisible();

    await page.getByLabel("Dari tanggal").fill("2026-11-01");
    await page.getByLabel("Sampai tanggal").fill("2026-11-10");
    await expect(page.getByText("Periode: 1 Nov 2026 – 10 Nov 2026")).toBeVisible();
    await expect(page.getByText("Pengguna baru", { exact: true })).toBeVisible();
  });
});

test.describe("Pagination ringkas", () => {
  test("88 pengguna: nomor halaman diringkas dengan … dan muat satu baris di layar kecil", async ({ page, isMobile }) => {
    const users = new UsersPageObject(page);
    await users.goto();
    const pagination = page.getByRole("navigation", { name: "Halaman pengguna" });
    await expect(pagination.getByRole("button", { name: "Halaman 1", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(pagination.getByRole("button", { name: "Halaman 9", exact: true })).toBeVisible();
    await expect(pagination).toContainText("…");
    await expect(pagination.getByRole("button", { name: "Halaman 5", exact: true })).toHaveCount(0);

    await pagination.getByRole("button", { name: "Halaman 9", exact: true }).click();
    await expect(pagination.getByRole("button", { name: "Halaman 9", exact: true })).toHaveAttribute("aria-current", "page");

    if (isMobile) {
      // Tombol nomor halaman berada dalam satu baris.
      const buttons = pagination.getByRole("button").filter({ visible: true });
      const tops = await buttons.evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)));
      expect(new Set(tops).size).toBe(1);
    }
  });
});

test.describe("Tanggal transaksi memakai WIB", () => {
  // 15 Nov 2026 17.30 UTC = 16 Nov 2026 00.30 WIB: daftar dan detail harus sama-sama 16 Nov.
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-15T17:30:00Z"));
  });

  test("daftar, detail, dan filter Transaksi Hari Ini memakai tanggal yang sama", async ({ page }) => {
    const transactions = new TransactionsPageObject(page);
    await transactions.goto();
    await expect(transactions.rows.filter({ hasText: pendingTransactionId })).toContainText("16 Nov 2026");

    await page.goto("/admin/transaksi?hari=ini");
    await expect(transactions.rows.filter({ hasText: pendingTransactionId })).toBeVisible();

    const detail = new TransactionDetailPageObject(page);
    await detail.goto(pendingTransactionId);
    await expect(page.getByRole("main")).toContainText("16 Nov 2026");
  });
});
