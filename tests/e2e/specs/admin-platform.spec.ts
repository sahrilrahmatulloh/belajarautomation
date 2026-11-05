import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, ADMIN_PLATFORM } from "../fixtures/testData";
import { AuditLogPageObject, CatalogPageObject, ModerationPageObject, switchAccount, UserDetailPageObject } from "../pages/AdminPages";
import { LeaderboardPage } from "../pages/LeaderboardPage";

const { freeXp, masterXp, foundationCourse, studiedFreeCourse, unstudiedFreeCourse, comingSoonDraftCourse, readyTargetCourse, flaggedUser, flaggedUserId, flaggedUserXp, correctedXp, rankBefore, rankAfter, otherFlaggedUser } = ADMIN_PLATFORM;

test.use({ role: "admin" });

test.describe("Katalog Belajar", () => {
  let catalog: CatalogPageObject;

  test.beforeEach(async ({ page }) => {
    catalog = new CatalogPageObject(page);
    await catalog.goto();
    await expect(catalog.heading).toBeVisible();
  });

  test("menampilkan banner Simulasi, indikator XP gratis, dan status course", async () => {
    await expect(catalog.banner).toBeVisible();
    await expect(catalog.indicator).toContainText(`${freeXp} / ${masterXp}`);
    await expect(catalog.rows).toHaveCount(25);
    await expect(catalog.row(unstudiedFreeCourse)).toContainText("Segera hadir");
    await expect(catalog.row(unstudiedFreeCourse)).toContainText("Gratis");
  });

  test("menolak Tersedia selama konten belum Siap, dengan pesan yang jelas", async () => {
    await catalog.change(comingSoonDraftCourse, "Status katalog", "Tersedia");

    await expect(catalog.dialog.getByRole("alert")).toContainText("belum Siap");
    await expect(catalog.dialog.getByRole("alert")).toContainText("UAT dan Production");
  });

  test("menolak course fondasi dijadikan premium", async () => {
    await catalog.change(foundationCourse, "Tingkat akses", "Premium");

    await expect(catalog.dialog.getByRole("alert")).toContainText("Course fondasi wajib gratis");
  });

  test("menolak gratis ke premium bila sudah ada yang mempelajari", async () => {
    await catalog.change("Playwright", "Tingkat akses", "Premium");

    await expect(catalog.dialog.getByRole("alert")).toContainText("sudah ada pengguna yang mempelajarinya");
  });

  test("menolak perubahan yang membuat XP gratis kurang dari batas Master", async () => {
    await catalog.change(studiedFreeCourse, "Tingkat akses", "Premium");

    await expect(catalog.dialog.getByRole("alert")).toContainText("kurang dari batas rank Master");
    await catalog.dialog.getByRole("button", { name: "Batal" }).click();
    await expect(catalog.indicator).toContainText(`${freeXp} / ${masterXp}`);
  });

  test("perubahan yang sah wajib alasan, tercatat di log, dan halaman Belajar tidak berubah", async ({ page }) => {
    await catalog.search.fill(readyTargetCourse);
    await catalog.row(readyTargetCourse).getByRole("button", { name: `Ubah ${readyTargetCourse}` }).click();
    await catalog.dialog.getByRole("combobox", { name: "Status konten" }).selectOption({ label: "Siap" });
    await expect(catalog.dialog.getByRole("button", { name: "Simpan" })).toBeDisabled();
    await catalog.dialog.getByRole("textbox", { name: "Alasan" }).fill("Konten selesai.");
    await catalog.dialog.getByRole("button", { name: "Simpan" }).click();
    await expect(catalog.row(readyTargetCourse)).toContainText("Siap");

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.rows.filter({ hasText: "Ubah katalog" })).toContainText("Konten selesai.");

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    await page.goto("/learn/selenium");
    await expect(page.getByRole("main")).toContainText("Segera hadir");
  });

  test("status roadmap dan latihan bisa diubah dengan alasan", async () => {
    const entry = catalog.itemRows.filter({ hasText: "Kuis QA Fundamental" });
    await expect(entry).toContainText("Aktif");

    await entry.getByRole("button", { name: "Nonaktifkan Kuis QA Fundamental" }).click();
    await catalog.dialog.getByRole("textbox", { name: "Alasan" }).fill("Soal sedang diperbaiki.");
    await catalog.dialog.getByRole("button", { name: "Simpan" }).click();

    await expect(entry).toContainText("Nonaktif");
  });
});

test.describe("Moderasi", () => {
  let moderation: ModerationPageObject;

  test.beforeEach(async ({ page }) => {
    moderation = new ModerationPageObject(page);
    await moderation.goto();
    await expect(moderation.heading).toBeVisible();
  });

  test("memuat contoh penandaan, dan batasnya diberi keterangan belum final", async ({ page }) => {
    await expect(page.getByRole("note").filter({ hasText: "batas penandaan belum final" })).toBeVisible();
    await expect(moderation.rows).toHaveCount(3);
    await expect(moderation.row(flaggedUser)).toContainText("Lonjakan XP harian");
    await expect(moderation.row(otherFlaggedUser)).toContainText("Lesson terlalu cepat");
  });

  test("koreksi XP mengubah total dan rank tanpa menghapus riwayat", async ({ page }) => {
    const user = new UserDetailPageObject(page);
    await user.goto(flaggedUserId);
    const summary = page.getByRole("region", { name: "Ringkasan Belajar" });
    await expect(summary).toContainText(flaggedUserXp);
    await expect(summary).toContainText(rankBefore);

    await moderation.goto();
    await moderation.row(flaggedUser).getByRole("button", { name: `Koreksi XP ${flaggedUser}` }).click();
    await expect(moderation.dialog.getByRole("button", { name: "Simpan koreksi" })).toBeDisabled();
    await moderation.dialog.getByRole("spinbutton", { name: /Jumlah koreksi/ }).fill("-2000");
    await expect(moderation.dialog).toContainText(`${correctedXp} XP (${rankAfter})`);
    await moderation.dialog.getByRole("textbox", { name: "Alasan" }).fill("XP tidak wajar.");
    await moderation.dialog.getByRole("button", { name: "Simpan koreksi" }).click();
    await expect(moderation.row(flaggedUser)).toContainText("Ditangani");
    await expect(moderation.row(flaggedUser)).toContainText(correctedXp);

    await user.goto(flaggedUserId);
    await expect(summary).toContainText(correctedXp);
    await expect(summary).toContainText(rankAfter);
    const history = page.getByRole("region", { name: "Riwayat Moderasi" });
    await expect(history.getByRole("list", { name: "Koreksi XP" })).toContainText("XP tidak wajar.");

    // Koreksi kedua menambah catatan, yang lama tetap ada.
    await moderation.goto();
    await moderation.row(flaggedUser).getByRole("button", { name: `Koreksi XP ${flaggedUser}` }).click();
    await moderation.dialog.getByRole("spinbutton", { name: /Jumlah koreksi/ }).fill("100");
    await moderation.dialog.getByRole("textbox", { name: "Alasan" }).fill("Koreksi lanjutan.");
    await moderation.dialog.getByRole("button", { name: "Simpan koreksi" }).click();
    await user.goto(flaggedUserId);
    await expect(history.getByRole("list", { name: "Koreksi XP" }).getByRole("listitem")).toHaveCount(2);

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.rows.filter({ hasText: "Koreksi XP" })).toHaveCount(2);

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    const leaderboard = new LeaderboardPage(page);
    await page.goto("/leaderboard?tab=global");
    await expect(leaderboard.topList.filter({ hasText: flaggedUser })).toContainText("4.500 XP");
  });

  test("sembunyikan dari leaderboard bekerja, dan bisa ditampilkan kembali", async ({ page }) => {
    await moderation.row(flaggedUser).getByRole("button", { name: `Sembunyikan dari leaderboard: ${flaggedUser}` }).click();
    await moderation.dialog.getByRole("textbox", { name: "Alasan" }).fill("Sedang ditinjau.");
    await moderation.dialog.getByRole("button", { name: "Sembunyikan" }).click();
    await expect(moderation.row(flaggedUser).getByRole("button", { name: `Tampilkan kembali ${flaggedUser}` })).toBeVisible();

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    const leaderboard = new LeaderboardPage(page);
    await page.goto("/leaderboard?tab=global");
    await expect(leaderboard.topList.first()).toBeVisible();
    await expect(leaderboard.topList.filter({ hasText: flaggedUser })).toHaveCount(0);

    await switchAccount(page, ACCOUNTS.admin.email);
    await expect(page).toHaveURL("/admin");
    await moderation.goto();
    await moderation.row(flaggedUser).getByRole("button", { name: `Tampilkan kembali ${flaggedUser}` }).click();
    await moderation.dialog.getByRole("textbox", { name: "Alasan" }).fill("Tinjauan selesai.");
    await moderation.dialog.getByRole("button", { name: "Tampilkan kembali" }).click();
    await expect(moderation.row(flaggedUser).getByRole("button", { name: `Sembunyikan dari leaderboard: ${flaggedUser}` })).toBeVisible();

    const user = new UserDetailPageObject(page);
    await user.goto(flaggedUserId);
    await expect(page.getByRole("list", { name: "Riwayat moderasi" }).getByRole("listitem")).toHaveCount(2);
  });

  test("abaikan menutup penandaan tanpa mengubah XP", async ({ page }) => {
    await moderation.row(otherFlaggedUser).getByRole("button", { name: `Abaikan ${otherFlaggedUser}` }).click();
    await moderation.dialog.getByRole("button", { name: "Abaikan" }).click();

    await expect(moderation.row(otherFlaggedUser)).toContainText("Diabaikan");
    await expect(moderation.row(otherFlaggedUser).getByRole("button", { name: /^Abaikan/ })).toHaveCount(0);
    await moderation.statusFilter.selectOption({ label: "Diabaikan" });
    await expect(page).toHaveURL(/status=diabaikan/);
    await expect(moderation.rows).toHaveCount(1);
  });
});

test.describe("Aksesibilitas", () => {
  const blocking = async (page: Page) => {
    const { violations } = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
    return violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id);
  };

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("dialog katalog dan moderasi tanpa pelanggaran", async ({ page }) => {
        const catalog = new CatalogPageObject(page);
        await catalog.goto();
        await catalog.search.fill(unstudiedFreeCourse);
        await catalog.row(unstudiedFreeCourse).getByRole("button", { name: `Ubah ${unstudiedFreeCourse}` }).click();
        await expect(catalog.dialog).toBeVisible();
        expect(await blocking(page)).toEqual([]);

        const moderation = new ModerationPageObject(page);
        await moderation.goto();
        await moderation.row(flaggedUser).getByRole("button", { name: `Koreksi XP ${flaggedUser}` }).click();
        await expect(moderation.dialog).toBeVisible();
        expect(await blocking(page)).toEqual([]);
      });
    });
  }
});
