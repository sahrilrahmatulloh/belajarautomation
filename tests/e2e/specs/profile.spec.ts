import { expect, test } from "../fixtures/auth";
import { ACTIVE_AVATAR_NAME, ACTIVE_THEME_NAME, FREE_AVATAR_NAMES, PAID_AVATAR_NAMES, USER_RANK } from "../fixtures/testData";
import { ProfilePage } from "../pages/ProfilePage";

test.use({ role: "user" });

test.describe("Profil", () => {
  let profile: ProfilePage;

  test.beforeEach(({ page }) => {
    profile = new ProfilePage(page);
  });

  test("memiliki 4 tab", async () => {
    await profile.goto();

    await expect(profile.tabs).toHaveText(["Ringkasan", "Aktivitas", "Pencapaian", "Kustomisasi"]);
  });

  for (const tab of ["Aktivitas", "Pencapaian", "Kustomisasi"]) {
    test(`tab ${tab} terbuka langsung lewat URL`, async () => {
      await profile.gotoTab(tab.toLowerCase());

      await expect(profile.tab(tab)).toHaveAttribute("aria-selected", "true");
    });
  }

  test("header tanpa level, sub-tingkat rank, dan lencana verifikasi", async () => {
    await profile.goto();

    await expect(profile.rankEmblem).toBeVisible();
    await expect(profile.header).toContainText(USER_RANK);
    await expect(profile.header).not.toContainText(/\b(level|lv\.?)\b/i);
    await expect(profile.header).not.toContainText(new RegExp(`${USER_RANK}\\s+(I{1,3}|IV|V|\\d)\\b`));
    await expect(profile.header).not.toContainText(/verifikasi|terverifikasi|verified/i);
  });

  test("Kustomisasi menandai avatar dan tema yang sedang digunakan, dengan pratinjau dan tombol simpan", async ({ page }) => {
    await profile.gotoTab("kustomisasi");

    await expect(page.getByRole("region", { name: "Digunakan Saat Ini" })).toHaveCount(0);
    await expect(profile.preview).toBeVisible();
    await expect(profile.saveAppearanceButton).toBeVisible();
    await expect(page.getByRole("button", { name: new RegExp(`^${ACTIVE_AVATAR_NAME}`) })).toContainText("Digunakan");

    await page.getByRole("button", { name: "Tema Banner" }).click();
    await expect(page.getByRole("button", { name: new RegExp(`^${ACTIVE_THEME_NAME}`) })).toContainText("Digunakan");
  });

  test("chip gaya menampilkan 9 gaya; gaya tanpa gambar berisi keterangan segera hadir", async ({ page }) => {
    await profile.gotoTab("kustomisasi");
    const styles = page.getByRole("group", { name: "Filter Gaya avatar" }).getByRole("button");

    await expect(styles).toHaveText([
      "Basic",
      /^Bug Hunter/,
      /^Cyberpunk/,
      /^Wizard/,
      /^Driver Formula/,
      /^Space Explorer/,
      /^Ninja/,
      /^Knight/,
      /^Master Chef/,
    ]);
    await expect(styles.filter({ hasText: "Segera hadir" })).toHaveCount(8);
    await expect(styles.filter({ hasText: "Basic" })).toHaveAttribute("aria-pressed", "true");

    await styles.filter({ hasText: "Ninja" }).click();
    await expect(page.getByRole("heading", { name: "Gaya Ninja segera hadir" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Kucing Putih/ })).toHaveCount(0);

    await styles.filter({ hasText: "Basic" }).click();
    await expect(page.getByRole("button", { name: /^Kucing Putih/ })).toBeVisible();
  });

  test("bingkai avatar di header profil dan pratinjau berbentuk bulat", async () => {
    // Radius minimal setengah lebar berarti bingkainya lingkaran penuh.
    const isRound = (frame: import("@playwright/test").Locator) =>
      frame.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius) >= el.getBoundingClientRect().width / 2);

    await profile.goto();
    await expect.poll(() => isRound(profile.header.getByRole("img", { name: /^Avatar / }).locator(".."))).toBe(true);

    await profile.gotoTab("kustomisasi");
    await expect.poll(() => isRound(profile.preview.locator("img[src*=kucing]").locator(".."))).toBe(true);
  });

  test("filter kepemilikan berupa tombol ikon dengan dropdown", async ({ page }) => {
    await profile.gotoTab("kustomisasi");
    const card = (name: string) => page.getByRole("button", { name: new RegExp(`^${name}`) });
    const filter = (label: string) => page.getByRole("button", { name: `Filter kepemilikan: ${label}` });

    await filter("Semua").click();
    await page.getByRole("menuitemradio", { name: "Terkunci" }).click();
    await expect(filter("Terkunci")).toBeVisible();
    await expect(card("Kucing Hitam")).toBeVisible();
    await expect(card("Kucing Putih")).toHaveCount(0);
    await expect(page.getByText("Jenis kucing lain segera hadir")).toHaveCount(0);

    await filter("Terkunci").click();
    await page.getByRole("menuitemradio", { name: "Dimiliki" }).click();
    for (const name of FREE_AVATAR_NAMES) await expect(card(name)).toBeVisible();
    for (const name of PAID_AVATAR_NAMES) await expect(card(name)).toHaveCount(0);
  });

  test("koleksi berisi 8 avatar: Putih dan Oren gratis, sisanya terkunci untuk Basic", async ({ page }) => {
    await profile.gotoTab("kustomisasi");
    const card = (name: string) => page.getByRole("button", { name: new RegExp(`^${name}`) });

    for (const name of [...FREE_AVATAR_NAMES, ...PAID_AVATAR_NAMES]) {
      // Gambar WebP benar-benar termuat, bukan tautan rusak.
      await card(name).scrollIntoViewIfNeeded();
      // Optimasi gambar pertama kali di server bisa lambat saat banyak test berjalan.
      await expect
        .poll(() => card(name).locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 15_000 })
        .toBeGreaterThan(0);
    }
    for (const name of FREE_AVATAR_NAMES) await expect(card(name)).toBeEnabled();
    for (const name of PAID_AVATAR_NAMES) {
      await expect(card(name)).toBeDisabled();
      await expect(card(name)).toContainText("Tersedia di Pro dan Premium");
    }
    await expect(page.getByText("Jenis kucing lain segera hadir")).toHaveCount(1);

    await card("Kucing Putih").click();
    await expect(card("Kucing Putih")).toHaveAttribute("aria-pressed", "true");
  });
});
