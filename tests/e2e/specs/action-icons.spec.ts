import AxeBuilder from "@axe-core/playwright";

import { expect, test } from "../fixtures/auth";
import { CREATOR_STUDIO } from "../fixtures/testData";
import { AllContentsPageObject, UsersPageObject } from "../pages/AdminPages";
import { CreatorContentsPage } from "../pages/CreatorStudioPages";

const [draft, , , , published] = CREATOR_STUDIO.actionsByStatus;

test.describe("Aksi ikon Creator", () => {
  test.use({ role: "creator" });

  let contents: CreatorContentsPage;

  test.beforeEach(async ({ page }) => {
    contents = new CreatorContentsPage(page);
    await contents.goto();
    await expect(contents.heading).toBeVisible();
  });

  test("aksi umum berupa ikon dengan tooltip, langkah utama tetap bertuliskan teks", async ({ page }) => {
    const entry = await contents.find(draft.title);
    const edit = entry.getByRole("link", { name: "Edit" });

    await expect(edit).toHaveText("");
    await expect(entry.getByRole("link", { name: "Kirim untuk Review" })).toHaveText("Kirim untuk Review");

    await edit.hover();
    await expect(page.getByRole("tooltip")).toHaveText("Edit");
  });

  test("tooltip juga muncul saat ikon difokus dengan keyboard", async ({ page }) => {
    const entry = await contents.find(published.title);

    await entry.getByRole("link", { name: "Lihat di website" }).focus();

    await expect(page.getByRole("tooltip")).toHaveText("Lihat di website");
  });

  test("ikon Hapus tetap membuka konfirmasi", async ({ page }) => {
    const entry = await contents.find(draft.title);

    await entry.getByRole("button", { name: "Hapus" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("Aksi ikon Admin", () => {
  test.use({ role: "admin" });

  test("ikon Lihat detail membawa nama pengguna, tooltip tetap singkat", async ({ page }) => {
    const users = new UsersPageObject(page);
    await users.goto();
    const detail = users.row("Sobat QA").getByRole("link", { name: "Lihat detail Sobat QA" });

    await detail.hover();

    await expect(page.getByRole("tooltip")).toHaveText("Lihat detail");
    await detail.click();
    await expect(page).toHaveURL(/\/admin\/pengguna\/user-sobat$/);
  });

  test("ikon Riwayat membuka riwayat status", async ({ page }) => {
    const contents = new AllContentsPageObject(page);
    await contents.goto();

    await contents.rows.first().getByRole("button", { name: "Riwayat" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("Aksesibilitas", () => {
  test.use({ role: "admin" });

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("daftar dengan aksi ikon dan tooltip tanpa pelanggaran", async ({ page }) => {
        const contents = new AllContentsPageObject(page);
        await contents.goto();
        await contents.rows.first().getByRole("button", { name: "Riwayat" }).hover();
        await expect(page.getByRole("tooltip")).toBeVisible();

        const { violations } = await new AxeBuilder({ page }).analyze();

        expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
      });
    });
  }
});
