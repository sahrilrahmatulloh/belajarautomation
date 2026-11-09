import { Locator, Page } from "@playwright/test";

import { ACCOUNTS, Role } from "../fixtures/testData";
import { BasePage } from "./BasePage";

// Dashboard Creator, Reviewer, dan Admin.
export class RoleDashboardPage extends BasePage {
  readonly greeting: Locator;
  readonly previewNotice: Locator;

  constructor(page: Page, role: Exclude<Role, "user">) {
    super(page, ACCOUNTS[role].home);
    this.greeting = page.getByRole("heading", { level: 1, name: /^Halo, / });
    this.previewNotice = page.getByRole("note").filter({ hasText: "Mode pratinjau" });
  }
}
