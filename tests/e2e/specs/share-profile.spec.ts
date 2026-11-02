import { expect, test } from "../fixtures/auth";
import { OWN_USERNAME } from "../fixtures/testData";
import { ProfilePage } from "../pages/ProfilePage";
import { ShareProfileDialog } from "../pages/ShareProfileDialog";

test.use({ role: "user" });

test.describe("Bagikan profil", () => {
  let share: ShareProfileDialog;

  test.beforeEach(async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.goto();
    await profile.shareButton.click();

    share = new ShareProfileDialog(page);
    await expect(share.dialog).toBeVisible();
  });

  test("membuat kartu profil berukuran 1200x630", async () => {
    await expect(share.card).toHaveJSProperty("naturalWidth", 1200);
    await expect(share.card).toHaveJSProperty("naturalHeight", 630);
  });

  test("mengunduh kartu sebagai file PNG", async ({ page }) => {
    await expect(share.card).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await share.downloadLink.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe(`profil-${OWN_USERNAME}.png`);
  });

  test("tautan media sosial memuat alamat profil publik", async () => {
    for (const name of ["WhatsApp", "X", "Facebook", "LinkedIn", "Telegram"]) {
      await expect(share.socialLink(name)).toHaveAttribute("href", new RegExp(`%2Fu%2F${OWN_USERNAME}`));
    }
  });

  test("menyalin tautan profil publik", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await share.copyButton.click();

    await expect(share.dialog.getByRole("button", { name: "Tersalin" })).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(new RegExp(`/u/${OWN_USERNAME}$`));
  });

  test("modal tertutup dengan tombol Tutup", async () => {
    await share.closeButton.click();

    await expect(share.dialog).toBeHidden();
  });
});
