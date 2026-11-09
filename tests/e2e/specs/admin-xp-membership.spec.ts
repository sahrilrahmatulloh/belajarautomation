import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { notification } from "../fixtures/notify";
import { MOCK_TOTP_CODE, MockAccount, MockPublicUser, mockSupabase, signInWithMock, uniqueMockAccount } from "../fixtures/supabaseMock";

// Koreksi XP (PRD FR-16 D) dan membership manual (PRD FR-16 E) untuk akun sungguhan, oleh Admin
// yang sudah lolos verifikasi dua langkah.

const ADMIN: MockAccount = uniqueMockAccount({ roles: ["student", "admin"], factors: [{ id: "faktor-admin", status: "verified" }] });
const SARI: MockPublicUser = { id: "00000000-0000-4000-8000-0000000000a1", username: "sari_qa", name: "Sari Wulandari", totalXp: 1200 };
const BUDI: MockPublicUser = { id: "00000000-0000-4000-8000-0000000000a2", username: "budi_test", name: "Budi Santoso", totalXp: 40 };

async function openVerifiedAdmin(page: Page) {
  await mockSupabase(page, { accounts: [ADMIN], others: [SARI, BUDI] });
  await signInWithMock(page, ADMIN, "/admin");
  await page.goto("/admin/pengguna");
  await page.getByLabel("Kode 6 digit").fill(MOCK_TOTP_CODE);
  await page.getByRole("button", { name: "Verifikasi" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Pengguna dan Peran" })).toBeVisible();
}

async function openSari(page: Page) {
  await openVerifiedAdmin(page);
  await page.getByRole("link", { name: "Lihat detail Sari Wulandari" }).click();
  await expect(page).toHaveURL(`/admin/pengguna/${SARI.id}`);
  await expect(page.getByRole("heading", { level: 1, name: "Sari Wulandari" })).toBeVisible();
}

const summary = (page: Page) => page.getByRole("definition");

test.describe("Admin: pengguna akun sungguhan", () => {
  test("daftar pengguna dari database dan pencarian", async ({ page }) => {
    await openVerifiedAdmin(page);
    const list = page.getByRole("main");

    await expect(list).toContainText("Sari Wulandari");
    await expect(list).toContainText("Budi Santoso");
    await expect(list).toContainText("1.200 XP · Practitioner");

    await page.getByLabel("Cari pengguna").fill("budi");

    await expect(list).toContainText("Budi Santoso");
    await expect(list).not.toContainText("Sari Wulandari");
  });

  test("koreksi XP menambah dan mengurangi total, tidak boleh di bawah 0", async ({ page }) => {
    await openSari(page);
    const form = page.getByRole("form", { name: "Koreksi XP" });
    const save = form.getByRole("button", { name: "Simpan koreksi" });

    await form.getByLabel("Jumlah XP").fill("500");
    await form.getByLabel("Alasan").fill("abc");
    await expect(save).toBeDisabled();

    await form.getByLabel("Alasan").fill("Kompensasi bug kuis");
    await save.click();

    await expect(notification(page, "XP dikoreksi. Total sekarang 1.700 XP.")).toBeVisible();
    await expect(summary(page).first()).toHaveText("1.700");
    const history = page.getByRole("region", { name: "Riwayat koreksi XP" });
    await expect(history).toContainText("+500 XP");
    await expect(history).toContainText("Kompensasi bug kuis");

    await form.getByLabel("Jumlah XP").fill("-5000");
    await form.getByLabel("Alasan").fill("Uji batas bawah XP");
    await save.click();

    await expect(notification(page, "Koreksi ditolak karena total XP akan kurang dari 0.")).toBeVisible();
    await expect(summary(page).first()).toHaveText("1.700");
  });

  test("memberi lalu mencabut membership manual", async ({ page }) => {
    await openSari(page);
    const grant = page.getByRole("form", { name: "Berikan membership" });

    await grant.getByLabel("Paket").selectOption("premium");
    await grant.getByLabel("Durasi").selectOption({ label: "30 hari" });
    await grant.getByLabel("Alasan").fill("Hadiah penguji UAT");
    await grant.getByRole("button", { name: "Berikan membership" }).click();

    await expect(notification(page, "Membership Premium diberikan.")).toBeVisible();
    await expect(summary(page).nth(2)).toHaveText("Premium");
    const revoke = page.getByRole("form", { name: "Cabut membership" });
    await expect(revoke).toContainText("Berlaku: Premium sampai");

    await revoke.getByLabel("Alasan pencabutan").fill("Masa uji selesai");
    await revoke.getByRole("button", { name: "Cabut membership" }).click();

    await expect(notification(page, "Membership manual dicabut. Membership sekarang Basic.")).toBeVisible();
    await expect(summary(page).nth(2)).toHaveText("Basic");
    await expect(revoke).toBeHidden();
    const history = page.getByRole("region", { name: "Riwayat membership" });
    await expect(history).toContainText("Premium · Pemberian manual");
    await expect(history).toContainText("Dicabut: Masa uji selesai");
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`aksesibilitas mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("daftar dan detail pengguna tanpa pelanggaran critical dan serious", async ({ page }) => {
        await openSari(page);
        const detail = await new AxeBuilder({ page }).analyze();
        expect(detail.violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);

        await page.getByRole("link", { name: "Kembali ke daftar pengguna" }).click();
        await expect(page.getByRole("main")).toContainText("Budi Santoso");
        const list = await new AxeBuilder({ page }).analyze();
        expect(list.violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
      });
    });
  }
});
