import { Locator, Page } from "@playwright/test";

// Modal Bagikan Profil yang dibuka dari header halaman profil.
export class ShareProfileDialog {
  readonly dialog: Locator;
  readonly card: Locator;
  readonly downloadLink: Locator;
  readonly copyButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole("dialog", { name: "Bagikan Profil" });
    this.card = this.dialog.getByRole("img", { name: /^Kartu profil / });
    this.downloadLink = this.dialog.getByRole("link", { name: "Unduh PNG" });
    this.copyButton = this.dialog.getByRole("button", { name: "Salin tautan" });
    this.closeButton = this.dialog.getByRole("button", { name: "Tutup" });
  }

  socialLink(name: string) {
    return this.dialog.getByRole("link", { name, exact: true });
  }
}
