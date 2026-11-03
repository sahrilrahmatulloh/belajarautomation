import { Locator, Page } from "@playwright/test";

import { CREATOR_STUDIO } from "../fixtures/testData";

const pngFile = (name: string) => ({ name, mimeType: "image/png", buffer: Buffer.from(CREATOR_STUDIO.pngBase64, "base64") });

// Konten Saya: tabel di desktop, kartu di mobile.
export class CreatorContentsPage {
  readonly heading: Locator;
  readonly notice: Locator;
  readonly entries: Locator;
  readonly search: Locator;
  readonly typeFilter: Locator;
  readonly statusFilter: Locator;
  readonly pagination: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Konten Saya" });
    this.notice = page.getByRole("note").filter({ hasText: "Data dummy untuk DEV" });
    this.entries = page
      .getByRole("table")
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader") })
      .or(page.getByRole("list", { name: "Daftar konten saya" }).getByRole("listitem"));
    this.search = page.getByRole("textbox", { name: "Cari konten" });
    this.typeFilter = page.getByRole("combobox", { name: "Filter jenis" });
    this.statusFilter = page.getByRole("group", { name: "Filter Status" });
    this.pagination = page.getByRole("navigation", { name: "Halaman konten" });
  }

  goto() {
    return this.page.goto("/creator/konten");
  }

  entry(title: string) {
    return this.entries.filter({ hasText: title });
  }

  // Tautan dan tombol aksi pada satu konten.
  actions(title: string) {
    return this.entry(title).locator("a, button");
  }

  statusTab(name: RegExp) {
    return this.statusFilter.getByRole("button", { name });
  }

  // Mencari dulu, karena kontennya bisa berada di halaman lain.
  async find(title: string) {
    await this.search.fill(title);
    return this.entry(title);
  }
}

export class ArticleEditorPage {
  readonly heading: Locator;
  readonly title: Locator;
  readonly excerpt: Locator;
  readonly category: Locator;
  readonly cover: Locator;
  readonly body: Locator;
  readonly toolbar: Locator;
  readonly checklist: Locator;
  readonly submit: Locator;
  readonly save: Locator;
  readonly preview: Locator;
  readonly infoTab: Locator;
  readonly contentTab: Locator;
  readonly dialog: Locator;
  readonly addVideo: Locator;
  readonly addImage: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: /(Buat|Edit) Artikel/ });
    this.title = page.getByRole("textbox", { name: "Judul", exact: true });
    this.excerpt = page.getByRole("textbox", { name: "Ringkasan" });
    this.category = page.getByRole("combobox", { name: "Kategori" });
    this.cover = page.getByLabel("Sampul", { exact: true });
    this.body = page.getByRole("textbox", { name: "Isi artikel" });
    this.toolbar = page.getByRole("toolbar", { name: "Format isi" });
    this.checklist = page.getByRole("region", { name: "Checklist sebelum kirim" });
    this.submit = page.getByRole("button", { name: "Kirim untuk Review" });
    this.save = page.getByRole("button", { name: "Simpan Draf" });
    this.preview = page.getByRole("button", { name: "Pratinjau" });
    this.infoTab = page.getByRole("group", { name: "Bagian editor" }).getByRole("button", { name: "Informasi" });
    this.contentTab = page.getByRole("group", { name: "Bagian editor" }).getByRole("button", { name: "Isi Artikel" });
    this.dialog = page.getByRole("dialog");
    this.addVideo = this.toolbar.getByRole("button", { name: /^Sisipkan video/ });
    this.addImage = this.toolbar.getByRole("button", { name: "Upload gambar" });
  }

  goto(contentId?: string) {
    return this.page.goto(contentId ? `/creator/buat/artikel?konten=${contentId}` : "/creator/buat/artikel");
  }

  async fillInfo({ title, excerpt, category }: { title: string; excerpt: string; category: string }, isMobile: boolean) {
    if (isMobile) await this.infoTab.click();
    await this.title.fill(title);
    await this.excerpt.fill(excerpt);
    await this.category.selectOption({ label: category });
    await this.cover.setInputFiles(pngFile("sampul.png"));
    await this.page.getByRole("img", { name: "Pratinjau sampul" }).waitFor();
    if (isMobile) await this.contentTab.click();
  }

  async typeBody(text: string) {
    await this.body.click();
    await this.page.keyboard.type(text);
  }

  async checkAll() {
    for (const box of await this.checklist.getByRole("checkbox").all()) await box.check();
  }

  async insertVideo(id: string) {
    await this.addVideo.click();
    await this.dialog.getByRole("textbox", { name: "Link YouTube" }).fill(`https://www.youtube.com/watch?v=${id}`);
    await this.fillVideoDetails();
    await this.dialog.getByRole("button", { name: "Sisipkan Video" }).click();
    await this.dialog.waitFor({ state: "hidden" });
  }

  async fillVideoDetails() {
    await this.dialog.getByRole("textbox", { name: "Durasi" }).fill("12:34");
    await this.dialog.getByRole("textbox", { name: "Alasan memilih video ini" }).fill("Relevan");
  }

  // Menanggapi route oEmbed tanpa memanggil YouTube sungguhan.
  mockYoutubeLookup(response: Record<string, string>) {
    return this.page.route("**/api/youtube-oembed**", (route) => route.fulfill({ json: response }));
  }
}

export function validPng(name: string) {
  return pngFile(name);
}

// Daftar dan detail Catatan Revisi.
export class RevisionPages {
  readonly fixedBoxes: Locator;
  readonly replies: Locator;
  readonly resubmit: Locator;
  readonly filter: Locator;
  readonly contentFilter: Locator;

  constructor(readonly page: Page) {
    this.fixedBoxes = page.getByRole("list", { name: "Daftar catatan" }).getByRole("checkbox");
    this.replies = page.getByRole("textbox", { name: /^Balasan/ });
    this.resubmit = page.getByRole("button", { name: "Kirim ulang untuk Review" });
    this.filter = page.getByRole("group", { name: "Filter Catatan" });
    this.contentFilter = page.getByRole("combobox", { name: "Filter konten" });
  }

  gotoList() {
    return this.page.goto("/creator/revisi");
  }

  goto(contentId: string) {
    return this.page.goto(`/creator/revisi/${contentId}`);
  }

  thread(title: string) {
    return this.page.getByRole("main").getByRole("link", { name: new RegExp(title) });
  }
}
