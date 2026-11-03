import { expect, test } from "../fixtures/auth";
import { MAIN_PAGES, openRolePage, ROLE_PAGES } from "../fixtures/mainPages";
import { DashboardPage } from "../pages/DashboardPage";

test.use({ role: "user" });

test.describe("Layout", () => {
  test('label lingkungan "DEV" tampil', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.environmentBadge).toHaveText("DEV");
  });

  test.describe("Tanpa scroll horizontal di mobile", () => {
    test.skip(({ isMobile }) => !isMobile, "Hanya berlaku untuk ukuran mobile");

    for (const { name, open } of MAIN_PAGES) {
      test(`halaman ${name}`, async ({ page }) => {
        const pageObject = await open(page);

        await pageObject.expectNoHorizontalScroll();
      });
    }

    for (const { role, name, path } of ROLE_PAGES) {
      test.describe(name, () => {
        test.use({ role });

        test(`halaman ${name}`, async ({ page }) => {
          const pageObject = await openRolePage(page, role, path);

          await pageObject.expectNoHorizontalScroll();
        });
      });
    }
  });
});
