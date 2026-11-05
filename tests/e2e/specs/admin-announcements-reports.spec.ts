import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS } from "../fixtures/testData";
import { AnnouncementsPageObject, AuditLogPageObject, ReportsPageObject, switchAccount, TransactionDetailPageObject } from "../pages/AdminPages";
import { NotificationsPage } from "../pages/NotificationsPage";

test.use({ role: "admin" });

const openNotifications = async (page: Page, email: string, home: string) => {
  await switchAccount(page, email);
  await expect(page).toHaveURL(home);
  await page.goto("/notifications");
  const notifications = new NotificationsPage(page);
  await expect(notifications.entries.first()).toBeVisible();
  return notifications;
};

test.describe("Pengumuman", () => {
  let announcements: AnnouncementsPageObject;

  test.beforeEach(async ({ page }) => {
    announcements = new AnnouncementsPageObject(page);
    await announcements.goto();
    await expect(announcements.heading).toBeVisible();
  });

  test("pratinjau mengikuti isian sebelum dikirim", async () => {
    await expect(announcements.preview).toContainText("Judul pengumuman");

    await announcements.fill("Maintenance malam ini", "Situs tidak tersedia pukul 22.00.");
    await announcements.group.selectOption({ label: "Akun dan sistem" });

    await expect(announcements.preview).toContainText("Maintenance malam ini");
    await expect(announcements.preview).toContainText("Situs tidak tersedia pukul 22.00.");
    await expect(announcements.preview).toContainText("Akun dan sistem");
  });

  test("tautan luar ditolak dengan pesan jelas", async ({ page }) => {
    await announcements.fill("Tautan luar", "Isi.");
    await announcements.href.fill("https://contoh.com");

    await announcements.sendNow.click();
    await announcements.dialog.getByRole("button", { name: "Kirim", exact: true }).click();

    await expect(page.getByRole("alert").filter({ hasText: "harus halaman internal" })).toBeVisible();
    await expect(announcements.row("Tautan luar")).toHaveCount(0);
  });

  test("pengumuman ke peran tertentu hanya diterima akun dengan peran itu", async ({ page }) => {
    const title = "Khusus Reviewer";
    await announcements.fill(title, "Panduan review diperbarui.");
    await announcements.group.selectOption({ label: "Akun dan sistem" });
    await announcements.href.fill("/reviewer");
    await announcements.targetRole("Reviewer");
    await announcements.send();
    await expect(announcements.row(title)).toContainText("Terkirim");

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.rows.filter({ hasText: "Kirim pengumuman" })).toContainText(title);

    const reviewer = await openNotifications(page, ACCOUNTS.reviewer.email, "/reviewer");
    await expect(reviewer.item(title)).toBeVisible();

    const creator = await openNotifications(page, ACCOUNTS.creator.email, "/creator");
    await expect(creator.item(title)).toHaveCount(0);

    const learner = await openNotifications(page, ACCOUNTS.user.email, ACCOUNTS.user.home);
    await expect(learner.item(title)).toHaveCount(0);
  });

  test("target membership hanya diterima pemilik paket itu", async ({ page }) => {
    const title = "Khusus Premium";
    await announcements.fill(title, "Benefit baru.");
    await announcements.group.selectOption({ label: "Akun dan sistem" });
    await announcements.target.selectOption({ label: "Membership tertentu" });
    await page.getByRole("combobox", { name: "Membership" }).selectOption({ label: "Premium" });
    await announcements.send();

    const premium = await openNotifications(page, ACCOUNTS.reviewer.email, "/reviewer");
    await expect(premium.item(title)).toBeVisible();

    const basic = await openNotifications(page, ACCOUNTS.user.email, ACCOUNTS.user.home);
    await expect(basic.item(title)).toHaveCount(0);
  });

  test("grup Konten baru mengikuti filter mode: tidak tampil di mode peran", async ({ page }) => {
    const title = "Pengumuman Konten Uji";
    await announcements.fill(title, "Coba course terbaru.");
    await announcements.href.fill("/learn");
    await announcements.send();

    const learner = await openNotifications(page, ACCOUNTS.user.email, ACCOUNTS.user.home);
    await expect(learner.item(title)).toBeVisible();
    await learner.item(title).click();
    await expect(page).toHaveURL("/learn");

    const creator = await openNotifications(page, ACCOUNTS.creator.email, "/creator");
    await expect(creator.item(title)).toHaveCount(0);
  });

  test("preferensi notifikasi berlaku: grup yang dimatikan tidak tampil", async ({ page }) => {
    const title = "Latihan baru";
    await announcements.fill(title, "Coba latihan terbaru.");
    await announcements.send();

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    await page.evaluate(() => window.localStorage.setItem("belajarautomation-notification-preferences", JSON.stringify({ mutedGroups: ["content"], email: false })));
    await page.goto("/notifications");
    const notifications = new NotificationsPage(page);
    await expect(notifications.entries.first()).toBeVisible();

    await expect(notifications.item(title)).toHaveCount(0);
  });

  test("pengumuman terjadwal yang dibatalkan tidak terkirim, dan yang lain terkirim saat diproses", async ({ page }) => {
    const future = new Date(Date.now() + 86_400_000).toISOString().slice(0, 16);

    for (const title of ["Jadwal Dibatalkan", "Jadwal Dilanjutkan"]) {
      await announcements.fill(title, "Isi.");
      await announcements.group.selectOption({ label: "Akun dan sistem" });
      await announcements.schedule.check();
      await page.getByLabel("Waktu kirim").fill(future);
      await page.getByRole("button", { name: "Jadwalkan Pengumuman" }).click();
      await expect(announcements.row(title)).toContainText("Terjadwal");
    }

    await announcements.row("Jadwal Dibatalkan").getByRole("button", { name: "Batalkan Jadwal Dibatalkan" }).click();
    await announcements.dialog.getByRole("button", { name: "Batalkan pengumuman" }).click();
    await expect(announcements.row("Jadwal Dibatalkan")).toContainText("Dibatalkan");

    const before = await openNotifications(page, ACCOUNTS.user.email, ACCOUNTS.user.home);
    await expect(before.item("Jadwal Dilanjutkan")).toHaveCount(0);

    await switchAccount(page, ACCOUNTS.admin.email);
    await expect(page).toHaveURL("/admin");
    await announcements.goto();
    await announcements.process.click();
    await expect(page.getByRole("status").filter({ hasText: "1 pengumuman terjadwal terkirim." })).toBeVisible();
    await expect(announcements.row("Jadwal Dilanjutkan")).toContainText("Terkirim");
    await expect(announcements.row("Jadwal Dibatalkan")).toContainText("Dibatalkan");

    const after = await openNotifications(page, ACCOUNTS.user.email, ACCOUNTS.user.home);
    await expect(after.item("Jadwal Dilanjutkan")).toBeVisible();
    await expect(after.item("Jadwal Dibatalkan")).toHaveCount(0);
  });

  test("draf tersimpan di riwayat, bisa diubah, lalu dikirim", async ({ page }) => {
    await announcements.fill("Draf Pengumuman", "");
    await announcements.saveDraft.click();
    await expect(announcements.row("Draf Pengumuman")).toContainText("Draf");

    await announcements.row("Draf Pengumuman").getByRole("button", { name: "Ubah Draf Pengumuman" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Ubah Draf" })).toBeVisible();
    await announcements.body.fill("Isi lengkap.");
    await announcements.send();

    await expect(announcements.history).toHaveCount(1);
    await expect(announcements.row("Draf Pengumuman")).toContainText("Terkirim");
  });
});

test.describe("Laporan", () => {
  let reports: ReportsPageObject;

  test.beforeEach(async ({ page }) => {
    reports = new ReportsPageObject(page);
    await reports.goto();
    await expect(reports.heading).toBeVisible();
  });

  test("angka mengikuti data, bukan ditulis tangan", async ({ page }) => {
    const pro = reports.sales.filter({ hasText: "Membership Pro" });
    await expect(pro).toBeVisible();
    const sold = async () => Number((await pro.innerText()).match(/Membership Pro\s*(?:Terjual\s*)?(\d+)/)?.[1]);
    const before = await sold();

    const detail = new TransactionDetailPageObject(page);
    await detail.goto("trx-sobat-pro");
    await detail.gatewayButton("Berhasil").click();
    await expect(detail.timeline.first()).toContainText("Berhasil");

    await reports.goto();
    await expect(pro).toBeVisible();
    expect(await sold()).toBe(before + 1);
  });

  test("filter rentang tanggal tersimpan di alamat dan menyaring laporan", async ({ page }) => {
    await expect(reports.stat("Pengguna baru")).not.toHaveText("0");

    await page.getByLabel("Sampai tanggal").fill("2000-01-01");

    await expect(page).toHaveURL(/sampai=2000-01-01/);
    await expect(reports.stat("Pengguna baru")).toHaveText("0");
    await expect(page.getByText("Belum ada penjualan pada rentang ini.")).toBeVisible();
    await expect(page.getByText("Belum ada konten terbit pada rentang ini.")).toBeVisible();
  });

  test("ekspor CSV berisi kolom yang benar dan angka yang sama dengan halaman", async ({ page }) => {
    const newUsers = await reports.stat("Pengguna baru").innerText();

    const [download] = await Promise.all([page.waitForEvent("download"), reports.exportButton.click()]);

    expect(download.suggestedFilename()).toBe("laporan-belajarautomation.csv");
    const lines = readFileSync(await download.path(), "utf8").replace(/^﻿/, "").split("\r\n");
    expect(lines[0]).toBe("Bagian,Nama,Jumlah,Nominal");
    expect(lines[1]).toBe(`Pengguna,Pengguna baru,${newUsers},`);
    expect(lines.some((line) => line.startsWith("Penjualan,Membership Pro,"))).toBe(true);
    expect(lines.some((line) => line.startsWith("Konten terbit,"))).toBe(true);
  });
});

test.describe("Aksesibilitas", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("dialog kirim pengumuman tanpa pelanggaran", async ({ page }) => {
        const announcements = new AnnouncementsPageObject(page);
        await announcements.goto();
        await announcements.fill("Uji", "Isi.");
        await announcements.sendNow.click();
        await expect(announcements.dialog).toBeVisible();

        const { violations } = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();

        expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
      });
    });
  }
});
