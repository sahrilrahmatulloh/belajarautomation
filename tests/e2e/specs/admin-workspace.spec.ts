import AxeBuilder from "@axe-core/playwright";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, ADMIN_WORKSPACE } from "../fixtures/testData";
import { AllContentsPageObject, ManageRolesPageObject, switchAccount } from "../pages/AdminPages";
import { NotificationsPage } from "../pages/NotificationsPage";
import { RevisionPages } from "../pages/CreatorStudioPages";
import { RoleDashboardPage } from "../pages/RoleDashboardPage";

const { waitingTitle, approvedTitle, publishedTitle, publishedId, authorMultiRoleTitle, counts, adminName, learnerName } = ADMIN_WORKSPACE;

test.use({ role: "admin" });

test.describe("Ringkasan", () => {
  test("menampilkan jumlah per status dan angka bisa diklik ke daftar tersaring", async ({ page }) => {
    await page.goto("/admin");

    for (const { label, value, query, rows } of ADMIN_WORKSPACE.summaryLinks) {
      await page.goto("/admin");
      await page.getByRole("link", { name: `${label} ${value}` }).click();

      await expect(page).toHaveURL(`/admin/konten${query}`);
      await expect(new AllContentsPageObject(page).rows).toHaveCount(rows);
    }
  });

  test("menampilkan konten terbit terbaru", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.getByRole("region", { name: "Terbit Terbaru" })).toContainText(publishedTitle);
  });
});

test.describe("Sidebar Admin", () => {
  test("hanya memuat Dashboard, Semua Konten, dan Kelola Peran", async ({ page, isMobile }) => {
    await page.goto("/admin");
    if (isMobile) await page.getByRole("button", { name: "Buka atau tutup sidebar" }).click();

    await expect(page.getByRole("navigation", { name: "Menu Admin" }).getByRole("link")).toHaveText(["Dashboard", "Semua Konten", "Kelola Peran"]);
  });
});

test.describe("Semua Konten", () => {
  let contents: AllContentsPageObject;

  test.beforeEach(async ({ page }) => {
    contents = new AllContentsPageObject(page);
    await contents.goto();
    await expect(contents.heading).toBeVisible();
  });

  test("tab status menampilkan jumlah dan tersimpan di alamat", async ({ page }) => {
    await expect(contents.statusTab(/^Semua/)).toHaveText(`Semua (${counts.all})`);

    await contents.statusTab(/^Disetujui/).click();

    await expect(page).toHaveURL("/admin/konten?status=disetujui");
    await expect(contents.rows).toHaveCount(counts.approved);
  });

  test("cari dan filter jenis, Creator, serta Reviewer menyaring daftar", async ({ page }) => {
    await contents.search.fill(waitingTitle);
    await expect(contents.rows).toHaveCount(1);
    await contents.search.fill("");

    await contents.creatorFilter.selectOption({ label: "Galih Ramadhan" });
    await expect(contents.rows).toHaveCount(counts.byGalih);
    await contents.creatorFilter.selectOption({ label: "Semua Creator" });

    await contents.reviewerFilter.selectOption({ label: "Belum ditugaskan" });
    await expect(page).toHaveURL(/reviewer=belum/);
    await contents.reviewerFilter.selectOption({ label: "Rahma Putri" });
    await expect(contents.rows).toHaveCount(counts.byRahma);
    await contents.reviewerFilter.selectOption({ label: "Semua Reviewer" });

    await contents.typeFilter.selectOption({ label: "Soal" });
    await expect(page.getByText("Tidak ada konten yang cocok.")).toBeVisible();
  });

  test("tugaskan Reviewer tanpa penulis, lalu Reviewer menerima notifikasi", async ({ page }) => {
    await contents.search.fill(waitingTitle);
    await contents.row(waitingTitle).getByRole("button", { name: "Tugaskan Reviewer" }).click();

    const options = contents.dialog.getByRole("combobox", { name: "Reviewer" }).getByRole("option");
    await expect(options).toHaveText(["Rahma Putri", "Bima Santoso"]);
    await contents.dialog.getByRole("combobox", { name: "Reviewer" }).selectOption({ label: "Rahma Putri" });
    await contents.dialog.getByRole("button", { name: "Tugaskan" }).click();
    await expect(contents.row(waitingTitle)).toContainText("Rahma Putri");

    await switchAccount(page, ACCOUNTS.reviewer.email);
    await expect(page).toHaveURL("/reviewer");
    await page.goto("/notifications");
    await expect(new NotificationsPage(page).item("Konten ditugaskan kepadamu").filter({ hasText: waitingTitle })).toBeVisible();
  });

  test("penulis yang juga Reviewer tidak ada di pilihan", async () => {
    await contents.search.fill(authorMultiRoleTitle);
    await contents.row(authorMultiRoleTitle).getByRole("button", { name: "Tugaskan Reviewer" }).click();

    await expect(contents.dialog.getByRole("combobox", { name: "Reviewer" }).getByRole("option")).toHaveText(["Rahma Putri"]);
  });

  test("terbitkan dari Disetujui dengan keterangan simulasi, dan tercatat di riwayat", async () => {
    await contents.statusTab(/^Disetujui/).click();
    await contents.row(approvedTitle).getByRole("button", { name: "Terbitkan" }).click();
    await expect(contents.dialog.getByRole("note")).toHaveText("Simulasi — di tahap ini artikel diterbitkan lewat PR (docs/CONTENT_GUIDE.md).");
    await contents.dialog.getByRole("button", { name: "Terbitkan" }).click();
    await expect(contents.rows).toHaveCount(0);

    await contents.statusTab(/^Terbit/).click();
    await contents.row(approvedTitle).getByRole("button", { name: "Riwayat" }).click();

    const history = contents.dialog.getByRole("list", { name: "Riwayat status" }).getByRole("listitem");
    await expect(history.first()).toContainText("Menerbitkan");
    await expect(history.first()).toContainText("Disetujui → Terbit");
    await expect(history.first()).toContainText(adminName);
  });

  test("aksi hanya muncul pada status yang sesuai", async () => {
    await contents.statusTab(/^Draf/).click();

    await expect(contents.rows.first().getByRole("button")).toHaveText(["Riwayat"]);
  });

  test("tarik dari website wajib alasan, dan Creator melihatnya sebagai catatan umum", async ({ page }) => {
    await contents.search.fill(publishedTitle);
    await contents.row(publishedTitle).getByRole("button", { name: "Tarik dari website" }).click();
    const confirm = contents.dialog.getByRole("button", { name: "Tarik dari website" });
    await expect(confirm).toBeDisabled();

    await contents.dialog.getByRole("textbox", { name: "Alasan penarikan" }).fill("Ada data yang keliru.");
    await confirm.click();
    await expect(contents.row(publishedTitle)).toContainText("Draf");

    await switchAccount(page, ACCOUNTS.creator.email);
    await expect(page).toHaveURL("/creator");
    const revisions = new RevisionPages(page);
    await revisions.goto(publishedId);

    await expect(page.getByRole("list", { name: "Daftar catatan" })).toContainText("Catatan Umum");
    await expect(page.getByRole("list", { name: "Daftar catatan" })).toContainText("Ada data yang keliru.");
  });
});

test.describe("Kelola Peran", () => {
  let roles: ManageRolesPageObject;

  test.beforeEach(async ({ page }) => {
    roles = new ManageRolesPageObject(page);
    await roles.goto();
    await expect(roles.heading).toBeVisible();
  });

  test("cari dan filter peran menyaring daftar", async () => {
    await roles.search.fill(learnerName);
    await expect(roles.rows).toHaveCount(1);
    await roles.search.fill("");

    await roles.roleFilter.selectOption({ label: "Reviewer" });

    await expect(roles.rows).toHaveCount(2);
  });

  test("tambah dan cabut peran tercatat di riwayat", async () => {
    await expect(roles.history).toContainText("Belum ada perubahan peran.");

    await roles.roleAction(learnerName, "Tambah Creator").click();
    await roles.dialog.getByRole("button", { name: "Tambah peran" }).click();
    await expect(roles.row(learnerName)).toContainText("Creator");
    await expect(roles.history.getByRole("listitem").first()).toContainText(`${adminName} menambah peran Creator untuk ${learnerName}`);

    await roles.roleAction(learnerName, "Cabut Creator").click();
    await roles.dialog.getByRole("button", { name: "Cabut peran" }).click();
    await expect(roles.roleAction(learnerName, "Tambah Creator")).toBeVisible();
    await expect(roles.history.getByRole("listitem").first()).toContainText(`${adminName} mencabut peran Creator dari ${learnerName}`);
  });

  test("peran baru berlaku saat pengguna masuk kembali", async ({ page }) => {
    await roles.roleAction(learnerName, "Tambah Creator").click();
    await roles.dialog.getByRole("button", { name: "Tambah peran" }).click();
    await expect(roles.row(learnerName)).toContainText("Creator");

    await switchAccount(page, ACCOUNTS.user.email);

    await expect(page).toHaveURL("/creator");
    const dashboard = new RoleDashboardPage(page, "creator");
    await dashboard.profileMenuButton.click();
    await expect(dashboard.modeOption("Mode Creator")).toHaveAttribute("aria-checked", "true");
  });

  test("tidak bisa mencabut Admin terakhir", async () => {
    await roles.roleAction(adminName, "Cabut Admin").click();
    await roles.dialog.getByRole("button", { name: "Cabut peran" }).click();

    await expect(roles.dialog.getByRole("alert")).toContainText("satu-satunya Admin");
    await roles.dialog.getByRole("button", { name: "Batal" }).click();
    await expect(roles.row(adminName)).toContainText("Admin");
    await expect(roles.history).toContainText("Belum ada perubahan peran.");
  });
});

test.describe("Aksesibilitas", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      for (const path of ADMIN_WORKSPACE.axePaths) {
        test(`${path} tanpa pelanggaran critical dan serious`, async ({ page }) => {
          await page.goto(path);
          await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();

          const { violations } = await new AxeBuilder({ page }).analyze();

          expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
        });
      }

      test("dialog aksi tanpa pelanggaran critical dan serious", async ({ page }) => {
        const contents = new AllContentsPageObject(page);
        await contents.goto();
        await expect(contents.heading).toBeVisible();

        for (const [title, action] of [[publishedTitle, "Tarik dari website"], [approvedTitle, "Terbitkan"], [approvedTitle, "Riwayat"]] as const) {
          await contents.search.fill(title);
          await contents.row(title).getByRole("button", { name: action }).click();
          await expect(contents.dialog).toBeVisible();

          const { violations } = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();

          expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
          await page.keyboard.press("Escape");
          await expect(contents.dialog).toBeHidden();
        }
      });
    });
  }
});
