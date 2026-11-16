import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { MOCK_TOTP_CODE, MockAccount, mockSupabase, signInWithMock, uniqueMockAccount } from "../fixtures/supabaseMock";

// Profil dan Pengaturan Admin (PRD FR-16 L): identitas tanpa foto, status keamanan, ringkasan
// kerja, dan pengaturan tanpa bagian khusus pelajar.

const profileMenu = (page: Page) => page.getByRole("button", { name: /^Buka menu profil/ });

test.describe("Profil dan Pengaturan Admin akun demo", () => {
  test.use({ role: "admin" });

  test("mode Admin memakai inisial, bukan avatar, dan menu profil membuka halaman Admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(profileMenu(page).locator("[data-admin-initials]")).toHaveText("AB");
    await expect(profileMenu(page).locator("img")).toHaveCount(0);

    await profileMenu(page).click();
    const menu = page.getByRole("navigation", { name: "Menu profil" });
    await expect(menu.getByRole("link", { name: "Profil" })).toHaveAttribute("href", "/admin/profil");
    await expect(menu.getByRole("link", { name: "Pengaturan" })).toHaveAttribute("href", "/admin/pengaturan");

    // Mode Belajar memakai avatar kucing lagi.
    await menu.getByRole("menuitemradio", { name: "Mode Belajar" }).click();
    await expect(page).toHaveURL("/");
    await expect(profileMenu(page).locator("img")).toHaveCount(1);
    await expect(profileMenu(page).locator("[data-admin-initials]")).toHaveCount(0);
  });

  test("Profil Admin memuat info akun, status verifikasi, dan ringkasan kerja tanpa XP", async ({ page }) => {
    await page.goto("/admin/profil");
    await expect(page.getByRole("heading", { level: 1, name: "Admin Belajar" })).toBeVisible();
    const info = page.getByRole("region", { name: "Info Akun" });
    await expect(info).toContainText("admin@demo.belajarautomation.com");
    await expect(info).toContainText("Admin");
    await expect(page.getByRole("region", { name: "Verifikasi Dua Langkah" })).toContainText("Akun demo DEV tidak memakai verifikasi dua langkah");
    const work = page.getByRole("region", { name: "Ringkasan Kerja" });
    await expect(work).toContainText("0 aksi Admin dalam 30 hari terakhir");
    await expect(page.getByRole("main")).not.toContainText(/\bXP\b|Rank/);

    // Satu aksi Admin menambah ringkasan kerja dan tautan Log tersaring ke Admin ini.
    await page.goto("/admin/pengguna/user-sobat");
    await page.getByRole("region", { name: "Ringkasan Belajar" }).getByRole("button", { name: "Koreksi XP" }).click();
    await page.getByRole("dialog").getByRole("spinbutton", { name: /Jumlah koreksi/ }).fill("10");
    await page.getByRole("dialog").getByRole("textbox", { name: "Alasan" }).fill("Uji ringkasan kerja.");
    await page.getByRole("dialog").getByRole("button", { name: "Simpan koreksi" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.goto("/admin/profil");
    await expect(work).toContainText("1 aksi Admin dalam 30 hari terakhir");
    await work.getByRole("link", { name: "Lihat aksi saya di Log Aktivitas Admin" }).click();
    await expect(page).toHaveURL(/\/admin\/log\?admin=/);
    await expect(page.getByRole("combobox", { name: "Filter Admin" })).not.toHaveValue("");
    await expect(page.getByRole("main")).toContainText("Uji ringkasan kerja.");
  });

  test("Pengaturan Admin hanya berisi bagian Admin; aksi backend dinonaktifkan untuk akun demo", async ({ page }) => {
    await page.goto("/admin/pengaturan");
    await expect(page.getByRole("heading", { level: 1, name: "Pengaturan Admin" })).toBeVisible();
    const sections = page.getByRole("main").getByRole("heading", { level: 2 });
    await expect(sections).toHaveText(["Informasi Akun", "Keamanan", "Notifikasi Admin", "Tampilan"]);
    await expect(page.getByRole("main")).not.toContainText(/Hapus Akun|Zona Berbahaya|Profil dapat dilihat publik/);

    const account = page.getByRole("region", { name: "Informasi Akun" });
    await expect(account.getByRole("textbox", { name: "Email" })).toHaveAttribute("readonly", "");
    await expect(account.getByRole("button", { name: "Simpan nama" })).toBeDisabled();
    const security = page.getByRole("region", { name: "Keamanan" });
    await expect(security.getByRole("button", { name: "Ganti password" })).toBeDisabled();
    await expect(security.getByRole("button", { name: "Atur ulang authenticator" })).toBeDisabled();
    await expect(security.getByRole("button", { name: "Keluar dari semua perangkat" })).toBeDisabled();
  });

  test("pilihan notifikasi Admin diingat dan mode warna bisa diganti", async ({ page }) => {
    await page.goto("/admin/pengaturan");
    const moderation = page.getByRole("checkbox", { name: /Akun ditandai Moderasi/ });
    await expect(moderation).toBeChecked();
    await moderation.uncheck();
    await page.reload();
    await expect(page.getByRole("checkbox", { name: /Akun ditandai Moderasi/ })).not.toBeChecked();

    await page.getByRole("radio", { name: "Gelap" }).check();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Profil dan Pengaturan Admin akun sungguhan", () => {
  const ADMIN: MockAccount = uniqueMockAccount({ roles: ["student", "admin"], factors: [{ id: "faktor-admin", status: "verified" }] });

  async function openAs(page: Page, path: string) {
    await mockSupabase(page, { accounts: [ADMIN] });
    // Login mengarah ke Dashboard Admin; verifikasi dua langkah di sana, lalu buka halaman tujuan.
    await signInWithMock(page, ADMIN, "/admin");
    await page.getByLabel("Kode 6 digit").fill(MOCK_TOTP_CODE);
    await page.getByRole("button", { name: "Verifikasi" }).click();
    await expect(page.getByRole("heading", { name: "Halo, Admin!" })).toBeVisible();
    await page.goto(path);
  }

  test("status verifikasi aktif, dan atur ulang authenticator meminta kode QR baru", async ({ page }) => {
    await openAs(page, "/admin/profil");
    await expect(page.getByRole("region", { name: "Verifikasi Dua Langkah" })).toContainText("Aktif sejak 1 Nov 2026");

    await page.goto("/admin/pengaturan");
    const security = page.getByRole("region", { name: "Keamanan" });
    await expect(security).toContainText("Aktif sejak 1 Nov 2026");
    await security.getByRole("button", { name: "Atur ulang authenticator" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Atur ulang" }).click();

    // Admin dikeluarkan, lalu saat masuk lagi wajib memindai kode QR baru.
    await expect(page).toHaveURL("/login");
    await signInWithMock(page, ADMIN, "/admin");
    await expect(page.getByRole("heading", { name: "Aktifkan verifikasi dua langkah" })).toBeVisible();
  });

  test("ganti password memeriksa panjang dan konfirmasi", async ({ page }) => {
    await openAs(page, "/admin/pengaturan");
    const form = page.getByRole("form", { name: "Ganti password" });
    await form.getByLabel("Password baru").fill("pendek");
    await form.getByLabel("Konfirmasi password").fill("pendek");
    await form.getByRole("button", { name: "Ganti password" }).click();
    await expect(form.getByRole("alert")).toHaveText("Password minimal 8 karakter.");

    await form.getByLabel("Password baru").fill("PasswordBaru1");
    await form.getByLabel("Konfirmasi password").fill("PasswordBeda1");
    await form.getByRole("button", { name: "Ganti password" }).click();
    await expect(form.getByRole("alert")).toHaveText("Konfirmasi password tidak sama.");
  });
});
