import { expect, test } from "../fixtures/auth";
import { MOCK_STUDENT, mockSupabase } from "../fixtures/supabaseMock";
import { ForgotPasswordPage, RegisterPage, ResetPasswordPage } from "../pages/AuthPages";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";

// Masuk, daftar, dan password lewat Supabase Auth (PRD 4.5, docs/DATABASE.md Fase 2b).
// Supabase ditiru di browser (fixtures/supabaseMock.ts), jadi tidak ada email terkirim.

async function signInAsStudent(page: import("@playwright/test").Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(MOCK_STUDENT.email, MOCK_STUDENT.password);
  await expect(new DashboardPage(page).greeting).toContainText(MOCK_STUDENT.name);
}

test.describe("Masuk dengan akun Supabase", () => {
  test("akun terverifikasi masuk dan sampai di dashboard dengan namanya", async ({ page }) => {
    await mockSupabase(page);

    await signInAsStudent(page);

    await expect(page).toHaveURL("/");
  });

  test("password salah menampilkan pesan error dan tetap di halaman login", async ({ page }) => {
    await mockSupabase(page);
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(MOCK_STUDENT.email, "password-salah");

    await expect(loginPage.formError).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("email belum terverifikasi dapat mengirim ulang email verifikasi", async ({ page }) => {
    const supabase = await mockSupabase(page, { accounts: [{ ...MOCK_STUDENT, emailConfirmed: false }] });
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(MOCK_STUDENT.email, MOCK_STUDENT.password);
    await expect(page.getByRole("alert").filter({ hasText: "Email belum diverifikasi" })).toBeVisible();
    await page.getByRole("button", { name: "Kirim ulang email verifikasi" }).click();

    await expect(page.getByRole("status").filter({ hasText: "Email verifikasi dikirim ulang" })).toBeVisible();
    expect(supabase.find("/auth/v1/resend")?.postDataJSON()).toMatchObject({ type: "signup", email: MOCK_STUDENT.email });
  });

  test("akun nonaktif ditolak dan sesinya diakhiri", async ({ page }) => {
    const supabase = await mockSupabase(page, { accounts: [{ ...MOCK_STUDENT, status: "deactivated" }] });
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(MOCK_STUDENT.email, MOCK_STUDENT.password);

    await expect(page.getByRole("alert").filter({ hasText: "Akun ini dinonaktifkan. Hubungi Admin." })).toBeVisible();
    await expect(page).toHaveURL("/login");
    await expect.poll(() => supabase.find("/auth/v1/logout")).toBeTruthy();
  });

  test("keluar mengakhiri sesi Supabase dan kembali ke halaman login", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInAsStudent(page);

    await new DashboardPage(page).logout();

    await expect(page).toHaveURL("/login");
    await expect.poll(() => supabase.find("/auth/v1/logout")).toBeTruthy();
  });

  test("sesi tetap ada setelah halaman dimuat ulang", async ({ page }) => {
    await mockSupabase(page);
    await signInAsStudent(page);

    await page.reload();

    await expect(page).toHaveURL("/");
    await expect(new DashboardPage(page).greeting).toContainText(MOCK_STUDENT.name);
  });
});

test.describe("Daftar dengan email", () => {
  const input = { name: "Sobat Baru", username: "Sobat_Baru", email: "Baru@Contoh.id", password: "rahasia123" };

  test("akun baru diminta memverifikasi email, dengan username dan alamat kembali yang benar", async ({ page }) => {
    const supabase = await mockSupabase(page);
    const register = new RegisterPage(page);
    await register.goto();

    await register.register(input);

    await expect(register.sentHeading).toBeVisible();
    await expect(page.getByText("baru@contoh.id")).toBeVisible();
    const signup = supabase.find("/auth/v1/signup");
    expect(signup?.postDataJSON()).toMatchObject({
      email: "baru@contoh.id",
      data: { full_name: "Sobat Baru", username: "sobat_baru" },
    });
    expect(new URL(signup!.url()).searchParams.get("redirect_to")).toContain("/auth/callback?next=");
  });

  test("username yang sudah dipakai ditolak sebelum akun dibuat", async ({ page }) => {
    const supabase = await mockSupabase(page, { usernames: { sobat_baru: "dipakai" } });
    const register = new RegisterPage(page);
    await register.goto();

    await register.register(input);

    await expect(page.getByText("Username sudah dipakai. Pilih yang lain.")).toBeVisible();
    await expect(register.usernameInput).toHaveAttribute("aria-invalid", "true");
    expect(supabase.find("/auth/v1/signup")).toBeUndefined();
  });

  test("username cadangan ditolak", async ({ page }) => {
    await mockSupabase(page, { usernames: { admin: "cadangan" } });
    const register = new RegisterPage(page);
    await register.goto();

    await register.register({ ...input, username: "admin" });

    await expect(page.getByText("Username ini tidak dapat dipakai. Pilih yang lain.")).toBeVisible();
  });

  test("format username diperiksa langsung di form", async ({ page }) => {
    const supabase = await mockSupabase(page);
    const register = new RegisterPage(page);
    await register.goto();

    await register.register({ ...input, username: "1sobat" });
    await expect(page.getByText("Username tidak boleh diawali angka.")).toBeVisible();

    await register.usernameInput.fill("ab");
    await register.submitButton.click();
    await expect(page.getByText("Username 3–20 karakter.")).toBeVisible();

    await register.usernameInput.fill("sobat-qa");
    await register.submitButton.click();
    await expect(page.getByText("Username hanya boleh huruf kecil, angka, dan garis bawah (_).")).toBeVisible();

    expect(supabase.find("/rest/v1/rpc/check_username")).toBeUndefined();
  });
});

test.describe("Lupa dan reset password", () => {
  test("tautan Lupa password membuka halaman permintaan reset", async ({ page }) => {
    await mockSupabase(page);
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await page.getByRole("link", { name: "Lupa password?" }).click();

    await expect(page).toHaveURL("/forgot-password");
  });

  test("permintaan reset selalu menampilkan pesan yang sama dan memakai alamat kembali yang benar", async ({ page }) => {
    const supabase = await mockSupabase(page);
    const forgot = new ForgotPasswordPage(page);
    await forgot.goto();

    await forgot.emailInput.fill("siapa.saja@contoh.id");
    await forgot.submitButton.click();

    await expect(forgot.sentHeading).toBeVisible();
    await expect(page.getByText(/Jika siapa\.saja@contoh\.id terdaftar/)).toBeVisible();
    const recover = supabase.find("/auth/v1/recover");
    expect(recover?.postDataJSON()).toMatchObject({ email: "siapa.saja@contoh.id" });
    expect(new URL(recover!.url()).searchParams.get("redirect_to")).toContain(
      `/auth/callback?next=${encodeURIComponent("/reset-password")}`
    );
  });

  test("halaman reset tanpa tautan yang valid meminta tautan baru", async ({ page }) => {
    await mockSupabase(page);
    const reset = new ResetPasswordPage(page);
    await reset.goto();

    await expect(reset.invalidHeading).toBeVisible();
    await reset.requestNewLink.click();
    await expect(page).toHaveURL("/forgot-password");
  });

  test("pengguna dengan sesi dari tautan reset dapat menyimpan password baru", async ({ page }) => {
    const supabase = await mockSupabase(page);
    await signInAsStudent(page);
    const reset = new ResetPasswordPage(page);
    await reset.goto();

    await reset.passwordInput.fill("passwordbaru1");
    await reset.confirmPasswordInput.fill("passwordbaru1");
    await reset.submitButton.click();

    await expect(page).toHaveURL("/");
    const update = supabase.requests.find((request) => request.method() === "PUT" && request.url().endsWith("/auth/v1/user"));
    expect(update?.postDataJSON()).toMatchObject({ password: "passwordbaru1" });
  });
});

test.describe("Pesan dari tautan email", () => {
  test("verifikasi berhasil menampilkan ajakan masuk", async ({ page }) => {
    await page.goto("/login?auth=verified");

    await expect(page.getByRole("status").filter({ hasText: "Email sudah terverifikasi. Silakan masuk." })).toBeVisible();
  });

  test("tautan reset kedaluwarsa menampilkan pesan error", async ({ page }) => {
    await page.goto("/login?auth=reset-invalid");

    await expect(page.getByRole("alert").filter({ hasText: "Tautan reset password tidak valid atau sudah kedaluwarsa." })).toBeVisible();
  });

  test("callback dengan error dari Supabase diarahkan ke login dengan pesan tautan tidak valid", async ({ page }) => {
    await page.goto("/auth/callback?error=access_denied&error_code=otp_expired");

    await expect(page).toHaveURL("/login?auth=link-invalid");
  });

  test("callback reset tanpa kode diarahkan ke login dengan pesan reset tidak valid", async ({ page }) => {
    await page.goto(`/auth/callback?next=${encodeURIComponent("/reset-password")}`);

    await expect(page).toHaveURL("/login?auth=reset-invalid");
  });

  test("callback tidak mengarahkan ke situs lain", async ({ page }) => {
    await page.goto(`/auth/callback?next=${encodeURIComponent("//contoh-jahat.id")}`);

    await expect(page).toHaveURL("/login?auth=verified");
  });
});
