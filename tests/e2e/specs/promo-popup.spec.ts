import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, ACTIVE_PROMO_TITLE, DEMO_PASSWORD } from "../fixtures/testData";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";

// Popup promosi di tengah layar setelah login (PRD 4.7).
test.use({ showPromo: true });

async function loginAs(page: import("@playwright/test").Page, role: keyof typeof ACCOUNTS) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(ACCOUNTS[role].email, DEMO_PASSWORD);
  await expect(page).toHaveURL(ACCOUNTS[role].home);
}

function promoDialog(page: import("@playwright/test").Page) {
  return page.getByRole("dialog", { name: ACTIVE_PROMO_TITLE });
}

test.describe("Popup promosi setelah login", () => {
  test("tampil setelah login, dan Nanti saja menutupnya tanpa muncul lagi saat pindah halaman", async ({ page }) => {
    await loginAs(page, "user");

    const dialog = promoDialog(page);
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Nanti saja" }).click();
    await expect(dialog).toBeHidden();

    await page.goto("/leaderboard");
    await expect(page.getByRole("heading", { level: 1, name: "Leaderboard" })).toBeVisible();
    await expect(promoDialog(page)).toHaveCount(0);
  });

  test("muncul lagi di login berikutnya bila hanya ditutup", async ({ page }) => {
    await loginAs(page, "user");
    await promoDialog(page).getByRole("button", { name: "Nanti saja" }).click();
    await new DashboardPage(page).logout();

    await loginAs(page, "user");

    await expect(promoDialog(page)).toBeVisible();
  });

  test("Jangan tampilkan lagi membuatnya tidak muncul di login berikutnya", async ({ page }) => {
    await loginAs(page, "user");
    await promoDialog(page).getByRole("button", { name: "Jangan tampilkan lagi" }).click();
    await expect(promoDialog(page)).toBeHidden();
    await new DashboardPage(page).logout();

    await loginAs(page, "user");

    await expect(new DashboardPage(page).greeting).toBeVisible();
    await expect(promoDialog(page)).toHaveCount(0);
  });

  test("tombol ajakan membuka halaman tujuan", async ({ page }) => {
    await loginAs(page, "user");

    await promoDialog(page).getByRole("link", { name: "Pasang tema" }).click();

    await expect(page).toHaveURL("/profile?tab=kustomisasi");
    await expect(promoDialog(page)).toHaveCount(0);
  });

  test("tidak tampil di mode peran", async ({ page }) => {
    await loginAs(page, "creator");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(promoDialog(page)).toHaveCount(0);
  });
});

test.describe("Tanpa login lewat form", () => {
  test.use({ role: "user" });

  test("membuka halaman dengan sesi yang sudah ada tidak menampilkan popup", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.greeting).toBeVisible();
    await expect(promoDialog(page)).toHaveCount(0);
  });
});
