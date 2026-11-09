import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { MOCK_TOTP_CODE, MockAccount, MockPublicUser, mockSupabase, signInWithMock, uniqueMockAccount } from "../fixtures/supabaseMock";

// Dashboard Admin akun sungguhan (PRD FR-16 A): data asli untuk pengguna, membership, rank, dan
// aksi Admin; angka contoh berlabel "Data contoh" untuk konten dan transaksi.

const ADMIN: MockAccount = uniqueMockAccount({ roles: ["student", "admin"], factors: [{ id: "faktor-admin", status: "verified" }] });
const OTHERS: MockPublicUser[] = [
  { id: "00000000-0000-4000-8000-0000000000b1", username: "sari_qa", name: "Sari Wulandari", totalXp: 1200 },
  { id: "00000000-0000-4000-8000-0000000000b2", username: "budi_test", name: "Budi Santoso", totalXp: 350 },
];

async function openDashboard(page: Page) {
  await mockSupabase(page, { accounts: [ADMIN], others: OTHERS });
  await signInWithMock(page, ADMIN, "/admin");
  await page.getByLabel("Kode 6 digit").fill(MOCK_TOTP_CODE);
  await page.getByRole("button", { name: "Verifikasi" }).click();
  await expect(page.getByRole("heading", { name: "Halo, Admin!" })).toBeVisible();
}

const section = (page: Page, name: string) => page.getByRole("region", { name: new RegExp(`^${name}`) });

test.describe("Dashboard Admin akun sungguhan", () => {
  test("menu bernama Dashboard dan angka pengguna dari database", async ({ page }) => {
    await openDashboard(page);

    await expect(section(page, "Pengguna").getByRole("link", { name: /Total Pengguna 3/ })).toBeVisible();
    await expect(section(page, "Pengguna")).toContainText("Total XP Terkumpul");
    await expect(section(page, "Pengguna")).toContainText("1.550");
    await expect(section(page, "Pengguna")).not.toContainText("Data contoh");
  });

  test("sebaran rank mengikuti total XP pengguna", async ({ page }) => {
    await openDashboard(page);
    const ranks = section(page, "Sebaran Rank");

    // Admin 0 XP = Trainee, Budi 350 = Apprentice, Sari 1.200 = Practitioner.
    await expect(ranks.getByRole("listitem").filter({ hasText: "Trainee" })).toContainText("1");
    await expect(ranks.getByRole("listitem").filter({ hasText: "Apprentice" })).toContainText("1");
    await expect(ranks.getByRole("listitem").filter({ hasText: "Practitioner" })).toContainText("1");
    await expect(ranks.getByRole("listitem").filter({ hasText: "Master" })).toContainText("0");
  });

  test("konten dan transaksi berlabel Data contoh, tanpa tautan", async ({ page }) => {
    await openDashboard(page);

    for (const name of ["Konten per Status", "Perlu Perhatian", "Transaksi"]) {
      await expect(section(page, name)).toContainText("Data contoh");
      await expect(section(page, name).getByRole("link")).toHaveCount(0);
    }
  });

  test("aksi Admin terbaru muncul setelah koreksi XP", async ({ page }) => {
    await openDashboard(page);
    await expect(section(page, "Aksi Admin Terbaru")).toContainText("Belum ada aksi Admin");

    await page.goto("/admin/pengguna/00000000-0000-4000-8000-0000000000b2");
    const form = page.getByRole("form", { name: "Koreksi XP" });
    await form.getByLabel("Jumlah XP").fill("100");
    await form.getByLabel("Alasan").fill("Kompensasi bug kuis");
    await form.getByRole("button", { name: "Simpan koreksi" }).click();
    await expect(page.getByRole("region", { name: "Riwayat koreksi XP" })).toContainText("+100 XP");

    await page.goto("/admin");
    await expect(section(page, "Aksi Admin Terbaru")).toContainText("Koreksi XP · Budi Santoso");
    await expect(section(page, "Aksi Admin Terbaru")).toContainText("Kompensasi bug kuis");
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`aksesibilitas mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("tanpa pelanggaran critical dan serious", async ({ page }) => {
        await openDashboard(page);
        await expect(section(page, "Sebaran Rank").getByRole("listitem").first()).toContainText(/\d/);

        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
      });
    });
  }
});
