import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class ChallengePage extends BasePage {
  readonly answerInput: Locator;
  readonly submitButton: Locator;
  readonly successResult: Locator;
  readonly failedResult: Locator;

  constructor(page: Page, slug: string) {
    super(page, `/playground/${slug}`);
    this.answerInput = page.getByRole("textbox");
    this.submitButton = page.getByRole("button", { name: "Submit Jawaban" });
    this.successResult = page.getByRole("heading", { name: "Challenge Completed!" });
    this.failedResult = page.getByRole("heading", { name: "Belum Tepat" });
  }

  async submitAnswer(answer: string) {
    await this.answerInput.fill(answer);
    await this.submitButton.click();
  }
}
