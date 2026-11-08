import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const port = process.env.NON_DEV_PORT ?? "3201";
const baseURL = `http://localhost:${port}`;

// Perilaku yang hanya bisa diuji di luar DEV, karena NEXT_PUBLIC_APP_ENV disisipkan saat
// build. Membuat build sendiri dengan lingkungan UAT, terpisah dari npm run test:e2e.
export default defineConfig({
  testDir: "tests/e2e/non-dev",
  outputDir: "test-results/non-dev",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [["list"], ...(isCI ? ([["github"]] as const) : [])],
  use: { baseURL, trace: "on-first-retry", screenshot: "only-on-failure" },
  projects: [{ name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    // Tanpa Supabase: akun demo tetap dipakai test peran di luar DEV. Nilai kosong
    // mengalahkan isi .env.local.
    env: { NEXT_PUBLIC_APP_ENV: "uat", PORT: port, NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_ANON_KEY: "", SUPABASE_SERVICE_ROLE_KEY: "" },
    reuseExistingServer: false,
    timeout: 5 * 60 * 1000,
  },
});
