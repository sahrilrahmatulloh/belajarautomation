import { expect, test } from "../fixtures/auth";
import { ProfilePage } from "../pages/ProfilePage";

test.use({ role: "user" });

test.describe("Tab Ringkasan profil", () => {
  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profile = new ProfilePage(page);
    await profile.goto();
  });

  test("statistik sama dengan riwayat aktivitas akun demo", async () => {
    const stats = profile.stats.getByRole("article");

    await expect(stats.filter({ hasText: "Total XP" })).toContainText("420");
    await expect(stats.filter({ hasText: "Materi Selesai" })).toContainText("19");
    await expect(stats.filter({ hasText: "Challenge Selesai" })).toContainText("2");
    await expect(stats.filter({ hasText: "Achievement" })).toContainText("7");
  });

  test("kartu Achievement menampilkan persentase dan 3 badge terbaru, lalu menuju tab Pencapaian", async ({ page }) => {
    await expect(profile.achievementCard).toContainText("58%");
    await expect(profile.achievementCard).toContainText("Tercapai7");
    await expect(profile.achievementCard).toContainText("Belum Tercapai5");
    await expect(profile.achievementCard.getByRole("listitem")).toHaveText([/./, /./, /./, /\+4/]);

    await profile.achievementCard.getByRole("link", { name: "Achievement" }).click();

    await expect(page).toHaveURL(/[?&]tab=pencapaian/);
    await expect(profile.tab("Pencapaian")).toHaveAttribute("aria-selected", "true");
  });

  test("Progress Rank menampilkan rank saat ini, rank berikutnya, dan sisa XP", async () => {
    await expect(profile.rankProgress.getByRole("img", { name: /^Emblem rank / })).toHaveCount(2);
    await expect(profile.rankProgress).toContainText("Apprentice(Saat ini)");
    await expect(profile.rankProgress).toContainText("Practitioner(Berikutnya)");
    await expect(profile.rankProgress).toContainText("420 / 1.000 XP");
    await expect(profile.rankProgress).toContainText("580 XP lagi");
    await expect(profile.rankProgress.getByRole("link", { name: "Lihat detail rank" })).toHaveAttribute("href", "/rank");
  });

  test("Progres XP berakhir di total XP, dengan periode 30 hari bawaan yang dapat diganti", async () => {
    await expect(profile.xpPeriodSelect).toHaveValue("30");
    await expect(profile.xpProgress).toContainText("420 XP");
    await expect(profile.xpProgress).toContainText(/menjadi 420 dalam 30 hari terakhir/);

    await profile.xpPeriodSelect.selectOption({ label: "7 Hari" });

    await expect(profile.xpProgress).toContainText(/menjadi 420 dalam 7 hari terakhir/);
  });

  test("Aktivitas Terbaru menampilkan 3 aktivitas dan menuju tab Aktivitas", async ({ page }) => {
    await expect(profile.recentActivity.getByRole("listitem")).toHaveCount(3);

    await profile.recentActivity.getByRole("link", { name: "Lihat semua" }).click();

    await expect(page).toHaveURL(/[?&]tab=aktivitas/);
    await expect(profile.tab("Aktivitas")).toHaveAttribute("aria-selected", "true");
  });

  test("progres per course dan roadmap tidak lagi ditampilkan di profil", async ({ page }) => {
    await expect(profile.rankProgress).toBeVisible();

    await expect(page.getByRole("heading", { name: "Progres Belajar" })).toHaveCount(0);
  });
});

test.describe("Tab Aktivitas", () => {
  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profile = new ProfilePage(page);
    await profile.gotoTab("aktivitas");
    await expect(profile.activityRows.first()).toBeVisible();
  });

  test("menampilkan ringkasan periode, grafik XP, dan heatmap", async () => {
    await expect(profile.activitySummary).toContainText("Ringkasan 30 hari terakhir");
    await expect(profile.xpChart).toBeVisible();
    await expect(profile.heatmap.getByRole("listitem")).toHaveCount(30);
  });

  test("filter jenis dan periode bekerja dan tersimpan di URL", async ({ page }) => {
    await profile.activityTypeChip("Challenge").click();

    await expect(profile.activityRows).toHaveCount(2);
    await expect(page).toHaveURL(/[?&]jenis=challenge/);

    await profile.activityPeriodChip("7 hari").click();

    await expect(profile.activityRows).toHaveCount(1);
    await expect(profile.activityRows).toContainText("Playwright Locator");
    await expect(profile.activitySummary).toContainText("Ringkasan 7 hari terakhir");
    await expect(page).toHaveURL(/[?&]periode=7/);

    await page.reload();

    await expect(profile.activityTypeChip("Challenge")).toHaveAttribute("aria-pressed", "true");
    await expect(profile.activityRows).toHaveCount(1);
  });
});

test.describe("Tab Pencapaian", () => {
  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profile = new ProfilePage(page);
    await profile.gotoTab("pencapaian");
    await expect(profile.achievementTotal).toBeVisible();
  });

  test("menampilkan total dan progres achievement bertahap", async () => {
    await expect(profile.achievementTotal).toContainText("7 / 12");
    await expect(profile.achievementSection("Diperoleh")).toContainText("First Steps");
    await expect(profile.achievementProgress("Rajin Belajar")).toHaveAttribute("aria-valuenow", "19");
  });

  test("filter kategori bekerja dan tersimpan di URL", async ({ page }) => {
    await profile.achievementCategoryChip("Testing").click();

    await expect(page).toHaveURL(/[?&]kategori=testing/);
    await expect(profile.achievementSection("Diperoleh")).toContainText("Bug Hunter");
    await expect(profile.achievementSection("Diperoleh")).not.toContainText("First Steps");

    await page.reload();

    await expect(profile.achievementCategoryChip("Testing")).toHaveAttribute("aria-pressed", "true");
    await expect(profile.achievementTotal).toContainText("7 / 12");
  });
});
