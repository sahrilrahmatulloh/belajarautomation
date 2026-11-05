import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import type { ContentRepository } from "@/lib/content/repository";

import { expect, test } from "../fixtures/auth";
import { CREATOR_STUDIO } from "../fixtures/testData";
import { ArticleEditorPage, CreatorContentsPage, RevisionPages, validPng } from "../pages/CreatorStudioPages";

test.use({ role: "creator" });

const { draftTitle, reviewTitle, revisionTitle, revisionId, approvedTitle, publishedTitle, noteCount, newArticle, videoIds } = CREATOR_STUDIO;

declare global {
  interface Window {
    __contentRepository: ContentRepository;
  }
}

// Menjalankan aksi peran lain lewat repository yang sama dengan halaman.
const withRepository = <T>(page: Page, action: (repository: ContentRepository, arg: string) => Promise<T>, arg = "") =>
  page.evaluate(
    ([source, value]) => new Function("repository", "arg", `return (${source})(repository, arg)`)(window.__contentRepository, value) as Promise<T>,
    [action.toString(), arg] as const
  );

test.describe("Konten Saya", () => {
  let contents: CreatorContentsPage;

  test.beforeEach(async ({ page }) => {
    contents = new CreatorContentsPage(page);
    await contents.goto();
    await expect(contents.heading).toBeVisible();
  });

  test("menandai data dummy dan menampilkan kolom sesuai PRD", async ({ page, isMobile }) => {
    test.skip(isMobile, "Di mobile daftar memakai kartu");

    await expect(contents.notice).toBeVisible();
    await expect(page.getByRole("columnheader")).toHaveText([...CREATOR_STUDIO.columns]);
  });

  test("mobile memakai kartu, bukan tabel", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Khusus layar sempit");

    await expect(page.getByRole("table")).toBeHidden();
    await expect(contents.entries).toHaveCount(CREATOR_STUDIO.pageSize);
  });

  test("tab status menampilkan jumlah dan menyaring daftar", async () => {
    await expect(contents.statusTab(/^Semua/)).toHaveText(`Semua (${CREATOR_STUDIO.contentCount})`);

    await contents.statusTab(/^Perlu Revisi/).click();

    await expect(contents.entries).toHaveCount(2);
    await expect(contents.entry(revisionTitle)).toBeVisible();
  });

  test("pagination berpindah halaman", async () => {
    await expect(contents.entries).toHaveCount(CREATOR_STUDIO.pageSize);
    await expect(contents.pagination).toContainText(`dari ${CREATOR_STUDIO.contentCount} konten`);

    await contents.pagination.getByRole("button", { name: "Halaman berikutnya" }).click();

    await expect(contents.entries).toHaveCount(CREATOR_STUDIO.contentCount - CREATOR_STUDIO.pageSize);
    await expect(contents.pagination.getByRole("button", { name: "Halaman 2" })).toHaveAttribute("aria-current", "page");
  });

  test("pencarian dan filter jenis menyaring daftar", async ({ page }) => {
    await contents.search.fill("Bug Report");
    await expect(contents.entries).toHaveCount(1);

    await contents.search.fill("");
    await contents.typeFilter.selectOption({ label: "Lesson" });

    await expect(page.getByText("Tidak ada konten yang cocok.")).toBeVisible();
  });

  for (const { title, actions } of CREATOR_STUDIO.actionsByStatus) {
    test(`aksi "${title}" mengikuti status`, async () => {
      await contents.find(title);

      await expect(contents.actions(title)).toHaveText([...actions]);
    });
  }

  test("tarik kembali mengubah status menjadi Draf dan bertahan setelah dimuat ulang", async ({ page }) => {
    const entry = await contents.find(reviewTitle);
    await entry.getByRole("button", { name: "Tarik kembali" }).click();
    await expect(entry).toContainText("Draf");

    await page.reload();

    await expect((await contents.find(reviewTitle))).toContainText("Draf");
  });

  test("hapus draf meminta konfirmasi", async ({ page }) => {
    const entry = await contents.find(draftTitle);
    await entry.getByRole("button", { name: "Hapus" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Batal" }).click();
    await expect(entry).toBeVisible();

    await entry.getByRole("button", { name: "Hapus" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Hapus" }).click();

    await expect(entry).toHaveCount(0);
  });

  test("buat revisi membuka salinan draf dan versi terbit tetap ada", async ({ page }) => {
    const entry = await contents.find(publishedTitle);
    await entry.getByRole("button", { name: "Buat revisi" }).click();
    await expect(page).toHaveURL(/\/creator\/buat\/artikel\?konten=konten-\d+/);

    await contents.goto();
    await contents.search.fill(publishedTitle);

    await expect(contents.entries).toHaveCount(2);
    await expect(contents.entries.filter({ hasText: "Revisi dari versi terbit" })).toContainText("Draf");
    await expect(contents.entries.filter({ hasText: "Terbit" }).filter({ hasNotText: "Revisi dari" })).toHaveCount(1);
  });

  test("konten yang disetujui hanya bisa dilihat", async ({ page }) => {
    const entry = await contents.find(approvedTitle);
    await entry.getByRole("link", { name: "Lihat" }).click();

    await expect(page.getByRole("heading", { level: 1, name: approvedTitle })).toBeVisible();
  });

  test("Creator baru melihat ajakan menulis konten pertama", async ({ page }) => {
    await page.evaluate(() => {
      const key = "belajarautomation-content-workflow-v2";
      window.localStorage.setItem(key, JSON.stringify({ users: [], contents: [], notes: [], statusEvents: [], roleEvents: [], agreements: [], auditLog: [], supersededIds: [], nextId: 1 }));
    });
    await page.reload();

    await expect(page.getByRole("heading", { name: "Belum ada konten" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tulis konten pertama" })).toHaveAttribute("href", "/creator/buat");
  });
});

test.describe("Buat Konten", () => {
  test("Artikel aktif, Lesson dan Soal terkunci dengan label Segera hadir", async ({ page }) => {
    await page.goto("/creator/buat");
    const main = page.getByRole("main");

    await expect(main.getByText("Segera hadir")).toHaveCount(2);
    await expect(main.getByRole("link", { name: /Lesson|Soal/ })).toHaveCount(0);

    await main.getByRole("link", { name: /^Artikel/ }).click();
    await expect(page).toHaveURL("/creator/buat/artikel");
  });
});

test.describe("Editor artikel", () => {
  let editor: ArticleEditorPage;

  test.beforeEach(async ({ page }) => {
    editor = new ArticleEditorPage(page);
    await editor.goto();
    await expect(editor.heading).toBeVisible();
  });

  const openContent = async (isMobile: boolean) => {
    if (isMobile) await editor.contentTab.click();
    await expect(editor.body).toBeVisible();
  };

  test("kirim baru aktif bila kolom wajib terisi dan checklist dicentang", async ({ page, isMobile }) => {
    await expect(page.getByText(/^Lengkapi kolom wajib: judul, ringkasan, kategori, sampul, isi\./)).toBeAttached();
    await editor.fillInfo(newArticle, isMobile);
    await openContent(isMobile);
    await editor.typeBody("Isi artikel.");
    await expect(editor.submit).toBeDisabled();
    await expect(page.getByText("Centang seluruh checklist untuk mengirim.")).toBeVisible();

    await editor.checkAll();

    await expect(editor.submit).toBeEnabled();
  });

  test("simpan otomatis membuat draf dan isinya bertahan setelah dimuat ulang", async ({ page, isMobile }) => {
    await expect(page.getByText("Belum disimpan")).toBeVisible();
    await editor.fillInfo(newArticle, isMobile);
    await openContent(isMobile);
    await editor.typeBody("satu dua tiga");
    await expect(page.getByText("3 kata")).toBeVisible();

    await expect(page.getByText(/^Tersimpan /)).toBeVisible();
    await expect(page).toHaveURL(/konten=konten-\d+/);
    await expect(page.getByText(/^Tersimpan /)).toBeVisible();

    await page.reload();

    await openContent(isMobile);
    await expect(editor.body).toContainText("satu dua tiga");
    await new CreatorContentsPage(page).goto();
    await expect(await new CreatorContentsPage(page).find(newArticle.title)).toContainText("Draf");
  });

  test("membuka editor tanpa mengetik tidak membuat draf kosong", async ({ page }) => {
    await expect(page.getByText("Belum disimpan")).toBeVisible();

    await page.goto("/creator/konten");

    await expect(page.getByRole("button", { name: /^Semua/ })).toHaveText(`Semua (${CREATOR_STUDIO.contentCount})`);
  });

  test("toolbar memformat isi, lengkap dengan urungkan dan ulangi", async ({ isMobile }) => {
    await openContent(isMobile);
    await editor.typeBody("Judul bagian");

    await editor.toolbar.getByRole("button", { name: "Heading 2" }).click();
    await expect(editor.body.getByRole("heading", { level: 2, name: "Judul bagian" })).toBeVisible();

    await editor.toolbar.getByRole("button", { name: "Urungkan" }).click();
    await expect(editor.body.getByRole("heading", { level: 2 })).toHaveCount(0);
    await editor.toolbar.getByRole("button", { name: "Ulangi" }).click();
    await expect(editor.body.getByRole("heading", { level: 2 })).toHaveCount(1);

    for (const name of ["Heading 3", "Tebal", "Miring", "Daftar", "Blok kode", "Kotak Tips", "Kotak Peringatan", "Tabel"]) {
      await expect(editor.toolbar.getByRole("button", { name })).toBeEnabled();
    }
    await editor.page.keyboard.press("End");
    await editor.page.keyboard.press("Enter");
    await editor.toolbar.getByRole("button", { name: "Kotak Tips" }).click();
    await expect(editor.body.locator('aside[data-callout="tips"]')).toBeVisible();
    await editor.toolbar.getByRole("button", { name: "Tabel" }).click();
    await expect(editor.body.getByRole("table")).toBeVisible();
  });

  test("sisipkan video: judul dan channel otomatis, maksimal 3 video, bisa diedit dan dihapus", async ({ page, isMobile }) => {
    await editor.mockYoutubeLookup({ status: "ok", judul: "Video Referensi Uji", channel: "Channel Uji" });
    await openContent(isMobile);

    await editor.addVideo.click();
    await expect(editor.dialog).toContainText("1 dari 3 video");
    await editor.dialog.getByRole("button", { name: "Batal" }).click();

    for (const id of videoIds) await editor.insertVideo(id);

    const blocks = editor.body.locator("[data-video-id]");
    await expect(blocks).toHaveCount(3);
    await expect(blocks.first()).toContainText("Video Referensi Uji");
    await expect(editor.addVideo).toBeDisabled();

    // Pratinjau memakai kartu video yang sama dengan halaman publik.
    await editor.preview.click();
    await expect(editor.dialog.getByRole("button", { name: /^Putar video:/ })).toHaveCount(3);
    await editor.dialog.getByRole("button", { name: "Tutup" }).click();

    await blocks.first().getByRole("button", { name: /^Edit video/ }).click();
    await editor.dialog.getByRole("textbox", { name: "Durasi" }).fill("1:02:03");
    await editor.dialog.getByRole("button", { name: "Simpan Video" }).click();
    await expect(blocks.first()).toContainText("1:02:03");

    await blocks.first().getByRole("button", { name: /^Hapus video/ }).click();
    await expect(blocks).toHaveCount(2);
    await expect(editor.addVideo).toBeEnabled();
    await expect(page.getByText(/^Tersimpan /)).toBeVisible();
  });

  test("sisipkan video: link tidak valid dan video tidak ditemukan ditolak", async ({ isMobile }) => {
    await editor.mockYoutubeLookup({ status: "tidak-ditemukan" });
    await openContent(isMobile);
    await editor.addVideo.click();
    const link = editor.dialog.getByRole("textbox", { name: "Link YouTube" });
    const submit = editor.dialog.getByRole("button", { name: "Sisipkan Video" });

    await link.fill("https://contoh.com/video");
    await expect(editor.dialog.getByRole("alert")).toContainText("Link tidak valid");
    await expect(submit).toBeDisabled();

    await link.fill(`https://youtu.be/${videoIds[0]}`);
    await expect(editor.dialog.getByRole("alert")).toContainText("Video tidak ditemukan");
    await editor.fillVideoDetails();
    await expect(submit).toBeDisabled();
  });

  test("sisipkan video: embed mati tetap bisa disisipkan sebagai tautan dengan judul manual", async ({ isMobile }) => {
    await editor.mockYoutubeLookup({ status: "embed-mati" });
    await openContent(isMobile);
    await editor.addVideo.click();

    await editor.dialog.getByRole("textbox", { name: "Link YouTube" }).fill(`https://www.youtube.com/watch?v=${videoIds[0]}`);
    await expect(editor.dialog.getByRole("status")).toContainText("tidak bisa di-embed");
    await editor.dialog.getByRole("textbox", { name: "Judul video" }).fill("Video Tanpa Embed");
    await editor.dialog.getByRole("textbox", { name: "Nama channel" }).fill("Channel Manual");
    await editor.fillVideoDetails();
    await editor.dialog.getByRole("button", { name: "Sisipkan Video" }).click();

    await expect(editor.body.locator("[data-video-id]")).toContainText("Tampil sebagai tautan");
  });

  test("upload gambar menolak format dan ukuran yang salah serta mewajibkan teks alternatif", async ({ isMobile }) => {
    await openContent(isMobile);
    await editor.addImage.click();
    await expect(editor.dialog).toContainText("Simulasi");
    const file = editor.dialog.getByLabel("Pilih file gambar");

    await file.setInputFiles({ name: "catatan.txt", mimeType: "text/plain", buffer: Buffer.from("x") });
    await expect(editor.dialog.getByRole("alert")).toContainText("Format tidak didukung");

    await file.setInputFiles({ name: "besar.png", mimeType: "image/png", buffer: Buffer.alloc(2 * 1024 * 1024 + 1) });
    await expect(editor.dialog.getByRole("alert")).toContainText("Ukuran file terlalu besar");

    await file.setInputFiles(validPng("contoh.png"));
    await expect(editor.dialog.getByText("contoh.png")).toBeVisible();
    await expect(editor.dialog.getByRole("button", { name: "Upload" })).toBeDisabled();
    await editor.dialog.getByRole("textbox", { name: "Teks alternatif" }).fill("Ilustrasi uji");
    await editor.dialog.getByRole("button", { name: "Upload" }).click();

    await expect(editor.body.getByRole("img", { name: "Ilustrasi uji" })).toBeVisible();
  });

  test("gambar kedua tidak menimpa gambar pertama", async ({ isMobile }) => {
    await openContent(isMobile);

    for (const alt of ["Gambar satu", "Gambar dua"]) {
      await editor.addImage.click();
      await editor.dialog.getByLabel("Pilih file gambar").setInputFiles(validPng("contoh.png"));
      await editor.dialog.getByRole("textbox", { name: "Teks alternatif" }).fill(alt);
      await editor.dialog.getByRole("button", { name: "Upload" }).click();
      await expect(editor.dialog).toBeHidden();
    }

    await expect(editor.body.getByRole("img")).toHaveCount(2);
  });

  test("upload gambar lewat seret dan lepas", async ({ page, isMobile }) => {
    await openContent(isMobile);
    await editor.addImage.click();

    const transfer = await page.evaluateHandle((base64) => {
      const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
      const data = new DataTransfer();
      data.items.add(new File([bytes], "seret.png", { type: "image/png" }));
      return data;
    }, CREATOR_STUDIO.pngBase64);
    await editor.dialog.getByTestId("area-upload").dispatchEvent("drop", { dataTransfer: transfer });

    await expect(editor.dialog.getByText("seret.png")).toBeVisible();
  });

  test("pratinjau memakai tampilan artikel publik", async ({ isMobile }) => {
    await editor.fillInfo(newArticle, isMobile);
    await openContent(isMobile);
    await editor.typeBody("Paragraf isi.");

    await editor.preview.click();

    await expect(editor.dialog.getByRole("heading", { level: 1, name: newArticle.title })).toBeVisible();
    await expect(editor.dialog).toContainText(newArticle.excerpt);
    await expect(editor.dialog).toContainText("Paragraf isi.");
    await expect(editor.dialog).toContainText("1 menit baca");
  });

  test("di mobile panel dipisah menjadi tab Informasi dan Isi Artikel", async ({ isMobile }) => {
    test.skip(!isMobile, "Khusus layar sempit");

    await expect(editor.title).toBeVisible();
    await expect(editor.body).toBeHidden();

    await editor.contentTab.click();

    await expect(editor.title).toBeHidden();
    await expect(editor.body).toBeVisible();
  });

  test("konten milik orang lain atau yang sudah dikirim tidak bisa diedit", async ({ page }) => {
    await editor.goto("konten-api");
    await expect(page.getByRole("heading", { name: "Konten tidak ditemukan" })).toBeVisible();

    await editor.goto("konten-pemula");
    await expect(page.getByRole("heading", { name: "Konten ini tidak bisa diubah" })).toBeVisible();
  });
});

test.describe("Catatan Revisi", () => {
  test("daftar memisahkan Perlu ditangani dan Selesai, dan bisa disaring per konten", async ({ page }) => {
    const revisions = new RevisionPages(page);
    await revisions.gotoList();
    await expect(revisions.thread(revisionTitle)).toBeVisible();

    await revisions.contentFilter.selectOption({ label: approvedTitle });
    await expect(page.getByText("Tidak ada catatan yang perlu ditangani.")).toBeVisible();

    await revisions.contentFilter.selectOption({ label: "Semua konten" });
    await revisions.filter.getByRole("button", { name: /^Selesai/ }).click();

    await expect(revisions.thread(revisionTitle)).toHaveCount(0);
    await expect(revisions.thread(approvedTitle)).toBeVisible();
  });

  test("kirim ulang nonaktif sampai semua catatan ditandai", async ({ page }) => {
    const revisions = new RevisionPages(page);
    await revisions.goto(revisionId);
    await expect(revisions.resubmit).toBeDisabled();
    await expect(page.getByRole("main")).toContainText(`0 dari ${noteCount} selesai`);

    for (const box of await revisions.fixedBoxes.all()) await box.check();

    await expect(page.getByRole("main")).toContainText(`${noteCount} dari ${noteCount} selesai`);
    await expect(revisions.resubmit).toBeEnabled();
  });

  test("tanda perbaikan dan balasan bertahan setelah dimuat ulang", async ({ page }) => {
    const revisions = new RevisionPages(page);
    await revisions.goto(revisionId);
    await revisions.fixedBoxes.first().check();
    await expect(revisions.fixedBoxes.first()).toBeChecked();
    await revisions.replies.first().fill("Sudah saya perbaiki.");
    await revisions.replies.first().blur();
    await expect(revisions.replies.first()).toHaveValue("Sudah saya perbaiki.");

    await expect(async () => {
      await page.reload();
      await expect(revisions.replies.first()).toHaveValue("Sudah saya perbaiki.");
    }).toPass();

    await expect(revisions.fixedBoxes.first()).toBeChecked();
  });

  test("catatan per bagian melompat ke heading di editor", async ({ page }) => {
    const revisions = new RevisionPages(page);
    await revisions.goto(revisionId);

    await page.getByRole("link", { name: CREATOR_STUDIO.noteAnchorLabel }).click();

    await expect(page).toHaveURL(/bagian=pembahasan/);
    await expect(new ArticleEditorPage(page).body.getByRole("heading", { name: CREATOR_STUDIO.noteAnchorHeading })).toBeInViewport();
  });

  test("catatan konten milik Creator lain tidak bisa dibuka", async ({ page }) => {
    const revisions = new RevisionPages(page);
    await revisions.goto("konten-api");

    await expect(page.getByRole("heading", { name: "Catatan tidak ditemukan" })).toBeVisible();
  });
});

test.describe("Alur lengkap Creator", () => {
  test("buat draf, kirim, diminta revisi, balas dan tandai, lalu kirim ulang", async ({ page, isMobile }) => {
    const editor = new ArticleEditorPage(page);
    await editor.goto();
    await editor.fillInfo(newArticle, isMobile);
    if (isMobile) await editor.contentTab.click();
    await editor.typeBody("Isi artikel lengkap.");
    await editor.checkAll();
    await editor.submit.click();
    await expect(page).toHaveURL("/creator/konten");

    const contents = new CreatorContentsPage(page);
    await expect(await contents.find(newArticle.title)).toContainText("Menunggu Review");

    // Reviewer dummy meminta revisi. Antarmuka Reviewer dibahas di PR berikutnya.
    const contentId = await withRepository(
      page,
      async (repository, title) => {
        const content = (await repository.listContents()).find((item) => item.judul === title);
        if (!content) throw new Error("Konten tidak ditemukan");
        await repository.claimReview("user-rahma", content.id);
        await repository.addNote("user-rahma", content.id, { kind: "umum", anchor: null, isi: "Tambahkan contoh." });
        await repository.requestRevision("user-rahma", content.id);
        return content.id;
      },
      newArticle.title
    );

    const revisions = new RevisionPages(page);
    await revisions.gotoList();
    await revisions.thread(newArticle.title).click();
    await expect(page).toHaveURL(`/creator/revisi/${contentId}`);
    await expect(page.getByRole("main")).toContainText("Tambahkan contoh.");
    await expect(revisions.resubmit).toBeDisabled();

    await revisions.replies.first().fill("Contoh sudah ditambahkan.");
    await revisions.replies.first().blur();
    await revisions.fixedBoxes.first().check();
    await expect(revisions.resubmit).toBeEnabled();
    await revisions.resubmit.click();

    await expect(page).toHaveURL("/creator/revisi");
    await contents.goto();
    await expect(await contents.find(newArticle.title)).toContainText("Menunggu Review");
    const submissions = await withRepository(page, (repository, id) => repository.getContent(id).then((item) => item?.submissionCount), contentId);
    expect(submissions).toBe(2);
  });
});

test.describe("Route oEmbed", () => {
  test("menolak id yang tidak valid tanpa memanggil YouTube", async ({ request }) => {
    const response = await request.get("/api/youtube-oembed?id=bukan-id");

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ status: "tidak-ditemukan" });
  });
});

test.describe("Aksesibilitas ruang kerja Creator", () => {
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

      test("dialog dan pratinjau editor tanpa pelanggaran critical dan serious", async ({ page, isMobile }) => {
        const editor = new ArticleEditorPage(page);
        await editor.goto("konten-qa");
        await expect(editor.heading).toBeVisible();
        if (isMobile) await editor.contentTab.click();

        for (const open of [editor.addVideo, editor.addImage, editor.preview]) {
          await open.click();
          await expect(editor.dialog).toBeVisible();

          const { violations } = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();

          expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
          await page.keyboard.press("Escape");
          await expect(editor.dialog).toBeHidden();
        }
      });
    });
  }
});
