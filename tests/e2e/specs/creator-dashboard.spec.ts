import { expect, test } from "../fixtures/auth";
import { CREATOR_DASHBOARD } from "../fixtures/testData";
import { CreatorDashboardPage } from "../pages/CreatorDashboardPage";
import { SettingsPage } from "../pages/SettingsPage";

test.use({ role: "creator" });

test.describe("Dashboard Creator", () => {
  let dashboard: CreatorDashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new CreatorDashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.greeting).toBeVisible();
  });

  test("banner pratinjau tampil di DEV", async () => {
    await expect(dashboard.previewNotice).toBeVisible();
  });

  test("kartu statistik mengikuti alur konten dan memakai istilah Draf", async () => {
    await expect(dashboard.statTitles).toHaveText([...CREATOR_DASHBOARD.statLabels]);
  });

  test("jumlah di kartu statistik sama dengan total konten", async () => {
    const values = await Promise.all(
      CREATOR_DASHBOARD.statLabels.map((label) => dashboard.statValue(label).innerText())
    );
    const total = values.reduce((sum, value) => sum + Number(value), 0);

    await expect(dashboard.contentRows).toHaveCount(total);
  });

  test("catatan revisi hanya untuk konten berstatus Perlu Revisi", async () => {
    await expect(dashboard.revisionNotes).toHaveCount(1);
    await expect(dashboard.revisionNotes.first()).toContainText(CREATOR_DASHBOARD.needsRevisionTitle);
    await expect(dashboard.contentRow(CREATOR_DASHBOARD.needsRevisionTitle)).toContainText("Perlu Revisi");
  });

  test("status konten memakai istilah Draf", async () => {
    await expect(dashboard.contentRow(CREATOR_DASHBOARD.draftTitle)).toContainText("Draf");
    await expect(dashboard.contentRows.filter({ hasText: "Draft" })).toHaveCount(0);
  });
});

test("judul halaman pengaturan memakai Bahasa Indonesia", async ({ page }) => {
  const settings = new SettingsPage(page);
  await settings.goto();

  await expect(page.getByRole("heading", { level: 1, name: "Pengaturan" })).toBeVisible();
});
