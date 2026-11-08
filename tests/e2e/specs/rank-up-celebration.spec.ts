import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { waitForEntranceAnimations } from "../fixtures/animations";
import { expect, test } from "../fixtures/auth";
import { MockAccount, SUPABASE_TEST_URL, mockSupabase, signInWithMock, uniqueMockAccount } from "../fixtures/supabaseMock";
import { DashboardPage } from "../pages/DashboardPage";

// Popup naik rank tampil di halaman mana pun, sekali per rank (PRD FR-05). Rank yang sudah
// dirayakan disimpan per akun di browser.
const STORAGE_KEY = "belajarautomation-rank-celebrated";

async function signInWithXp(page: Page, request: { post: (url: string, options: object) => Promise<unknown> }, totalXp: number, celebrated?: number) {
  const account: MockAccount = uniqueMockAccount();
  await request.post(`${SUPABASE_TEST_URL}/__test/seed`, { data: { user: account.id, totalXp } });
  if (celebrated !== undefined) {
    await page.addInitScript(
      ({ key, id, minXp }) => {
        if (!window.localStorage.getItem(key)) {
          window.localStorage.setItem(key, JSON.stringify({ [id]: { celebrated: minXp, showing: null } }));
        }
      },
      { key: STORAGE_KEY, id: account.id, minXp: celebrated }
    );
  }
  await mockSupabase(page, { accounts: [account] });
  await signInWithMock(page, account);
  return account;
}

const celebrationOf = (page: Page) => page.getByRole("dialog", { name: /^Selamat!/ });

test.describe("Popup naik rank", () => {
  test("rank yang naik dari tempat lain dirayakan saat halaman dibuka, lalu tidak muncul lagi", async ({ page, request }) => {
    // Terakhir dirayakan Trainee (0), sekarang 1.000 XP = Practitioner.
    await signInWithXp(page, request, 1000, 0);

    const celebration = celebrationOf(page);
    await expect(celebration).toBeVisible();
    await expect(celebration).toContainText("Rank Up!");
    await expect(celebration).toContainText("Kamu telah naik ke rank");
    await expect(celebration).toContainText("Practitioner");
    await expect(celebration).toContainText("raih rank Specialist di 2.200 XP");

    await celebration.getByRole("button", { name: "Lanjut Belajar" }).click();
    await expect(celebration).toBeHidden();

    await page.reload();
    await expect(new DashboardPage(page).greeting).toBeVisible();
    await expect(celebrationOf(page)).toBeHidden();
  });

  test("Lihat Progress Rank membuka halaman Rank", async ({ page, request }) => {
    await signInWithXp(page, request, 300, 0);

    const celebration = celebrationOf(page);
    await celebration.getByRole("link", { name: "Lihat Progress Rank" }).click();

    await expect(page).toHaveURL("/rank");
    await expect(celebration).toBeHidden();
  });

  test("perangkat baru mencatat rank saat ini tanpa popup", async ({ page, request }) => {
    await signInWithXp(page, request, 1000);
    const dashboard = new DashboardPage(page);
    // Progres sudah termuat saat statistik menampilkan 1.000 XP.
    await expect(dashboard.stats).toContainText("1.000");

    await expect(celebrationOf(page)).toBeHidden();
  });

  test("rank tertinggi menampilkan pesan khusus", async ({ page, request }) => {
    await signInWithXp(page, request, 5500, 3800);

    await expect(celebrationOf(page)).toContainText("Kamu mencapai rank tertinggi.");
  });

  test("tombol bagikan menampilkan kartu naik rank yang bisa diunduh dan tautan profil", async ({ page, request }) => {
    const account = await signInWithXp(page, request, 300, 0);
    await celebrationOf(page).getByRole("button", { name: "Bagikan pencapaian" }).click();

    const share = page.getByRole("dialog", { name: "Bagikan Pencapaian" });
    await expect(share).toBeVisible();
    await expect(share.getByRole("img", { name: `Kartu naik rank ${account.name} ke Apprentice, 300 XP` })).toBeVisible();
    await expect(share.getByRole("link", { name: "Unduh PNG" })).toHaveAttribute("download", "naik-rank-apprentice.png");
    await expect(share.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", new RegExp(`u%2F${account.username}|u/${account.username}`));
    await expect(share.getByRole("button", { name: "Salin tautan" })).toBeVisible();

    await waitForEntranceAnimations(page);
    const { violations } = await new AxeBuilder({ page }).include("[role=dialog]").analyze();
    expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);

    await share.getByRole("button", { name: "Kembali" }).click();
    await expect(celebrationOf(page)).toContainText("Apprentice");
  });
});
