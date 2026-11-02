import { expect, test } from "../fixtures/auth";
import { CheckoutPage } from "../pages/CheckoutPage";
import { MembershipPage } from "../pages/MembershipPage";

test.use({ role: "user" });

test.describe("Membership", () => {
  let membership: MembershipPage;

  test.beforeEach(async ({ page }) => {
    membership = new MembershipPage(page);
    await membership.goto();
  });

  test("menampilkan paket Basic, Pro, dan Premium", async () => {
    await expect(membership.plans).toHaveCount(3);
    for (const plan of ["Basic", "Pro", "Premium"]) {
      await expect(membership.plan(plan)).toBeVisible();
    }
  });

  test("menampilkan kredit eBook dan project setiap paket", async () => {
    await expect(membership.plan("Pro")).toContainText("1 kredit eBook dan 1 kredit project");
    await expect(membership.plan("Premium")).toContainText("3 kredit eBook dan 3 kredit project");

    await expect(membership.comparisonValues("Kredit eBook")).toHaveText(["0", "1", "3"]);
    await expect(membership.comparisonValues("Kredit project")).toHaveText(["0", "1", "3"]);
  });

  test("checkout menampilkan label simulasi", async ({ page }) => {
    await membership.buy("Pro");

    await expect(page).toHaveURL("/checkout");

    const checkout = new CheckoutPage(page);
    await expect(checkout.simulationNote).toBeVisible();
    await expect(checkout.payButton).toBeVisible();
  });
});
