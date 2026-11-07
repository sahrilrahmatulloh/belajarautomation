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

test.describe("Splash screen", () => {
  // Context baru tanpa penanda splash dari fixture, seperti pengunjung pertama kali.
  test("tampil di kunjungan pertama, lalu tidak muncul lagi di tab baru browser yang sama", async ({ browser }, testInfo) => {
    const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL, storageState: undefined });
    const first = await context.newPage();
    // Dicek begitu halaman diterima, karena splash hilang sendiri setelah 1,8 detik.
    await first.goto("/login", { waitUntil: "commit" });
    // Splash hanya hiasan (aria-hidden), jadi dicari lewat kelasnya.
    await expect(first.locator(".splash-screen")).toBeVisible();
    await expect(first.locator(".splash-screen")).toBeHidden();

    const second = await context.newPage();
    await second.goto("/login");
    await expect(second.locator("html")).toHaveAttribute("data-splash", "seen");
    await expect(second.locator(".splash-screen")).toBeHidden();

    await context.close();
  });
});
