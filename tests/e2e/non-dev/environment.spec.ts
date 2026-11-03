import { expect, test } from "../fixtures/auth";
import { BLOG } from "../fixtures/testData";
import { BlogPage } from "../pages/BlogPage";
import { LoginPage } from "../pages/LoginPage";
import { RoleDashboardPage } from "../pages/RoleDashboardPage";

test.describe("Halaman login di luar DEV", () => {
  test("akun dan password demo tidak tampil", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.submitButton).toBeEnabled();

    await expect(loginPage.demoAccounts).toBeHidden();
    await expect(page.getByText("demo1234")).toHaveCount(0);
  });
});

test.describe("Dashboard peran di luar DEV", () => {
  test.use({ role: "creator" });

  test("banner pratinjau tidak tampil", async ({ page }) => {
    const dashboard = new RoleDashboardPage(page, "creator");
    await dashboard.goto();
    await expect(dashboard.greeting).toBeVisible();

    await expect(dashboard.previewNotice).toBeHidden();
  });
});

test.describe("Lingkungan UAT", () => {
  test('label lingkungan bertuliskan "UAT"', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.environmentBadge).toHaveText("UAT");
  });

  test("artikel draf tidak tampil dan menghasilkan 404", async ({ page }) => {
    const blog = new BlogPage(page);
    await blog.goto();

    await expect(blog.main.getByRole("heading", { name: "Belum ada artikel" })).toBeVisible();
    await expect(blog.draftBadges).toHaveCount(0);

    const response = await page.goto(`/blog/${BLOG.article.slug}`);
    expect(response?.status()).toBe(404);
  });

  test("halaman pratinjau video tidak tersedia", async ({ page }) => {
    const response = await page.goto("/dev/video-referensi");

    expect(response?.status()).toBe(404);
  });

  test("halaman tetap noindex", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  });
});
