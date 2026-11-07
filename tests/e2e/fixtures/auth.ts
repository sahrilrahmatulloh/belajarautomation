import { expect, test as base } from "@playwright/test";

import { LoginPage } from "../pages/LoginPage";
import { ACCOUNTS, DEMO_PASSWORD, Role, SPLASH_SEEN_KEY } from "./testData";

interface AuthOptions {
  // Role yang sudah login saat test dimulai; null berarti tamu.
  role: Role | null;
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

// Pemakaian: test.use({ role: "creator" }). Login lewat halaman login sekali per
// worker dan role, lalu storage state-nya dipakai ulang oleh test di worker itu.
export const test = base.extend<AuthOptions, AuthWorkerFixtures>({
  role: [null, { option: true }],

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

  context: async ({ context }, provide) => {
    await context.addInitScript(markSplashSeen, SPLASH_SEEN_KEY);
    await provide(context);
  },
});

export { expect };
