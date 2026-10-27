import { ChallengeDetail } from "@/types/ChallengeDetail";

export const CHALLENGE_DETAILS: ChallengeDetail[] = [
  {
    slug: "playwright-locator",
    instruction:
      "Buat locator Playwright terbaik untuk tombol Login berikut.",
    requirements: [
      "Gunakan locator yang readable",
      "Prioritaskan semantic locator",
      "Hindari XPath panjang",
    ],
    code: `<button type="submit">Login</button>`,
    placeholder:
      'page.getByRole("button", { name: "Login" })',
    expectedAnswer:
      'page.getByRole("button", { name: "Login" })',
    successFeedback:
      "Locator kamu valid. getByRole adalah pilihan yang baik karena menggunakan semantic role dan accessible name.",
  },

  {
    slug: "login-test-case",
    instruction:
      "Tuliskan satu test case positif untuk fitur login.",
    requirements: [
      "Gunakan email valid",
      "Gunakan password valid",
      "Pastikan user berhasil masuk ke dashboard",
    ],
    placeholder:
      "Given user berada di halaman login...",
    expectedAnswer: "dashboard",
    successFeedback:
      "Test case mencakup expected result utama yaitu user berhasil masuk ke dashboard.",
  },

  {
    slug: "find-checkout-bug",
    instruction:
      "Analisis skenario checkout dan identifikasi bug utama.",
    requirements: [
      "Jelaskan actual result",
      "Jelaskan expected result",
      "Tuliskan bug secara singkat",
    ],
    code: `Cart Total: Rp100.000
Shipping: Rp20.000
Displayed Total: Rp100.000`,
    placeholder:
      "Bug: Total pembayaran tidak memasukkan biaya pengiriman...",
    expectedAnswer: "shipping",
    successFeedback:
      "Benar. Total pembayaran seharusnya memasukkan biaya shipping.",
  },

  {
    slug: "api-response-validation",
    instruction:
      "Tuliskan validasi untuk memastikan API mengembalikan HTTP status 200.",
    requirements: [
      "Validasi status code",
      "Expected status adalah 200",
    ],
    code: `GET /api/users/1`,
    placeholder: "expect(response.status()).toBe(200);",
    expectedAnswer: "200",
    successFeedback:
      "Validasi status code berhasil ditemukan.",
  },

  {
    slug: "playwright-login-test",
    instruction:
      "Lengkapi assertion Playwright untuk memastikan login berhasil.",
    requirements: [
      "Validasi URL setelah login",
      "Pastikan user berada di dashboard",
    ],
    code: `await page.getByLabel("Email").fill("qa@test.com");
await page.getByLabel("Password").fill("password123");
await page.getByRole("button", { name: "Login" }).click();

// Tulis assertion di bawah ini`,
    placeholder:
      'await expect(page).toHaveURL(/dashboard/);',
    expectedAnswer: "dashboard",
    successFeedback:
      "Assertion berhasil memvalidasi bahwa user masuk ke halaman dashboard.",
  },

  {
    slug: "ai-test-generation",
    instruction:
      "Buat prompt untuk meminta AI menghasilkan test scenario fitur login.",
    requirements: [
      "Berikan context fitur",
      "Minta positive dan negative scenario",
      "Tentukan format output",
    ],
    placeholder:
      "Buat test scenario untuk fitur login...",
    expectedAnswer: "scenario",
    successFeedback:
      "Prompt sudah memiliki konteks yang cukup untuk menghasilkan test scenario.",
  },
];