import { expect, test } from "../fixtures/auth";

// Banner sampul halaman fitur (PRD FR-12 v2.47): latar tema aktif, ikon, judul, dan deskripsi,
// tanpa avatar. Blog tidak memakainya karena terbuka untuk publik.
const PAGES = [
  { path: "/learn", title: "Belajar QA Automation" },
  { path: "/roadmap", title: "Roadmap" },
  { path: "/playground", title: "QA Automation Playground" },
  { path: "/leaderboard", title: "Leaderboard" },
  { path: "/ebooks", title: "eBook" },
  { path: "/projects", title: "Project" },
];

const THEME_IMAGE = 'img[src*="padang-rumput%2Fbanner.webp"]';

test.use({ role: "user" });

test.describe("Banner sampul halaman fitur", () => {
  for (const { path, title } of PAGES) {
    test(`${title} memakai banner bertema tanpa avatar`, async ({ page }) => {
      await page.goto(path);
      const heading = page.getByRole("heading", { level: 1, name: title, exact: true });
      const banner = page.getByRole("main").locator("section").filter({ has: heading });

      await expect(heading).toBeVisible();
      await expect(banner.locator(THEME_IMAGE)).toBeAttached();
      await expect(banner.locator('img[src*="%2Fprofile%2F"], img[src^="/profile/"]')).toHaveCount(0);
    });
  }

  test("keterangan fitur tersembunyi di balik ikon (i) dan tampil sebagai popup", async ({ page }) => {
    await page.goto("/roadmap");
    const description = "Pilih jalur belajar sesuai tujuan karier automation kamu.";
    const info = page.getByRole("button", { name: "Tentang Roadmap" });
    await expect(page.getByText(description)).toBeHidden();

    // Diulang bila klik terjadi sebelum halaman selesai hydrate.
    const popup = page.getByRole("dialog").filter({ hasText: description });
    await expect(async () => {
      if (!(await popup.isVisible())) await info.click();
      await expect(popup).toBeVisible({ timeout: 1_000 });
    }).toPass();

    await page.keyboard.press("Escape");
    await expect(popup).toBeHidden();
  });

  test("aturan latihan Playground hanya ada di popup (i), tanpa kotak keterangan di halaman", async ({ page }) => {
    await page.goto("/playground");
    const rule = "Latihan boleh diulang kapan saja. XP hanya diberikan saat kamu lulus untuk pertama kalinya.";
    await expect(page.getByRole("heading", { level: 1, name: "QA Automation Playground" })).toBeVisible();
    await expect(page.getByText(rule)).toBeHidden();
    await expect(page.getByRole("heading", { name: "Tempat latihan" })).toHaveCount(0);

    const info = page.getByRole("button", { name: "Tentang QA Automation Playground" });
    const popup = page.getByRole("dialog").filter({ hasText: rule });
    await expect(async () => {
      if (!(await popup.isVisible())) await info.click();
      await expect(popup).toBeVisible({ timeout: 1_000 });
    }).toPass();
    await expect(popup).toContainText("Latih skill QA dan automation melalui challenge interaktif.");
  });

  test("Blog tidak memakai banner bertema", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("main").locator(THEME_IMAGE)).toHaveCount(0);
  });
});
