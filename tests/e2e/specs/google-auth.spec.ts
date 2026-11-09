import { expect, test } from "../fixtures/auth";

// Masuk dan daftar dengan Google (PRD 4.5): tampil "Segera hadir" sampai backend tersedia.
for (const { path, label } of [
  { path: "/login", label: "Masuk dengan Google" },
  { path: "/register", label: "Daftar dengan Google" },
]) {
  test.describe(`Tombol Google di ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test("tampil di atas form email dengan keterangan Segera hadir", async ({ page }) => {
      const button = page.getByRole("button", { name: `${label} (Segera hadir)` });

      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute("aria-disabled", "true");
      await expect(page.getByText("atau dengan email")).toBeVisible();

      await button.hover();
      await expect(page.getByRole("tooltip")).toHaveText("Segera hadir");
    });

    test("diklik tidak memindahkan halaman", async ({ page }) => {
      // Tombol aria-disabled tetap bisa difokus, jadi klik dikirim langsung tanpa menunggu tombol aktif.
      await page.getByRole("button", { name: `${label} (Segera hadir)` }).dispatchEvent("click");

      await expect(page).toHaveURL(path);
    });
  });
}
