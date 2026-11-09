import { expect, test } from "../fixtures/auth";
import { notification, notifications } from "../fixtures/notify";
import { DashboardPage } from "../pages/DashboardPage";
import { MembershipPage } from "../pages/MembershipPage";

// Alert singkat di atas layar (PRD 4.6): hasil aksi dan status koneksi internet.
test.use({ role: "user" });

const OFFLINE_MESSAGE = "Koneksi internet terputus. Perubahan belum bisa disimpan sampai koneksi kembali.";

test.describe("Alert koneksi internet", () => {
  test("muncul saat offline, tetap tampil, lalu diganti alert saat kembali online", async ({ page, context }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.greeting).toBeVisible();

    await context.setOffline(true);
    const offline = notification(page, OFFLINE_MESSAGE);
    await expect(offline).toBeVisible();
    await expect(offline).toHaveAttribute("data-notify-tone", "warning");

    await context.setOffline(false);
    await expect(notification(page, "Koneksi internet kembali.")).toBeVisible();
    await expect(offline).toHaveCount(0);
  });
});

test.describe("Alert hasil aksi", () => {
  test("menambah dan menghapus produk keranjang menampilkan alert", async ({ page }) => {
    const membership = new MembershipPage(page);
    await membership.goto();

    await membership.plan("Pro").getByRole("button", { name: "Tambah ke Keranjang" }).click();
    await expect(notification(page, "Membership Pro Lifetime ditambahkan ke keranjang.")).toBeVisible();

    await page.goto("/cart");
    await page.getByRole("button", { name: "Hapus Membership Pro Lifetime dari keranjang" }).click();
    await expect(notification(page, "Membership Pro Lifetime dihapus dari keranjang.")).toBeVisible();
  });

  test("alert dapat ditutup dan hilang sendiri setelah 4 detik", async ({ page }) => {
    await page.clock.install();
    const membership = new MembershipPage(page);
    await membership.goto();

    await membership.plan("Pro").getByRole("button", { name: "Tambah ke Keranjang" }).click();
    const alert = notification(page, "ditambahkan ke keranjang");
    await expect(alert).toBeVisible();
    await alert.getByRole("button", { name: "Tutup pemberitahuan" }).click();
    await expect(alert).toHaveCount(0);

    await page.goto("/cart");
    await page.getByRole("button", { name: /^Hapus .* dari keranjang$/ }).click();
    const removed = notification(page, "dihapus dari keranjang");
    await expect(removed).toBeVisible();
    await page.clock.fastForward(4100);
    await expect(removed).toHaveCount(0);
  });

  test("wadah alert diumumkan pembaca layar", async ({ page }) => {
    await new DashboardPage(page).goto();

    await expect(notifications(page).locator('[aria-live="assertive"]')).toHaveCount(1);
    await expect(notifications(page).locator('[aria-live="polite"]')).toHaveCount(1);
  });
});
