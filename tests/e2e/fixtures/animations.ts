import { Page } from "@playwright/test";

// Menunggu animasi masuk yang sekali jalan selesai, mis. teks popup yang memudar masuk, agar
// pemeriksaan axe tidak menilai kontras saat elemen masih transparan. Animasi berulang
// (sinar berputar, bintang berkelip) diabaikan.
export async function waitForEntranceAnimations(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.effect?.getTiming().iterations === Infinity || animation.playState === "finished")
  );
}
