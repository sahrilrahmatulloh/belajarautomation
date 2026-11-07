import { expect, test } from "../fixtures/auth";
import { BlogPage } from "../pages/BlogPage";

// proxy.ts menyegarkan sesi Supabase (docs/DATABASE.md Bagian 4.1, PRD 8.2).
// Tamu tanpa cookie sesi tidak boleh memicu panggilan ke Supabase, dan cookie
// sesi yang rusak tidak boleh membuat halaman gagal dimuat.
test.describe("Sesi Supabase di proxy", () => {
  test("tamu membuka halaman publik tanpa menerima cookie sesi", async ({ page }) => {
    const blog = new BlogPage(page);

    const response = await page.goto("/blog");

    expect(response?.status()).toBe(200);
    const setCookie = (await response?.headerValue("set-cookie")) ?? "";
    expect(setCookie).not.toContain("sb-");
    await expect(blog.heading).toBeVisible();
  });

  test("cookie sesi yang rusak tidak membuat halaman gagal dimuat", async ({ page, context, baseURL }) => {
    await context.addCookies([
      { name: "sb-uji-auth-token", value: "bukan-token-yang-valid", url: baseURL ?? "http://localhost:3000" },
    ]);
    const blog = new BlogPage(page);

    const response = await page.goto("/blog");

    expect(response?.status()).toBe(200);
    await expect(blog.heading).toBeVisible();
  });
});
