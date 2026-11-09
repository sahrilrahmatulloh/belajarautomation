import { expect, test } from "../fixtures/auth";
import { USER_RANK } from "../fixtures/testData";
import { DashboardPage } from "../pages/DashboardPage";

test.use({ role: "user" });

test.describe("Dashboard", () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.goto();
  });

  test("statistik belajar tampil di atas kalender belajar", async () => {
    await expect(dashboard.stats).toBeVisible();
    await expect(dashboard.calendar).toBeVisible();

    const statsBox = await dashboard.stats.boundingBox();
    const calendarBox = await dashboard.calendar.boundingBox();
    expect(statsBox!.y).toBeLessThan(calendarBox!.y);
  });

  test("Welcome Banner menampilkan sapaan tanpa kutipan motivasi", async () => {
    await expect(dashboard.greeting).toContainText("Sobat QA");
    await expect(dashboard.welcomeBanner.locator("blockquote")).toHaveCount(0);
    await expect(dashboard.welcomeBanner).not.toContainText(/["“”]/);
  });

  test("kartu Rank & XP menampilkan nama rank dan emblem", async () => {
    await expect(dashboard.rankCard.getByRole("heading", { name: USER_RANK })).toBeVisible();
    await expect(dashboard.rankEmblem).toBeVisible();
    await expect(dashboard.rankCard).toContainText("XP");
  });

  test("Lanjutkan Belajar menampilkan sampul dan tombol menuju halaman course", async ({ page }) => {
    await expect(dashboard.continueCover).toBeVisible();

    await dashboard.continueButton.click();

    await expect(page).toHaveURL(/\/learn\/[a-z0-9-]+$/);
  });
});
