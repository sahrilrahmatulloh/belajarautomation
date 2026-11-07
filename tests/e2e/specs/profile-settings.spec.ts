import { expect, test } from "../fixtures/auth";
import { MOCK_STUDENT, mockSupabase, signInWithMock } from "../fixtures/supabaseMock";
import { ProfilePage } from "../pages/ProfilePage";
import { SettingsPage } from "../pages/SettingsPage";

// Pengaturan Informasi Profil untuk akun Supabase (PRD FR-13): nama tampilan, Tentang saya,
// username dengan jeda 30 hari, dan email dengan konfirmasi ke email lama dan baru.

test.describe("Informasi Profil akun Supabase", () => {
  test("menyimpan nama dan Tentang saya, lalu tampil di header profil dengan tautan yang aman", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const settings = new SettingsPage(page);
    await settings.goto();
    await expect(settings.nameInput).toHaveValue(MOCK_STUDENT.name);

    await settings.nameInput.fill("Pelajar Baru");
    await settings.bioInput.fill("Belajar Playwright. Portofolio: https://contoh.id/porto. Bukan tautan: javascript:alert(1)");
    await expect(settings.profileSection.getByText(/^\d+\/160$/)).toBeVisible();
    await settings.saveProfileButton.click();

    await expect(settings.profileSection.getByRole("status").filter({ hasText: "Profil tersimpan." })).toBeVisible();
    expect(supabase.find("/rest/v1/rpc/update_profile")?.postDataJSON()).toMatchObject({ new_display_name: "Pelajar Baru" });

    const profile = new ProfilePage(page);
    await profile.goto();
    await expect(profile.header.getByRole("heading", { level: 1 })).toHaveText("Pelajar Baru");
    const link = profile.header.getByRole("link", { name: /contoh\.id\/porto/ });
    await expect(link).toHaveAttribute("href", "https://contoh.id/porto");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "nofollow ugc noopener noreferrer");
    await expect(profile.header.getByRole("link", { name: /javascript/ })).toHaveCount(0);
    await expect(profile.header).toContainText("javascript:alert(1)");
  });

  test("nama tampilan wajib diisi", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const settings = new SettingsPage(page);
    await settings.goto();

    await settings.nameInput.fill("  ");
    await settings.saveProfileButton.click();

    await expect(settings.profileSection.getByText("Nama tampilan wajib diisi.")).toBeVisible();
    await expect(settings.nameInput).toHaveAttribute("aria-invalid", "true");
    expect(supabase.find("/rest/v1/rpc/update_profile")).toBeUndefined();
  });

  test("ganti username lalu terkunci 30 hari", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const settings = new SettingsPage(page);
    await settings.goto();
    await expect(settings.usernameInput).toHaveValue(MOCK_STUDENT.username!);

    await settings.usernameInput.fill("Pelajar_Hebat");
    await settings.changeUsernameButton.click();

    await expect(settings.profileSection.getByRole("status").filter({ hasText: /^Username diganti\. Bisa diganti lagi mulai / })).toBeVisible();
    expect(supabase.find("/rest/v1/rpc/change_username")?.postDataJSON()).toEqual({ new_username: "pelajar_hebat" });
    await expect(settings.usernameInput).toBeDisabled();
    await expect(settings.profileSection.getByText(/^Username bisa diganti lagi mulai /)).toBeVisible();
  });

  test("username yang sudah dipakai ditolak", async ({ page }) => {
    await mockSupabase(page, { usernames: { sobat_lain: "dipakai" } });
    await signInWithMock(page, MOCK_STUDENT);
    const settings = new SettingsPage(page);
    await settings.goto();

    await settings.usernameInput.fill("sobat_lain");
    await settings.changeUsernameButton.click();

    await expect(settings.profileSection.getByText("Username sudah dipakai. Pilih yang lain.")).toBeVisible();
    await expect(settings.usernameInput).toHaveAttribute("aria-invalid", "true");
  });

  test("username yang baru diganti tidak bisa diganti sebelum 30 hari", async ({ page }) => {
    const changedAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    await mockSupabase(page, { accounts: [{ ...MOCK_STUDENT, usernameChangedAt: changedAt }] });
    await signInWithMock(page, MOCK_STUDENT);
    const settings = new SettingsPage(page);
    await settings.goto();

    await expect(settings.usernameInput).toBeDisabled();
    await expect(settings.changeUsernameButton).toBeDisabled();
    await expect(settings.profileSection.getByText(/^Username bisa diganti lagi mulai /)).toBeVisible();
  });

  test("ganti email mengirim konfirmasi ke email lama dan baru", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);
    const settings = new SettingsPage(page);
    await settings.goto();

    await settings.emailInput.fill("Baru@Contoh.id");
    await settings.changeEmailButton.click();

    await expect(
      settings.profileSection.getByRole("status").filter({ hasText: `${MOCK_STUDENT.email} dan baru@contoh.id` })
    ).toBeVisible();
    await expect(settings.profileSection.getByText("Menunggu konfirmasi ke baru@contoh.id.", { exact: false })).toBeVisible();
    const update = supabase.requests.find((request) => request.method() === "PUT" && request.url().includes("/auth/v1/user"));
    expect(update?.postDataJSON()).toMatchObject({ email: "baru@contoh.id" });
    expect(new URL(update!.url()).searchParams.get("redirect_to")).toContain(
      `/auth/callback?next=${encodeURIComponent("/settings?email=dikonfirmasi")}`
    );
  });

  test("kembali dari tautan konfirmasi email menampilkan pesan", async ({ page }) => {
    await mockSupabase(page);
    await signInWithMock(page, MOCK_STUDENT);

    await page.goto("/settings?email=dikonfirmasi");

    await expect(page.getByRole("status").filter({ hasText: "Konfirmasi diterima." })).toBeVisible();
  });
});

test.describe("Informasi Profil akun demo", () => {
  test.use({ role: "user" });

  test("isian tampil tetapi tidak dapat diubah", async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();

    await expect(settings.profileSection.getByText("Akun demo tidak dapat diubah.", { exact: false })).toBeVisible();
    await expect(settings.nameInput).toBeDisabled();
    await expect(settings.saveProfileButton).toBeDisabled();
    await expect(settings.changeUsernameButton).toBeDisabled();
    await expect(settings.changeEmailButton).toBeDisabled();
    await expect(settings.profileSection.getByRole("link", { name: "Ganti avatar di Kustomisasi" })).toHaveAttribute(
      "href",
      "/profile?tab=kustomisasi"
    );
  });
});

test("callback konfirmasi email yang gagal kembali ke Pengaturan", async ({ page }) => {
  const next = encodeURIComponent("/settings?email=dikonfirmasi");
  const response = await page.request.get(`/auth/callback?next=${next}&error=access_denied&error_code=otp_expired`, {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(307);
  expect(response.headers().location).toMatch(/\/settings\?email=gagal$/);
});
