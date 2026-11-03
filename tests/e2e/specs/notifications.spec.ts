import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { NOTIFICATIONS } from "../fixtures/testData";
import { NotificationsPage } from "../pages/NotificationsPage";
import { SettingsPage } from "../pages/SettingsPage";

// Notifikasi dummy dihitung mundur dari saat ini, dan pengelompokan tanggalnya bergantung
// pada zona waktu browser. Jam dan zona waktu dibuat tetap agar hasilnya sama kapan pun
// test berjalan.
test.use({ timezoneId: NOTIFICATIONS.timezone });

async function openNotifications(page: Page) {
  await page.clock.setFixedTime(new Date(NOTIFICATIONS.now));
  const notifications = new NotificationsPage(page);
  await notifications.goto();
  await expect(notifications.list).toBeVisible();
  return notifications;
}

test.describe("Lonceng notifikasi", () => {
  test.use({ role: "user" });

  test("menampilkan jumlah belum dibaca, maksimal 9+", async ({ page }) => {
    const notifications = await openNotifications(page);

    await expect(notifications.bell).toHaveAccessibleName(`Notifikasi, ${NOTIFICATIONS.unreadLabel} belum dibaca`);
    await expect(notifications.bellBadge).toHaveText("9+");
  });

  test("menampilkan angka apa adanya bila belum dibaca kurang dari 10", async ({ page }) => {
    const notifications = await openNotifications(page);

    await notifications.item(NOTIFICATIONS.announcement.title).click();
    await notifications.announcement.getByRole("button", { name: "Mengerti" }).click();

    await expect(notifications.bell).toHaveAccessibleName("Notifikasi, 9 belum dibaca");
    await expect(notifications.bellBadge).toHaveText("9");
  });

  test("tidak menampilkan angka bila semua sudah dibaca", async ({ page }) => {
    const notifications = await openNotifications(page);

    await notifications.markAllButton.click();

    await expect(notifications.bell).toHaveAccessibleName("Notifikasi");
    await expect(notifications.bellBadge).toBeHidden();
  });
});

test.describe("Popover di desktop", () => {
  test.use({ role: "user" });
  test.skip(({ isMobile }) => isMobile, "Popover hanya ada di desktop");

  test("membuka maksimal 5 notifikasi terbaru tanpa memindahkan halaman", async ({ page }) => {
    await page.clock.setFixedTime(new Date(NOTIFICATIONS.now));
    const settings = new SettingsPage(page);
    await settings.goto();
    const notifications = new NotificationsPage(page);

    await notifications.bell.click();

    await expect(notifications.popover).toBeVisible();
    await expect(page).toHaveURL("/settings");
    await expect(notifications.popoverEntries).toHaveCount(5);
    await expect(notifications.popoverEntries.first()).toContainText(NOTIFICATIONS.newestTitle);
  });

  test("tautan Lihat semua notifikasi membuka halaman dan menutup popover", async ({ page }) => {
    const notifications = await openNotifications(page);
    await page.goto("/settings");
    await notifications.bell.click();

    await notifications.seeAllLink.click();

    await expect(page).toHaveURL("/notifications");
    await expect(notifications.popover).toBeHidden();
  });

  test("tandai semua dibaca ikut mengubah lonceng", async ({ page }) => {
    const notifications = await openNotifications(page);
    await notifications.bell.click();

    await notifications.popoverMarkAllButton.click();

    await expect(notifications.bell).toHaveAccessibleName("Notifikasi");
    await expect(notifications.popoverMarkAllButton).toBeDisabled();
  });

  test("klik notifikasi menuju halaman terkait dan menandainya dibaca", async ({ page }) => {
    const notifications = await openNotifications(page);
    await notifications.bell.click();

    await notifications.popoverItem("Membership aktif").click();

    await expect(page).toHaveURL("/membership");
    await expect(notifications.popover).toBeHidden();
    await expect(notifications.bell).toHaveAccessibleName("Notifikasi, 9 belum dibaca");
  });

  test("pengumuman dibuka dalam modal dan popover tertutup", async ({ page }) => {
    const notifications = await openNotifications(page);
    await notifications.bell.click();

    await notifications.popoverItem(NOTIFICATIONS.announcement.title).click();

    await expect(notifications.announcement).toContainText(NOTIFICATIONS.announcement.bodyPart);
    await expect(notifications.popover).toBeHidden();
    await expect(page).toHaveURL("/notifications");
  });

  test("dapat dioperasikan dengan keyboard", async ({ page }) => {
    const notifications = await openNotifications(page);

    await notifications.bell.focus();
    await page.keyboard.press("Enter");
    await expect(notifications.popover).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(notifications.popover).toBeHidden();
    await expect(notifications.bell).toBeFocused();
  });
});

test.describe("Lonceng di mobile", () => {
  test.use({ role: "user" });
  test.skip(({ isMobile }) => !isMobile, "Hanya berlaku untuk ukuran mobile");

  test("langsung membuka halaman notifikasi", async ({ page }) => {
    await page.clock.setFixedTime(new Date(NOTIFICATIONS.now));
    await page.goto("/settings");
    const notifications = new NotificationsPage(page);

    await notifications.bell.click();

    await expect(page).toHaveURL("/notifications");
    await expect(notifications.heading).toBeVisible();
    await expect(notifications.popover).toBeHidden();
  });

  test("tombol kembali menuju halaman sebelumnya", async ({ page }) => {
    await page.clock.setFixedTime(new Date(NOTIFICATIONS.now));
    await page.goto("/settings");
    const notifications = new NotificationsPage(page);
    await notifications.bell.click();
    await expect(notifications.heading).toBeVisible();

    await notifications.backButton.click();

    await expect(page).toHaveURL("/settings");
  });
});

test.describe("Halaman notifikasi", () => {
  test.use({ role: "user" });

  test("tidak melebar secara horizontal, termasuk saat ada pesan", async ({ page }) => {
    const notifications = await openNotifications(page);
    await notifications.expectNoHorizontalScroll();

    await notifications.gotoWithQuery("pesan=tidak-tersedia");
    await expect(notifications.unavailableMessage).toBeVisible();
    await notifications.expectNoHorizontalScroll();
  });

  test("tandai satu dibaca mengubah lonceng dan tersimpan setelah dimuat ulang", async ({ page }) => {
    const notifications = await openNotifications(page);
    const { title, href } = NOTIFICATIONS.targets[1];
    await expect(notifications.item(title)).toContainText("Belum dibaca");

    await notifications.item(title).click();
    await expect(page).toHaveURL(href);
    await expect(notifications.bell).toHaveAccessibleName("Notifikasi, 9 belum dibaca");

    await notifications.goto();
    await expect(notifications.item(title)).toBeVisible();
    await expect(notifications.item(title)).not.toContainText("Belum dibaca");
    await expect(notifications.bell).toHaveAccessibleName("Notifikasi, 9 belum dibaca");
  });

  test("tandai semua dibaca mengosongkan tab Belum dibaca", async ({ page }) => {
    const notifications = await openNotifications(page);

    await notifications.markAllButton.click();

    await expect(notifications.bell).toHaveAccessibleName("Notifikasi");
    await expect(notifications.markAllButton).toBeDisabled();
    await expect(notifications.list).not.toContainText("Belum dibaca");

    await notifications.statusTab("Belum dibaca").click();
    await expect(notifications.list.getByRole("heading", { name: "Semua notifikasi sudah dibaca" })).toBeVisible();
  });

  test("tab Belum dibaca hanya menampilkan yang belum dibaca dan tersimpan di URL", async ({ page }) => {
    const notifications = await openNotifications(page);
    await expect(notifications.item("Naik rank")).toBeVisible();

    await notifications.statusTab("Belum dibaca").click();

    await expect(page).toHaveURL(/[?&]tab=belum-dibaca/);
    await expect(notifications.item("Naik rank")).toBeHidden();
    await expect(notifications.item(NOTIFICATIONS.newestTitle)).toBeVisible();

    await notifications.statusTab("Semua").click();
    await expect(page).not.toHaveURL(/tab=/);
    await expect(notifications.item("Naik rank")).toBeVisible();
  });

  test("filter kelompok menyaring daftar dan tersimpan di URL", async ({ page }) => {
    const notifications = await openNotifications(page);

    await notifications.groupFilter.selectOption({ label: "Transaksi" });

    await expect(page).toHaveURL(/[?&]kelompok=transaksi/);
    await expect(notifications.entries).toHaveCount(NOTIFICATIONS.transactionCount);
    await expect(notifications.item(NOTIFICATIONS.newestTitle)).toBeHidden();

    await notifications.groupFilter.selectOption({ label: "Semua kelompok" });
    await expect(page).not.toHaveURL(/kelompok=/);
    await expect(notifications.entries).toHaveCount(NOTIFICATIONS.entryCount);
  });

  test("tab dan filter dari URL langsung diterapkan", async ({ page }) => {
    const notifications = await openNotifications(page);

    await notifications.gotoWithQuery("tab=belum-dibaca&kelompok=progres-belajar");

    await expect(notifications.groupFilter).toHaveValue("progres-belajar");
    await expect(notifications.statusTab("Belum dibaca")).toHaveAttribute("aria-pressed", "true");
    await expect(notifications.entries).toHaveCount(1);
    await expect(notifications.item("Lulus latihan")).toBeVisible();
  });

  test("nilai filter yang tidak dikenal diabaikan", async ({ page }) => {
    const notifications = await openNotifications(page);

    await notifications.gotoWithQuery("tab=asal&kelompok=asal");

    await expect(notifications.groupFilter).toHaveValue("");
    await expect(notifications.entries).toHaveCount(NOTIFICATIONS.entryCount);
  });

  test("menampilkan keadaan kosong saat filter tidak punya hasil", async ({ page }) => {
    const notifications = await openNotifications(page);
    await notifications.markAllButton.click();

    await notifications.gotoWithQuery("tab=belum-dibaca&kelompok=transaksi");

    await expect(notifications.entries).toHaveCount(0);
    await expect(
      notifications.list.getByRole("heading", { name: "Tidak ada yang belum dibaca di Transaksi" })
    ).toBeVisible();
  });

  test("notifikasi sejenis digabung dan isinya bisa dibuka", async ({ page }) => {
    const notifications = await openNotifications(page);
    const { title, body, item, href } = NOTIFICATIONS.merged;
    const merged = notifications.list.getByRole("button", { name: title });
    await expect(merged).toContainText(body);
    await expect(merged).toHaveAttribute("aria-expanded", "false");

    await merged.click();

    await expect(merged).toHaveAttribute("aria-expanded", "true");
    // Membuka gabungan belum berarti membaca isinya.
    await expect(notifications.bell).toHaveAccessibleName(`Notifikasi, ${NOTIFICATIONS.unreadLabel} belum dibaca`);

    await notifications.list.getByRole("link", { name: item }).click();
    await expect(page).toHaveURL(href);
    await expect(notifications.bell).toHaveAccessibleName("Notifikasi, 9 belum dibaca");
  });

  for (const { title, href } of NOTIFICATIONS.targets) {
    test(`klik "${title}" menuju ${href}`, async ({ page }) => {
      const notifications = await openNotifications(page);

      await notifications.item(title).click();

      await expect(page).toHaveURL(href);
    });
  }

  test("pengumuman dibuka dalam modal berisi teks lengkap tanpa pindah halaman", async ({ page }) => {
    const notifications = await openNotifications(page);
    const { title, bodyPart } = NOTIFICATIONS.announcement;

    await notifications.item(title).click();

    await expect(notifications.announcement.getByRole("heading", { name: title })).toBeVisible();
    await expect(notifications.announcement).toContainText(bodyPart);
    await expect(page).toHaveURL("/notifications");

    await notifications.announcement.getByRole("button", { name: "Mengerti" }).click();
    await expect(notifications.announcement).toBeHidden();
    await expect(notifications.bell).toHaveAccessibleName("Notifikasi, 9 belum dibaca");
  });

  test("modal pengumuman juga bisa ditutup dengan tombol Tutup dan Escape", async ({ page }) => {
    const notifications = await openNotifications(page);
    const row = notifications.item(NOTIFICATIONS.announcement.title);

    await row.click();
    await notifications.announcement.getByRole("button", { name: "Tutup" }).click();
    await expect(notifications.announcement).toBeHidden();

    await row.click();
    await expect(notifications.announcement).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(notifications.announcement).toBeHidden();
  });

  test("konten yang sudah dihapus menampilkan pesan yang terlihat dan bisa ditutup", async ({ page }) => {
    const notifications = await openNotifications(page);

    await notifications.item(NOTIFICATIONS.unavailableTitle).click();

    await expect(page).toHaveURL(/\/notifications\?pesan=tidak-tersedia/);
    await expect(notifications.unavailableMessage).toBeVisible();
    await expect(notifications.unavailableMessage).toBeInViewport();
    await expect(notifications.bell).toHaveAccessibleName("Notifikasi, 9 belum dibaca");

    await notifications.closeMessageButton.click();

    await expect(notifications.unavailableMessage).toBeHidden();
    await expect(page).toHaveURL("/notifications");
  });

  test("format waktu mengikuti usia notifikasi", async ({ page }) => {
    const notifications = await openNotifications(page);

    for (const { title, time } of NOTIFICATIONS.times) {
      await expect(notifications.item(title)).toContainText(time);
    }
  });

  test("daftar dikelompokkan per tanggal", async ({ page }) => {
    const notifications = await openNotifications(page);

    await expect(notifications.dayHeadings).toHaveText([...NOTIFICATIONS.dayHeadings]);
  });
});

test.describe("Notifikasi khusus role", () => {
  test.describe("akun User", () => {
    test.use({ role: "user" });

    test("tidak melihat notifikasi role maupun filternya", async ({ page }) => {
      const notifications = await openNotifications(page);

      for (const { title } of NOTIFICATIONS.roles) {
        await expect(notifications.item(title)).toBeHidden();
      }
      await expect(notifications.groupFilter.getByRole("option", { name: "Khusus role" })).toHaveCount(0);
    });
  });

  for (const { role, title, href, count } of NOTIFICATIONS.roles) {
    test.describe(`akun ${role}`, () => {
      test.use({ role });

      test("hanya melihat notifikasi untuk role-nya dan bisa membukanya", async ({ page }) => {
        const notifications = await openNotifications(page);
        await expect(notifications.item(title)).toBeVisible();

        for (const other of NOTIFICATIONS.roles) {
          if (other.role !== role) await expect(notifications.item(other.title)).toBeHidden();
        }

        await notifications.groupFilter.selectOption({ label: "Khusus role" });
        await expect(notifications.entries).toHaveCount(count);

        await notifications.item(title).click();
        await expect(page).toHaveURL(href);
      });
    });
  }
});

test.describe("Preferensi notifikasi", () => {
  async function openSettings(page: Page) {
    await page.clock.setFixedTime(new Date(NOTIFICATIONS.now));
    const settings = new SettingsPage(page);
    await settings.goto();
    await expect(settings.notificationSection).toBeVisible();
    return { settings, notifications: new NotificationsPage(page) };
  }

  test.describe("akun User", () => {
    test.use({ role: "user" });

    test("menampilkan toggle, kelompok Selalu aktif, dan keterangannya", async ({ page }) => {
      const { settings } = await openSettings(page);
      const section = settings.notificationSection;

      await expect(settings.notificationSwitch("Progres belajar")).toHaveAttribute("aria-checked", "true");
      await expect(settings.notificationSwitch("Konten baru")).toHaveAttribute("aria-checked", "true");
      await expect(settings.notificationSwitch("Khusus role")).toHaveCount(0);

      await expect(section.getByText("Selalu aktif")).toHaveCount(2);
      await expect(settings.notificationSwitch("Transaksi")).toHaveCount(0);
      await expect(settings.notificationSwitch("Akun dan sistem")).toHaveCount(0);

      await expect(section.getByText("belum tersimpan permanen")).toBeVisible();
      await expect(section.getByText("Email aktif setelah backend tersedia")).toBeVisible();
    });

    test("kelompok yang dimatikan hilang dari lonceng dan halaman, lalu kembali saat dinyalakan", async ({ page }) => {
      const { settings, notifications } = await openSettings(page);
      const toggle = settings.notificationSwitch("Konten baru");

      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-checked", "false");
      await expect(notifications.bell).toHaveAccessibleName(`Notifikasi, ${NOTIFICATIONS.unreadWithoutContent} belum dibaca`);

      await notifications.goto();
      await expect(notifications.list).toBeVisible();
      await expect(notifications.item(NOTIFICATIONS.newestTitle)).toBeHidden();
      await expect(notifications.item(NOTIFICATIONS.merged.title)).toBeHidden();
      await expect(notifications.groupFilter.getByRole("option", { name: "Konten baru" })).toHaveCount(0);

      await settings.goto();
      await expect(toggle).toHaveAttribute("aria-checked", "false");
      await toggle.click();
      await expect(notifications.bell).toHaveAccessibleName(`Notifikasi, ${NOTIFICATIONS.unreadLabel} belum dibaca`);
    });

    test("filter URL untuk kelompok yang dimatikan diabaikan", async ({ page }) => {
      const { settings, notifications } = await openSettings(page);
      await settings.notificationSwitch("Konten baru").click();

      await notifications.gotoWithQuery("kelompok=konten-baru");

      await expect(notifications.list).toBeVisible();
      await expect(notifications.groupFilter).toHaveValue("");
      await expect(notifications.item("Membership aktif")).toBeVisible();
    });

    test("toggle email tidak mengubah notifikasi di website", async ({ page }) => {
      const { settings, notifications } = await openSettings(page);
      const toggle = settings.notificationSwitch("Kirim juga lewat email");
      await expect(toggle).toHaveAttribute("aria-checked", "false");

      await toggle.click();

      await expect(toggle).toHaveAttribute("aria-checked", "true");
      await expect(notifications.bell).toHaveAccessibleName(`Notifikasi, ${NOTIFICATIONS.unreadLabel} belum dibaca`);
    });

    test("kelompok wajib tetap tampil walau tersimpan sebagai dimatikan", async ({ page }) => {
      const { settings, notifications } = await openSettings(page);
      await page.evaluate(
        ([key]) => window.localStorage.setItem(key, JSON.stringify({ mutedGroups: ["transaction", "system"] })),
        [NOTIFICATIONS.preferencesKey]
      );

      await settings.goto();

      await expect(notifications.bell).toHaveAccessibleName(`Notifikasi, ${NOTIFICATIONS.unreadLabel} belum dibaca`);
    });

    test("kelompok yang dimatikan hilang dari popover", async ({ page, isMobile }) => {
      test.skip(isMobile, "Popover hanya ada di desktop");
      const { settings, notifications } = await openSettings(page);
      await settings.notificationSwitch("Konten baru").click();

      await notifications.bell.click();

      await expect(notifications.popoverItem(NOTIFICATIONS.newestTitle)).toBeHidden();
      await expect(notifications.popoverItem("Membership aktif")).toBeVisible();
    });
  });

  test.describe("akun Creator", () => {
    test.use({ role: "creator" });

    test("dapat mematikan kelompok Khusus role", async ({ page }) => {
      const { settings, notifications } = await openSettings(page);
      const [creator] = NOTIFICATIONS.roles;

      await settings.notificationSwitch("Khusus role").click();

      await notifications.goto();
      await expect(notifications.list).toBeVisible();
      await expect(notifications.item(creator.title)).toBeHidden();
      await expect(notifications.groupFilter.getByRole("option", { name: "Khusus role" })).toHaveCount(0);
    });
  });
});
