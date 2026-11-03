import AxeBuilder from "@axe-core/playwright";

import { expect, test } from "../fixtures/auth";
import { CREATOR_STUDIO } from "../fixtures/testData";
import { ArticleEditorPage, CreatorContentsPage, RevisionDetailPageObject } from "../pages/CreatorStudioPages";

test.use({ role: "creator" });

const { draftTitle, reviewTitle, revisionTitle, approvedTitle, publishedTitle, revisionId } = CREATOR_STUDIO;

test.describe("Prototipe Konten Saya", () => {
  let contents: CreatorContentsPage;

  test.beforeEach(async ({ page }) => {
    contents = new CreatorContentsPage(page);
    await contents.goto();
    await expect(contents.heading).toBeVisible();
  });

  test("menandai halaman sebagai prototipe dan menampilkan kolom sesuai PRD", async ({ page }) => {
    await expect(contents.notice).toBeVisible();
    await expect(page.getByRole("columnheader")).toHaveText([...CREATOR_STUDIO.columns]);
    await expect(contents.rows).toHaveCount(CREATOR_STUDIO.contentCount);
  });

  test("tab status menampilkan jumlah dan menyaring daftar", async () => {
    await expect(contents.statusTab(/^Semua/)).toHaveText(`Semua (${CREATOR_STUDIO.contentCount})`);

    await contents.statusTab(/^Menunggu Review/).click();

    await expect(contents.rows).toHaveCount(2);
    await expect(contents.row(reviewTitle)).toBeVisible();
  });

  test("pencarian dan filter jenis menyaring daftar", async () => {
    await contents.search.fill("Page Object");
    await expect(contents.rows).toHaveCount(1);

    await contents.search.fill("");
    await contents.typeFilter.selectOption({ label: "Artikel" });
    await expect(contents.row(reviewTitle)).toBeVisible();
    await expect(contents.row(draftTitle)).toHaveCount(0);
  });

  for (const { title, actions } of CREATOR_STUDIO.actionsByStatus) {
    test(`aksi "${title}" mengikuti status`, async () => {
      await expect(contents.row(title).getByRole("cell").last().locator("a, button")).toHaveText([...actions]);
    });
  }

  test("tarik kembali mengubah status menjadi Draf", async () => {
    await contents.row(reviewTitle).getByRole("button", { name: "Tarik kembali" }).click();

    await expect(contents.row(reviewTitle)).toContainText("Draf");
    await expect(contents.row(reviewTitle).getByRole("link", { name: "Edit" })).toBeVisible();
  });

  test("hapus draf meminta konfirmasi", async ({ page }) => {
    await contents.row(draftTitle).getByRole("button", { name: "Hapus" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Batal" }).click();
    await expect(contents.row(draftTitle)).toBeVisible();

    await contents.row(draftTitle).getByRole("button", { name: "Hapus" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Hapus" }).click();

    await expect(contents.row(draftTitle)).toHaveCount(0);
  });

  test("buat revisi dari konten terbit membuat draf baru dan versi terbit tetap ada", async ({ page }) => {
    await contents.row(publishedTitle).getByRole("button", { name: "Buat revisi" }).click();
    await expect(page).toHaveURL(/\/creator\/buat\/artikel\?konten=\d+/);

    await contents.goto();
    await expect(contents.row(`${publishedTitle} (Revisi)`)).toContainText("Draf");
    await expect(contents.rows.filter({ hasText: publishedTitle }).filter({ hasText: "Terbit" })).toHaveCount(1);
  });

  test("konten yang disetujui hanya bisa dilihat", async ({ page }) => {
    await contents.row(approvedTitle).getByRole("link", { name: "Lihat" }).click();

    await expect(page.getByRole("heading", { level: 1, name: approvedTitle })).toBeVisible();
  });

  test("perubahan bertahan setelah dimuat ulang", async ({ page }) => {
    await contents.row(reviewTitle).getByRole("button", { name: "Tarik kembali" }).click();
    await expect(contents.row(reviewTitle)).toContainText("Draf");

    await page.reload();

    await expect(contents.row(reviewTitle)).toContainText("Draf");
  });
});

test.describe("Prototipe Buat Konten", () => {
  test("isi lesson dan soal latihan terkunci, artikel blog aktif", async ({ page }) => {
    await page.goto("/creator/buat");
    const main = page.getByRole("main");

    await expect(main.getByText("Isi lesson")).toBeVisible();
    await expect(main.getByRole("link", { name: /Isi lesson|Soal latihan/ })).toHaveCount(0);

    await main.getByRole("link", { name: /Artikel blog/ }).click();
    await expect(page).toHaveURL("/creator/buat/artikel");
  });
});

test.describe("Prototipe editor artikel", () => {
  let editor: ArticleEditorPage;

  test.beforeEach(async ({ page }) => {
    editor = new ArticleEditorPage(page);
    await editor.goto();
    await expect(editor.heading).toBeVisible();
  });

  test("kirim hanya aktif bila kolom wajib terisi dan checklist dicentang", async ({ isMobile }) => {
    await editor.fillInfo(CREATOR_STUDIO.newArticle, isMobile);
    await editor.body.fill("## Pendahuluan\n\nIsi artikel.");
    await expect(editor.submit).toBeDisabled();

    await editor.checkAll();

    await expect(editor.submit).toBeEnabled();
  });

  test("menulis dan mengirim artikel baru sampai masuk Konten Saya", async ({ page, isMobile }) => {
    await editor.fillInfo(CREATOR_STUDIO.newArticle, isMobile);
    await editor.body.fill("## Pendahuluan\n\nIsi artikel.");
    await editor.checkAll();

    await editor.submit.click();

    await expect(page).toHaveURL("/creator/konten");
    await expect(new CreatorContentsPage(page).row(CREATOR_STUDIO.newArticle.title)).toContainText("Menunggu Review");
  });

  test("simpan draf dan menampilkan jumlah kata", async ({ page, isMobile }) => {
    await editor.fillInfo(CREATOR_STUDIO.newArticle, isMobile);
    await editor.body.fill("satu dua tiga");

    await expect(page.getByText("3 kata")).toBeVisible();
    await editor.save.click();

    await expect(page.getByText(/^Tersimpan pukul/)).toBeVisible();
    await new CreatorContentsPage(page).goto();
    await expect(new CreatorContentsPage(page).row(CREATOR_STUDIO.newArticle.title)).toContainText("Draf");
  });

  test("toolbar menyisipkan format ke isi artikel", async ({ page, isMobile }) => {
    if (isMobile) await editor.contentTab.click();

    await page.getByRole("button", { name: "Kotak Tips" }).click();

    await expect(editor.body).toHaveValue("<Tips>Isi tips</Tips>\n\n");
  });

  test("sisipkan video: link salah ditolak, maksimal 3 video", async ({ page, isMobile }) => {
    if (isMobile) await editor.contentTab.click();
    const addVideo = page.getByRole("button", { name: "Sisipkan video" });

    await addVideo.click();
    await editor.dialog.getByRole("textbox", { name: "Link YouTube" }).fill("https://contoh.com/video");
    await expect(editor.dialog.getByRole("alert")).toContainText("Link tidak valid");
    await expect(editor.dialog.getByRole("button", { name: "Sisipkan Video" })).toBeDisabled();
    await editor.dialog.getByRole("button", { name: "Batal" }).click();

    for (const id of CREATOR_STUDIO.videoIds) {
      await addVideo.click();
      await editor.dialog.getByRole("textbox", { name: "Link YouTube" }).fill(`https://www.youtube.com/watch?v=${id}`);
      await editor.dialog.getByRole("textbox", { name: "Judul video" }).fill(`Video ${id}`);
      await editor.dialog.getByRole("textbox", { name: "Nama channel" }).fill("Channel");
      await editor.dialog.getByRole("textbox", { name: "Durasi" }).fill("12:34");
      await editor.dialog.getByRole("textbox", { name: "Alasan memilih video ini" }).fill("Relevan");
      await editor.dialog.getByRole("button", { name: "Sisipkan Video" }).click();
    }

    await expect(page.getByRole("list", { name: "Referensi video" }).getByRole("listitem")).toHaveCount(3);
    await expect(addVideo).toBeDisabled();

    // Pratinjau memakai kartu video yang sama dengan halaman publik.
    await page.getByRole("button", { name: "Pratinjau" }).click();
    await expect(editor.dialog.getByRole("button", { name: /^Putar video:/ })).toHaveCount(3);
  });

  test("upload gambar menolak format dan ukuran yang salah", async ({ page, isMobile }) => {
    if (isMobile) await editor.contentTab.click();
    await page.getByRole("button", { name: "Upload gambar" }).click();
    const file = page.getByLabel("Pilih file gambar");

    await file.setInputFiles({ name: "catatan.txt", mimeType: "text/plain", buffer: Buffer.from("x") });
    await expect(editor.dialog.getByRole("alert")).toContainText("Format tidak didukung");

    await file.setInputFiles({ name: "besar.png", mimeType: "image/png", buffer: Buffer.alloc(2 * 1024 * 1024 + 1) });
    await expect(editor.dialog.getByRole("alert")).toContainText("Ukuran file terlalu besar");

    await file.setInputFiles({ name: "contoh.png", mimeType: "image/png", buffer: Buffer.from("x") });
    await expect(editor.dialog.getByRole("button", { name: "Upload" })).toBeDisabled();
    await editor.dialog.getByRole("textbox", { name: "Teks alternatif" }).fill("Ilustrasi");
    await editor.dialog.getByRole("button", { name: "Upload" }).click();

    await expect(editor.body).toHaveValue(/!\[Ilustrasi\]\(contoh\.png\)/);
  });

  test("pratinjau menampilkan isi yang ditulis", async ({ page, isMobile }) => {
    if (isMobile) await editor.contentTab.click();
    await editor.body.fill("## Bagian Satu\n\nParagraf isi.");

    await page.getByRole("button", { name: "Pratinjau" }).click();

    await expect(editor.dialog.getByRole("heading", { name: "Bagian Satu" })).toBeVisible();
    await expect(editor.dialog).toContainText("Paragraf isi.");
  });
});

test.describe("Prototipe Catatan Revisi", () => {
  test("daftar memisahkan Perlu ditangani dan Selesai", async ({ page }) => {
    await page.goto("/creator/revisi");
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: new RegExp(revisionTitle) })).toBeVisible();

    await page.getByRole("group", { name: "Filter Catatan" }).getByRole("button", { name: /^Selesai/ }).click();

    await expect(main.getByRole("link", { name: new RegExp(revisionTitle) })).toHaveCount(0);
  });

  test("kirim ulang nonaktif sampai semua catatan ditandai, lalu konten kembali ke review", async ({ page }) => {
    const detail = new RevisionDetailPageObject(page);
    await detail.goto(revisionId);
    await expect(detail.resubmit).toBeDisabled();
    await expect(page.getByRole("main")).toContainText(`0 dari ${CREATOR_STUDIO.noteCount} selesai`);

    for (const box of await detail.fixedBoxes.all()) await box.check();

    await expect(page.getByRole("main")).toContainText(`${CREATOR_STUDIO.noteCount} dari ${CREATOR_STUDIO.noteCount} selesai`);
    await detail.resubmit.click();

    await expect(page).toHaveURL("/creator/revisi");
    const contents = new CreatorContentsPage(page);
    await contents.goto();
    await expect(contents.row(revisionTitle)).toContainText("Menunggu Review");
  });

  test("tanda perbaikan dan balasan bertahan setelah dimuat ulang", async ({ page }) => {
    const detail = new RevisionDetailPageObject(page);
    await detail.goto(revisionId);
    await detail.fixedBoxes.first().check();
    await page.getByRole("textbox", { name: /Balasan/ }).first().fill("Sudah saya perbaiki.");

    await page.reload();

    await expect(detail.fixedBoxes.first()).toBeChecked();
    await expect(page.getByRole("textbox", { name: /Balasan/ }).first()).toHaveValue("Sudah saya perbaiki.");
  });
});

test.describe("Aksesibilitas prototipe", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      for (const path of CREATOR_STUDIO.axePaths) {
        test(`${path} tanpa pelanggaran critical dan serious`, async ({ page }) => {
          await page.goto(path);
          await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();

          const { violations } = await new AxeBuilder({ page }).analyze();

          expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
        });
      }
    });
  }
});
