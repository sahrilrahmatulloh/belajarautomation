import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, ADMIN_WORKSPACE, DEMO_PASSWORD, PUBLIC_USER } from "../fixtures/testData";
import { AllContentsPageObject, AuditLogPageObject, ModerationPageObject, switchAccount, TransactionsPageObject, UserDetailPageObject, UsersPageObject } from "../pages/AdminPages";
import { LeaderboardPage } from "../pages/LeaderboardPage";
import { LoginPage } from "../pages/LoginPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { RevisionPages } from "../pages/CreatorStudioPages";
import { RoleDashboardPage } from "../pages/RoleDashboardPage";

const {
  waitingTitle,
  approvedTitle,
  approvedAuthorId,
  approvedAuthorName,
  publishedTitle,
  publishedId,
  authorMultiRoleTitle,
  counts,
  adminId,
  adminName,
  learnerId,
  learnerName,
  leaderboardUserId,
  leaderboardUserName,
} = ADMIN_WORKSPACE;

test.use({ role: "admin" });

const logEntries = (log: AuditLogPageObject, action: string, target: string) => log.rows.filter({ hasText: action }).filter({ hasText: target });

test.describe("Ringkasan", () => {
  for (const { label, value, url, rows } of ADMIN_WORKSPACE.summaryLinks) {
    test(`angka ${label} membuka daftar yang tersaring`, async ({ page }) => {
      await page.goto("/admin");

      await page.getByRole("link", { name: `${label} ${value}` }).click();

      await expect(page).toHaveURL(url);
      const list = url.includes("pengguna") ? new UsersPageObject(page) : url.includes("transaksi") ? new TransactionsPageObject(page) : url.includes("moderasi") ? new ModerationPageObject(page) : new AllContentsPageObject(page);
      await expect(list.rows).toHaveCount(rows);
    });
  }

  test("kartu Transaksi dan Moderasi tersedia sebagai placeholder", async ({ page }) => {
    await page.goto("/admin");

    for (const label of ADMIN_WORKSPACE.placeholderCards) {
      await expect(page.getByRole("heading", { level: 3, name: label })).toBeVisible();
      await expect(page.getByRole("link", { name: new RegExp(label) })).toHaveCount(0);
    }
    await expect(page.getByRole("main")).toContainText("Alur belum ditentukan");
  });
});

test.describe("Sidebar", () => {
  test("menu dikelompokkan sesuai FR-16", async ({ page, isMobile }) => {
    await page.goto("/admin");
    if (isMobile) await page.getByRole("button", { name: "Buka atau tutup sidebar" }).click();
    const nav = page.getByRole("navigation", { name: "Menu Admin" });

    await expect(nav.getByRole("link")).toHaveText(["Ringkasan", "Semua Konten", "Pengguna dan Peran", "Moderasi", "Transaksi", "Produk Digital", "Katalog Belajar", "Log Aktivitas Admin"]);
    await expect(nav).toContainText("Konten");
    await expect(nav).toContainText("Pengguna");
    await expect(nav).toContainText("Laporan");
  });
});

test.describe("Semua Konten", () => {
  let contents: AllContentsPageObject;

  test.beforeEach(async ({ page }) => {
    contents = new AllContentsPageObject(page);
    await contents.goto();
    await expect(contents.heading).toBeVisible();
  });

  test("tab status menampilkan jumlah, dan filter tersimpan di alamat", async ({ page }) => {
    await expect(contents.statusTab(/^Semua/)).toHaveText(`Semua (${counts.all})`);

    await contents.statusTab(/^Disetujui/).click();
    await expect(page).toHaveURL("/admin/konten?status=disetujui");
    await expect(contents.rows).toHaveCount(counts.approved);

    await page.reload();
    await expect(contents.rows).toHaveCount(counts.approved);
  });

  test("cari dan filter jenis, Creator, serta Reviewer menyaring daftar", async ({ page }) => {
    await contents.search.fill(waitingTitle);
    await expect(contents.rows).toHaveCount(1);
    await contents.search.fill("");

    await contents.creatorFilter.selectOption({ label: "Galih Ramadhan" });
    await expect(contents.rows).toHaveCount(counts.byGalih);
    await contents.creatorFilter.selectOption({ label: "Semua Creator" });

    await contents.reviewerFilter.selectOption({ label: "Rahma Putri" });
    await expect(contents.rows).toHaveCount(counts.byRahma);
    await contents.reviewerFilter.selectOption({ label: "Semua Reviewer" });

    await contents.typeFilter.selectOption({ label: "Soal" });
    await expect(page.getByText("Tidak ada konten yang cocok.")).toBeVisible();
  });

  test("tugaskan Reviewer tanpa penulis, Reviewer menerima notifikasi, dan tercatat di log", async ({ page }) => {
    await contents.search.fill(waitingTitle);
    await contents.row(waitingTitle).getByRole("button", { name: "Tugaskan Reviewer" }).click();
    const reviewer = contents.dialog.getByRole("combobox", { name: "Reviewer" });
    await expect(reviewer.getByRole("option")).toHaveText(["Rahma Putri", "Bima Santoso"]);
    await reviewer.selectOption({ label: "Rahma Putri" });
    await contents.dialog.getByRole("button", { name: "Tugaskan" }).click();
    await expect(contents.row(waitingTitle)).toContainText("Rahma Putri");

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(logEntries(log, "Tugaskan Reviewer", waitingTitle)).toHaveCount(1);

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

  test("Terbitkan terkunci tanpa kesepakatan, lalu terbuka setelah kesepakatan dicatat", async ({ page }) => {
    await contents.search.fill(approvedTitle);
    const entry = contents.row(approvedTitle);
    await expect(entry.getByRole("button", { name: "Terbitkan" })).toBeDisabled();
    await expect(entry).toContainText("Terkunci: Creator belum punya kesepakatan.");

    await entry.getByRole("link", { name: "Catat kesepakatan" }).click();
    await expect(page).toHaveURL(`/admin/pengguna/${approvedAuthorId}`);
    const detail = new UserDetailPageObject(page);
    await expect(detail.agreement).toContainText("Belum ada kesepakatan tercatat.");
    await detail.recordAgreement("2026-11-01", "Dokumen kesepakatan uji");
    await expect(detail.agreement.getByRole("list", { name: "Riwayat kesepakatan" })).toContainText("Dokumen kesepakatan uji");

    await contents.goto();
    await contents.search.fill(approvedTitle);
    await contents.row(approvedTitle).getByRole("button", { name: "Terbitkan" }).click();
    await expect(contents.dialog.getByRole("note")).toHaveText("Simulasi — di tahap ini artikel diterbitkan lewat PR (docs/CONTENT_GUIDE.md).");
    await contents.dialog.getByRole("button", { name: "Terbitkan" }).click();
    await expect(contents.row(approvedTitle)).toContainText("Terbit");

    await contents.row(approvedTitle).getByRole("button", { name: "Riwayat" }).click();
    const history = contents.dialog.getByRole("list", { name: "Riwayat status" }).getByRole("listitem");
    await expect(history.first()).toContainText("Menerbitkan");
    await expect(history.first()).toContainText("Disetujui → Terbit");
    await expect(history.first()).toContainText(adminName);
    await page.keyboard.press("Escape");

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(logEntries(log, "Catat kesepakatan", approvedAuthorName)).toHaveCount(1);
    await expect(logEntries(log, "Terbitkan", approvedTitle)).toHaveCount(1);
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

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(logEntries(log, "Tarik dari website", publishedTitle)).toContainText("Ada data yang keliru.");

    await switchAccount(page, ACCOUNTS.creator.email);
    await expect(page).toHaveURL("/creator");
    await new RevisionPages(page).goto(publishedId);
    const notes = page.getByRole("list", { name: "Daftar catatan" });
    await expect(notes).toContainText("Catatan Umum");
    await expect(notes).toContainText("Ada data yang keliru.");
  });
});

test.describe("Daftar pengguna", () => {
  let users: UsersPageObject;

  test.beforeEach(async ({ page }) => {
    users = new UsersPageObject(page);
    await users.goto();
    await expect(users.heading).toBeVisible();
  });

  test("cari berdasarkan nama, username, dan email", async () => {
    for (const keyword of [learnerName, "sobatqa", "user@demo"]) {
      await users.search.fill(keyword);
      await expect(users.rows).toHaveCount(1);
      await expect(users.row(learnerName)).toBeVisible();
    }
  });

  test("filter peran, membership, status, dan tanpa kesepakatan tersimpan di alamat", async ({ page }) => {
    await users.roleFilter.selectOption({ label: "Reviewer" });
    await expect(page).toHaveURL(/peran=reviewer/);
    await expect(users.rows).toHaveCount(counts.reviewers);
    await users.membershipFilter.selectOption({ label: "Premium" });
    await expect(users.rows).toHaveCount(1);
    await users.membershipFilter.selectOption({ label: "Semua membership" });
    await users.roleFilter.selectOption({ label: "Semua peran" });

    await users.statusFilter.selectOption({ label: "Nonaktif" });
    await expect(page.getByText("Tidak ada pengguna yang cocok.")).toBeVisible();
    await users.statusFilter.selectOption({ label: "Semua status" });

    await users.noAgreementFilter.check();
    await expect(page).toHaveURL(/kesepakatan=tanpa/);
    await expect(users.rows).toHaveCount(counts.creatorsWithoutAgreement);
    await expect(users.row(approvedAuthorName)).toBeVisible();
  });
});

test.describe("Detail pengguna", () => {
  test("menampilkan info akun, ringkasan belajar, membership, dan riwayat transaksi", async ({ page }) => {
    const users = new UsersPageObject(page);
    await users.goto("?q=sobatqa");
    await users.row(learnerName).getByRole("link", { name: `Lihat detail ${learnerName}` }).click();
    await expect(page).toHaveURL(`/admin/pengguna/${learnerId}`);

    await expect(page.getByRole("heading", { level: 1, name: learnerName })).toBeVisible();
    await expect(page.getByRole("region", { name: "Info Akun" })).toContainText("user@demo.belajarautomation.com");
    await expect(page.getByRole("region", { name: "Ringkasan Belajar" })).toContainText("Rank");
    await expect(page.getByRole("region", { name: "Membership dan Hak Akses" })).toContainText("Basic");
    await expect(page.getByRole("region", { name: "Riwayat Transaksi" })).toBeVisible();
  });

  test("tambah dan cabut peran wajib alasan, berlaku saat login, dan tercatat", async ({ page }) => {
    const detail = new UserDetailPageObject(page);
    await detail.goto(learnerId);

    await detail.roles.getByRole("button", { name: "Tambah Creator" }).click();
    await expect(detail.dialog.getByRole("button", { name: "Tambah peran" })).toBeDisabled();
    await detail.confirmWithReason("Tambah peran", "Bergabung sebagai penulis.");
    await expect(detail.roles.getByRole("list", { name: "Riwayat peran" })).toContainText(`${adminName} menambah peran Creator`);

    const log = new AuditLogPageObject(page);
    await log.goto();
    const added = logEntries(log, "Tambah peran", learnerName);
    await expect(added).toContainText("Bergabung sebagai penulis.");
    await added.getByRole("button", { name: /^Lihat perubahan/ }).click();
    await expect(log.dialog).toContainText("Sebelum");
    await expect(log.dialog).toContainText("creator");
    await page.keyboard.press("Escape");

    await detail.goto(learnerId);
    await detail.changeRole("Cabut Creator", "Cabut peran");
    await expect(detail.roles.getByRole("button", { name: "Tambah Creator" })).toBeVisible();

    await detail.changeRole("Tambah Creator", "Tambah peran");
    await expect(detail.roles.getByRole("button", { name: "Cabut Creator" })).toBeVisible();
    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL("/creator");
    const dashboard = new RoleDashboardPage(page, "creator");
    await dashboard.profileMenuButton.click();
    await expect(dashboard.modeOption("Mode Creator")).toHaveAttribute("aria-checked", "true");
  });

  test("tidak bisa mencabut Admin terakhir, dan penolakan tidak tercatat", async ({ page }) => {
    const detail = new UserDetailPageObject(page);
    await detail.goto(adminId);

    await detail.changeRole("Cabut Admin", "Cabut peran");

    await expect(detail.dialog.getByRole("alert")).toContainText("satu-satunya Admin");
    await page.keyboard.press("Escape");
    await expect(detail.roles.getByRole("button", { name: "Cabut Admin" })).toBeVisible();

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(page.getByText("Belum ada aktivitas Admin.")).toBeVisible();
  });

  test("Admin tidak bisa menonaktifkan akunnya sendiri", async ({ page }) => {
    const detail = new UserDetailPageObject(page);
    await detail.goto(adminId);

    await detail.status.getByRole("button", { name: "Nonaktifkan akun" }).click();
    await detail.confirmWithReason("Nonaktifkan");

    await expect(detail.dialog.getByRole("alert")).toContainText("akunmu sendiri");
  });

  test("nonaktifkan wajib alasan: login ditolak, tercatat di log, dan bisa diaktifkan kembali", async ({ page }) => {
    const detail = new UserDetailPageObject(page);
    await detail.goto(learnerId);
    await detail.status.getByRole("button", { name: "Nonaktifkan akun" }).click();
    await expect(detail.dialog.getByRole("button", { name: "Nonaktifkan" })).toBeDisabled();
    await detail.confirmWithReason("Nonaktifkan", "Melanggar ketentuan.");
    await expect(detail.status.getByRole("button", { name: "Aktifkan akun" })).toBeVisible();

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(logEntries(log, "Nonaktifkan akun", learnerName)).toContainText("Melanggar ketentuan.");

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page.getByRole("alert").filter({ hasText: "Akun ini dinonaktifkan" })).toBeVisible();
    await expect(page).toHaveURL("/login");

    const login = new LoginPage(page);
    await login.login(ACCOUNTS.admin.email, DEMO_PASSWORD);
    await expect(page).toHaveURL("/admin");
    await detail.goto(learnerId);
    await detail.status.getByRole("button", { name: "Aktifkan akun" }).click();
    await detail.confirmWithReason("Aktifkan");
    await expect(detail.status.getByRole("button", { name: "Nonaktifkan akun" })).toBeVisible();

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
  });

  test("akun nonaktif hilang dari leaderboard dan profil publik, datanya tetap ada", async ({ page }) => {
    const detail = new UserDetailPageObject(page);
    await detail.goto(leaderboardUserId);
    await detail.status.getByRole("button", { name: "Nonaktifkan akun" }).click();
    await detail.confirmWithReason("Nonaktifkan");
    await expect(detail.status.getByRole("button", { name: "Aktifkan akun" })).toBeVisible();

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);

    const leaderboard = new LeaderboardPage(page);
    await page.goto("/leaderboard?tab=global");
    await expect(leaderboard.topList.first()).toBeVisible();
    await expect(leaderboard.topList.filter({ hasText: leaderboardUserName })).toHaveCount(0);

    await page.goto(`/u/${PUBLIC_USER.username}`);
    await expect(page.getByRole("heading", { name: "Profil tidak ditemukan" })).toBeVisible();

    await switchAccount(page, ACCOUNTS.admin.email);
    await expect(page).toHaveURL("/admin");
    const users = new UsersPageObject(page);
    await users.goto("?status=nonaktif");
    await expect(users.row(leaderboardUserName)).toBeVisible();
  });

  test("kesepakatan bisa diperbarui tanpa menghapus yang lama", async ({ page }) => {
    const detail = new UserDetailPageObject(page);
    await detail.goto("user-galih");
    const history = detail.agreement.getByRole("list", { name: "Riwayat kesepakatan" }).getByRole("listitem");
    await expect(history).toHaveCount(1);

    await detail.recordAgreement("2026-11-02", "Kesepakatan versi baru");

    await expect(history).toHaveCount(2);
    await expect(history.first()).toContainText("Kesepakatan versi baru");
    await expect(detail.agreement.getByRole("status")).toHaveText("Kesepakatan tercatat.");
  });

  test("kesepakatan hanya tampil untuk Creator", async ({ page }) => {
    const detail = new UserDetailPageObject(page);
    await detail.goto(learnerId);
    await expect(page.getByRole("heading", { level: 1, name: learnerName })).toBeVisible();

    await expect(detail.agreement).toBeHidden();
  });

  test("pengguna yang tidak ada menampilkan keterangan", async ({ page }) => {
    await new UserDetailPageObject(page).goto("tidak-ada");

    await expect(page.getByRole("heading", { name: "Pengguna tidak ditemukan" })).toBeVisible();
  });
});

test.describe("Log Aktivitas Admin", () => {
  test("bisa dicari dan disaring, dan tidak punya aksi ubah atau hapus", async ({ page }) => {
    const detail = new UserDetailPageObject(page);
    await detail.goto(learnerId);
    await detail.changeRole("Tambah Reviewer", "Tambah peran");
    await expect(detail.roles.getByRole("button", { name: "Cabut Reviewer" })).toBeVisible();
    await detail.status.getByRole("button", { name: "Nonaktifkan akun" }).click();
    await detail.confirmWithReason("Nonaktifkan", "Alasan khusus nonaktif.");
    await expect(detail.status.getByRole("button", { name: "Aktifkan akun" })).toBeVisible();

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.heading).toBeVisible();
    await expect(log.rows).toHaveCount(2);

    await log.search.fill("khusus nonaktif");
    await expect(log.rows).toHaveCount(1);
    await log.search.fill("");

    await log.actionFilter.selectOption({ label: "Tambah peran" });
    await expect(page).toHaveURL(/aksi=tambah-peran/);
    await expect(log.rows).toHaveCount(1);
    await log.actionFilter.selectOption({ label: "Semua aksi" });

    await log.adminFilter.selectOption({ label: adminName });
    await expect(log.rows).toHaveCount(2);

    await page.getByLabel("Sampai tanggal").fill("2000-01-01");
    await expect(page.getByText("Tidak ada log yang cocok.")).toBeVisible();
    await page.getByLabel("Sampai tanggal").fill("");

    await expect(log.rows.first().getByRole("button")).toHaveText([/^Lihat perubahan/]);
    await expect(page.getByRole("main").getByRole("button", { name: /Hapus|Ubah|Edit/ })).toHaveCount(0);
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

      for (const path of ADMIN_WORKSPACE.axePaths) {
        test(`${path} tanpa pelanggaran critical dan serious`, async ({ page }) => {
          await page.goto(path);
          await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();

          expect(await blocking(page)).toEqual([]);
        });
      }

      test("baris Terbitkan terkunci tanpa pelanggaran", async ({ page }) => {
        const contents = new AllContentsPageObject(page);
        await contents.goto("?status=disetujui");
        await expect(contents.row(approvedTitle)).toContainText("Terkunci");

        expect(await blocking(page)).toEqual([]);
      });

      test("dialog aksi tanpa pelanggaran", async ({ page }) => {
        const contents = new AllContentsPageObject(page);
        await contents.goto();
        await expect(contents.heading).toBeVisible();

        for (const [title, action] of [[publishedTitle, "Tarik dari website"], [waitingTitle, "Tugaskan Reviewer"], [approvedTitle, "Riwayat"]] as const) {
          await contents.search.fill(title);
          await contents.row(title).getByRole("button", { name: action }).click();
          await expect(contents.dialog).toBeVisible();

          expect(await blocking(page, '[role="dialog"]')).toEqual([]);
          await page.keyboard.press("Escape");
          await expect(contents.dialog).toBeHidden();
        }
      });

      test("dialog log dan alasan tanpa pelanggaran", async ({ page }) => {
        const detail = new UserDetailPageObject(page);
        await detail.goto(learnerId);
        await detail.roles.getByRole("button", { name: "Tambah Creator" }).click();
        await expect(detail.dialog).toBeVisible();
        expect(await blocking(page, '[role="dialog"]')).toEqual([]);
        await detail.confirmWithReason("Tambah peran");
        await expect(detail.roles.getByRole("button", { name: "Cabut Creator" })).toBeVisible();

        const log = new AuditLogPageObject(page);
        await log.goto();
        await log.rows.first().getByRole("button", { name: /^Lihat perubahan/ }).click();
        await expect(log.dialog).toBeVisible();

        expect(await blocking(page, '[role="dialog"]')).toEqual([]);
      });
    });
  }
});
