import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

// Halaman pengerjaan latihan (app/playground/[slug]).
export class ChallengePage extends BasePage {
  readonly heading: Locator;
  readonly typeBadge: Locator;
  readonly courseLink: Locator;
  readonly backLink: Locator;
  readonly result: Locator;
  readonly timer: Locator;
  readonly retryButton: Locator;

  // Kuis
  readonly quiz: Locator;
  readonly options: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly submitAnswerButton: Locator;
  readonly review: Locator;

  // Bug Hunt
  readonly findingsPanel: Locator;
  readonly submitFindingsButton: Locator;

  // Test Case Writing
  readonly answerInput: Locator;
  readonly sampleAnswer: Locator;
  readonly checklist: Locator;
  readonly finishCheckButton: Locator;

  // Locator Challenge
  readonly practiceFrame: Locator;
  readonly selectorInput: Locator;
  readonly testSelectorButton: Locator;
  readonly submitSelectorButton: Locator;
  readonly selectorPanel: Locator;

  constructor(page: Page, readonly slug: string) {
    super(page, `/playground/${slug}`);
    const main = page.getByRole("main");
    this.heading = main.getByRole("heading", { level: 1 });
    this.typeBadge = main.locator("header").getByText(/^(Kuis|Bug Hunt|Test Case Writing|Locator Challenge)$/);
    this.courseLink = main.getByRole("link", { name: /^Course: / });
    this.backLink = main.getByRole("link", { name: "Kembali ke Playground" });
    this.result = page.getByRole("region", { name: "Hasil latihan" });
    this.timer = page.getByRole("timer");
    this.retryButton = page.getByRole("button", { name: "Ulangi latihan" });

    this.quiz = page.getByRole("region", { name: "Pengerjaan kuis" });
    this.options = this.quiz.getByRole("radio");
    this.nextButton = page.getByRole("button", { name: "Berikutnya" });
    this.previousButton = page.getByRole("button", { name: "Sebelumnya" });
    this.submitAnswerButton = page.getByRole("button", { name: "Kirim jawaban" });
    this.review = page.getByRole("list", { name: "Pembahasan" }).getByRole("listitem");

    this.findingsPanel = page.getByRole("region", { name: "Daftar dugaan temuan" });
    this.submitFindingsButton = page.getByRole("button", { name: "Kirim temuan" });

    this.answerInput = page.getByLabel("Tulis test case kamu");
    this.sampleAnswer = page.getByRole("region", { name: "Contoh jawaban" });
    this.checklist = page.getByRole("region", { name: "Checklist penilaian" });
    this.finishCheckButton = page.getByRole("button", { name: "Selesai menilai" });

    this.practiceFrame = page.getByRole("region", { name: /^Halaman latihan: / });
    this.selectorPanel = page.getByRole("region", { name: "Tulis selector" });
    this.selectorInput = this.selectorPanel.getByLabel("Selector", { exact: true });
    this.testSelectorButton = page.getByRole("button", { name: "Uji selector" });
    this.submitSelectorButton = this.selectorPanel.getByRole("button", { name: "Kirim", exact: true });
  }

  // Menjawab seluruh soal: indexes[i] adalah opsi yang dipilih pada soal ke-i.
  async answerQuiz(indexes: readonly number[]) {
    for (const [position, index] of indexes.entries()) {
      await this.options.nth(index).check();
      if (position < indexes.length - 1) await this.nextButton.click();
    }
  }

  finding(label: string) {
    return this.findingsPanel.getByRole("checkbox", { name: label });
  }

  async submitFindings(labels: readonly string[]) {
    for (const label of labels) await this.finding(label).check();
    await this.submitFindingsButton.click();
  }

  findingGroup(title: "Bug ditemukan" | "Bug terlewat" | "Salah tandai") {
    return this.page.getByRole("region", { name: title });
  }

  checklistItem(label: string) {
    return this.checklist.getByRole("checkbox", { name: label });
  }

  selectorType(label: "CSS" | "XPath") {
    return this.selectorPanel.getByRole("radio", { name: label });
  }

  async enterSelector(type: "CSS" | "XPath", selector: string) {
    await this.selectorType(type).check();
    await this.selectorInput.fill(selector);
  }

  // Elemen yang sedang disorot sebagai hasil "Uji selector".
  get highlighted() {
    return this.practiceFrame.locator("[data-practice-match]");
  }
}
