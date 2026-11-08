import { expect, test } from "../fixtures/auth";
import { CHALLENGE_KEYS } from "../fixtures/testData";
import { ChallengePage } from "../pages/ChallengePage";
import { PlaygroundPage } from "../pages/PlaygroundPage";

test.use({ role: "user" });

const { quiz, bugHunt, testCase, locator } = CHALLENGE_KEYS;
const wrongAnswers = quiz.answers.map((answer) => (answer + 1) % 4);

test.describe("Halaman pengerjaan", () => {
  test("menampilkan judul, jenis, course terkait, dan tombol kembali", async ({ page }) => {
    const challenge = new ChallengePage(page, quiz.slug);
    await challenge.goto();

    await expect(challenge.heading).toHaveText(quiz.title);
    await expect(challenge.typeBadge).toHaveText("Kuis");
    await expect(challenge.courseLink).toHaveAttribute("href", `/learn/${quiz.courseSlug}`);

    await challenge.backLink.click();
    await expect(page).toHaveURL("/playground");
  });

  test("slug yang tidak ada menghasilkan 404", async ({ page }) => {
    const response = await page.goto("/playground/latihan-tidak-ada");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Kuis", () => {
  let challenge: ChallengePage;

  test.beforeEach(async ({ page }) => {
    challenge = new ChallengePage(page, quiz.slug);
    await challenge.goto();
    await expect(challenge.quiz).toBeVisible();
  });

  test("satu soal per layar, jawaban bisa diubah, dan kirim aktif setelah semua terjawab", async () => {
    await expect(challenge.quiz.getByText(`Soal 1 dari ${quiz.answers.length}`)).toBeVisible();
    await expect(challenge.submitAnswerButton).toBeDisabled();
    await expect(challenge.previousButton).toBeDisabled();

    await challenge.options.nth(0).check();
    await challenge.options.nth(1).check();
    await expect(challenge.options.nth(0)).not.toBeChecked();
    await expect(challenge.quiz.getByText(`1 dari ${quiz.answers.length} terjawab`)).toBeVisible();

    await challenge.nextButton.click();
    await expect(challenge.quiz.getByText(`Soal 2 dari ${quiz.answers.length}`)).toBeVisible();
    await challenge.previousButton.click();
    await expect(challenge.options.nth(1)).toBeChecked();

    await challenge.answerQuiz(quiz.answers);
    await expect(challenge.submitAnswerButton).toBeEnabled();
  });

  test("lulus: menampilkan skor, XP penyelesaian pertama, dan pembahasan", async () => {
    await challenge.answerQuiz(quiz.answers);
    await challenge.submitAnswerButton.click();

    await expect(challenge.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Skor 100%");
    await expect(challenge.result).toContainText("+30 XP");

    await expect(challenge.review).toHaveCount(quiz.answers.length);
    const first = challenge.review.first();
    await expect(first).toContainText(quiz.firstQuestion);
    await expect(first).toContainText("Jawaban kamu");
    await expect(first).toContainText(`Jawaban benar${quiz.firstCorrectOption}`);
    await expect(first).toContainText(quiz.firstExplanation);
  });

  test("batas lulus 70%: 6 dari 8 lulus dan 5 dari 8 belum", async ({ page }) => {
    const withCorrect = (count: number) =>
      quiz.answers.map((answer, index) => (index < count ? answer : (answer + 1) % 4));

    await challenge.answerQuiz(withCorrect(5));
    await challenge.submitAnswerButton.click();
    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Skor 63%");

    await page.getByRole("button", { name: "Ulangi latihan" }).click();

    await challenge.answerQuiz(withCorrect(6));
    await challenge.submitAnswerButton.click();
    await expect(challenge.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Skor 75%");
  });

  test("tidak lulus: tanpa XP dan tetap menampilkan pembahasan jawaban yang salah", async () => {
    await challenge.answerQuiz(wrongAnswers);
    await challenge.submitAnswerButton.click();

    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Skor 0%");
    await expect(challenge.result).not.toContainText("+30 XP");
    await expect(challenge.review).toHaveCount(quiz.answers.length);
    await expect(challenge.review.first()).toContainText(quiz.firstExplanation);
  });

  test("mengulang setelah lulus tidak memberi XP lagi dan kartu berstatus Lulus", async ({ page }) => {
    await challenge.answerQuiz(quiz.answers);
    await challenge.submitAnswerButton.click();
    await expect(challenge.result).toContainText("+30 XP");

    await page.getByRole("button", { name: "Ulangi latihan" }).click();
    await challenge.answerQuiz(quiz.answers);
    await challenge.submitAnswerButton.click();

    await expect(challenge.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Tidak ada XP tambahan");

    await page.getByRole("link", { name: "Daftar latihan" }).click();
    const playground = new PlaygroundPage(page);
    const card = playground.card(quiz.title);
    await expect(card.getByText("Lulus", { exact: true })).toBeVisible();
    await expect(card.getByText("Skor terakhir 100%")).toBeVisible();
    await expect(playground.actionLink(quiz.title, "Ulangi")).toBeVisible();
  });

  test("gagal setelah pernah lulus: status kartu tetap Lulus dengan skor terakhir", async ({ page }) => {
    await challenge.answerQuiz(quiz.answers);
    await challenge.submitAnswerButton.click();
    await expect(challenge.result).toContainText("+30 XP");

    await page.getByRole("button", { name: "Ulangi latihan" }).click();
    await challenge.answerQuiz(wrongAnswers);
    await challenge.submitAnswerButton.click();
    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();

    await page.getByRole("link", { name: "Daftar latihan" }).click();
    const card = new PlaygroundPage(page).card(quiz.title);
    await expect(card.getByText("Lulus", { exact: true })).toBeVisible();
    await expect(card.getByText("Skor terakhir 0%")).toBeVisible();
  });

  test("hasil gagal tercatat di kartu sebagai Belum lulus", async ({ page }) => {
    await challenge.answerQuiz(wrongAnswers);
    await challenge.submitAnswerButton.click();
    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();

    await page.getByRole("link", { name: "Daftar latihan" }).click();
    const playground = new PlaygroundPage(page);
    await expect(playground.card(quiz.title).getByText("Belum lulus", { exact: true })).toBeVisible();
    await expect(playground.actionLink(quiz.title, "Coba Lagi")).toBeVisible();
  });

  test("latihan yang sudah lulus di riwayat tidak memberi XP lagi", async ({ page }) => {
    const passed = new ChallengePage(page, quiz.alreadyPassed.slug);
    await passed.goto();

    await passed.answerQuiz(quiz.alreadyPassed.answers);
    await passed.submitAnswerButton.click();

    await expect(passed.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
    await expect(passed.result).toContainText("Tidak ada XP tambahan");
  });
});

test.describe("Bug Hunt", () => {
  let challenge: ChallengePage;

  test.beforeEach(async ({ page }) => {
    challenge = new ChallengePage(page, bugHunt.slug);
    await challenge.goto();
    await expect(challenge.findingsPanel).toBeVisible();
    await expect(challenge.practiceFrame).toBeVisible();
  });

  test("menemukan semua bug tanpa salah tandai membuat lulus", async () => {
    await expect(challenge.submitFindingsButton).toBeDisabled();

    await challenge.submitFindings(bugHunt.bugs);

    await expect(challenge.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Skor 100%");
    await expect(challenge.result).toContainText("+75 XP");
    await expect(challenge.findingGroup("Bug ditemukan")).toContainText(bugHunt.bugExplanation);
    await expect(challenge.findingGroup("Bug terlewat")).toBeHidden();
    await expect(challenge.findingGroup("Salah tandai")).toBeHidden();
  });

  test("salah tandai membuat belum lulus walau semua bug ditemukan", async () => {
    await challenge.submitFindings([...bugHunt.bugs, bugHunt.decoy]);

    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.findingGroup("Salah tandai")).toContainText(bugHunt.decoy);
    await expect(challenge.findingGroup("Salah tandai")).toContainText(bugHunt.decoyExplanation);
  });

  test("bug terlewat ditampilkan beserta penjelasannya", async () => {
    await challenge.submitFindings(bugHunt.bugs.slice(0, 1));

    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.findingGroup("Bug ditemukan")).toContainText(bugHunt.bugs[0]);
    await expect(challenge.findingGroup("Bug terlewat")).toContainText(bugHunt.bugs[1]);
  });
});

test.describe("Test Case Writing", () => {
  let challenge: ChallengePage;

  test.beforeEach(async ({ page }) => {
    challenge = new ChallengePage(page, testCase.slug);
    await challenge.goto();
    await expect(challenge.answerInput).toBeVisible();
  });

  async function submitAnswer() {
    await challenge.answerInput.fill("Judul: Login berhasil\nLangkah: isi email dan password");
    await challenge.submitAnswerButton.click();
    await expect(challenge.checklist).toBeVisible();
  }

  test("kirim aktif setelah menulis, lalu tampil contoh jawaban dan keterangan penilaian mandiri", async ({ page }) => {
    await expect(challenge.submitAnswerButton).toBeDisabled();
    await expect(challenge.sampleAnswer).toBeHidden();

    await submitAnswer();

    await expect(challenge.sampleAnswer).toContainText(testCase.sampleAnswerStart);
    await expect(page.getByRole("region", { name: "Jawaban kamu" })).toContainText("Judul: Login berhasil");
    await expect(challenge.checklist).toContainText("penilaian mandiri");
  });

  test("lulus jika semua poin wajib tercentang, tanpa XP karena dinilai sendiri", async () => {
    await submitAnswer();

    for (const label of testCase.required) await challenge.checklistItem(label).check();
    await challenge.finishCheckButton.click();

    await expect(challenge.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Test Case dinilai sendiri, jadi tidak memberi XP.");
    await expect(challenge.result).not.toContainText("+75 XP");
  });

  test("belum lulus jika ada poin wajib yang tidak tercentang", async () => {
    await submitAnswer();

    for (const label of [...testCase.required.slice(1), ...testCase.optional]) {
      await challenge.checklistItem(label).check();
    }
    await challenge.finishCheckButton.click();

    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.result).not.toContainText("+75 XP");
  });
});

test.describe("Locator Challenge", () => {
  let challenge: ChallengePage;

  test.beforeEach(async ({ page }) => {
    challenge = new ChallengePage(page, locator.slug);
    await challenge.goto();
    await expect(challenge.selectorPanel).toBeVisible();
    await expect(challenge.selectorPanel).toContainText(locator.target);
  });

  for (const [type, selector] of [
    ["CSS", locator.css],
    ["XPath", locator.xpath],
  ] as const) {
    test(`selector ${type} yang tepat membuat lulus`, async () => {
      await challenge.enterSelector(type, selector);
      await challenge.testSelectorButton.click();
      await expect(challenge.selectorPanel.getByText("1 elemen cocok.")).toBeVisible();
      await expect(challenge.highlighted).toHaveCount(1);

      await challenge.submitSelectorButton.click();

      await expect(challenge.result.getByRole("heading", { name: "Lulus" })).toBeVisible();
      await expect(challenge.result).toContainText("+75 XP");
    });
  }

  test("selector yang mengenai lebih dari satu elemen belum lulus dan semuanya disorot", async () => {
    await challenge.enterSelector("CSS", "button");
    await challenge.testSelectorButton.click();

    await expect(challenge.selectorPanel.getByText(`${locator.buttonCount} elemen cocok.`)).toBeVisible();
    await expect(challenge.highlighted).toHaveCount(locator.buttonCount);

    await challenge.submitSelectorButton.click();

    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.result).toContainText(`Selector mengenai ${locator.buttonCount} elemen`);
  });

  test("selector yang mengenai satu elemen selain target belum lulus", async () => {
    await challenge.enterSelector("CSS", locator.wrongSelector);
    await challenge.submitSelectorButton.click();

    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("bukan elemen target");
  });

  for (const [type, selector] of [
    ["CSS", "button["],
    ["XPath", "//["],
    ["XPath", "count(//button)"],
  ] as const) {
    test(`selector ${type} tidak valid "${selector}" menampilkan pesan tanpa mengirim`, async () => {
      await challenge.enterSelector(type, selector);
      await challenge.testSelectorButton.click();

      await expect(challenge.selectorPanel.getByRole("alert")).toContainText("tidak valid");
      await expect(challenge.highlighted).toHaveCount(0);

      await challenge.submitSelectorButton.click();

      await expect(challenge.selectorPanel.getByRole("alert")).toContainText("tidak valid");
      await expect(challenge.result).toBeHidden();
    });
  }

  test("selector hanya berjalan di dalam kontainer halaman latihan", async () => {
    // Judul halaman (h1) ada di luar kontainer, dan banyak tombol aplikasi juga di luar.
    for (const [type, selector] of [
      ["CSS", "h1"],
      ["XPath", "//h1"],
    ] as const) {
      await challenge.enterSelector(type, selector);
      await challenge.testSelectorButton.click();
      await expect(challenge.selectorPanel.getByText("0 elemen cocok.")).toBeVisible();
    }

    await challenge.enterSelector("XPath", "//button");
    await challenge.testSelectorButton.click();
    await expect(challenge.selectorPanel.getByText(`${locator.buttonCount} elemen cocok.`)).toBeVisible();
  });

  test("selector kosong tidak bisa diuji atau dikirim", async () => {
    await expect(challenge.testSelectorButton).toBeDisabled();
    await expect(challenge.submitSelectorButton).toBeDisabled();
  });
});

test.describe("Kunci jawaban tidak terkirim sebelum jawaban dikirim", () => {
  for (const { slug, visible, secrets } of CHALLENGE_KEYS.secretChecks) {
    test(`HTML ${slug} tidak memuat kunci jawaban`, async ({ request }) => {
      const response = await request.get(`/playground/${slug}`);
      expect(response.ok()).toBe(true);
      const html = await response.text();

      // Memastikan HTML yang diperiksa memang memuat isi latihan.
      expect(html).toContain(visible);
      for (const secret of [...secrets, "correctIndex", "bugIds", "sampleAnswer", "targetElementId"]) {
        expect(html, `HTML memuat "${secret}"`).not.toContain(secret);
      }
    });
  }
});
