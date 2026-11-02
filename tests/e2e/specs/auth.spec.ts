import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, ROLES } from "../fixtures/testData";
import { LoginPage } from "../pages/LoginPage";

test.describe("Fixture login", () => {
  for (const role of ROLES) {
    test.describe(role, () => {
      test.use({ role });

      test(`sesi ${role} tersimpan sehingga halaman login mengarahkan ke dashboard-nya`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await expect(page).toHaveURL(ACCOUNTS[role].home);
      });
    });
  }
});
