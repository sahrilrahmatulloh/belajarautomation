import { Page } from "@playwright/test";

// Alert singkat di atas layar (PRD 4.6), dari components/common/Toaster.tsx.
export function notifications(page: Page) {
  return page.getByRole("region", { name: "Pemberitahuan" });
}

export function notification(page: Page, text: string | RegExp) {
  return notifications(page).locator("[data-notify-tone]").filter({ hasText: text });
}
