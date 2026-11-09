import { Page, Request } from "@playwright/test";

// Supabase tiruan untuk test. Build test diarahkan ke alamat ini lewat playwright.config.ts,
// jadi test tidak menyentuh project Supabase sungguhan dan tidak mengirim email.
// - Panggilan dari browser dijawab mockSupabase(page) di bawah.
// - Panggilan dari server Next.js (Server Action, proxy) dijawab tests/e2e/mock-supabase-server.mjs
//   yang berjalan di alamat yang sama.
export const SUPABASE_TEST_PORT = 54399;
export const SUPABASE_TEST_URL = `http://127.0.0.1:${SUPABASE_TEST_PORT}`;
// Kunci service role tiruan, sama dengan yang diterima mock-supabase-server.mjs.
export const SUPABASE_TEST_SERVICE_ROLE_KEY = "service-role-uji";
export const SUPABASE_TEST_KEY = "sb_publishable_uji";

// Masuk lewat halaman login dengan Supabase tiruan yang sudah dipasang.
export async function signInWithMock(page: Page, account: MockAccount) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(account.email);
  await page.getByRole("textbox", { name: "Password" }).fill(account.password);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await page.waitForURL("/");
}

export interface MockAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  username: string | null;
  roles?: ("student" | "creator" | "reviewer" | "admin")[];
  status?: "active" | "deactivated";
  emailConfirmed?: boolean;
  bio?: string;
  usernameChangedAt?: string | null;
  newEmail?: string | null;
  avatarId?: string | null;
  themeId?: string | null;
}

export const MOCK_STUDENT: MockAccount = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "pelajar@contoh.id",
  password: "rahasia123",
  name: "Pelajar Uji",
  username: "pelajar_uji",
};

interface MockOptions {
  accounts?: MockAccount[];
  // Jawaban check_username per username; selain yang tercantum dianggap tersedia.
  usernames?: Record<string, "tersedia" | "format" | "cadangan" | "dipakai">;
  // Pengguna lain di leaderboard dan profil publik (selain akun yang login).
  others?: MockPublicUser[];
}

export interface MockPublicUser {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatarId?: string;
  totalXp?: number;
}

function dbError(message: string, details: string | null = null) {
  return { status: 400, contentType: "application/json", body: JSON.stringify({ code: "P0001", message, details, hint: null }) };
}

function base64Url(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function userJson(account: MockAccount) {
  return {
    id: account.id,
    aud: "authenticated",
    role: "authenticated",
    email: account.email,
    email_confirmed_at: account.emailConfirmed === false ? null : "2026-11-01T00:00:00Z",
    new_email: account.newEmail ?? undefined,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: account.name },
    created_at: "2026-11-01T00:00:00Z",
  };
}

function sessionJson(account: MockAccount) {
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  const accessToken = [
    base64Url({ alg: "HS256", typ: "JWT" }),
    base64Url({ sub: account.id, email: account.email, role: "authenticated", aal: "aal1", exp: expiresAt }),
    "tanda-tangan-uji",
  ].join(".");
  return {
    access_token: accessToken,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: expiresAt,
    refresh_token: `refresh-${account.id}`,
    user: userJson(account),
  };
}

function authError(status: number, code: string, msg: string) {
  return { status, contentType: "application/json", body: JSON.stringify({ code: status, error_code: code, msg }) };
}

function json(body: unknown, status = 200) {
  return { status, contentType: "application/json", body: JSON.stringify(body) };
}

// Memasang Supabase tiruan di halaman. Mengembalikan daftar permintaan yang
// diterima, agar test bisa memeriksa isi yang dikirim aplikasi.
export async function mockSupabase(page: Page, options: MockOptions = {}) {
  const accounts = options.accounts ?? [MOCK_STUDENT];
  const requests: Request[] = [];
  let signedIn: MockAccount | null = null;

  await page.route(`${SUPABASE_TEST_URL}/**`, async (route) => {
    const request = route.request();
    requests.push(request);
    const url = new URL(request.url());
    const path = url.pathname;
    const body = request.postDataJSON() as Record<string, unknown> | null;

    if (path === "/auth/v1/token" && url.searchParams.get("grant_type") === "password") {
      const account = accounts.find((item) => item.email === body?.email);
      if (!account || account.password !== body?.password) {
        return route.fulfill(authError(400, "invalid_credentials", "Invalid login credentials"));
      }
      if (account.emailConfirmed === false) {
        return route.fulfill(authError(400, "email_not_confirmed", "Email not confirmed"));
      }
      // Salinan, agar perubahan profil di satu test tidak bocor ke test lain.
      signedIn = { ...account };
      return route.fulfill(json(sessionJson(account)));
    }

    if (path === "/rest/v1/rpc/get_my_account") {
      if (!signedIn) return route.fulfill(json(null));
      return route.fulfill(
        json({
          display_name: signedIn.name,
          username: signedIn.username,
          bio: signedIn.bio ?? "",
          username_changed_at: signedIn.usernameChangedAt ?? null,
          avatar_id: signedIn.avatarId ?? null,
          theme_id: signedIn.themeId ?? null,
          status: signedIn.status ?? "active",
          roles: signedIn.roles ?? ["student"],
        })
      );
    }

    if (path === "/rest/v1/rpc/update_profile") {
      if (!signedIn) return route.fulfill(dbError("tidak_login"));
      signedIn.name = String(body?.new_display_name ?? "").trim();
      signedIn.bio = String(body?.new_bio ?? "").trim();
      return route.fulfill({ status: 204, body: "" });
    }

    if (path === "/rest/v1/rpc/set_appearance") {
      if (!signedIn) return route.fulfill(dbError("tidak_login"));
      signedIn.avatarId = String(body?.new_avatar_id ?? "");
      signedIn.themeId = String(body?.new_theme_id ?? "");
      return route.fulfill({ status: 204, body: "" });
    }

    if (path === "/rest/v1/rpc/change_username") {
      if (!signedIn) return route.fulfill(dbError("tidak_login"));
      const candidate = String(body?.new_username ?? "");
      const changedAt = signedIn.usernameChangedAt ? new Date(signedIn.usernameChangedAt).getTime() : 0;
      const nextAt = changedAt + 30 * 24 * 60 * 60 * 1000;
      if (signedIn.username && changedAt && nextAt > Date.now()) {
        return route.fulfill(dbError("username_jeda", new Date(nextAt).toISOString()));
      }
      const availability = options.usernames?.[candidate] ?? "tersedia";
      if (availability !== "tersedia") return route.fulfill(dbError(`username_${availability}`));
      signedIn.username = candidate;
      signedIn.usernameChangedAt = new Date().toISOString();
      return route.fulfill(json(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()));
    }

    // Progres dan XP dicatat server Next.js di server tiruan; browser membacanya dari sana.
    if (path === "/rest/v1/rpc/get_my_progress") return route.continue();

    if (path === "/rest/v1/rpc/get_leaderboard") {
      if (!signedIn) return route.fulfill(dbError("tidak_login"));
      const me = signedIn;
      const rows = [
        ...(options.others ?? []).map((user) => ({
          user_id: user.id,
          username: user.username,
          display_name: user.name,
          avatar_id: user.avatarId ?? null,
          total_xp: user.totalXp ?? 0,
          show_on_leaderboard: true,
          is_current_user: false,
        })),
        {
          user_id: me.id,
          username: me.username,
          display_name: me.name,
          avatar_id: me.avatarId ?? null,
          total_xp: 0,
          show_on_leaderboard: true,
          is_current_user: true,
        },
      ];
      return route.fulfill(json(rows));
    }

    if (path === "/rest/v1/rpc/get_public_profile") {
      if (!signedIn) return route.fulfill(dbError("tidak_login"));
      const candidate = String(body?.candidate ?? "").toLowerCase();
      const me = signedIn;
      const user = (options.others ?? []).find((item) => item.username.toLowerCase() === candidate);
      const row = user
        ? { username: user.username, display_name: user.name, bio: user.bio ?? "", avatar_id: user.avatarId ?? null, theme_id: null, total_xp: user.totalXp ?? 0, is_current_user: false }
        : me.username?.toLowerCase() === candidate
          ? { username: me.username, display_name: me.name, bio: me.bio ?? "", avatar_id: me.avatarId ?? null, theme_id: me.themeId ?? null, total_xp: 0, is_current_user: true }
          : null;
      return route.fulfill(json(row ? [{ ...row, lessons_completed: 0, challenges_completed: 0, profile_public: true }] : []));
    }

    if (path === "/rest/v1/rpc/check_username") {
      const candidate = String(body?.candidate ?? "");
      return route.fulfill(json(options.usernames?.[candidate] ?? "tersedia"));
    }

    if (path === "/auth/v1/signup") {
      const account: MockAccount = { id: "00000000-0000-4000-8000-000000000099", email: String(body?.email), password: "", name: "", username: null, emailConfirmed: false };
      return route.fulfill(json(userJson(account)));
    }

    if (path === "/auth/v1/recover" || path === "/auth/v1/resend") return route.fulfill(json({}));

    if (path === "/auth/v1/logout") {
      signedIn = null;
      return route.fulfill({ status: 204, body: "" });
    }

    if (path === "/auth/v1/user") {
      if (!signedIn) return route.fulfill(authError(401, "session_not_found", "Session not found"));
      if (request.method() === "PUT" && typeof body?.email === "string") signedIn.newEmail = body.email;
      return route.fulfill(json(userJson(signedIn)));
    }

    return route.fulfill(authError(404, "not_found", `Tidak ditiru: ${request.method()} ${path}`));
  });

  return {
    requests,
    // Permintaan pertama ke path tertentu, mis. "/auth/v1/signup".
    find(path: string) {
      return requests.find((request) => new URL(request.url()).pathname === path);
    },
  };
}

// Akun uji dengan id unik, agar progres XP tidak bercampur antar test yang berjalan paralel.
// Email tetap sama agar popup promosi tetap dimatikan oleh fixture.
export function uniqueMockAccount(overrides: Partial<MockAccount> = {}): MockAccount {
  return { ...MOCK_STUDENT, id: crypto.randomUUID(), ...overrides };
}
