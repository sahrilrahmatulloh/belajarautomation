import { Page } from "@playwright/test";

import { ACCOUNTS, Role } from "../fixtures/testData";
import { BasePage } from "./BasePage";

// Dashboard Creator, Reviewer, dan Admin.
export class RoleDashboardPage extends BasePage {
  constructor(page: Page, role: Exclude<Role, "user">) {
    super(page, ACCOUNTS[role].home);
  }
}
