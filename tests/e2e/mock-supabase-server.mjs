// Server Supabase tiruan untuk test e2e. Melayani panggilan dari server Next.js (Server Action,
// proxy) yang tidak bisa ditiru dengan page.route di browser:
// - GET  /auth/v1/user                  : pengguna dari token JWT tiruan (tanpa verifikasi tanda tangan).
// - POST /rest/v1/rpc/record_lesson_completion, record_challenge_attempt : logika XP seperti di
//   supabase/migrations/20261109090000_xp_progress.sql, disimpan di memori per pengguna.
// - POST /rest/v1/rpc/get_my_progress   : progres pengguna dari token (diteruskan dari browser).
// - GET  /rest/v1/xp_transactions       : riwayat XP milik pengguna dari token, terbaru lebih dulu
//   (seperti RLS di database; diteruskan dari browser untuk Ringkasan profil).
// Jalankan: node tests/e2e/mock-supabase-server.mjs (otomatis lewat playwright.config.ts).
import http from "node:http";

const PORT = Number(process.env.MOCK_SUPABASE_PORT ?? 54399);
const SERVICE_ROLE_KEY = process.env.MOCK_SUPABASE_SERVICE_ROLE_KEY ?? "service-role-uji";

/** @type {Map<string, {lessons: Map<string, string>, attempts: {slug: string, score: number, passed: boolean, at: string}[], xp: Set<string>, transactions: {id: number, source_type: string, source_id: string, xp: number, created_at: string}[], totalXp: number, lessonsCompleted: number, challengesCompleted: number}>} */
const users = new Map();
let nextTransactionId = 1;

function userState(id) {
  if (!users.has(id)) {
    users.set(id, { lessons: new Map(), attempts: [], xp: new Set(), transactions: [], totalXp: 0, lessonsCompleted: 0, challengesCompleted: 0 });
  }
  return users.get(id);
}

function decodeJwt(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return payload && typeof payload.sub === "string" ? payload : null;
  } catch {
    return null;
  }
}

function bearer(req) {
  const header = req.headers.authorization ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function addXp(state, type, source, xp) {
  const key = `${type}:${source}`;
  if (xp <= 0 || state.xp.has(key)) return 0;
  state.xp.add(key);
  state.totalXp += xp;
  state.transactions.push({ id: nextTransactionId++, source_type: type, source_id: source, xp, created_at: new Date().toISOString() });
  return xp;
}

function send(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "*",
  });
  res.end(body === undefined ? "" : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function progressOf(id) {
  const state = userState(id);
  const bySlug = new Map();
  for (const attempt of state.attempts) {
    const current = bySlug.get(attempt.slug) ?? { slug: attempt.slug, passed: false, best_score: 0, last_score: 0, attempts: 0 };
    current.passed ||= attempt.passed;
    current.best_score = Math.max(current.best_score, attempt.score);
    current.last_score = attempt.score;
    current.attempts += 1;
    bySlug.set(attempt.slug, current);
  }
  return {
    total_xp: state.totalXp,
    lessons_completed: state.lessonsCompleted,
    challenges_completed: state.challengesCompleted,
    lessons: [...state.lessons].map(([key, at]) => {
      const [course_slug, lesson_slug] = key.split("/");
      return { course_slug, lesson_slug, completed_at: at };
    }),
    challenges: [...bySlug.values()],
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  if (req.method === "OPTIONS") return send(res, 204);
  if (url.pathname === "/health") return send(res, 200, { ok: true });

  // Khusus test: menetapkan total XP awal pengguna, mis. untuk menguji naik rank.
  if (url.pathname === "/__test/seed" && req.method === "POST") {
    const body = await readBody(req);
    if (typeof body.user !== "string") return send(res, 400, { message: "user wajib diisi" });
    userState(body.user).totalXp = Number(body.totalXp ?? 0);
    return send(res, 200, { ok: true });
  }

  const token = bearer(req);
  const isServiceRole = token === SERVICE_ROLE_KEY || req.headers.apikey === SERVICE_ROLE_KEY;

  if (url.pathname === "/auth/v1/user" && req.method === "GET") {
    const payload = decodeJwt(token);
    if (!payload) return send(res, 401, { code: 401, error_code: "bad_jwt", msg: "invalid JWT" });
    return send(res, 200, { id: payload.sub, aud: "authenticated", role: "authenticated", email: payload.email ?? "" });
  }

  if (url.pathname === "/rest/v1/rpc/get_my_progress") {
    const payload = decodeJwt(token);
    if (!payload) return send(res, 401, { code: "42501", message: "permission denied" });
    return send(res, 200, progressOf(payload.sub));
  }

  if (url.pathname === "/rest/v1/xp_transactions" && req.method === "GET") {
    const payload = decodeJwt(token);
    if (!payload) return send(res, 401, { code: "42501", message: "permission denied" });
    const limit = Number(url.searchParams.get("limit") ?? 1000);
    const rows = [...userState(payload.sub).transactions].reverse().slice(0, limit);
    return send(res, 200, rows);
  }

  if (url.pathname === "/rest/v1/rpc/record_lesson_completion") {
    if (!isServiceRole) return send(res, 401, { code: "42501", message: "permission denied" });
    const body = await readBody(req);
    const state = userState(body.p_user);
    const key = `${body.p_course}/${body.p_lesson}`;
    const isNew = !state.lessons.has(key);
    let lessonXp = 0;
    let courseXp = 0;
    if (isNew) {
      state.lessons.set(key, new Date().toISOString());
      state.lessonsCompleted += 1;
      lessonXp = addXp(state, "lesson", key, body.p_lesson_xp);
    }
    const doneInCourse = [...state.lessons.keys()].filter((item) => item.startsWith(`${body.p_course}/`)).length;
    if (body.p_course_lesson_count > 0 && doneInCourse >= body.p_course_lesson_count) {
      courseXp = addXp(state, "course", body.p_course, body.p_course_xp);
    }
    return send(res, 200, {
      is_new: isNew,
      xp_awarded: lessonXp + courseXp,
      course_bonus: courseXp > 0,
      total_xp: state.totalXp,
      lessons_completed: state.lessonsCompleted,
    });
  }

  if (url.pathname === "/rest/v1/rpc/record_challenge_attempt") {
    if (!isServiceRole) return send(res, 401, { code: "42501", message: "permission denied" });
    const body = await readBody(req);
    const state = userState(body.p_user);
    const firstPass = Boolean(body.p_passed) && !state.attempts.some((item) => item.slug === body.p_slug && item.passed);
    state.attempts.push({ slug: body.p_slug, score: body.p_score, passed: Boolean(body.p_passed), at: new Date().toISOString() });
    let awarded = 0;
    if (firstPass) {
      state.challengesCompleted += 1;
      awarded = addXp(state, body.p_type === "quiz" ? "quiz" : "challenge", body.p_slug, body.p_xp);
    }
    return send(res, 200, { first_pass: firstPass, xp_awarded: awarded, total_xp: state.totalXp, challenges_completed: state.challengesCompleted });
  }

  return send(res, 404, { code: "PGRST404", message: `Tidak ditiru: ${req.method} ${url.pathname}` });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Supabase tiruan berjalan di http://127.0.0.1:${PORT}`);
});
