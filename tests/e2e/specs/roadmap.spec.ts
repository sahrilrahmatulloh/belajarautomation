import { expect, test } from "../fixtures/auth";
import { RoadmapDetailPage } from "../pages/RoadmapDetailPage";
import { RoadmapPage } from "../pages/RoadmapPage";

test.use({ role: "user" });

test.describe("Roadmap", () => {
  test("menampilkan 6 roadmap", async ({ page }) => {
    const roadmap = new RoadmapPage(page);
    await roadmap.goto();

    await expect(roadmap.cards).toHaveCount(6);
  });

  test.describe("Detail QA Automation Web", () => {
    let detail: RoadmapDetailPage;

    test.beforeEach(async ({ page }) => {
      detail = new RoadmapDetailPage(page, "qa-automation-web");
      await detail.goto();
    });

    test('menampilkan cabang dengan label "Rekomendasi"', async () => {
      await expect(detail.branchHeadings).toBeVisible();
      await expect(detail.recommendedLabels).toBeVisible();
      await expect(detail.recommendedLabels.locator("..")).toContainText("TypeScript");
    });

    test('"Lihat Materi" pada node Playwright menuju /learn/playwright', async ({ page }) => {
      await detail.materialLink("Playwright").click();

      await expect(page).toHaveURL("/learn/playwright");
    });
  });
});
