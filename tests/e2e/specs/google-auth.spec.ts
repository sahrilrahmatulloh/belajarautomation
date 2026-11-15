import { expect, test } from "../fixtures/auth";

// Masuk dan daftar dengan Google (PRD 4.5): tampil "Segera hadir" sampai backend tersedia.
for (const { path, label, submit } of [
  { path: "/login", label: "Masuk dengan Google", submit: "Masuk" },
  { path: "/register", label: "Daftar dengan Google", submit: "Buat Akun" },
]) {
  test.describe(`Tombol Google di ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test("tampil di bawah tombol utama form email dengan keterangan Segera hadir", async ({ page }) => {
      const button = page.getByRole("button", { name: `${label} (Segera hadir)` });

      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute("aria-disabled", "true");
      await expect(page.getByText("atau", { exact: true })).toBeVisible();

      // PRD 4.5 v2.48: tombol Google di bawah tombol utama (Masuk atau Buat Akun).
      const submitBox = (await page.getByRole("button", { name: submit, exact: true }).boundingBox())!;
      const googleBox = (await button.boundingBox())!;
      expect(googleBox.y).toBeGreaterThan(submitBox.y + submitBox.height);

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
