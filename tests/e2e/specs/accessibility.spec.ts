import AxeBuilder from "@axe-core/playwright";
import { Page, TestInfo } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { MAIN_PAGES, openRolePage, ROLE_PAGES } from "../fixtures/mainPages";
import { COLORS, GUEST_PAGES, LEARNER_PAGES } from "../fixtures/testData";

const BLOCKING_IMPACTS = ["critical", "serious"];

async function expectNoBlockingViolations(page: Page, testInfo: TestInfo) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const summarize = (violation: (typeof violations)[number]) =>
    `${violation.impact}: ${violation.id} (${violation.nodes.length} elemen) - ${violation.help}`;

  // Selain critical dan serious hanya dicatat di laporan, tidak menggagalkan test.
  for (const violation of violations.filter((item) => !BLOCKING_IMPACTS.includes(item.impact ?? ""))) {
    testInfo.annotations.push({ type: "a11y", description: summarize(violation) });
  }
  await testInfo.attach("axe-violations", {
    body: JSON.stringify(violations, null, 2),
    contentType: "application/json",
  });

  expect(violations.filter((item) => BLOCKING_IMPACTS.includes(item.impact ?? "")).map(summarize)).toEqual([]);
}

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`Aksesibilitas mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
    test.use({ colorScheme });

    test.describe("Tamu", () => {
      for (const { name, path } of GUEST_PAGES) {
        test(`halaman ${name} tanpa pelanggaran critical dan serious`, async ({ page }, testInfo) => {
          await page.goto(path);
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

          await expectNoBlockingViolations(page, testInfo);
        });
      }
    });

    test.describe("Pelajar", () => {
      test.use({ role: "user" });

      for (const { name, open } of MAIN_PAGES) {
        test(`halaman ${name} tanpa pelanggaran critical dan serious`, async ({ page }, testInfo) => {
          await open(page);

          await expectNoBlockingViolations(page, testInfo);
        });
      }

      for (const { name, path } of LEARNER_PAGES) {
        test(`halaman ${name} tanpa pelanggaran critical dan serious`, async ({ page }, testInfo) => {
          await page.goto(path);
          await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();

          await expectNoBlockingViolations(page, testInfo);
        });
      }
    });

    for (const { role, name, path } of ROLE_PAGES) {
      test.describe(name, () => {
        test.use({ role });

        test(`halaman ${name} tanpa pelanggaran critical dan serious`, async ({ page }, testInfo) => {
          await openRolePage(page, role, path);

          await expectNoBlockingViolations(page, testInfo);
        });
      });
    }

    test.describe("Menu profil", () => {
      test.use({ role: "creator" });

      test("menu profil yang terbuka tanpa pelanggaran apa pun", async ({ page }) => {
        const dashboard = await openRolePage(page, "creator", "/creator");
        await dashboard.profileMenuButton.click();
        await expect(page.getByRole("menu")).toBeVisible();

        const { violations } = await new AxeBuilder({ page }).include('[role="menu"]').analyze();

        expect(violations.map((violation) => violation.id)).toEqual([]);
      });
    });

    test.describe("Warna tombol utama", () => {
      test("tombol berteks putih memakai warna yang sama di semua mode", async ({ page }) => {
        await page.goto("/login");

        const button = page.getByRole("button", { name: "Masuk" });
        await expect(button).toHaveCSS("background-color", COLORS.primaryButton);
        await expect(button).toHaveCSS("color", COLORS.white);
      });

      test.describe("Chip filter aktif", () => {
        test.use({ role: "user" });

        test("memakai warna tombol utama", async ({ page }) => {
          await page.goto("/notifications");

          const chip = page.getByRole("group", { name: "Filter Status" }).getByRole("button", { name: "Semua" });
          await expect(chip).toHaveCSS("background-color", COLORS.primaryButton);
          await expect(chip).toHaveCSS("color", COLORS.white);
        });
      });
    });
  });
}
