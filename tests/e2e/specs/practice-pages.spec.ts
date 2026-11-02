import { expect, test } from "../fixtures/auth";
import { PracticeSite } from "../pages/PracticeSite";

test.use({ role: "user" });

test.describe("Halaman latihan login", () => {
  let site: PracticeSite;

  test.beforeEach(async ({ page }) => {
    site = new PracticeSite(page, "bug-hunt-form-login");
    await site.goto();
    await expect(site.frame).toBeVisible();
  });

  test("berbingkai dan berlabel jelas sebagai halaman latihan", async () => {
    await expect(site.frame.getByText("Halaman latihan", { exact: true })).toBeVisible();
    await expect(site.frame.getByText(/bukan fitur sungguhan/)).toBeVisible();
  });

  test("tidak mengirim data ke mana pun saat form dikirim", async ({ page }) => {
    const submissions: string[] = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") submissions.push(request.url());
    });

    await site.element("login-email").fill("siswa@contoh.test");
    await site.element("login-password").fill("latihan123");
    await site.element("login-submit").click();

    await expect(site.element("login-success")).toBeVisible();
    expect(submissions).toEqual([]);
    await expect(page).toHaveURL("/playground/bug-hunt-form-login");
  });

  test("bug: form tetap diterima walau email kosong", async () => {
    await expect(site.element("login-submit")).toBeEnabled();

    await site.element("login-password").fill("latihan123");
    await site.element("login-submit").click();

    await expect(site.element("login-success")).toBeVisible();
  });

  test("bug: pesan error password salah ketik", async () => {
    await site.element("login-email").fill("siswa@contoh.test");
    await site.element("login-password").fill("salah");
    await site.element("login-submit").click();

    await expect(site.element("login-error")).toHaveText("Pasword salah.");
  });

  test("bukan bug: password tersamarkan, label terhubung, dan tautan daftar ada", async ({ page }) => {
    await expect(site.element("login-password")).toHaveAttribute("type", "password");
    await expect(site.frame.getByLabel("Email")).toHaveAttribute("data-practice-id", "login-email");
    await expect(site.frame.getByRole("link", { name: "Daftar" })).toBeVisible();

    await site.frame.getByRole("link", { name: "Daftar" }).click();
    await expect(page).toHaveURL("/playground/bug-hunt-form-login");
  });
});

test.describe("Halaman latihan checkout", () => {
  let site: PracticeSite;

  test.beforeEach(async ({ page }) => {
    site = new PracticeSite(page, "find-checkout-bug");
    await site.goto();
    await expect(site.frame).toBeVisible();
  });

  test("bug: total tidak dikurangi diskon", async () => {
    await expect(site.element("checkout-subtotal")).toHaveText("Rp200.000");
    await expect(site.element("checkout-discount")).toHaveText("-Rp20.000");
    await expect(site.element("checkout-shipping")).toHaveText("Rp15.000");
    await expect(site.element("checkout-total")).toHaveText("Rp215.000");
  });

  test("bug: subtotal tidak berubah saat jumlah diubah", async () => {
    await site.element("checkout-plus-kaos").click();

    await expect(site.element("checkout-quantity-kaos")).toHaveText("2");
    await expect(site.element("checkout-subtotal")).toHaveText("Rp200.000");
  });

  test("bug: jumlah bisa dikurangi sampai di bawah 1", async () => {
    await site.element("checkout-minus-kaos").click();
    await expect(site.element("checkout-quantity-kaos")).toHaveText("0");

    await site.element("checkout-minus-kaos").click();
    await expect(site.element("checkout-quantity-kaos")).toHaveText("-1");
  });

  test("bukan bug: metode pembayaran bisa dipilih", async () => {
    await site.element("checkout-method-cod").check();

    await expect(site.element("checkout-method-cod")).toBeChecked();
    await expect(site.element("checkout-method-transfer")).not.toBeChecked();
  });
});

test.describe("Halaman latihan registrasi", () => {
  let site: PracticeSite;

  test.beforeEach(async ({ page }) => {
    site = new PracticeSite(page, "locator-form-registrasi");
    await site.goto();
    await expect(site.frame).toBeVisible();
  });

  test("pendaftaran mewajibkan persetujuan syarat dan ketentuan", async () => {
    await site.element("registrasi-submit").click();
    await expect(site.element("registrasi-error")).toBeVisible();

    await site.element("registrasi-syarat").check();
    await site.element("registrasi-submit").click();

    await expect(site.element("registrasi-success")).toBeVisible();
    await expect(site.element("registrasi-error")).toBeHidden();
  });

  test("selector umum mengenai lebih dari satu kotak centang", async () => {
    await expect(site.frame.locator('input[type="checkbox"]')).toHaveCount(2);
  });
});
