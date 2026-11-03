import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, DEMO_PASSWORD, ROLES } from "../fixtures/testData";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RoleDashboardPage } from "../pages/RoleDashboardPage";

test.describe("Login sebagai tamu", () => {
  test("akun demo user masuk dan sampai di dashboard", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ACCOUNTS.user.email, DEMO_PASSWORD);

    await expect(page).toHaveURL(ACCOUNTS.user.home);
    await expect(new DashboardPage(page).greeting).toBeVisible();
  });

  test("password salah menampilkan pesan error dan tetap di halaman login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ACCOUNTS.user.email, "password-salah");

    await expect(loginPage.formError).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("isian yang diketik sebelum halaman siap tetap terpakai saat masuk", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const release = await loginPage.gotoBeforeHydration();

    await loginPage.emailInput.fill(ACCOUNTS.user.email);
    await loginPage.passwordInput.fill(DEMO_PASSWORD);
    await expect(loginPage.submitButton).toBeDisabled();

    release();
    await expect(loginPage.submitButton).toBeEnabled();
    await expect(loginPage.emailInput).toHaveValue(ACCOUNTS.user.email);

    await loginPage.submitButton.click();
    await expect(page).toHaveURL(ACCOUNTS.user.home);
  });

  test("membuka /profile tanpa login diarahkan ke halaman login", async ({ page }) => {
    await new ProfilePage(page).goto();

    await expect(page).toHaveURL("/login");
  });

  for (const role of ["creator", "reviewer", "admin"] as const) {
    test(`akun ${role} masuk ke dashboard miliknya`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(ACCOUNTS[role].email, DEMO_PASSWORD);

      await expect(page).toHaveURL(ACCOUNTS[role].home);
      await expect(new RoleDashboardPage(page, role).greeting).toBeVisible();
    });
  }
});

test.describe("Sesi tersimpan", () => {
  for (const role of ROLES) {
    test.describe(role, () => {
      test.use({ role });

      test(`halaman login mengarahkan ${role} ke dashboard miliknya`, async ({ page }) => {
        await new LoginPage(page).goto();

        await expect(page).toHaveURL(ACCOUNTS[role].home);
      });
    });
  }
});

test.describe("Logout", () => {
  test.use({ role: "user" });

  test("keluar mengembalikan pengguna ke halaman login", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.logout();

    await expect(page).toHaveURL("/login");
    await expect(new LoginPage(page).submitButton).toBeVisible();
  });
});
