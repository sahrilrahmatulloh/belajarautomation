import AxeBuilder from "@axe-core/playwright";

import { expect, test } from "../fixtures/auth";
import { VIDEO_REFERENSI } from "../fixtures/testData";
import { VideoReferensiPage } from "../pages/VideoReferensiPage";

const { embedded, english, linkOnly } = VIDEO_REFERENSI;

test.describe("Video referensi", () => {
  let video: VideoReferensiPage;

  test.beforeEach(async ({ page }) => {
    video = new VideoReferensiPage(page);
    await video.goto();
    await expect(video.heading).toBeVisible();
  });

  test("sebelum diklik tidak ada iframe", async () => {
    await expect(video.playButton(embedded.judul)).toBeVisible();
    await expect(video.frames).toHaveCount(0);
  });

  test("setelah diklik memuat player youtube-nocookie", async () => {
    await video.playButton(embedded.judul).click();

    await expect(video.frame(embedded.judul)).toHaveAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${embedded.id}?autoplay=1`
    );
    await expect(video.frames).toHaveCount(1);
    await expect(video.playButton(embedded.judul)).toBeHidden();
  });

  test("tombol putar bisa dioperasikan dengan keyboard dan fokus pindah ke player", async ({ page }) => {
    await video.playButton(embedded.judul).focus();

    await page.keyboard.press("Enter");

    await expect(video.frame(embedded.judul)).toBeFocused();
  });

  test("kredit channel, durasi, dan keterangan tampil", async () => {
    const card = video.card(embedded.judul);

    await expect(card).toContainText(embedded.channel);
    await expect(card).toContainText(embedded.durasi);
    await expect(card).toContainText("Video dari YouTube · materi pelengkap");
  });

  test("label bahasa hanya untuk video selain Bahasa Indonesia", async () => {
    await expect(video.card(english.judul)).toContainText("Bahasa Inggris");
    await expect(video.card(embedded.judul)).not.toContainText("Bahasa Indonesia");
  });

  test("video tanpa embed hanya menampilkan tautan Tonton di YouTube", async () => {
    const link = video.watchLink(linkOnly.judul);

    await expect(link).toHaveAttribute("href", `https://www.youtube.com/watch?v=${linkOnly.id}`);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(video.playButton(linkOnly.judul)).toHaveCount(0);
    await expect(video.card(linkOnly.judul)).toContainText(linkOnly.channel);
  });

  test("tidak melebar di layar sempit dan memakai rasio 16:9", async () => {
    const box = await video.playButton(embedded.judul).boundingBox();

    expect(box).not.toBeNull();
    expect(Math.round((box!.width / box!.height) * 9)).toBe(16);
    expect(await video.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("tanpa pelanggaran axe", async ({ page }) => {
        const { violations } = await new AxeBuilder({ page }).analyze();

        expect(violations.map((violation) => violation.id)).toEqual([]);
      });

      test("tanpa pelanggaran axe setelah diputar", async ({ page }) => {
        await video.playButton(embedded.judul).click();
        await expect(video.frame(embedded.judul)).toBeVisible();

        const { violations } = await new AxeBuilder({ page }).exclude("iframe").analyze();

        expect(violations.map((violation) => violation.id)).toEqual([]);
      });
    });
  }
});
