import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { MOCK_TOTP_CODE, MOCK_TOTP_SECRET, MockAccount, mockSupabase, signInWithMock, uniqueMockAccount } from "../fixtures/supabaseMock";

// Halaman Admin untuk akun sungguhan wajib verifikasi dua langkah (PRD 8.3).

const ADMIN: MockAccount = uniqueMockAccount({ roles: ["student", "admin"] });

async function openAdmin(page: Page, account: MockAccount) {
  await mockSupabase(page, { accounts: [account] });
  await signInWithMock(page, account, account.roles?.includes("admin") ? "/admin" : "/");
  await page.goto("/admin/pengguna");
}

const gate = (page: Page) => page.getByRole("region", { name: "Verifikasi Admin" });
const codeInput = (page: Page) => page.getByLabel("Kode 6 digit");
const usersHeading = (page: Page) => page.getByRole("heading", { level: 1, name: "Pengguna dan Peran" });

test.describe("Verifikasi dua langkah Admin", () => {
  test("Admin tanpa authenticator mendaftarkan QR lalu masuk dengan kode", async ({ page }) => {
    await openAdmin(page, { ...ADMIN, factors: [] });

    await expect(gate(page).getByRole("heading", { name: "Aktifkan verifikasi dua langkah" })).toBeVisible();
    await expect(gate(page).getByRole("img", { name: "Kode QR untuk aplikasi authenticator" })).toBeVisible();
    await expect(gate(page)).toContainText(MOCK_TOTP_SECRET);
    await expect(usersHeading(page)).toBeHidden();

    await codeInput(page).fill("000000");
    await gate(page).getByRole("button", { name: "Aktifkan dan masuk" }).click();
    await expect(gate(page).getByRole("alert")).toHaveText("Kode salah atau sudah kedaluwarsa. Periksa aplikasi authenticator, lalu coba lagi.");

    await codeInput(page).fill(MOCK_TOTP_CODE);
    await gate(page).getByRole("button", { name: "Aktifkan dan masuk" }).click();

    await expect(usersHeading(page)).toBeVisible();
    await expect(gate(page)).toBeHidden();
  });

  test("Admin yang sudah punya authenticator cukup memasukkan kode", async ({ page }) => {
    await openAdmin(page, { ...ADMIN, factors: [{ id: "faktor-lama", status: "verified" }] });

    await expect(gate(page).getByRole("heading", { name: "Verifikasi dua langkah" })).toBeVisible();
    await expect(gate(page).getByRole("img")).toHaveCount(0);
    await expect(gate(page).getByRole("button", { name: "Verifikasi" })).toBeDisabled();

    await codeInput(page).fill(MOCK_TOTP_CODE);
    await gate(page).getByRole("button", { name: "Verifikasi" }).click();

    await expect(usersHeading(page)).toBeVisible();
  });

  test("kode hanya menerima angka, maksimal 6 digit", async ({ page }) => {
    await openAdmin(page, { ...ADMIN, factors: [{ id: "faktor-lama", status: "verified" }] });

    await codeInput(page).fill("12ab3456789");
    await expect(codeInput(page)).toHaveValue("123456");

    // Kode berspasi yang disalin dari aplikasi authenticator tetap utuh.
    await codeInput(page).fill("654 321");
    await expect(codeInput(page)).toHaveValue("654321");
  });

  test("akun tanpa peran Admin tidak bisa membuka halaman Admin", async ({ page }) => {
    await openAdmin(page, uniqueMockAccount());

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1, name: /^Halo,/ })).toBeVisible();
    await expect(usersHeading(page)).toBeHidden();
    await expect(gate(page)).toBeHidden();
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`aksesibilitas mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("halaman pendaftaran QR tanpa pelanggaran critical dan serious", async ({ page }) => {
        await openAdmin(page, { ...ADMIN, factors: [] });
        await expect(gate(page).getByRole("img", { name: "Kode QR untuk aplikasi authenticator" })).toBeVisible();

        const { violations } = await new AxeBuilder({ page }).analyze();

        expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
      });
    });
  }
});
