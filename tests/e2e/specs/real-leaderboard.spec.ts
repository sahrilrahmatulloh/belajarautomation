import { expect, test } from "../fixtures/auth";
import { MOCK_STUDENT, MockPublicUser, mockSupabase, signInWithMock } from "../fixtures/supabaseMock";
import { LeaderboardPage } from "../pages/LeaderboardPage";
import { PublicProfilePage } from "../pages/PublicProfilePage";

// Leaderboard akun sungguhan dan profil publik yang bisa dibuka dari barisnya (PRD FR-06, FR-13).

const OTHERS: MockPublicUser[] = [
  { id: "00000000-0000-4000-8000-0000000000a1", username: "sari_qa", name: "Sari Wulandari", bio: "Belajar Playwright tiap pagi.", avatarId: "kucing-oren" },
  { id: "00000000-0000-4000-8000-0000000000a2", username: "budi_test", name: "Budi Santoso", avatarId: "kucing-putih" },
];

test.describe("Leaderboard akun Supabase", () => {
  test("menampilkan akun sungguhan, termasuk diri sendiri", async ({ page }) => {
    await mockSupabase(page, { others: OTHERS });
    await signInWithMock(page, MOCK_STUDENT);
    const leaderboard = new LeaderboardPage(page);

    await leaderboard.goto();
    await leaderboard.globalTab.click();

    await expect(leaderboard.topList).toHaveCount(3);
    await expect(leaderboard.topList.filter({ hasText: "Sari Wulandari" })).toBeVisible();
    await expect(leaderboard.topList.filter({ hasText: "Budi Santoso" })).toBeVisible();
    await expect(leaderboard.topList.filter({ hasText: "Kamu" })).toContainText(MOCK_STUDENT.name);
  });

  test("mengklik baris membuka profil publik pengguna tersebut", async ({ page }) => {
    await mockSupabase(page, { others: OTHERS });
    await signInWithMock(page, MOCK_STUDENT);
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.goto();
    await leaderboard.globalTab.click();

    await leaderboard.topList.getByRole("link", { name: /^Lihat profil Sari Wulandari/ }).click();

    await expect(page).toHaveURL("/u/sari_qa");
    const profile = new PublicProfilePage(page, "sari_qa");
    await expect(profile.name).toHaveText("Sari Wulandari");
    await expect(profile.main).toContainText("@sari_qa");
    await expect(profile.main).toContainText("Belajar Playwright tiap pagi.");
    await expect(profile.main.getByRole("img", { name: "Avatar Kucing Oren" })).toBeVisible();
  });

  test("profil akun yang tidak ada menampilkan Profil tidak ditemukan", async ({ page }) => {
    await mockSupabase(page, { others: OTHERS });
    await signInWithMock(page, MOCK_STUDENT);

    await page.goto("/u/tidak_ada_orangnya");

    await expect(page.getByRole("heading", { level: 1, name: "Profil tidak ditemukan" })).toBeVisible();
  });
});

test.describe("Leaderboard akun demo", () => {
  test.use({ role: "user" });

  test("baris peserta dummy juga bisa diklik untuk membuka profilnya", async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.goto();

    const firstLink = leaderboard.topList.first().getByRole("link");
    const href = await firstLink.getAttribute("href");
    expect(href).toMatch(/^\/u\/.+/);
    await firstLink.click();

    await expect(page).toHaveURL(href!);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
