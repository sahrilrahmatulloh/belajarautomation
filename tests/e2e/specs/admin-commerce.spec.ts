import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import type { ContentRepository } from "@/lib/content/repository";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, ADMIN_COMMERCE } from "../fixtures/testData";
import { AuditLogPageObject, ProductsPageObject, switchAccount, TransactionDetailPageObject, TransactionsPageObject, UserDetailPageObject } from "../pages/AdminPages";

const { ownedTransactionId, ownedEbookTitle, ownedEbookSlug, pendingTransactionId, pendingTitle, failedTransactionId, refundedTransactionId, draftProductTitle, draftProductSlug, learnerId, allStatuses } = ADMIN_COMMERCE;

test.use({ role: "admin" });

const catalogCard = (page: Page, title: string) => page.getByRole("main").getByRole("article").filter({ hasText: title });

test.describe("Daftar transaksi", () => {
  let transactions: TransactionsPageObject;

  test.beforeEach(async ({ page }) => {
    transactions = new TransactionsPageObject(page);
    await transactions.goto();
    await expect(transactions.heading).toBeVisible();
  });

  test("memuat semua status dan filter tersimpan di alamat", async ({ page }) => {
    await expect(transactions.statusFilter.getByRole("option")).toHaveText(["Semua status", ...allStatuses]);

    for (const status of allStatuses) {
      await transactions.statusFilter.selectOption({ label: status });
      await expect(transactions.rows.first()).toContainText(status);
    }
    await expect(page).toHaveURL(/status=refund/);
  });

  test("bisa dicari dan disaring rentang tanggal", async ({ page }) => {
    await transactions.search.fill(ownedTransactionId);
    await expect(transactions.rows).toHaveCount(1);
    await transactions.search.fill("");

    await page.getByLabel("Sampai tanggal").fill("2000-01-01");
    await expect(page.getByText("Tidak ada transaksi yang cocok.")).toBeVisible();
    await expect(page).toHaveURL(/sampai=2000-01-01/);
  });
});

test.describe("Refund", () => {
  test("wajib alasan, mencabut akses, tercatat, dan tidak bisa diulang", async ({ page }) => {
    const detail = new TransactionDetailPageObject(page);
    await detail.goto(ownedTransactionId);
    await expect(page.getByRole("note").filter({ hasText: "Kebijakan refund belum final" })).toBeVisible();

    await detail.refundButton.click();
    const confirm = detail.dialog.getByRole("button", { name: "Refund", exact: true });
    await expect(confirm).toBeDisabled();
    await detail.dialog.getByRole("textbox", { name: "Alasan refund" }).fill("Permintaan pengguna.");
    await confirm.click();

    await expect(detail.timeline.first()).toContainText("Refund");
    await expect(detail.timeline.first()).toContainText("Permintaan pengguna.");
    await expect(detail.refundButton).toBeHidden();

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.rows.filter({ hasText: "Refund" }).filter({ hasText: ownedEbookTitle })).toContainText("Permintaan pengguna.");

    const user = new UserDetailPageObject(page);
    await user.goto(learnerId);
    await expect(page.getByRole("list", { name: "Daftar hak akses" })).toContainText("Dicabut");

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    await page.goto(`/ebooks/${ownedEbookSlug}`);
    await expect(page.getByRole("heading", { level: 1, name: ownedEbookTitle })).toBeVisible();
    await expect(page.getByText("eBook ini sudah kamu miliki")).toBeHidden();
  });

  test("pemilik melihat eBook sebagai dimiliki sebelum refund", async ({ page }) => {
    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);

    await page.goto(`/ebooks/${ownedEbookSlug}`);

    await expect(page.getByText("eBook ini sudah kamu miliki")).toBeVisible();
  });

  for (const { name, id } of [
    { name: "Menunggu Pembayaran", id: pendingTransactionId },
    { name: "Gagal", id: failedTransactionId },
    { name: "Refund", id: refundedTransactionId },
  ]) {
    test(`tidak tersedia untuk status ${name}`, async ({ page }) => {
      const detail = new TransactionDetailPageObject(page);
      await detail.goto(id);
      await expect(detail.timeline.first()).toBeVisible();

      await expect(detail.refundButton).toBeHidden();
    });
  }
});

test.describe("Status pembayaran", () => {
  test("Admin tidak punya aksi mengubah status, dan repository menolak refund yang bukan Berhasil", async ({ page }) => {
    const detail = new TransactionDetailPageObject(page);
    await detail.goto(failedTransactionId);
    await expect(detail.timeline.first()).toContainText("Gagal");

    await expect(detail.gateway).toBeHidden();
    await expect(page.getByRole("main").getByRole("combobox")).toHaveCount(0);

    const result = await page.evaluate(async (id) => {
      const repository = (window as unknown as { __contentRepository: ContentRepository & { setTransactionStatus?: unknown } }).__contentRepository;
      const message = await repository.refundTransaction("user-admin", id, "Uji.").then(
        () => "",
        (error: Error) => error.message
      );
      return { message, hasSetter: "setTransactionStatus" in repository };
    }, failedTransactionId);

    expect(result.message).toContain("Refund hanya untuk transaksi berstatus Berhasil");
    expect(result.hasSetter).toBe(false);
  });

  test("Simulasi gateway terpisah dari aksi Admin: mengaktifkan akses tanpa masuk Log", async ({ page }) => {
    const detail = new TransactionDetailPageObject(page);
    await detail.goto(pendingTransactionId);
    await expect(detail.gateway).toContainText("Bukan aksi Admin");

    await detail.gatewayButton("Berhasil").click();

    await expect(detail.timeline.first()).toContainText("Berhasil");
    await expect(detail.timeline.first()).toContainText("Payment gateway");
    await expect(detail.gateway).toBeHidden();

    const user = new UserDetailPageObject(page);
    await user.goto(learnerId);
    await expect(page.getByRole("region", { name: "Membership dan Hak Akses" })).toContainText("Pro");

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(page.getByText("Belum ada aktivitas Admin.")).toBeVisible();
  });

  test("Simulasi gateway Gagal dan Kedaluwarsa tidak memberi akses", async ({ page }) => {
    const detail = new TransactionDetailPageObject(page);
    await detail.goto(pendingTransactionId);

    await detail.gatewayButton("Kedaluwarsa").click();
    await expect(detail.timeline.first()).toContainText("Kedaluwarsa");

    const user = new UserDetailPageObject(page);
    await user.goto(learnerId);
    await expect(page.getByRole("region", { name: "Membership dan Hak Akses" })).not.toContainText(pendingTitle);
  });
});

test.describe("Hak akses manual", () => {
  test("pemberian manual membuka akses, tercatat di log, dan bisa dicabut dengan alasan", async ({ page }) => {
    const user = new UserDetailPageObject(page);
    await user.goto(learnerId);
    const access = page.getByRole("region", { name: "Membership dan Hak Akses" });

    await access.getByRole("button", { name: "Berikan hak akses manual" }).click();
    await expect(user.dialog.getByRole("button", { name: "Berikan akses" })).toBeDisabled();
    await user.dialog.getByRole("combobox", { name: "Item" }).selectOption({ label: "Membership Premium" });
    await user.dialog.getByRole("textbox", { name: "Alasan" }).fill("Kompensasi gangguan.");
    await user.dialog.getByRole("button", { name: "Berikan akses" }).click();

    const list = access.getByRole("list", { name: "Daftar hak akses" });
    await expect(list).toContainText("Pemberian manual");
    await expect(list).toContainText("Kompensasi gangguan.");
    await expect(access).toContainText("Premium");

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.rows.filter({ hasText: "Berikan hak akses" })).toContainText("Kompensasi gangguan.");

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    await page.goto("/membership");
    await expect(page.getByRole("main")).toContainText("Premium");

    await switchAccount(page, ACCOUNTS.admin.email);
    await expect(page).toHaveURL("/admin");
    await user.goto(learnerId);
    await access.getByRole("button", { name: "Cabut hak akses Membership Premium" }).click();
    await user.dialog.getByRole("textbox", { name: "Alasan" }).fill("Salah pilih.");
    await user.dialog.getByRole("button", { name: "Cabut akses" }).click();
    await expect(list).toContainText("Alasan dicabut: Salah pilih.");
    await expect(access.getByRole("button", { name: "Cabut hak akses Membership Premium" })).toBeHidden();
  });

  test("hak akses dari pembelian tidak bisa dicabut lewat aksi manual", async ({ page }) => {
    const user = new UserDetailPageObject(page);
    await user.goto(learnerId);
    const list = page.getByRole("list", { name: "Daftar hak akses" });
    await expect(list).toContainText(ownedEbookTitle);

    await expect(list.getByRole("button")).toHaveCount(0);
  });

  test("detail pengguna memuat riwayat transaksi dan klaim kredit", async ({ page }) => {
    const user = new UserDetailPageObject(page);
    await user.goto("user-rahma");

    await expect(page.getByRole("region", { name: "Riwayat Transaksi" })).toContainText("Membership Premium");
    await expect(page.getByRole("region", { name: "Riwayat Klaim Kredit" }).getByRole("listitem")).toHaveCount(2);
    await expect(page.getByRole("region", { name: "Membership dan Hak Akses" })).toContainText("1 dari 3");
  });
});

test.describe("Produk Digital", () => {
  let products: ProductsPageObject;

  test.beforeEach(async ({ page }) => {
    products = new ProductsPageObject(page);
    await products.goto();
    await expect(products.heading).toBeVisible();
  });

  test("filter jenis dan status tersimpan di alamat", async ({ page }) => {
    await products.statusFilter.selectOption({ label: "Draf" });

    await expect(page).toHaveURL(/status=draf/);
    await expect(products.rows).toHaveCount(1);
    await expect(products.row(draftProductTitle)).toBeVisible();

    await products.statusFilter.selectOption({ label: "Semua status" });
    await products.typeFilter.selectOption({ label: "Project" });
    await expect(products.rows.first()).toContainText("Project");
  });

  test("produk Draf tidak tampil di katalog publik, dan tampil setelah Terbit", async ({ page }) => {
    // Admin melihat ajakan Mode Belajar di halaman pelajar, jadi katalog diperiksa sebagai pelajar.
    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    await page.goto("/ebooks");
    await expect(catalogCard(page, ownedEbookTitle)).toBeVisible();
    await expect(catalogCard(page, draftProductTitle)).toHaveCount(0);

    await page.goto(`/ebooks/${draftProductSlug}`);
    await expect(page.getByRole("heading", { name: "eBook tidak ditemukan" })).toBeVisible();

    await switchAccount(page, ACCOUNTS.admin.email);
    await expect(page).toHaveURL("/admin");
    await products.goto();
    await products.openEdit(draftProductTitle);
    await products.dialog.getByRole("combobox", { name: "Status" }).selectOption({ label: "Terbit" });
    await products.dialog.getByRole("button", { name: "Simpan" }).click();
    await expect(products.row(draftProductTitle)).toContainText("Terbit");

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    await page.goto("/ebooks");
    await expect(catalogCard(page, draftProductTitle)).toBeVisible();
  });

  test("ubah harga wajib alasan dan tidak mengubah transaksi lama", async ({ page }) => {
    const detail = new TransactionDetailPageObject(page);
    await detail.goto(ownedTransactionId);
    const info = page.getByRole("region", { name: "Info Transaksi" });
    await expect(info).toContainText("49.000");

    await products.goto();
    await products.openEdit(ownedEbookTitle);
    await products.dialog.getByRole("spinbutton", { name: "Harga (Rp)" }).fill("75000");
    await products.dialog.getByRole("button", { name: "Simpan" }).click();
    await expect(products.dialog.getByRole("alert")).toContainText("Alasan perubahan harga wajib diisi");

    await products.dialog.getByRole("textbox", { name: "Alasan perubahan harga" }).fill("Penyesuaian harga.");
    await products.dialog.getByRole("button", { name: "Simpan" }).click();
    await expect(products.row(ownedEbookTitle)).toContainText("75.000");

    await detail.goto(ownedTransactionId);
    await expect(info).toContainText("49.000");
    await expect(info).not.toContainText("75.000");

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.rows.filter({ hasText: "Ubah produk" })).toContainText("Penyesuaian harga.");
  });

  test("tambah produk dengan file simulasi, dan kolom wajib ditolak", async () => {
    await products.addButton.click();
    await products.dialog.getByRole("button", { name: "Simpan" }).click();
    await expect(products.dialog.getByRole("alert")).toContainText("Judul produk wajib diisi");

    await products.dialog.getByRole("textbox", { name: "Judul" }).fill("eBook Uji Baru");
    await products.dialog.getByRole("textbox", { name: "Deskripsi" }).fill("Deskripsi uji.");
    await products.dialog.getByRole("spinbutton", { name: "Harga (Rp)" }).fill("10000");
    await products.dialog.getByLabel("File produk (Simulasi)").setInputFiles({ name: "uji.pdf", mimeType: "application/pdf", buffer: Buffer.from("x") });
    await expect(products.dialog).toContainText("Tercatat: uji.pdf");
    await products.dialog.getByRole("button", { name: "Simpan" }).click();

    await products.search.fill("eBook Uji Baru");
    await expect(products.row("eBook Uji Baru")).toContainText("Draf");
  });
});

test.describe("Aksesibilitas", () => {
  const blocking = async (page: Page, selector?: string) => {
    const builder = new AxeBuilder({ page });
    const { violations } = await (selector ? builder.include(selector) : builder).analyze();
    return violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id);
  };

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("dialog refund, hak akses, dan produk tanpa pelanggaran", async ({ page }) => {
        const detail = new TransactionDetailPageObject(page);
        await detail.goto(ownedTransactionId);
        await detail.refundButton.click();
        await expect(detail.dialog).toBeVisible();
        expect(await blocking(page, '[role="dialog"]')).toEqual([]);

        const user = new UserDetailPageObject(page);
        await user.goto(learnerId);
        await page.getByRole("button", { name: "Berikan hak akses manual" }).click();
        await expect(user.dialog).toBeVisible();
        expect(await blocking(page, '[role="dialog"]')).toEqual([]);

        const products = new ProductsPageObject(page);
        await products.goto();
        await products.addButton.click();
        await expect(products.dialog).toBeVisible();
        expect(await blocking(page, '[role="dialog"]')).toEqual([]);
      });

      test("katalog eBook dan Project tanpa pelanggaran", async ({ page }) => {
        await switchAccount(page, ACCOUNTS.user.email);
        await expect(page).toHaveURL(ACCOUNTS.user.home);

        for (const path of ["/ebooks", "/projects"]) {
          await page.goto(path);
          await expect(page.getByRole("main").getByRole("article").first()).toBeVisible();
          expect(await blocking(page)).toEqual([]);
        }
      });
    });
  }
});
