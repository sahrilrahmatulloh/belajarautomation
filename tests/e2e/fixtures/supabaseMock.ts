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

// Masuk lewat halaman login dengan Supabase tiruan yang sudah dipasang. home: halaman tujuan
// setelah masuk, mis. "/admin" untuk akun berperan Admin.
export async function signInWithMock(page: Page, account: MockAccount, home = "/") {
  await page.goto("/login");
  await page.getByLabel("Email").fill(account.email);
  await page.getByRole("textbox", { name: "Password" }).fill(account.password);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await page.waitForURL(home);
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
  // Faktor MFA (authenticator) milik akun; kode yang diterima tiruan ini adalah MOCK_TOTP_CODE.
  factors?: MockFactor[];
  // Membership yang berlaku dari database (PRD FR-16 E); bawaannya basic.
  membership?: "basic" | "pro" | "premium";
}

// Pemberian membership yang disimpan Supabase tiruan untuk fungsi Admin.
interface MockGrant {
  id: number;
  tier: "pro" | "premium";
  source: "manual";
  reason: string;
  starts_at: string;
  ends_at: string | null;
  revoked_at: string | null;
  revoke_reason: string | null;
}

export interface MockFactor {
  id: string;
  status: "verified" | "unverified";
}

// Kode authenticator yang diterima Supabase tiruan.
export const MOCK_TOTP_CODE = "123456";
export const MOCK_TOTP_SECRET = "JBSWY3DPEHPK3PXP";

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
    factors: (account.factors ?? []).map((factor) => ({
      id: factor.id,
      friendly_name: "Authenticator Admin",
      factor_type: "totp",
      status: factor.status,
      created_at: "2026-11-01T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
    })),
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

function sessionJson(account: MockAccount, aal: "aal1" | "aal2" = "aal1") {
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  const accessToken = [
    base64Url({ alg: "HS256", typ: "JWT" }),
    base64Url({ sub: account.id, email: account.email, role: "authenticated", aal, exp: expiresAt }),
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
  // Tingkat sesi: aal2 setelah kode authenticator diverifikasi (PRD 8.3).
  let aal: "aal1" | "aal2" = "aal1";
  // Data fungsi Admin: total XP, riwayat koreksi, dan pemberian membership per pengguna.
  const xpTotals = new Map<string, number>((options.others ?? []).map((user) => [user.id, user.totalXp ?? 0]));
  const corrections = new Map<string, { amount: number; reason: string; created_at: string }[]>();
  const grants = new Map<string, MockGrant[]>();
  const activeGrants = (userId: string) =>
    (grants.get(userId) ?? []).filter((grant) => !grant.revoked_at && (!grant.ends_at || new Date(grant.ends_at) > new Date()));
  const tierOf = (userId: string, fallback: MockAccount["membership"] = "basic") => {
    const active = activeGrants(userId);
    if (active.some((grant) => grant.tier === "premium")) return "premium";
    if (active.length > 0) return "pro";
    return fallback ?? "basic";
  };

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
      aal = "aal1";
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
          membership: tierOf(signedIn.id, signedIn.membership),
        })
      );
    }

    // Fungsi Admin (PRD FR-16 C, D, E): hanya Admin dengan sesi aal2.
    if (path.startsWith("/rest/v1/rpc/admin_")) {
      if (!signedIn || !(signedIn.roles ?? []).includes("admin") || aal !== "aal2") {
        return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ code: "42501", message: "bukan_admin", details: null, hint: null }) });
      }
      const me = signedIn;
      const people = [
        { user_id: me.id, display_name: me.name, username: me.username, email: me.email, roles: me.roles ?? ["student"] },
        ...(options.others ?? []).map((user) => ({ user_id: user.id, display_name: user.name, username: user.username, email: `${user.username}@contoh.id`, roles: ["student"] })),
      ];
      const rowOf = (person: (typeof people)[number]) => ({
        ...person,
        total_xp: xpTotals.get(person.user_id) ?? 0,
        tier: tierOf(person.user_id),
        status: "active",
        created_at: "2026-11-01T00:00:00Z",
      });
      const find = (userId: unknown) => people.find((person) => person.user_id === userId);
      const reason = String(body?.p_reason ?? "").trim();

      if (path === "/rest/v1/rpc/admin_search_users") {
        const query = String(body?.p_query ?? "").toLowerCase();
        return route.fulfill(
          json(people.filter((person) => [person.display_name, person.username ?? "", person.email].some((value) => value.toLowerCase().includes(query))).map(rowOf))
        );
      }

      const person = find(body?.p_user);
      if (!person) return route.fulfill(dbError("pengguna_tidak_ditemukan"));

      if (path === "/rest/v1/rpc/admin_get_user") {
        return route.fulfill(
          json({
            ...rowOf(person),
            lessons_completed: 0,
            challenges_completed: 0,
            xp_corrections: [...(corrections.get(person.user_id) ?? [])].reverse(),
            memberships: [...(grants.get(person.user_id) ?? [])].reverse(),
          })
        );
      }

      if (reason.length < 5) return route.fulfill(dbError("alasan_wajib"));

      if (path === "/rest/v1/rpc/admin_adjust_xp") {
        const amount = Number(body?.p_amount);
        if (!Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 100000) return route.fulfill(dbError("jumlah_tidak_valid"));
        const total = (xpTotals.get(person.user_id) ?? 0) + amount;
        if (total < 0) return route.fulfill(dbError("xp_negatif"));
        xpTotals.set(person.user_id, total);
        corrections.set(person.user_id, [...(corrections.get(person.user_id) ?? []), { amount, reason, created_at: new Date().toISOString() }]);
        return route.fulfill(json(total));
      }

      if (path === "/rest/v1/rpc/admin_grant_membership") {
        const now = new Date();
        const days = body?.p_days === null || body?.p_days === undefined ? null : Number(body.p_days);
        for (const grant of activeGrants(person.user_id)) {
          grant.revoked_at = now.toISOString();
          grant.revoke_reason = "Diganti pemberian manual baru";
        }
        const list = grants.get(person.user_id) ?? [];
        list.push({
          id: list.length + 1,
          tier: body?.p_tier === "pro" ? "pro" : "premium",
          source: "manual",
          reason,
          starts_at: now.toISOString(),
          ends_at: days ? new Date(now.getTime() + days * 86400000).toISOString() : null,
          revoked_at: null,
          revoke_reason: null,
        });
        grants.set(person.user_id, list);
        return route.fulfill(json({ tier: tierOf(person.user_id), ends_at: list.at(-1)!.ends_at }));
      }

      if (path === "/rest/v1/rpc/admin_revoke_membership") {
        const active = activeGrants(person.user_id);
        if (active.length === 0) return route.fulfill(dbError("tidak_ada_membership_manual"));
        for (const grant of active) {
          grant.revoked_at = new Date().toISOString();
          grant.revoke_reason = reason;
        }
        return route.fulfill(json(tierOf(person.user_id)));
      }
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

    // MFA (PRD 8.3): daftar authenticator, tantangan, dan verifikasi kode.
    if (path === "/auth/v1/factors" && request.method() === "POST") {
      if (!signedIn) return route.fulfill(authError(401, "session_not_found", "Session not found"));
      const id = `faktor-${(signedIn.factors?.length ?? 0) + 1}`;
      signedIn.factors = [...(signedIn.factors ?? []), { id, status: "unverified" }];
      return route.fulfill(
        json({
          id,
          type: "totp",
          friendly_name: body?.friendly_name ?? "",
          totp: {
            qr_code: '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="#000"/></svg>',
            secret: MOCK_TOTP_SECRET,
            uri: `otpauth://totp/belajarautomation.com:${signedIn.email}?secret=${MOCK_TOTP_SECRET}`,
          },
        })
      );
    }

    const factorPath = path.match(/^\/auth\/v1\/factors\/([^/]+)(?:\/(challenge|verify))?$/);
    if (factorPath) {
      if (!signedIn) return route.fulfill(authError(401, "session_not_found", "Session not found"));
      const [, factorId, action] = factorPath;
      if (!action && request.method() === "DELETE") {
        signedIn.factors = (signedIn.factors ?? []).filter((factor) => factor.id !== factorId);
        return route.fulfill(json({ id: factorId }));
      }
      if (action === "challenge") {
        return route.fulfill(json({ id: `tantangan-${factorId}`, type: "totp", expires_at: Math.floor(Date.now() / 1000) + 300 }));
      }
      if (action === "verify") {
        if (body?.code !== MOCK_TOTP_CODE) return route.fulfill(authError(422, "mfa_verification_failed", "Invalid TOTP code entered"));
        signedIn.factors = (signedIn.factors ?? []).map((factor) => (factor.id === factorId ? { ...factor, status: "verified" } : factor));
        aal = "aal2";
        return route.fulfill(json(sessionJson(signedIn, "aal2")));
      }
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
