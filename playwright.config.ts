import { defineConfig, devices } from "@playwright/test";

import { SUPABASE_TEST_KEY, SUPABASE_TEST_URL } from "./tests/e2e/fixtures/supabaseMock";

const isCI = Boolean(process.env.CI);
// next start juga membaca PORT, jadi test bisa dijalankan di samping server dev.
const port = process.env.PORT ?? "3000";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests/e2e/specs",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ...(isCI ? ([["github"]] as const) : []),
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    // Supabase diarahkan ke alamat tiruan agar test tidak menyentuh project sungguhan dan
    // tidak mengirim email; panggilannya dijawab tests/e2e/fixtures/supabaseMock.ts.
    env: { NEXT_PUBLIC_SUPABASE_URL: SUPABASE_TEST_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_TEST_KEY },
    reuseExistingServer: !isCI,
    // Waktu mencakup next build.
    timeout: 5 * 60 * 1000,
  },
});
