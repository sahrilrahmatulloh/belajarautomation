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

  test("avatar di kartu memakai bingkai bulat, bukan kotak", async () => {
    await expect(share.card).toHaveJSProperty("naturalWidth", 1200);

    // Bingkai putih berpusat di (144, 136) dengan jari-jari 80. Titik di dalam lingkaran
    // berwarna putih; sudut kotak pembungkusnya (68, 60) tidak, karena bingkainya bulat.
    const pixels = await share.card.evaluate((img: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const at = (x: number, y: number) => Array.from(ctx.getImageData(x, y, 1, 1).data.slice(0, 3));
      return { ring: at(144, 60), corner: at(68, 60) };
    });

    expect(pixels.ring).toEqual([255, 255, 255]);
    expect(pixels.corner).not.toEqual([255, 255, 255]);
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
