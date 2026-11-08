import { expect, test } from "../fixtures/auth";
import { LoginPage } from "../pages/LoginPage";

// Panel promosi bergeser di halaman masuk dan daftar (PRD 4.5). Hanya desktop.

function showcase(page: import("@playwright/test").Page) {
  const root = page.getByRole("region", { name: "Promosi belajarautomation.com" });
  return {
    root,
    dot: (n: number) => root.getByRole("button", { name: new RegExp(`^Slide ${n}:`) }),
    pauseButton: root.getByRole("button", { name: "Jeda slide" }),
    playButton: root.getByRole("button", { name: "Putar slide" }),
  };
}

test.describe("Panel promosi halaman masuk (desktop)", () => {
  test.skip(({ isMobile }) => isMobile, "Panel promosi hanya tampil di desktop");

  test("berisi 3 slide dengan titik navigasi dan tombol jeda", async ({ page }) => {
    await new LoginPage(page).goto();
    const panel = showcase(page);

    await expect(panel.root).toBeVisible();
    await expect(panel.root.getByRole("button", { name: /^Slide \d:/ })).toHaveCount(3);
    await expect(panel.dot(1)).toHaveAttribute("aria-current", "true");
    await expect(panel.root.getByText("Belajar QA Automation dari nol hingga siap kerja.")).toBeVisible();
    await expect(panel.pauseButton).toBeVisible();
  });

  test("bergeser sendiri setiap 6 detik", async ({ page }) => {
    await page.clock.install();
    await new LoginPage(page).goto();
    const panel = showcase(page);
    await expect(panel.dot(1)).toHaveAttribute("aria-current", "true");
    // Tombol jeda baru tampil setelah halaman siap; timer pergeseran dipasang saat itu.
    await expect(panel.pauseButton).toBeVisible();

    await page.clock.fastForward(6100);
    await expect(panel.dot(2)).toHaveAttribute("aria-current", "true");
    await expect(panel.root.getByText(/avatar kucing untuk profilmu/)).toBeVisible();
  });

  test("titik navigasi membuka slide yang dipilih", async ({ page }) => {
    await new LoginPage(page).goto();
    const panel = showcase(page);

    await panel.dot(3).click();

    await expect(panel.dot(3)).toHaveAttribute("aria-current", "true");
    await expect(panel.root.getByText("eBook praktis untuk QA Engineer.")).toBeVisible();
  });

  test("tombol jeda menghentikan pergeseran otomatis", async ({ page }) => {
    await page.clock.install();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const panel = showcase(page);

    await panel.pauseButton.click();
    await expect(panel.playButton).toBeVisible();
    // Pindahkan fokus dan mouse keluar panel agar yang menahan hanya tombol jeda.
    await loginPage.emailInput.click();
    await page.clock.fastForward(13000);

    await expect(panel.dot(1)).toHaveAttribute("aria-current", "true");
  });

  test("bisa digeser dengan menarik slide", async ({ page }) => {
    await new LoginPage(page).goto();
    const box = (await showcase(page).root.boundingBox())!;
    const y = box.y + box.height / 2;

    await page.mouse.move(box.x + box.width * 0.7, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, y, { steps: 5 });
    await page.mouse.up();

    await expect(showcase(page).dot(2)).toHaveAttribute("aria-current", "true");
  });

  test.describe("dengan pengaturan kurangi gerakan", () => {
    test.use({ reducedMotion: "reduce" });

    test("tidak bergeser sendiri dan tidak ada tombol jeda", async ({ page }) => {
      await page.clock.install();
      await new LoginPage(page).goto();
      const panel = showcase(page);
      await expect(panel.root).toBeVisible();

      await page.clock.fastForward(13000);

      await expect(panel.dot(1)).toHaveAttribute("aria-current", "true");
      await expect(panel.pauseButton).toHaveCount(0);
    });
  });
});

test.describe("Panel promosi di HP", () => {
  test.skip(({ isMobile }) => !isMobile, "Hanya untuk ukuran mobile");

  test("tidak ditampilkan agar form tetap di atas", async ({ page }) => {
    await new LoginPage(page).goto();

    await expect(page.getByRole("region", { name: "Promosi belajarautomation.com" })).toBeHidden();
  });
});
