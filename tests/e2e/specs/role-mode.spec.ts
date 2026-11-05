import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, DEMO_PASSWORD, ROLE_MODE } from "../fixtures/testData";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { RoleDashboardPage } from "../pages/RoleDashboardPage";

async function openSidebar(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByRole("button", { name: "Buka atau tutup sidebar" }).click();
}

// Membuka halaman dengan sesi siap; halaman ber-layout dashboard menunggu sesi terbaca.
async function openDashboard(page: Page, role: "creator" | "reviewer" | "admin") {
  const dashboard = new RoleDashboardPage(page, role);
  await dashboard.goto();
  await expect(dashboard.greeting).toBeVisible();
  return dashboard;
}

test.describe("Pengalih mode", () => {
  for (const { role, modeLabel } of ROLE_MODE.modes) {
    test.describe(`akun ${role}`, () => {
      test.use({ role });

      test(`menu profil berisi Mode Belajar dan ${modeLabel}`, async ({ page }) => {
        const dashboard = await openDashboard(page, role);

        await dashboard.profileMenuButton.click();

        await expect(dashboard.modeOption("Mode Belajar")).toHaveAttribute("aria-checked", "false");
        await expect(dashboard.modeOption(modeLabel)).toHaveAttribute("aria-checked", "true");
      });

      test("beralih ke Mode Belajar lalu kembali ke mode peran", async ({ page }) => {
        const dashboard = await openDashboard(page, role);

        await dashboard.switchMode("Mode Belajar");
        await expect(page).toHaveURL("/");
        await expect(new DashboardPage(page).greeting).toContainText(ACCOUNTS[role].name);

        await dashboard.switchMode(modeLabel);
        await expect(page).toHaveURL(ACCOUNTS[role].home);
        await expect(dashboard.greeting).toBeVisible();
      });
    });
  }

  test.describe("akun Creator", () => {
    test.use({ role: "creator" });

    test("mode tersimpan saat berpindah halaman dan dimuat ulang", async ({ page }) => {
      const dashboard = await openDashboard(page, "creator");
      await dashboard.switchMode("Mode Belajar");
      await expect(page).toHaveURL("/");

      await page.goto("/learn");
      await expect(page.getByRole("heading", { level: 1, name: "Belajar QA Automation" })).toBeVisible();
      await page.reload();
      await expect(page.getByRole("heading", { level: 1, name: "Belajar QA Automation" })).toBeVisible();
      await expect(dashboard.cartLink).toBeVisible();
    });

    test("sidebar mengikuti mode aktif", async ({ page, isMobile }) => {
      const dashboard = await openDashboard(page, "creator");
      await openSidebar(page, isMobile);
      await expect(page.getByRole("navigation", { name: "Menu Creator" })).toBeVisible();

      await page.goto("/");
      await expect(page).toHaveURL("/creator");

      await dashboard.switchMode("Mode Belajar");
      await expect(page).toHaveURL("/");
      await expect(new DashboardPage(page).greeting).toBeVisible();
      await openSidebar(page, isMobile);
      await expect(page.getByRole("navigation", { name: "Menu User" })).toBeVisible();
    });

    test("membuka halaman peran dari Mode Belajar mengembalikan mode peran", async ({ page }) => {
      const dashboard = await openDashboard(page, "creator");
      await dashboard.switchMode("Mode Belajar");
      await expect(page).toHaveURL("/");

      await dashboard.goto();

      await expect(dashboard.greeting).toBeVisible();
      await expect(dashboard.cartLink).toBeHidden();
    });

    test("menu Dashboard dan logo di mode peran menuju dashboard peran", async ({ page, isMobile }) => {
      await page.goto("/notifications");
      await expect(page.getByRole("heading", { level: 1, name: "Notifikasi" })).toBeVisible();
      await openSidebar(page, isMobile);

      const menu = page.getByRole("navigation", { name: "Menu Creator" });
      await expect(menu.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/creator");
      await expect(page.getByRole("complementary").getByRole("link").first()).toHaveAttribute("href", "/creator");
    });
  });

  test.describe("akun User", () => {
    test.use({ role: "user" });

    test("tidak punya pilihan mode", async ({ page }) => {
      const dashboard = new DashboardPage(page);
      await dashboard.goto();
      await expect(dashboard.greeting).toBeVisible();

      await dashboard.profileMenuButton.click();

      await expect(page.getByRole("menuitem", { name: "Profil" })).toBeVisible();
      await expect(page.getByRole("menuitemradio")).toHaveCount(0);
    });
  });
});

test.describe("Akun dengan beberapa peran", () => {
  test("menu profil memuat setiap mode yang dimiliki", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(ROLE_MODE.multiRoleEmail, DEMO_PASSWORD);
    await expect(page).toHaveURL("/reviewer");
    const dashboard = new RoleDashboardPage(page, "reviewer");

    await dashboard.profileMenuButton.click();

    await expect(dashboard.modeOption("Mode Belajar")).toBeVisible();
    await expect(dashboard.modeOption("Mode Reviewer")).toHaveAttribute("aria-checked", "true");
    await dashboard.modeOption("Mode Creator").click();
    await expect(page).toHaveURL("/creator");
  });
});

test.describe("Tampilan per mode", () => {
  for (const { role } of ROLE_MODE.modes) {
    test.describe(`akun ${role}`, () => {
      test.use({ role });

      test("keranjang dan membership tidak tampil di mode peran", async ({ page }) => {
        const dashboard = await openDashboard(page, role);

        await expect(dashboard.cartLink).toBeHidden();
        await dashboard.profileMenuButton.click();
        await expect(page.getByRole("menuitem", { name: "Profil" })).toBeVisible();
        await expect(page.getByRole("menuitem", { name: /Membership/ })).toHaveCount(0);
      });

      test("keranjang dan membership tampil di Mode Belajar", async ({ page }) => {
        const dashboard = await openDashboard(page, role);
        await dashboard.switchMode("Mode Belajar");
        await expect(page).toHaveURL("/");

        await expect(dashboard.cartLink).toBeVisible();
        await dashboard.profileMenuButton.click();
        await expect(page.getByRole("menuitem", { name: /Membership/ })).toBeVisible();
      });
    });
  }
});

test.describe("Halaman khusus pelajar di mode peran", () => {
  test.use({ role: "creator" });

  for (const path of ROLE_MODE.learnerPaths) {
    test(`${path} menampilkan ajakan beralih mode`, async ({ page }) => {
      await page.goto(path);

      await expect(page.getByRole("heading", { level: 1, name: ROLE_MODE.promptTitle })).toBeVisible();
      await expect(page.getByRole("button", { name: "Beralih ke Mode Belajar" })).toBeVisible();
      await expect(page).toHaveURL(path);
    });
  }

  test("tombol ajakan membuka halaman yang dituju", async ({ page }) => {
    await page.goto("/leaderboard");

    await page.getByRole("button", { name: "Beralih ke Mode Belajar" }).click();

    await expect(page).toHaveURL("/leaderboard");
    await expect(page.getByRole("heading", { level: 1, name: ROLE_MODE.promptTitle })).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("tautan kembali menuju dashboard peran", async ({ page }) => {
    await page.goto("/membership");

    await page.getByRole("link", { name: "Kembali ke Dashboard" }).click();

    await expect(page).toHaveURL("/creator");
  });
});

test.describe("Profil per mode", () => {
  test.describe("Creator", () => {
    test.use({ role: "creator" });

    test("menampilkan identitas, jumlah konten per status, dan konten terbit", async ({ page }) => {
      await page.goto("/profile");

      await expect(page.getByRole("heading", { level: 1, name: ACCOUNTS.creator.name })).toBeVisible();
      const main = page.getByRole("main");
      await expect(main.getByText(ACCOUNTS.creator.email)).toBeVisible();
      await expect(main.getByText("Creator", { exact: true })).toBeVisible();
      await expect(main.getByRole("heading", { level: 3 })).toHaveText([...ROLE_MODE.creatorStatLabels]);
      await expect(page.getByRole("region", { name: "Konten Terbit" })).toContainText(ROLE_MODE.publishedTitle);
    });

    test("tidak menampilkan data pelajar", async ({ page }) => {
      await page.goto("/profile");
      const main = page.getByRole("main");
      await expect(main.getByRole("heading", { level: 1 })).toBeVisible();

      await expect(main).not.toContainText(/\bXP\b|Rank|Achievement|Pencapaian|Membership/i);
    });

    test("Mode Belajar memakai profil pelajar dengan nama yang sama", async ({ page }) => {
      const dashboard = await openDashboard(page, "creator");
      await dashboard.switchMode("Mode Belajar");
      await expect(page).toHaveURL("/");

      await page.goto("/profile");

      await expect(page.getByRole("heading", { level: 1, name: ACCOUNTS.creator.name })).toBeVisible();
      await expect(page.getByRole("tab", { name: "Pencapaian" })).toBeVisible();
    });

    test("pengaturan memakai identitas akun dan menyembunyikan privasi leaderboard", async ({ page }) => {
      await page.goto("/settings");

      await expect(page.locator("#profile-name")).toHaveValue(ACCOUNTS.creator.name);
      await expect(page.locator("#profile-email")).toHaveValue(ACCOUNTS.creator.email);
      await expect(page.getByRole("switch", { name: "Tampilkan saya di leaderboard" })).toHaveCount(0);
    });
  });

  test.describe("Reviewer", () => {
    test.use({ role: "reviewer" });

    test("menampilkan jumlah direview, disetujui, dan diminta revisi", async ({ page }) => {
      await page.goto("/profile");

      await expect(page.getByRole("heading", { level: 1, name: ACCOUNTS.reviewer.name })).toBeVisible();
      const stats = page.getByRole("region", { name: "Aktivitas Review" });
      for (const { label, value } of ROLE_MODE.reviewerStats) {
        const card = stats.getByRole("heading", { level: 3, name: label }).locator("xpath=following-sibling::p");
        await expect(card).toHaveText(value);
      }
    });
  });

  test.describe("Admin", () => {
    test.use({ role: "admin" });

    test("menampilkan peran dan tugas tanpa statistik", async ({ page }) => {
      await page.goto("/profile");

      await expect(page.getByRole("heading", { level: 1, name: ACCOUNTS.admin.name })).toBeVisible();
      const tasks = page.getByRole("region", { name: "Peran dan Tugas" });
      await expect(tasks.getByRole("listitem")).toHaveText([...ROLE_MODE.adminTasks]);
      await expect(page.getByRole("main").getByRole("heading", { level: 3 })).toHaveCount(0);
    });
  });

  test.describe("Profil publik", () => {
    test.use({ role: "creator" });

    test("tetap menampilkan profil pelajar di mode peran", async ({ page }) => {
      await page.goto(`/u/${ROLE_MODE.publicUsername}`);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("tab", { name: "Pencapaian" })).toBeVisible();
    });
  });
});

test.describe("Notifikasi per mode", () => {
  test.use({ role: "creator" });

  async function openNotifications(page: Page) {
    const notifications = new NotificationsPage(page);
    await notifications.goto();
    await expect(notifications.list).toBeVisible();
    return notifications;
  }

  test("mode peran hanya menampilkan Khusus role serta Akun dan sistem", async ({ page }) => {
    const notifications = await openNotifications(page);

    await expect(notifications.item(ROLE_MODE.notifications.revision.contentTitle)).toBeVisible();
    await expect(notifications.item("Jadwal maintenance")).toBeVisible();
    await expect(notifications.item("Membership aktif")).toBeHidden();
    await expect(notifications.item("Lulus latihan")).toBeHidden();
    await expect(notifications.item("Latihan baru tersedia")).toBeHidden();
    await expect(notifications.groupFilter.getByRole("option")).toHaveText(["Semua kelompok", "Akun dan sistem", "Khusus role"]);
  });

  test("Mode Belajar tidak menampilkan notifikasi Khusus role", async ({ page }) => {
    const dashboard = await openDashboard(page, "creator");
    await dashboard.switchMode("Mode Belajar");
    await expect(page).toHaveURL("/");

    const notifications = await openNotifications(page);

    await expect(notifications.item("Membership aktif")).toBeVisible();
    await expect(notifications.item("Jadwal maintenance")).toBeVisible();
    await expect(notifications.item(ROLE_MODE.notifications.revision.contentTitle)).toBeHidden();
    await expect(notifications.groupFilter.getByRole("option", { name: "Khusus role" })).toHaveCount(0);
  });

  test("pengaturan notifikasi mengikuti mode", async ({ page }) => {
    await page.goto("/settings");
    const section = page.locator("#notifikasi");

    await expect(section.getByRole("switch", { name: "Khusus role", exact: true })).toBeVisible();
    await expect(section.getByRole("switch", { name: "Progres belajar", exact: true })).toHaveCount(0);
    await expect(section.getByRole("switch", { name: "Konten baru", exact: true })).toHaveCount(0);
    await expect(section.getByText("Transaksi", { exact: true })).toHaveCount(0);
  });

  for (const { title, href, contentTitle } of [ROLE_MODE.notifications.revision, ROLE_MODE.notifications.approved]) {
    test(`"${title}" dibuat dari riwayat status dan membuka konten terkait`, async ({ page }) => {
      const notifications = await openNotifications(page);
      await expect(notifications.item(contentTitle)).toContainText(title);

      await notifications.item(contentTitle).click();

      await expect(page).toHaveURL(href);
    });
  }
});

test.describe("Halaman informasi Reviewer", () => {
  for (const { role, menuName, menu, path, heading } of ROLE_MODE.guidePages) {
    test.describe(`${menu}`, () => {
      test.use({ role });

      test(`menu ${menu} membuka halaman informasi dengan tautan panduan`, async ({ page, isMobile }) => {
        await openDashboard(page, role);
        await openSidebar(page, isMobile);

        const link = page.getByRole("navigation", { name: menuName }).getByRole("link", { name: menu, exact: true });
        await expect(link).not.toContainText("Segera hadir");
        await link.click();

        await expect(page).toHaveURL(path);
        await expect(page.getByRole("heading", { level: 1, name: menu })).toBeVisible();
        await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
        // Reviewer bekerja di Google Docs, jadi tidak perlu panduan teknis dan istilah Git.
        await expect(page.getByRole("main")).not.toContainText(/github|\bgit\b|branch|pull request|\bMDX\b/i);
        await expect(page.getByRole("region", { name: "Yang perlu diperiksa" })).toContainText("Referensi video");
      });
    });
  }
});

test.describe("Menu Creator", () => {
  test.use({ role: "creator" });

  for (const { menu, path, title } of ROLE_MODE.creatorPages) {
    test(`menu ${menu} terbuka tanpa status Segera hadir`, async ({ page, isMobile }) => {
      await openDashboard(page, "creator");
      await openSidebar(page, isMobile);

      const link = page.getByRole("navigation", { name: "Menu Creator" }).getByRole("link", { name: menu });
      await expect(link).not.toContainText("Segera hadir");
      await link.click();

      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    });
  }

  test("tombol Buat Konten Baru di dashboard menuju Buat Konten", async ({ page }) => {
    await openDashboard(page, "creator");

    await page.getByRole("link", { name: "Buat Konten Baru" }).click();

    await expect(page).toHaveURL("/creator/buat");
  });
});
