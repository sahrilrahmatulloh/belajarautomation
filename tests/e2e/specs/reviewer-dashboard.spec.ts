import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, REVIEWER_WORKSPACE } from "../fixtures/testData";

// Dashboard, Profil, dan Pengaturan Reviewer (PRD FR-15 Dashboard Reviewer, Profil dan Pengaturan
// Reviewer).

const { unassignedId, unassignedTitle, ownTitle } = REVIEWER_WORKSPACE;

test.use({ role: "reviewer" });

const region = (page: Page, name: string) => page.getByRole("region", { name: new RegExp(`^${name}`) });

test.describe("Dashboard Reviewer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reviewer");
    await expect(page.getByRole("heading", { level: 1, name: "Halo, Reviewer!" })).toBeVisible();
  });

  test("angka Belum Ditugaskan membuka tab Belum ditugaskan di Antrean Review", async ({ page }) => {
    await region(page, "Statistik review").getByRole("link", { name: /^Belum Ditugaskan/ }).click();
    await expect(page).toHaveURL("/reviewer/antrean?tab=belum");
    await expect(page.getByRole("button", { name: /^Belum ditugaskan/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("antrean bisa disaring, tidak memuat konten sendiri, dan konten belum ditugaskan bisa diambil", async ({ page }) => {
    const queue = page.getByRole("list", { name: "Antrean review" });
    await expect(queue).not.toContainText(ownTitle);

    await region(page, "Antrean Review").getByRole("button", { name: /^Ditugaskan ke saya/ }).click();
    await expect(queue.getByRole("button", { name: /^Ambil untuk review/ })).toHaveCount(0);
    await expect(queue.getByRole("link", { name: /^Buka review/ }).first()).toBeVisible();

    await region(page, "Antrean Review").getByRole("button", { name: /^Belum ditugaskan/ }).click();
    await expect(queue.getByRole("link", { name: /^Buka review/ })).toHaveCount(0);
    await queue.getByRole("button", { name: `Ambil untuk review ${unassignedTitle}` }).click();

    await expect(page).toHaveURL(`/reviewer/review/${unassignedId}`);
  });

  test("Hasil Review dan Keputusan per Minggu menampilkan keputusan Reviewer", async ({ page }) => {
    const result = region(page, "Hasil Review");
    await expect(result).toContainText(/Disetujui\s*\d+ \(\d+%\)/);
    await expect(result).toContainText(/Diminta revisi\s*\d+ \(\d+%\)/);

    const weekly = region(page, "Keputusan per Minggu");
    await expect(weekly.getByRole("table").getByRole("row")).toHaveCount(9);
    const chart = weekly.getByRole("img", { name: /^Jumlah keputusan review per minggu/ });
    await chart.focus();
    await expect(weekly.locator("[data-chart-tooltip]")).toContainText("diminta revisi");
  });

  test("checklist panduan dapat dibuka-tutup dan menautkan ke Panduan Review", async ({ page }) => {
    const guide = region(page, "Checklist Panduan Review");
    const items = guide.getByRole("listitem");
    await expect(items.first()).toBeVisible();
    await guide.getByText(/poin pemeriksaan$/).click();
    await expect(items.first()).toBeHidden();
    await expect(guide.getByRole("link", { name: "Buka Panduan Review lengkap" })).toHaveAttribute("href", "/reviewer/panduan");
  });

  test("di layar kecil tidak ada yang perlu digeser ke samping", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Khusus layar kecil.");
    const overflow = await page.evaluate(() => document.querySelector("main")!.scrollWidth - document.querySelector("main")!.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("Profil dan Pengaturan Reviewer", () => {
  test("mode Reviewer memakai inisial dan menu profil membuka halaman Reviewer", async ({ page }) => {
    await page.goto("/reviewer");
    const menuButton = page.getByRole("button", { name: /^Buka menu profil/ });
    await expect(menuButton.locator("[data-admin-initials]")).toHaveText("RP");
    await menuButton.click();
    const menu = page.getByRole("navigation", { name: "Menu profil" });
    await expect(menu.getByRole("link", { name: "Profil" })).toHaveAttribute("href", "/reviewer/profil");
    await expect(menu.getByRole("link", { name: "Pengaturan" })).toHaveAttribute("href", "/reviewer/pengaturan");
  });

  test("Profil Reviewer memuat info akun, aktivitas review, dan keputusan terakhir tanpa XP", async ({ page }) => {
    await page.goto("/reviewer/profil");
    await expect(page.getByRole("heading", { level: 1, name: ACCOUNTS.reviewer.name })).toBeVisible();
    await expect(page.getByRole("region", { name: "Info Akun" })).toContainText(ACCOUNTS.reviewer.email);
    const stats = page.getByRole("region", { name: "Aktivitas Review" });
    await expect(stats.getByRole("heading", { level: 3 })).toHaveText(["Direview", "Disetujui", "Diminta Revisi", "Sedang Ditugaskan"]);
    await expect(page.getByRole("region", { name: "Keputusan Terakhir" }).getByRole("listitem").first()).toBeVisible();
    await expect(page.getByRole("main")).not.toContainText(/\bXP\b|Rank/);
  });

  test("Pengaturan Reviewer tanpa verifikasi dua langkah dan bagian pelajar; notifikasi diingat", async ({ page }) => {
    await page.goto("/reviewer/pengaturan");
    await expect(page.getByRole("heading", { level: 1, name: "Pengaturan Reviewer" })).toBeVisible();
    await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText(["Informasi Akun", "Keamanan", "Notifikasi Reviewer", "Tampilan"]);
    await expect(page.getByRole("main")).not.toContainText(/Verifikasi dua langkah|Hapus Akun|Profil dapat dilihat publik/);

    const assigned = page.getByRole("checkbox", { name: /Konten baru ditugaskan kepadaku/ });
    await expect(assigned).toBeChecked();
    await assigned.uncheck();
    await page.reload();
    await expect(page.getByRole("checkbox", { name: /Konten baru ditugaskan kepadaku/ })).not.toBeChecked();
  });
});
