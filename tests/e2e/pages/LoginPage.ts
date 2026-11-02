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

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
