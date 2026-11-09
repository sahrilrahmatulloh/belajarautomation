import { Locator, Page } from "@playwright/test";

export class ReviewQueuePageObject {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly tabs: Locator;
  readonly search: Locator;
  readonly typeFilter: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Antrean Review" });
    this.rows = page.getByRole("table").getByRole("row").filter({ has: page.getByRole("rowheader") });
    this.tabs = page.getByRole("group", { name: "Filter Antrean" });
    this.search = page.getByRole("textbox", { name: "Cari konten" });
    this.typeFilter = page.getByRole("combobox", { name: "Filter jenis" });
  }

  goto() {
    return this.page.goto("/reviewer/antrean");
  }

  tab(name: RegExp) {
    return this.tabs.getByRole("button", { name });
  }

  row(title: string) {
    return this.rows.filter({ hasText: title });
  }
}

export class ReviewPageObject {
  readonly panel: Locator;
  readonly noteKind: Locator;
  readonly noteSection: Locator;
  readonly noteVideo: Locator;
  readonly noteText: Locator;
  readonly addNote: Locator;
  readonly newNotes: Locator;
  readonly previousNotes: Locator;
  readonly checklist: Locator;
  readonly requestRevision: Locator;
  readonly approve: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.panel = page.getByRole("complementary", { name: "Panel review" });
    this.noteKind = this.panel.getByRole("combobox", { name: "Jenis catatan" });
    this.noteSection = this.panel.getByRole("combobox", { name: "Bagian", exact: true });
    this.noteVideo = this.panel.getByRole("combobox", { name: "Video", exact: true });
    this.noteText = this.panel.getByRole("textbox", { name: "Isi catatan" });
    this.addNote = this.panel.getByRole("button", { name: "Tambah catatan" });
    this.newNotes = page.getByRole("region", { name: /^Catatan Baru/ }).getByRole("listitem");
    this.previousNotes = page.getByRole("region", { name: "Catatan Sebelumnya" }).getByRole("listitem");
    this.checklist = page.getByRole("region", { name: "Checklist Reviewer" }).getByRole("checkbox");
    this.requestRevision = this.panel.getByRole("button", { name: "Minta Revisi" });
    this.approve = this.panel.getByRole("button", { name: "Setujui" });
    this.dialog = page.getByRole("dialog");
  }

  goto(contentId: string) {
    return this.page.goto(`/reviewer/review/${contentId}`);
  }

  async writeNote(kind: "Catatan umum" | "Per bagian" | "Per video", text: string) {
    await this.noteKind.selectOption({ label: kind });
    await this.noteText.fill(text);
    await this.addNote.click();
  }

  async checkAll() {
    await this.checklist.first().waitFor();
    for (const box of await this.checklist.all()) await box.check();
  }
}
