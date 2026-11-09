import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, OWN_USERNAME, PRIVATE_USERNAME, PUBLIC_USER } from "../fixtures/testData";
import { ProfilePage } from "../pages/ProfilePage";
import { PublicProfilePage } from "../pages/PublicProfilePage";
import { SettingsPage } from "../pages/SettingsPage";

test.describe("Profil publik sebagai tamu", () => {
  test("wajib login sehingga tamu diarahkan ke halaman login", async ({ page }) => {
    await new PublicProfilePage(page, OWN_USERNAME).goto();

    await expect(page).toHaveURL("/login");
  });
});

test.describe("Profil publik setelah login", () => {
  test.use({ role: "user" });

  test("hanya menampilkan tab Ringkasan dan Pencapaian", async ({ page }) => {
    const profile = new PublicProfilePage(page, PUBLIC_USER.username);
    await profile.goto();

    await expect(profile.name).toHaveText(PUBLIC_USER.displayName);
    await expect(profile.tabs).toHaveText(["Ringkasan", "Pencapaian"]);
    await expect(profile.ownerNotice).toBeHidden();
  });

  test("tab pemilik tidak bisa dibuka lewat URL", async ({ page }) => {
    const profile = new PublicProfilePage(page, PUBLIC_USER.username);

    for (const tab of ["aktivitas", "kustomisasi"]) {
      await profile.gotoTab(tab);

      await expect(profile.tab("Ringkasan")).toHaveAttribute("aria-selected", "true");
      await expect(profile.stats).toBeVisible();
    }
  });

  test("tidak menampilkan email, membership, pengaturan, dan tombol bagikan", async ({ page }) => {
    // Profil akun demo, karena hanya akun inilah yang punya email dan membership.
    const profile = new PublicProfilePage(page, OWN_USERNAME);
    await profile.goto();
    await expect(profile.stats).toBeVisible();

    await expect(profile.main).not.toContainText(ACCOUNTS.user.email);
    await expect(profile.main).not.toContainText(/membership/i);
    await expect(profile.settingsLink).toBeHidden();
    await expect(profile.shareButton).toBeHidden();
  });

  test("profil privat hanya menampilkan keterangan privat", async ({ page }) => {
    const profile = new PublicProfilePage(page, PRIVATE_USERNAME);
    await profile.goto();

    await expect(profile.privateNotice).toBeVisible();
    await expect(profile.tabs).toHaveCount(0);
    await expect(profile.stats).toBeHidden();
  });

  test("username yang tidak ada menampilkan Profil tidak ditemukan", async ({ page }) => {
    // Username di luar data dummy dicari di database akun sungguhan; bila tidak ada, tampil pesan ini.
    await new PublicProfilePage(page, "pengguna-tidak-ada").goto();

    await expect(page.getByRole("heading", { level: 1, name: "Profil tidak ditemukan" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kembali ke Leaderboard" })).toHaveAttribute("href", "/leaderboard");
  });

  test('"Lihat sebagai publik" membuka profil sendiri dengan keterangan pemilik', async ({ page }) => {
    const ownProfile = new ProfilePage(page);
    await ownProfile.goto();
    await ownProfile.viewAsPublicLink.click();

    await expect(page).toHaveURL(`/u/${OWN_USERNAME}`);
    await expect(new PublicProfilePage(page, OWN_USERNAME).ownerNotice).toBeVisible();
  });

  test("Pengaturan memiliki opsi profil dapat dilihat publik", async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();

    await expect(settings.publicProfileSwitch).toHaveAttribute("aria-checked", "true");

    await settings.publicProfileSwitch.click();

    await expect(settings.publicProfileSwitch).toHaveAttribute("aria-checked", "false");
  });
});
