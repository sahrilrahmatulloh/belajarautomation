import { expect, test } from "../fixtures/auth";
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

  test("menyimpan avatar pilihan lalu tampil di header profil dan menu profil", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const profile = new ProfilePage(page);
    await profile.gotoTab("kustomisasi");
    await expect(profile.saveAppearanceButton).toBeDisabled();

    await page.getByRole("button", { name: /^Kucing Oren/ }).click();
    await expect(profile.saveAppearanceButton).toBeEnabled();
    await profile.saveAppearanceButton.click();

    await expect(profile.preview.getByRole("status").filter({ hasText: "Pilihan tersimpan." })).toBeVisible();
    expect(supabase.find("/rest/v1/rpc/set_appearance")?.postDataJSON()).toEqual({
      new_avatar_id: "kucing-oren",
      new_theme_id: "kucing-fuji",
    });
    await expect(page.getByRole("button", { name: /^Kucing Oren/ })).toContainText("Digunakan");
    await expect(profile.saveAppearanceButton).toBeDisabled();

    await profile.goto();
    await expect(profile.header.getByRole("img", { name: "Avatar Kucing Oren" })).toBeVisible();
    await expect(profile.profileMenuButton.locator("img")).toHaveAttribute("src", /kucing-oren/);
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
