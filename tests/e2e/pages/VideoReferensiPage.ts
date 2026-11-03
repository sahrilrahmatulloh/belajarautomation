import { Locator, Page } from "@playwright/test";

// Halaman pratinjau komponen video dengan data dummy.
export class VideoReferensiPage {
  readonly heading: Locator;
  readonly frames: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Pratinjau Video Referensi" });
    this.frames = page.locator("iframe");
  }

  // Test tidak bergantung pada jaringan YouTube.
  async goto() {
    await this.page.route(/youtube(-nocookie)?\.com|ytimg\.com/, (route) => route.abort());
    return this.page.goto("/dev/video-referensi");
  }

  playButton(judul: string) {
    return this.page.getByRole("button", { name: `Putar video: ${judul}` });
  }

  frame(judul: string) {
    return this.page.locator(`iframe[title="${judul}"]`);
  }

  card(judul: string) {
    return this.page.getByRole("figure").filter({ hasText: judul });
  }

  watchLink(judul: string) {
    return this.card(judul).getByRole("link", { name: /Tonton di YouTube/ });
  }
}
