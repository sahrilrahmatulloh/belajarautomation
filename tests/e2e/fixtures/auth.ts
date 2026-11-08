import { expect, test as base } from "@playwright/test";

import { LoginPage } from "../pages/LoginPage";
import { ACCOUNTS, ACTIVE_PROMO_ID, DEMO_PASSWORD, PROMO_DISMISSED_KEY, Role, SPLASH_SEEN_KEY } from "./testData";
import { MOCK_STUDENT } from "./supabaseMock";

interface AuthOptions {
  // Role yang sudah login saat test dimulai; null berarti tamu.
  role: Role | null;
  // Popup promosi setelah login. Bawaan mati agar tidak menutupi halaman di test lain;
  // test popup memakai test.use({ showPromo: true }).
  showPromo: boolean;
}

interface AuthWorkerFixtures {
  storageStateFor: (role: Role) => Promise<string>;
}

// Splash menutupi halaman 1,8 detik di setiap context baru dan bukan bagian yang diuji.
function markSplashSeen(key: string) {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // Halaman tanpa origin (about:blank) tidak punya localStorage.
  }
}

// Menandai popup promosi "jangan tampilkan lagi" untuk akun uji (demo dan Supabase tiruan).
function dismissPromo({ key, promoId, emails }: { key: string; promoId: string; emails: string[] }) {
  try {
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, JSON.stringify(Object.fromEntries(emails.map((email) => [email, [promoId]]))));
  } catch {
    // Halaman tanpa origin (about:blank) tidak punya localStorage.
  }
}

const TEST_EMAILS = [...Object.values(ACCOUNTS).map((account) => account.email), MOCK_STUDENT.email];

// Pemakaian: test.use({ role: "creator" }). Login lewat halaman login sekali per
// worker dan role, lalu storage state-nya dipakai ulang oleh test di worker itu.
export const test = base.extend<AuthOptions, AuthWorkerFixtures>({
  role: [null, { option: true }],
  showPromo: [false, { option: true }],

  storageStateFor: [
    async ({ browser }, provide, workerInfo) => {
      const files = new Map<Role, string>();

      await provide(async (role) => {
        const existing = files.get(role);
        if (existing) return existing;

        const context = await browser.newContext({
          baseURL: workerInfo.project.use.baseURL,
          storageState: undefined,
        });
        await context.addInitScript(markSplashSeen, SPLASH_SEEN_KEY);

        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        const account = ACCOUNTS[role];
        await loginPage.goto();
        await loginPage.login(account.email, DEMO_PASSWORD);
        await expect(page).toHaveURL(account.home);

        // Nama file memuat parallelIndex agar worker paralel tidak saling menimpa.
        const file = `playwright/.auth/${role}-${workerInfo.parallelIndex}.json`;
        await context.storageState({ path: file });
        await context.close();

        files.set(role, file);
        return file;
      });
    },
    { scope: "worker" },
  ],

  storageState: async ({ role, storageStateFor }, provide) => {
    await provide(role ? await storageStateFor(role) : undefined);
  },

  context: async ({ context, showPromo }, provide) => {
    await context.addInitScript(markSplashSeen, SPLASH_SEEN_KEY);
    if (!showPromo) {
      await context.addInitScript(dismissPromo, { key: PROMO_DISMISSED_KEY, promoId: ACTIVE_PROMO_ID, emails: TEST_EMAILS });
    }
    await provide(context);
  },
});

export { expect };
