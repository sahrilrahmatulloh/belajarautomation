import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { ACCOUNTS, BLOG, DEMO_PASSWORD } from "../fixtures/testData";
import { ArticlePage } from "../pages/ArticlePage";
import { BlogPage } from "../pages/BlogPage";
import { LoginPage } from "../pages/LoginPage";

const { article, featuredTitle } = BLOG;

async function openBlog(page: Page) {
  const blog = new BlogPage(page);
  await blog.goto();
  await blog.expectReady();
  return blog;
}

async function openArticle(page: Page, slug: string = article.slug) {
  const articlePage = new ArticlePage(page, slug);
  await articlePage.goto();
  await articlePage.expectReady();
  return articlePage;
}

// Mencatat teks yang dikirim ke clipboard. Membaca clipboard langsung tidak bisa dipakai
// karena clipboard Windows mengubah akhir baris menjadi CRLF.
async function captureClipboard(page: Page) {
  await page.addInitScript(() => {
    const clipboard = {
      writeText: async (text: string) => {
        (window as unknown as { copiedText: string }).copiedText = text;
      },
    };
    Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });
  });
  return () => page.evaluate(() => (window as unknown as { copiedText?: string }).copiedText);
}

test.describe("Blog tanpa login", () => {
  test("daftar artikel terbuka dan header menampilkan Masuk dan Daftar", async ({ page }) => {
    const blog = await openBlog(page);

    await expect(page).toHaveURL("/blog");
    await expect(blog.heading).toBeVisible();
    await expect(blog.loginLink).toBeVisible();
    await expect(blog.registerLink).toBeVisible();
    await expect(page.getByRole("button", { name: "Buka menu profil" })).toBeHidden();
    await expect(page.getByRole("button", { name: /^Notifikasi/ })).toBeHidden();
    await expect(page.getByRole("link", { name: /^Notifikasi/ })).toBeHidden();
  });

  test("halaman artikel terbuka dan header menampilkan Masuk dan Daftar", async ({ page }) => {
    const articlePage = await openArticle(page);

    await expect(page).toHaveURL(`/blog/${article.slug}`);
    await expect(articlePage.heading).toHaveText(article.title);
    await expect(articlePage.loginLink).toBeVisible();
    await expect(articlePage.registerLink).toBeVisible();
  });

  test("isi artikel ada di HTML dari server agar bisa dibaca mesin pencari", async ({ request }) => {
    const listHtml = await (await request.get("/blog")).text();
    expect(listHtml).toContain(`/blog/${article.slug}`);

    const articleHtml = await (await request.get(`/blog/${article.slug}`)).text();
    expect(articleHtml).toContain(article.bodyText);
  });

  test("tombol Masuk dan Daftar menuju halaman yang benar", async ({ page }) => {
    const blog = await openBlog(page);
    await blog.registerLink.click();
    await expect(page).toHaveURL("/register");

    await blog.goto();
    await blog.loginLink.click();
    await expect(page).toHaveURL("/login");
  });

  test("halaman lain tetap mewajibkan login", async ({ page }) => {
    for (const path of ["/", "/learn", "/playground", "/roadmap"]) {
      await page.goto(path);
      await expect(page).toHaveURL("/login");
    }
  });

  test("menu yang butuh login mengarah ke login lalu kembali ke tujuan", async ({ page, isMobile }) => {
    const blog = await openBlog(page);
    if (isMobile) await page.getByRole("button", { name: "Buka atau tutup sidebar" }).click();

    await blog.menu.getByRole("link", { name: "Belajar" }).click();
    await expect(page).toHaveURL("/login?next=%2Flearn");

    await new LoginPage(page).login(ACCOUNTS.user.email, DEMO_PASSWORD);
    await expect(page).toHaveURL("/learn");
  });

  test("menu Blog aktif dan tidak bertanda Segera hadir", async ({ page, isMobile }) => {
    const blog = await openBlog(page);
    if (isMobile) await page.getByRole("button", { name: "Buka atau tutup sidebar" }).click();

    const link = blog.menu.getByRole("link", { name: "Blog" });
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(link).not.toContainText("Segera hadir");
  });

  test("tidak melebar secara horizontal", async ({ page }) => {
    const blog = await openBlog(page);
    await blog.expectNoHorizontalScroll();

    const articlePage = await openArticle(page);
    await articlePage.expectNoHorizontalScroll();
  });
});

test.describe("Daftar artikel", () => {
  test("artikel unggulan tampil terpisah dan terbaru lebih dulu", async ({ page }) => {
    const blog = await openBlog(page);

    await expect(blog.featuredLink).toHaveAccessibleName(`Baca Artikel: ${featuredTitle}`);
    await expect(blog.cards).toHaveCount(BLOG.articleCount - 1);
    await expect(blog.cardTitles.first()).toHaveText(BLOG.newestCardTitle);
  });

  test("seluruh kartu dapat diklik", async ({ page }) => {
    const blog = await openBlog(page);

    await blog.cards.filter({ hasText: article.title }).getByRole("link").click();

    await expect(page).toHaveURL(`/blog/${article.slug}`);
  });

  test("pencarian menyaring judul dan ringkasan serta tersimpan di URL", async ({ page }) => {
    const blog = await openBlog(page);

    await blog.searchInput.fill(BLOG.search.keyword);

    await expect(page).toHaveURL(new RegExp(`[?&]q=${BLOG.search.keyword.replace(" ", "\\+")}`));
    await expect(blog.cardTitles).toHaveText([BLOG.search.title]);
    await expect(blog.featuredLink).toBeHidden();

    await page.reload();
    await expect(blog.searchInput).toHaveValue(BLOG.search.keyword);
    await expect(blog.cardTitles).toHaveText([BLOG.search.title]);
  });

  test("chip kategori menyaring daftar dan tersimpan di URL", async ({ page }) => {
    const blog = await openBlog(page);

    await blog.category(BLOG.category.name).click();

    await expect(page).toHaveURL(`/blog?kategori=${BLOG.category.slug}`);
    await expect(blog.category(BLOG.category.name)).toHaveAttribute("aria-pressed", "true");
    await expect(blog.cards).toHaveCount(BLOG.category.count);

    await blog.category("Semua").click();
    await expect(page).toHaveURL("/blog");
    await expect(blog.featuredLink).toBeVisible();
  });

  test("filter dari URL langsung diterapkan", async ({ page }) => {
    const blog = new BlogPage(page);

    await blog.gotoWithQuery(`kategori=${BLOG.category.slug}`);

    await expect(blog.category(BLOG.category.name)).toHaveAttribute("aria-pressed", "true");
    await expect(blog.cards).toHaveCount(BLOG.category.count);
  });

  test("kategori tanpa artikel tidak tampil dan nilainya di URL diabaikan", async ({ page }) => {
    const blog = await openBlog(page);

    await expect(blog.categoryFilter.getByRole("button")).toHaveText([...BLOG.visibleCategories]);
    for (const name of BLOG.emptyCategories) {
      await expect(blog.category(name)).toHaveCount(0);
    }

    await blog.gotoWithQuery("kategori=api-testing");
    await expect(blog.category("Semua")).toHaveAttribute("aria-pressed", "true");
    await expect(blog.cards).toHaveCount(BLOG.articleCount - 1);
  });

  test("pencarian tanpa hasil menampilkan empty state dan bisa direset", async ({ page }) => {
    const blog = await openBlog(page);

    await blog.searchInput.fill("katakuncitidakada");
    await expect(blog.emptyState).toBeVisible();

    await blog.resetButton.click();

    await expect(page).toHaveURL("/blog");
    await expect(blog.searchInput).toHaveValue("");
    await expect(blog.featuredLink).toBeVisible();
  });

  test("urutan bawaan terbaru dan bisa diubah ke terlama", async ({ page }) => {
    const blog = await openBlog(page);
    await expect(blog.sortSelect).toHaveValue("");

    await blog.sortSelect.selectOption({ label: "Terlama" });

    await expect(page).toHaveURL("/blog?urut=terlama");
    await expect(blog.cardTitles.first()).toHaveText(BLOG.oldestTitle);
  });
});

test.describe("Artikel draf di DEV", () => {
  test("tampil dengan badge Draf di daftar dan halaman artikel", async ({ page }) => {
    const blog = await openBlog(page);
    await expect(blog.draftBadges).toHaveCount(BLOG.articleCount);

    const articlePage = await openArticle(page);
    await expect(articlePage.draftBadge).toBeVisible();
  });
});

test.describe("Halaman artikel", () => {
  test("menampilkan breadcrumb, penulis, tanggal, dan waktu baca", async ({ page }) => {
    const articlePage = await openArticle(page);
    const header = articlePage.articleHeader;

    await expect(articlePage.breadcrumb.getByRole("link")).toHaveText(["Blog", article.category]);
    await expect(header.getByText("Tim BelajarAutomation", { exact: true })).toBeVisible();
    await expect(header.getByText(article.date, { exact: true })).toBeVisible();
    await expect(header.getByText(/^\d+ menit baca$/)).toBeVisible();
    await expect(header.getByText(/^Diperbarui/)).toBeHidden();
  });

  test("breadcrumb kategori membuka daftar dengan filter aktif", async ({ page }) => {
    const articlePage = await openArticle(page);

    await articlePage.breadcrumb.getByRole("link", { name: article.category }).click();

    await expect(page).toHaveURL(`/blog?kategori=${article.categorySlug}`);
    await expect(new BlogPage(page).category(article.category)).toHaveAttribute("aria-pressed", "true");
  });

  test("daftar isi menuju heading yang benar tanpa menggeser layout", async ({ page }) => {
    const articlePage = await openArticle(page);
    await articlePage.openToc();
    await expect(articlePage.toc.getByRole("link")).toHaveText([...article.headings]);

    await articlePage.toc.getByRole("link", { name: article.tocTarget.title }).click();

    await expect(page).toHaveURL(`/blog/${article.slug}#${article.tocTarget.id}`);
    const heading = page.getByRole("heading", { level: 2, name: article.tocTarget.title });
    await expect(heading).toHaveAttribute("id", article.tocTarget.id);
    await expect(heading).toBeInViewport();
    await expect(page.getByRole("banner")).toBeInViewport({ ratio: 1 });
    const documentOverflow = await page.evaluate(
      () => document.documentElement.scrollHeight - document.documentElement.clientHeight
    );
    expect(documentOverflow).toBe(0);
  });

  test("daftar isi menandai bagian yang sedang dibaca di desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "Di mobile daftar isi berupa panel yang dilipat");
    const articlePage = await openArticle(page);
    await expect(articlePage.activeTocLink).toHaveText(article.headings[0]);

    await articlePage.toc.getByRole("link", { name: article.tocTarget.title }).click();

    await expect(articlePage.activeTocLink).toHaveText(article.tocTarget.title);
    await expect(articlePage.toc).toBeInViewport();
  });

  test("daftar isi di mobile berupa panel yang bisa dilipat", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Hanya berlaku untuk ukuran mobile");
    const articlePage = await openArticle(page);
    await expect(articlePage.tocToggle).toHaveAttribute("aria-expanded", "false");
    await expect(articlePage.toc.getByRole("link")).toHaveCount(0);

    await articlePage.tocToggle.click();
    await expect(articlePage.toc.getByRole("link")).toHaveCount(article.headings.length);

    await articlePage.toc.getByRole("link", { name: article.tocTarget.title }).click();
    await expect(articlePage.tocToggle).toHaveAttribute("aria-expanded", "false");
  });

  test("blok kode menampilkan bahasa dan tombol Salin menyalin kode apa adanya", async ({ page }) => {
    const getCopied = await captureClipboard(page);
    const articlePage = await openArticle(page);
    await expect(articlePage.codeBlock()).toHaveAccessibleName("Kode ts");

    await articlePage.copyCodeButton().click();

    await expect(page.getByRole("main").getByText("Disalin", { exact: true })).toBeVisible();
    expect(await getCopied()).toBe(article.firstCode);
  });

  test("kotak ajakan di akhir artikel sesuai tujuan bagi pengguna yang login", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(ACCOUNTS.user.email, DEMO_PASSWORD);
    await expect(page).toHaveURL(ACCOUNTS.user.home);

    const articlePage = await openArticle(page);
    const { ctaSection } = articlePage;

    await expect(ctaSection.getByRole("link", { name: "Lihat Course" })).toHaveAttribute("href", article.courseHref);
    await expect(ctaSection.getByRole("link", { name: "Mulai Latihan" })).toHaveAttribute("href", article.practiceHref);
    await ctaSection.getByRole("link", { name: "Mulai Latihan" }).click();
    await expect(page).toHaveURL(article.practiceHref);
    await context.close();
  });

  test("kotak ajakan mengarahkan tamu ke login lalu kembali ke tujuan", async ({ page }) => {
    const articlePage = await openArticle(page);

    await articlePage.ctaSection.getByRole("link", { name: "Lihat Course" }).click();
    await expect(page).toHaveURL(`/login?next=${encodeURIComponent(article.courseHref)}`);

    await new LoginPage(page).login(ACCOUNTS.user.email, DEMO_PASSWORD);
    await expect(page).toHaveURL(article.courseHref);
  });

  test("tujuan dari tautan login diteruskan saat pindah ke halaman daftar", async ({ page }) => {
    const target = encodeURIComponent(article.courseHref);
    await page.goto(`/login?next=${target}`);
    const link = page.getByRole("link", { name: "Daftar sekarang" });
    await expect(link).toHaveAttribute("href", `/register?next=${target}`);
  });

  test("tautan login tidak bisa mengarahkan ke situs lain", async ({ page }) => {
    for (const target of ["https://contoh.example", "//contoh.example", "/\\contoh.example"]) {
      await page.goto(`/login?next=${encodeURIComponent(target)}`);
      await new LoginPage(page).login(ACCOUNTS.user.email, DEMO_PASSWORD);
      await expect(page).toHaveURL(ACCOUNTS.user.home);
      await page.evaluate(() => window.localStorage.clear());
    }
  });

  test("menampilkan sumber bila ada dan menyembunyikannya bila tidak ada", async ({ page }) => {
    const articlePage = await openArticle(page);
    await expect(articlePage.sources.getByRole("link")).toHaveCount(article.sourceCount);

    const outline = await openArticle(page, BLOG.outlineSlug);
    await expect(outline.heading).toBeVisible();
    await expect(outline.sources).toBeHidden();
  });

  test("salin tautan menampilkan notifikasi", async ({ page }) => {
    const getCopied = await captureClipboard(page);
    const articlePage = await openArticle(page);

    await articlePage.shareSection.getByRole("button", { name: "Salin Tautan" }).click();

    await expect(articlePage.copiedMessage).toBeVisible();
    expect(await getCopied()).toMatch(new RegExp(`/blog/${article.slug}$`));
  });

  test("tautan WhatsApp dan LinkedIn memuat alamat artikel", async ({ page }) => {
    const articlePage = await openArticle(page);
    const encodedPath = encodeURIComponent(`/blog/${article.slug}`);

    await expect(articlePage.shareSection.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      new RegExp(`^https://wa\\.me/.*http.*${encodedPath}`)
    );
    await expect(articlePage.shareSection.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      new RegExp(`^https://www\\.linkedin\\.com/.*http.*${encodedPath}`)
    );
  });

  test("tombol Bagikan membuka panel dan salin tautan menutupnya", async ({ page }) => {
    await captureClipboard(page);
    const articlePage = await openArticle(page);

    await articlePage.shareButton.click();
    await expect(articlePage.sharePanel).toBeVisible();

    await articlePage.sharePanel.getByRole("button", { name: "Salin Tautan" }).click();

    await expect(articlePage.sharePanel).toBeHidden();
    await expect(articlePage.copiedMessage).toBeVisible();
  });

  test("di mobile panel Bagikan muncul dari bawah layar", async ({ page, isMobile, viewport }) => {
    test.skip(!isMobile, "Hanya berlaku untuk ukuran mobile");
    const articlePage = await openArticle(page);

    await articlePage.shareButton.click();
    await expect(articlePage.sharePanel).toBeVisible();

    await expect
      .poll(async () => {
        const box = await articlePage.sharePanel.boundingBox();
        return box ? Math.round(box.y + box.height) : 0;
      })
      .toBe(viewport!.height);
  });

  test("menampilkan tiga artikel terkait, diutamakan kategori yang sama", async ({ page }) => {
    const articlePage = await openArticle(page);
    const titles = articlePage.related.getByRole("heading", { level: 3 });

    await expect(titles).toHaveCount(3);
    await expect(titles.first()).toHaveText(article.relatedFirst);
    await expect(articlePage.related).not.toContainText(article.title);
  });

  test("tidak ada fitur simpan artikel dan kolom komentar", async ({ page }) => {
    await openArticle(page);

    await expect(page.getByRole("button", { name: /simpan|bookmark/i })).toHaveCount(0);
    await expect(page.getByRole("main").getByText(/komentar/i)).toHaveCount(0);
  });

  test("slug tidak dikenal menampilkan halaman 404 yang ramah", async ({ page }) => {
    const response = await page.goto("/blog/artikel-yang-tidak-ada");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Artikel tidak ditemukan" })).toBeVisible();

    await page.getByRole("link", { name: "Kembali ke Blog" }).click();
    await expect(page).toHaveURL("/blog");
  });
});

test.describe("Blog setelah login", () => {
  test.use({ role: "user" });

  test("header kembali menampilkan menu pengguna", async ({ page }) => {
    const blog = await openBlog(page);

    await expect(blog.profileMenuButton).toBeVisible();
    await expect(blog.loginLink).toBeHidden();
    await expect(blog.registerLink).toBeHidden();
  });
});

test.describe("SEO", () => {
  test("setiap artikel punya judul, deskripsi, dan gambar pratinjau", async ({ page }) => {
    await page.goto(`/blog/${article.slug}`);

    await expect(page).toHaveTitle(`${article.title} | belajarautomation.com`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", article.excerpt);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", new RegExp(article.title));
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", new RegExp(`${article.cover}$`));
  });

  test("di luar Production seluruh situs noindex dan nofollow", async ({ page }) => {
    for (const path of ["/blog", `/blog/${article.slug}`, "/login"]) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    }
  });

  test("robots.txt tidak memblokir halaman agar noindex terbaca, dan tanpa sitemap di luar Production", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();

    expect(robots).toContain("Allow: /");
    expect(robots).not.toContain("Disallow");
    expect(robots).not.toContain("Sitemap");
  });

  test("sitemap memuat halaman publik dan tidak memuat artikel draf", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();

    expect(sitemap).toContain("/blog</loc>");
    expect(sitemap).not.toContain(`/blog/${article.slug}`);
  });
});
