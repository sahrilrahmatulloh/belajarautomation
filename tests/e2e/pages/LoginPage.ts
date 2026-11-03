import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly formError: Locator;

  constructor(page: Page) {
    super(page, "/login");
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.submitButton = page.getByRole("button", { name: "Masuk" });
    this.formError = page.getByRole("alert").filter({ hasText: "Email atau password salah." });
  }

  // Membuka halaman dengan JavaScript tertahan, seperti di koneksi lambat: form sudah
  // tampil tetapi belum interaktif. Fungsi yang dikembalikan melepas JavaScript-nya.
  async gotoBeforeHydration() {
    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await this.page.route("**/_next/static/**/*.js", async (route) => {
      await gate;
      await route.continue();
    });
    await this.page.goto(this.path, { waitUntil: "commit" });
    await this.emailInput.waitFor();
    return release;
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
