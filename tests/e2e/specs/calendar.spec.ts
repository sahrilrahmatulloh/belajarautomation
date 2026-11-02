import { expect, test } from "../fixtures/auth";
import { DashboardPage } from "../pages/DashboardPage";

test.use({ role: "user" });

const ACTIVE = ", ada aktivitas belajar";

// Riwayat dummy dihitung mundur dari hari ini, jadi tanggal dibuat tetap agar hasilnya
// tidak bergantung pada hari test berjalan. 16 November 2026 di Asia/Jakarta.
test.describe("Kalender Belajar", () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-16T05:00:00Z"));
    dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.calendar).toBeVisible();
  });

  test("menandai hari yang ada di riwayat aktivitas", async () => {
    // Riwayat: aktif 0-4 hari lalu, tidak aktif 5 hari lalu, aktif lagi 6-7 hari lalu.
    await expect(dashboard.calendarDay(`16 November 2026${ACTIVE}`)).toBeVisible();
    await expect(dashboard.calendarDay(`12 November 2026${ACTIVE}`)).toBeVisible();
    await expect(dashboard.calendarDay("11 November 2026")).toBeVisible();
    await expect(dashboard.calendarDay(`10 November 2026${ACTIVE}`)).toBeVisible();
  });

  test("tidak menandai hari setelah hari ini", async () => {
    await expect(dashboard.calendarDay("17 November 2026")).toBeVisible();
  });

  test("hari di bulan sebelumnya ikut ditandai", async () => {
    await dashboard.previousMonthButton.click();

    await expect(dashboard.calendar).toContainText("Oktober 2026");
    // 28 hari lalu adalah aktivitas pertama, 29 hari lalu belum ada aktivitas.
    await expect(dashboard.calendarDay(`19 Oktober 2026${ACTIVE}`)).toBeVisible();
    await expect(dashboard.calendarDay("18 Oktober 2026")).toBeVisible();
  });

  test("memilih tanggal menampilkan ringkasan aktivitasnya", async () => {
    await expect(dashboard.calendar).toContainText(/Senin, 16 November: \d+ aktivitas, \+\d+ XP\./);

    await dashboard.calendarDay("11 November 2026").click();

    await expect(dashboard.calendar).toContainText("Rabu, 11 November: tidak ada aktivitas belajar.");

    await dashboard.calendarDay(`15 November 2026${ACTIVE}`).click();

    await expect(dashboard.calendar).toContainText("Minggu, 15 November: 1 aktivitas, +75 XP.");
  });

  test("tautan Aktivitas membuka tab Aktivitas di profil", async ({ page }) => {
    await dashboard.calendarActivityLink.click();

    await expect(page).toHaveURL("/profile?tab=aktivitas");
  });
});
