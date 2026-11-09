import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class SettingsPage extends BasePage {
  readonly publicProfileSwitch: Locator;
  readonly notificationSection: Locator;
  readonly profileSection: Locator;
  readonly nameInput: Locator;
  readonly bioInput: Locator;
  readonly saveProfileButton: Locator;
  readonly usernameInput: Locator;
  readonly changeUsernameButton: Locator;
  readonly emailInput: Locator;
  readonly changeEmailButton: Locator;

  constructor(page: Page) {
    super(page, "/settings");
    this.publicProfileSwitch = page.getByRole("switch", { name: "Profil dapat dilihat publik" });
    this.notificationSection = page.locator("#notifikasi");
    this.profileSection = page.getByRole("region", { name: "Informasi Profil" });
    this.nameInput = this.profileSection.getByRole("textbox", { name: "Nama tampilan" });
    this.bioInput = this.profileSection.getByRole("textbox", { name: "Tentang saya" });
    this.saveProfileButton = this.profileSection.getByRole("button", { name: "Simpan Profil" });
    this.usernameInput = this.profileSection.getByRole("textbox", { name: "Username" });
    this.changeUsernameButton = this.profileSection.getByRole("button", { name: "Ganti Username" });
    this.emailInput = this.profileSection.getByRole("textbox", { name: "Email" });
    this.changeEmailButton = this.profileSection.getByRole("button", { name: "Ganti Email" });
  }

  notificationSwitch(name: string) {
    return this.notificationSection.getByRole("switch", { name, exact: true });
  }
}
