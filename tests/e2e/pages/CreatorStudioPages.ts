import { Locator, Page } from "@playwright/test";

// Prototipe Konten Saya.
export class CreatorContentsPage {
  readonly heading: Locator;
  readonly notice: Locator;
  readonly rows: Locator;
  readonly search: Locator;
  readonly typeFilter: Locator;
  readonly statusFilter: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Konten Saya" });
    this.notice = page.getByRole("note").filter({ hasText: "Prototipe dengan data dummy" });
    this.rows = page.getByRole("table").getByRole("row").filter({ has: page.getByRole("rowheader") });
    this.search = page.getByRole("textbox", { name: "Cari konten" });
    this.typeFilter = page.getByRole("combobox", { name: "Filter jenis" });
    this.statusFilter = page.getByRole("group", { name: "Filter Status" });
  }

  goto() {
    return this.page.goto("/creator/konten");
  }

  row(title: string) {
    return this.rows.filter({ hasText: title });
  }

  statusTab(name: RegExp) {
    return this.statusFilter.getByRole("button", { name });
  }
}

// Prototipe editor artikel.
export class ArticleEditorPage {
  readonly heading: Locator;
  readonly title: Locator;
  readonly excerpt: Locator;
  readonly category: Locator;
  readonly cover: Locator;
  readonly body: Locator;
  readonly submit: Locator;
  readonly save: Locator;
  readonly infoTab: Locator;
  readonly contentTab: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Buat Artikel" });
    this.title = page.getByRole("textbox", { name: "Judul", exact: true });
    this.excerpt = page.getByRole("textbox", { name: "Ringkasan" });
    this.category = page.getByRole("combobox", { name: "Kategori" });
    this.cover = page.getByRole("textbox", { name: "Sampul" });
    this.body = page.getByRole("textbox", { name: "Isi artikel" });
    this.submit = page.getByRole("button", { name: "Kirim untuk Review" });
    this.save = page.getByRole("button", { name: "Simpan Draf" });
    this.infoTab = page.getByRole("group", { name: "Bagian editor" }).getByRole("button", { name: "Informasi" });
    this.contentTab = page.getByRole("group", { name: "Bagian editor" }).getByRole("button", { name: "Isi Artikel" });
    this.dialog = page.getByRole("dialog");
  }

  goto() {
    return this.page.goto("/creator/buat/artikel");
  }

  async fillInfo({ title, excerpt, category, cover }: { title: string; excerpt: string; category: string; cover: string }, isMobile: boolean) {
    if (isMobile) await this.infoTab.click();
    await this.title.fill(title);
    await this.excerpt.fill(excerpt);
    await this.category.selectOption({ label: category });
    await this.cover.fill(cover);
    if (isMobile) await this.contentTab.click();
  }

  async checkAll() {
    const boxes = this.page.getByRole("region", { name: "Checklist sebelum kirim" }).getByRole("checkbox");
    for (const box of await boxes.all()) await box.check();
  }
}

// Prototipe detail Catatan Revisi.
export class RevisionDetailPageObject {
  readonly fixedBoxes: Locator;
  readonly resubmit: Locator;

  constructor(readonly page: Page) {
    this.fixedBoxes = page.getByRole("list", { name: "Daftar catatan" }).getByRole("checkbox");
    this.resubmit = page.getByRole("button", { name: "Kirim ulang untuk Review" });
  }

  goto(contentId: number) {
    return this.page.goto(`/creator/revisi/${contentId}`);
  }
}
