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

  test("empat angka utama membuka Konten Saya yang tersaring", async ({ page }) => {
    await expect(dashboard.statTitles).toHaveText([...CREATOR_DASHBOARD.statLabels]);
    await expect(dashboard.statValue("Total Konten")).toHaveText(String(CREATOR_DASHBOARD.total));

    await dashboard.stats.getByRole("link", { name: /^Perlu Revisi/ }).click();
    await expect(page).toHaveURL("/creator/konten?status=perlu-revisi");
    await expect(page.getByRole("button", { name: /^Perlu Revisi \(2\)/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("Alur Konten memuat lima tahap yang jumlahnya sama dengan total konten", async () => {
    await expect(dashboard.flowItems).toHaveCount(5);
    const counts = await Promise.all(CREATOR_DASHBOARD.stageLabels.map(async (label) => Number((await dashboard.flowCount(label).innerText()).replace(/\D/g, ""))));
    expect(counts.reduce((sum, value) => sum + value, 0)).toBe(CREATOR_DASHBOARD.total);
    // Memakai istilah Draf, bukan Draft.
    await expect(dashboard.flow).not.toContainText("Draft");
  });

  test("grafik konten dibuat per minggu memiliki tabel data 8 minggu", async () => {
    await expect(dashboard.weekly.getByRole("table").getByRole("row")).toHaveCount(9);
    await expect(dashboard.weekly.getByRole("img", { name: /^Jumlah konten yang dibuat per minggu/ })).toBeVisible();
  });

  test("Perlu Dikerjakan memuat revisi dengan progres catatan, lalu draf", async ({ page }) => {
    const items = dashboard.todo.getByRole("listitem");
    await expect(items).toHaveCount(CREATOR_DASHBOARD.openRevisionCount + 2);
    await expect(items.first()).toContainText(CREATOR_DASHBOARD.needsRevisionTitle);
    await expect(items.first()).toContainText(/\d+ dari \d+ catatan selesai/);
    await expect(dashboard.todo.getByRole("link", { name: new RegExp(CREATOR_DASHBOARD.draftTitle) })).toHaveAttribute("href", /\/creator\/buat\/artikel\?konten=/);

    await items.first().getByRole("link").click();
    await expect(page).toHaveURL(/\/creator\/revisi\//);
  });

  test("Konten Terbaru menampilkan lima konten dengan status dan membuka detail", async ({ page }) => {
    await expect(dashboard.recent).toHaveCount(5);
    await dashboard.recent.first().getByRole("link").click();
    await expect(page).toHaveURL(/\/creator\/konten\/[^/?]+$/);
  });

  test("di layar kecil tidak ada tabel yang perlu digeser ke samping", async ({ isMobile }) => {
    test.skip(!isMobile, "Khusus layar kecil.");
    await expect(dashboard.createButton).toBeVisible();
    await dashboard.expectNoHorizontalScroll();
  });
});

test.describe("Profil dan Pengaturan Creator", () => {
  test("mode Creator memakai inisial, bukan avatar, dan menu profil membuka halaman Creator", async ({ page }) => {
    await page.goto("/creator");
    const menuButton = page.getByRole("button", { name: /^Buka menu profil/ });
    await expect(menuButton.locator("[data-admin-initials]")).toHaveText("AP");
    await expect(menuButton.locator("img")).toHaveCount(0);
    await menuButton.click();
    const menu = page.getByRole("navigation", { name: "Menu profil" });
    await expect(menu.getByRole("link", { name: "Profil" })).toHaveAttribute("href", "/creator/profil");
    await expect(menu.getByRole("link", { name: "Pengaturan" })).toHaveAttribute("href", "/creator/pengaturan");
  });

  test("Profil Creator tanpa foto memuat konten per status dan konten terbit", async ({ page }) => {
    await page.goto("/creator/profil");
    await expect(page.getByText("Profil Creator", { exact: true })).toBeVisible();
    await expect(page.getByRole("main").locator("img")).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Konten per Status" }).getByRole("heading", { level: 3 })).toHaveText([...CREATOR_DASHBOARD.stageLabels]);
    await expect(page.getByRole("region", { name: "Konten Terbit" }).getByRole("listitem")).toHaveCount(1);
  });

  test("Pengaturan Creator memuat notifikasi konten dan pilihan diingat", async ({ page }) => {
    await page.goto("/creator/pengaturan");
    await expect(page.getByRole("heading", { level: 1, name: "Pengaturan Creator" })).toBeVisible();
    await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText(["Informasi Akun", "Keamanan", "Notifikasi Creator", "Tampilan"]);
    await expect(page.getByRole("main")).not.toContainText(/Verifikasi dua langkah|Hapus Akun/);

    const revision = page.getByRole("checkbox", { name: /Konten diminta revisi/ });
    await revision.uncheck();
    await page.reload();
    await expect(page.getByRole("checkbox", { name: /Konten diminta revisi/ })).not.toBeChecked();
  });
});

test("data dummy bisa direset dari Pengaturan", async ({ page }) => {
  const settings = new SettingsPage(page);
  await settings.goto();
  const section = page.getByRole("region", { name: "Data Dummy" });

  await section.getByRole("button", { name: "Reset data dummy" }).click();

  await expect(section.getByRole("status")).toHaveText("Data dummy sudah direset.");
});

test("judul halaman pengaturan memakai Bahasa Indonesia", async ({ page }) => {
  const settings = new SettingsPage(page);
  await settings.goto();

  await expect(page.getByRole("heading", { level: 1, name: "Pengaturan" })).toBeVisible();
});
