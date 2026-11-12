import { expect, test } from "../fixtures/auth";
import { notification } from "../fixtures/notify";
import { PAID_AVATAR_NAMES } from "../fixtures/testData";
import { MOCK_STUDENT, mockSupabase, signInWithMock } from "../fixtures/supabaseMock";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "../pages/ProfilePage";

// Menyimpan avatar dan tema pilihan ke akun (PRD FR-12, FR-13 Kustomisasi).

test.describe("Kustomisasi akun Supabase", () => {
  test("akun baru memakai Kucing Putih sebagai avatar bawaan", async ({ page }) => {
    await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.header.getByRole("img", { name: "Avatar Kucing Putih" })).toBeVisible();
    await expect(new DashboardPage(page).profileMenuButton.locator("img")).toHaveAttribute("src", /kucing-putih/);
  });

  test("akun baru memakai tema bawaan Padang Rumput dengan kucing 3D Kucing Putih di banner", async ({ page, isMobile }) => {
    const modelRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().endsWith(".glb")) modelRequests.push(request.url());
    });
    await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.header.locator('img[src*="padang-rumput%2Fbanner.webp"]')).toBeAttached();
    if (isMobile) {
      // Di layar kecil kucing 3D tidak ditampilkan dan modelnya tidak diunduh (PRD FR-12).
      await expect(profile.cat3d).toBeHidden();
      await expect(profile.rankProgress).toBeVisible();
      expect(modelRequests).toEqual([]);
    } else {
      await expect(profile.cat3d).toHaveAttribute("data-cat-3d", "ready", { timeout: 15_000 });
      await expect(profile.cat3d.locator("canvas")).toBeVisible();
      expect(modelRequests.some((url) => url.endsWith("/models/kucing-putih.glb"))).toBe(true);
    }
  });

  test("avatar Kucing Oren belum punya model 3D, jadi kucing 3D tidak ditampilkan", async ({ page }) => {
    const oren = { ...MOCK_STUDENT, avatarId: "kucing-oren" };
    await mockSupabase(page, { accounts: [oren] });
    await signInWithMock(page, oren);
    const profile = new ProfilePage(page);
    await profile.goto();

    await expect(profile.header.getByRole("img", { name: "Avatar Kucing Oren" })).toBeVisible();
    await expect(profile.cat3d).toHaveCount(0);
  });

  test("menyimpan avatar pilihan lalu tampil di header profil dan menu profil", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const profile = new ProfilePage(page);
    await profile.gotoTab("kustomisasi");
    await expect(profile.saveAppearanceButton).toBeDisabled();

    await page.getByRole("button", { name: /^Kucing Oren/ }).click();
    await expect(profile.saveAppearanceButton).toBeEnabled();
    await profile.saveAppearanceButton.click();

    await expect(notification(page, "Pilihan avatar dan tema tersimpan.")).toBeVisible();
    expect(supabase.find("/rest/v1/rpc/set_appearance")?.postDataJSON()).toEqual({
      new_avatar_id: "kucing-oren",
      new_theme_id: "padang-rumput",
    });
    await expect(page.getByRole("button", { name: /^Kucing Oren/ })).toContainText("Digunakan");
    await expect(profile.saveAppearanceButton).toBeDisabled();

    await profile.goto();
    await expect(profile.header.getByRole("img", { name: "Avatar Kucing Oren" })).toBeVisible();
    await expect(profile.profileMenuButton.locator("img")).toHaveAttribute("src", /kucing-oren/);
  });

  test("menyimpan tema Neon Night lalu dipakai di header profil", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const profile = new ProfilePage(page);
    await profile.gotoTab("kustomisasi");

    await page.getByRole("button", { name: "Tema Banner" }).click();
    await page.getByRole("button", { name: /^Neon Night/ }).click();
    await profile.saveAppearanceButton.click();

    await expect(notification(page, "Pilihan avatar dan tema tersimpan.")).toBeVisible();
    expect(supabase.find("/rest/v1/rpc/set_appearance")?.postDataJSON()).toMatchObject({ new_theme_id: "kucing-cyberpunk" });

    await profile.goto();
    await expect(profile.header.locator("video[data-theme-video]")).toHaveAttribute("src", "/banner/kucing-cyberpunk/banner.mp4");
  });

  test("avatar berbayar tetap terkunci untuk akun Basic", async ({ page }) => {
    await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const profile = new ProfilePage(page);
    await profile.gotoTab("kustomisasi");

    for (const name of PAID_AVATAR_NAMES) {
      await expect(page.getByRole("button", { name: new RegExp(`^${name}`) })).toBeDisabled();
    }
  });

  test("akun Premium dari database bisa memakai avatar berbayar dan melihat paketnya", async ({ page }) => {
    const premium = { ...MOCK_STUDENT, membership: "premium" as const };
    const supabase = await mockSupabase(page, { accounts: [premium] });
    await signInWithMock(page, premium);
    const profile = new ProfilePage(page);
    await profile.gotoTab("kustomisasi");

    for (const name of PAID_AVATAR_NAMES) {
      await expect(page.getByRole("button", { name: new RegExp(`^${name}`) })).toBeEnabled();
    }

    // Kostum berbayar bisa dipilih dan disimpan oleh akun Premium.
    await page.getByRole("group", { name: "Filter Gaya avatar" }).getByRole("button", { name: "Bug Hunter" }).click();
    await page.getByRole("button", { name: /^Kucing Oren Bug Hunter/ }).click();
    await profile.saveAppearanceButton.click();
    await expect(notification(page, "Pilihan avatar dan tema tersimpan.")).toBeVisible();
    expect(supabase.find("/rest/v1/rpc/set_appearance")?.postDataJSON()).toMatchObject({ new_avatar_id: "kucing-oren-bug-hunter" });

    await profile.goto();
    await expect(profile.header.getByRole("img", { name: "Avatar Kucing Oren Bug Hunter" })).toBeVisible();

    await page.goto("/membership");
    const premiumCard = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Premium", exact: true }) });
    await expect(premiumCard).toContainText("Paket kamu saat ini");
  });
});

test.describe("Kustomisasi akun demo", () => {
  test.use({ role: "user" });

  test("pilihan hanya tampil di pratinjau dan tidak dapat disimpan", async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.gotoTab("kustomisasi");

    await page.getByRole("button", { name: /^Kucing Putih/ }).click();

    await expect(profile.saveAppearanceButton).toBeDisabled();
    await expect(profile.preview.getByText("Akun demo tidak dapat menyimpan pilihan.")).toBeVisible();
  });
});
