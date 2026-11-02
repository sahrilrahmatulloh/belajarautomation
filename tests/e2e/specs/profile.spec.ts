import { expect, test } from "../fixtures/auth";
import { ACTIVE_AVATAR_NAME, ACTIVE_THEME_NAME, USER_RANK } from "../fixtures/testData";
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

  test("Kustomisasi menampilkan avatar dan tema yang sedang digunakan", async () => {
    await profile.gotoTab("kustomisasi");

    await expect(profile.usedAvatar).toContainText(ACTIVE_AVATAR_NAME);
    await expect(profile.usedTheme).toContainText(ACTIVE_THEME_NAME);
  });
});
