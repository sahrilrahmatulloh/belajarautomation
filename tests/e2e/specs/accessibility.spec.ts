import AxeBuilder from "@axe-core/playwright";

import { expect, test } from "../fixtures/auth";
import { MAIN_PAGES } from "../fixtures/mainPages";

test.use({ role: "user" });

test.describe("Aksesibilitas", () => {
  for (const { name, open } of MAIN_PAGES) {
    test(`halaman ${name} tanpa pelanggaran critical`, async ({ page }, testInfo) => {
      await open(page);

      const { violations } = await new AxeBuilder({ page }).analyze();
      const summarize = (violation: (typeof violations)[number]) =>
        `${violation.impact}: ${violation.id} (${violation.nodes.length} elemen) - ${violation.help}`;

      // Selain critical hanya dicatat di laporan, tidak menggagalkan test.
      for (const violation of violations.filter((item) => item.impact !== "critical")) {
        testInfo.annotations.push({ type: "a11y", description: summarize(violation) });
      }
      await testInfo.attach("axe-violations", {
        body: JSON.stringify(violations, null, 2),
        contentType: "application/json",
      });

      expect(violations.filter((item) => item.impact === "critical").map(summarize)).toEqual([]);
    });
  }
});
