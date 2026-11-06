import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, CHALLENGE_KEYS, DEMO_PASSWORD } from "../fixtures/testData";
import { AuditLogPageObject, endMaintenance, MaintenancePageObject, scheduleMaintenance, simulateMaintenance, switchAccount } from "../pages/AdminPages";
import { ChallengePage } from "../pages/ChallengePage";
import { LoginPage } from "../pages/LoginPage";
import { NotificationsPage } from "../pages/NotificationsPage";

const { quiz, bugHunt } = CHALLENGE_KEYS;

const banner = (page: Page) => page.getByRole("region", { name: "Pemberitahuan maintenance" });
const maintenanceHeading = (page: Page) => page.getByRole("heading", { level: 1, name: "Situs sedang maintenance" });

test.describe("Panel Admin: Mode Maintenance", () => {
  test.use({ role: "admin" });

  let maintenance: MaintenancePageObject;

  test.beforeEach(async ({ page }) => {
    maintenance = new MaintenancePageObject(page);
    await maintenance.goto();
    await expect(maintenance.heading).toBeVisible();
  });

  test("waktu mulai lebih cepat dari saat ini ditambah Persiapan ditolak", async () => {
    await maintenance.prep.selectOption({ label: "30 menit" });
    await maintenance.fillEarliest.click();
    await maintenance.prep.selectOption({ label: "60 menit" });
    await maintenance.message.fill("Perbaikan.");
    await maintenance.schedule.click();
    await maintenance.confirmWithReason("Jadwalkan");

    await expect(maintenance.dialog.getByRole("alert")).toContainText("Persiapan 60 menit");
    await expect(maintenance.history).toHaveCount(0);
  });

  test("menjadwalkan mengirim pengumuman, tercatat di log, dan menampilkan banner", async ({ page }) => {
    await maintenance.scheduleEarliest(10, "Perbaikan fitur blog.");

    await expect(page.getByRole("status").filter({ hasText: "Maintenance dijadwalkan." })).toBeVisible();
    await expect(maintenance.current).toContainText("Tahap: Terjadwal");
    await expect(maintenance.history.first()).toContainText("Terjadwal");
    await expect(banner(page)).toContainText("Maintenance terjadwal");
    await expect(banner(page)).toContainText("Perbaikan fitur blog.");

    const log = new AuditLogPageObject(page);
    await log.goto();
    await expect(log.rows.filter({ hasText: "Jadwalkan maintenance" })).toContainText("Uji maintenance");

    await switchAccount(page, ACCOUNTS.user.email);
    await expect(page).toHaveURL(ACCOUNTS.user.home);
    await page.goto("/notifications");
    const notifications = new NotificationsPage(page);
    // Notifikasi dummy juga berjudul "Jadwal maintenance", jadi dicocokkan dengan pesannya.
    await expect(notifications.item("Jadwal maintenance").filter({ hasText: "Perbaikan fitur blog." })).toBeVisible();
  });

  test("hanya satu jadwal berjalan; jadwal bisa dibatalkan sebelum Aktif", async ({ page }) => {
    await maintenance.scheduleEarliest(5, "Perbaikan.");
    await expect(maintenance.current).toBeVisible();
    await expect(maintenance.schedule).toHaveCount(0);

    await maintenance.current.getByRole("button", { name: "Batalkan Maintenance" }).click();
    await maintenance.confirmWithReason("Batalkan maintenance", "Perbaikan ditunda");

    await expect(maintenance.current).toHaveCount(0);
    await expect(maintenance.history.first()).toContainText("Dibatalkan");
    await expect(banner(page)).toHaveCount(0);
  });

  test("tombol simulasi memajukan tahap, dan Admin mengakhiri maintenance yang Aktif", async ({ page }) => {
    await maintenance.scheduleEarliest(5, "Perbaikan.");

    await page.getByRole("button", { name: "Simulasi: masuk Persiapan" }).click();
    await expect(maintenance.current).toContainText("Tahap: Persiapan");
    await expect(banner(page)).toContainText("Maintenance dimulai dalam");

    await page.getByRole("button", { name: "Simulasi: mulai Aktif" }).click();
    await expect(maintenance.current).toContainText("Tahap: Aktif");
    await expect(maintenance.current.getByRole("button", { name: "Ubah Jadwal" })).toHaveCount(0);
    // Admin tetap bisa memakai situs.
    await expect(banner(page)).toContainText("Mode maintenance aktif");

    await maintenance.current.getByRole("button", { name: "Akhiri Maintenance" }).click();
    await maintenance.confirmWithReason("Akhiri maintenance", "Perbaikan selesai");

    await expect(maintenance.current).toHaveCount(0);
    await expect(maintenance.history.first()).toContainText("Selesai");
  });
});

test.describe("Pengguna selama maintenance", () => {
  test.use({ role: "user" });

  test("Persiapan: latihan yang sudah dikerjakan boleh dilanjutkan, latihan baru belum bisa dimulai", async ({ page }) => {
    const challenge = new ChallengePage(page, quiz.slug);
    await challenge.goto();
    await challenge.options.nth(quiz.answers[0]).check();

    await scheduleMaintenance(page);
    await simulateMaintenance(page, "persiapan");
    await expect(banner(page)).toContainText("Maintenance dimulai dalam");

    await page.reload();
    await expect(challenge.quiz).toBeVisible();
    await expect(challenge.quiz.getByText(`1 dari ${quiz.answers.length} terjawab`)).toBeVisible();

    await page.goto(`/playground/${bugHunt.slug}`);
    await expect(page.getByRole("heading", { name: "Latihan baru belum bisa dimulai" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Kirim temuan" })).toHaveCount(0);
  });

  test("menit terakhir menampilkan peringatan yang lebih menonjol", async ({ page }) => {
    await page.goto("/playground");
    await scheduleMaintenance(page);
    await simulateMaintenance(page, "menit-terakhir");

    await expect(page.getByRole("alert").filter({ hasText: "kurang dari 1 menit lagi" })).toBeVisible();
  });

  test("Aktif: situs tertutup, jawaban tersimpan, dan kuis dilanjutkan dari soal terakhir setelah selesai", async ({ page }) => {
    const challenge = new ChallengePage(page, quiz.slug);
    await challenge.goto();
    await challenge.answerQuiz(quiz.answers.slice(0, 3));
    await expect(challenge.quiz.getByText(`Soal 3 dari ${quiz.answers.length}`)).toBeVisible();

    await scheduleMaintenance(page, "Perbaikan fitur kuis.");
    await simulateMaintenance(page, "aktif");

    await expect(maintenanceHeading(page)).toBeVisible();
    await expect(page.getByText("Perbaikan fitur kuis.")).toBeVisible();
    await expect(page.getByRole("region", { name: "Pekerjaanmu aman" })).toContainText(`${quiz.title}: 3 dari ${quiz.answers.length} soal terjawab, tersimpan.`);

    // Halaman publik ikut tertutup.
    await page.goto("/blog");
    await expect(maintenanceHeading(page)).toBeVisible();

    await endMaintenance(page);
    await expect(maintenanceHeading(page)).toHaveCount(0);
    await expect(banner(page)).toContainText("Maintenance selesai");

    await banner(page).getByRole("link", { name: quiz.title }).click();
    await expect(page).toHaveURL(`/playground/${quiz.slug}`);
    await expect(challenge.quiz.getByText(`Soal 3 dari ${quiz.answers.length}`)).toBeVisible();
    await expect(challenge.quiz.getByText(`3 dari ${quiz.answers.length} terjawab`)).toBeVisible();

    await banner(page).getByRole("button", { name: "Tutup pemberitahuan" }).click();
    await expect(banner(page)).toHaveCount(0);
  });

  test("jawaban yang dikirim saat Aktif tertunda, lalu terkirim otomatis setelah selesai", async ({ page }) => {
    // Jam dihentikan sesaat agar halaman belum sempat tertutup saat jawaban dikirim.
    await page.clock.install();
    const challenge = new ChallengePage(page, quiz.slug);
    await challenge.goto();
    await challenge.answerQuiz(quiz.answers);
    await scheduleMaintenance(page);

    await simulateMaintenance(page, "menit-terakhir");
    await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1_000));
    // Waktu melewati jam mulai tanpa menjalankan timer: halaman belum diperbarui saat Kirim ditekan.
    await page.clock.setSystemTime(await page.evaluate(() => Date.now() + 60_000));
    await challenge.submitAnswerButton.click();
    await expect(page.getByRole("status").filter({ hasText: "Jawabanmu aman dan akan dikirim setelah maintenance selesai." })).toBeVisible();
    await expect(challenge.submitAnswerButton).toBeDisabled();

    await page.clock.resume();
    await expect(maintenanceHeading(page)).toBeVisible();
    await expect(page.getByRole("region", { name: "Pekerjaanmu aman" })).toContainText("Jawaban akan dikirim otomatis setelah maintenance selesai.");

    await endMaintenance(page);
    await expect(challenge.result).toBeVisible();
    await expect(challenge.result).toContainText("Lulus");
  });
});

test.describe("Halaman login selama maintenance Aktif", () => {
  test("banner tampil otomatis dan hanya Admin yang bisa masuk", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await scheduleMaintenance(page);
    await simulateMaintenance(page, "aktif");

    await expect(banner(page)).toContainText("Situs sedang maintenance");

    await login.login(ACCOUNTS.creator.email, DEMO_PASSWORD);
    await expect(page.getByRole("alert").filter({ hasText: "Saat ini hanya Admin yang dapat masuk." })).toBeVisible();
    await expect(page).toHaveURL("/login");

    await login.login(ACCOUNTS.admin.email, DEMO_PASSWORD);
    await expect(page).toHaveURL(ACCOUNTS.admin.home);
    await expect(maintenanceHeading(page)).toHaveCount(0);
  });

  test("tamu yang membuka halaman publik melihat halaman maintenance", async ({ page }) => {
    await page.goto("/login");
    await scheduleMaintenance(page);
    await simulateMaintenance(page, "aktif");

    await page.goto("/blog");
    await expect(maintenanceHeading(page)).toBeVisible();
    await page.getByRole("link", { name: "Masuk sebagai Admin" }).click();
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Aksesibilitas", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme, role: "user" });

      test("banner Persiapan, menit terakhir, dan halaman maintenance tanpa pelanggaran", async ({ page }) => {
        await page.goto("/playground");
        await scheduleMaintenance(page);
        await simulateMaintenance(page, "persiapan");
        await expect(banner(page)).toBeVisible();
        const prep = await new AxeBuilder({ page }).include('[aria-label="Pemberitahuan maintenance"]').analyze();
        expect(prep.violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);

        await simulateMaintenance(page, "menit-terakhir");
        await expect(page.getByRole("alert").filter({ hasText: "kurang dari 1 menit lagi" })).toBeVisible();
        const finalMinute = await new AxeBuilder({ page }).include('[aria-label="Pemberitahuan maintenance"]').analyze();
        expect(finalMinute.violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);

        await simulateMaintenance(page, "aktif");
        await expect(maintenanceHeading(page)).toBeVisible();
        const screen = await new AxeBuilder({ page }).analyze();
        expect(screen.violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
      });
    });
  }
});
