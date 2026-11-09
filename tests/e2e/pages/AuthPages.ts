import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

// Halaman daftar /register.
export class RegisterPage extends BasePage {
  readonly nameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly agreeCheckbox: Locator;
  readonly submitButton: Locator;
  readonly sentHeading: Locator;
  readonly resendButton: Locator;

  constructor(page: Page) {
    super(page, "/register");
    this.nameInput = page.getByRole("textbox", { name: "Nama lengkap" });
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password", exact: true });
    this.confirmPasswordInput = page.getByRole("textbox", { name: "Konfirmasi password" });
    this.agreeCheckbox = page.getByRole("checkbox", { name: /Saya menyetujui/ });
    this.submitButton = page.getByRole("button", { name: "Buat Akun" });
    this.sentHeading = page.getByRole("heading", { name: "Cek email kamu" });
    this.resendButton = page.getByRole("button", { name: "Kirim ulang email verifikasi" });
  }

  async register(input: { name: string; username: string; email: string; password: string }) {
    await this.nameInput.fill(input.name);
    await this.usernameInput.fill(input.username);
    await this.emailInput.fill(input.email);
    await this.passwordInput.fill(input.password);
    await this.confirmPasswordInput.fill(input.password);
    await this.agreeCheckbox.check();
    await this.submitButton.click();
  }
}

// Halaman /forgot-password.
export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly sentHeading: Locator;

  constructor(page: Page) {
    super(page, "/forgot-password");
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.submitButton = page.getByRole("button", { name: "Kirim tautan reset" });
    this.sentHeading = page.getByRole("heading", { name: "Cek email kamu" });
  }
}

// Halaman /reset-password.
export class ResetPasswordPage extends BasePage {
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly invalidHeading: Locator;
  readonly requestNewLink: Locator;

  constructor(page: Page) {
    super(page, "/reset-password");
    this.passwordInput = page.getByRole("textbox", { name: "Password baru", exact: true });
    this.confirmPasswordInput = page.getByRole("textbox", { name: "Konfirmasi password baru" });
    this.submitButton = page.getByRole("button", { name: "Simpan password baru" });
    this.invalidHeading = page.getByRole("heading", { name: "Tautan tidak valid" });
    this.requestNewLink = page.getByRole("link", { name: "Minta tautan baru" });
  }
}
