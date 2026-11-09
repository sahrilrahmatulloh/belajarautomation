"use client";

import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";

import { DUMMY_ACCOUNTS } from "@/data/dummy/accounts";
import { isDemoLoginEnabled, isSupabaseConfigured } from "@/lib/auth/mode";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Session } from "@/types/Auth";
import { UserRole } from "@/types/Role";

// Sesi aplikasi berasal dari dua sumber:
// - Supabase Auth (akun sungguhan), jika Supabase sudah dipasang.
// - Akun demo di localStorage, hanya jika isDemoLoginEnabled (DEV, atau sebelum
//   Supabase dipasang). Sesi demo bukan proteksi akses.
// Sesi Supabase diutamakan jika keduanya ada.
const STORAGE_KEY = "belajarautomation-session";
const ROLES = ["user", "creator", "reviewer", "admin"];

let demoCache: Session | null | undefined;
let supabaseSession: Session | null = null;
// Benar setelah status login Supabase diketahui. Tanpa Supabase, langsung benar.
let supabaseReady = !isSupabaseConfigured;
let combined: Session | null | undefined;
let started = false;
let loadedUserId: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  combined = undefined;
  listeners.forEach((listener) => listener());
}

// ---------------------------------------------------------------------------
// Sesi demo
// ---------------------------------------------------------------------------

function readDemoSession(): Session | null {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");

    if (
      parsed &&
      typeof parsed === "object" &&
      "name" in parsed &&
      "email" in parsed &&
      "role" in parsed &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.role === "string" &&
      ROLES.includes(parsed.role)
    ) {
      // Sesi lama belum menyimpan id pengguna dan daftar peran.
      const session = parsed as Session;
      const account = DUMMY_ACCOUNTS.find((item) => item.email === session.email);
      return {
        ...session,
        source: "demo",
        userId: session.userId ?? account?.userId,
        roles: Array.isArray(session.roles) ? session.roles : (account?.roles ?? ["user", session.role]),
      };
    }
  } catch {
    // Data rusak atau penyimpanan tidak tersedia.
  }
  return null;
}

function getDemoSession() {
  if (!isDemoLoginEnabled) return null;
  if (demoCache === undefined) demoCache = readDemoSession();
  return demoCache;
}

function writeDemoSession(session: Session | null) {
  try {
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Penyimpanan tidak tersedia; sesi hanya bertahan di memori.
  }
  demoCache = session;
  emit();
}

// ---------------------------------------------------------------------------
// Sesi Supabase
// ---------------------------------------------------------------------------

interface AccountRow {
  display_name: string;
  username: string | null;
  bio?: string;
  username_changed_at?: string | null;
  avatar_id?: string | null;
  theme_id?: string | null;
  status: "active" | "deactivated";
  roles: ("student" | "creator" | "reviewer" | "admin")[];
  membership?: "basic" | "pro" | "premium";
}

// Peran tambahan yang dipakai sebagai mode awal, jika punya lebih dari satu.
const ROLE_PRIORITY: UserRole[] = ["admin", "reviewer", "creator"];

function toSession(user: User, row: AccountRow): Session {
  // Di database peran dasar bernama "student"; di aplikasi masih "user".
  const extraRoles = ROLE_PRIORITY.filter((role) => (row.roles as string[]).includes(role));
  const roles: UserRole[] = ["user", ...extraRoles];
  return {
    source: "supabase",
    userId: user.id,
    name: row.display_name || (user.email ?? "").split("@")[0],
    email: user.email ?? "",
    username: row.username,
    bio: row.bio ?? "",
    usernameChangedAt: row.username_changed_at ?? null,
    pendingEmail: user.new_email ?? null,
    avatarId: row.avatar_id ?? null,
    themeId: row.theme_id ?? null,
    membership: row.membership ?? "basic",
    role: extraRoles[0] ?? "user",
    roles,
  };
}

export type AccountLoadResult =
  | { status: "ok"; session: Session }
  | { status: "deactivated" }
  | { status: "missing" };

// Membaca profil dan peran akun yang sedang login. Akun nonaktif langsung dikeluarkan.
export async function loadSupabaseAccount(user: User): Promise<AccountLoadResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return { status: "missing" };

  const { data, error } = await client.rpc("get_my_account");
  const row = data as AccountRow | null;
  if (error || !row) return { status: "missing" };

  if (row.status === "deactivated") {
    await client.auth.signOut();
    setSupabaseSession(null);
    return { status: "deactivated" };
  }

  const session = toSession(user, row);
  loadedUserId = user.id;
  setSupabaseSession(session);
  return { status: "ok", session };
}

// Memuat ulang data akun setelah pengguna mengubah profil atau email.
export async function refreshSupabaseAccount(): Promise<AccountLoadResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return { status: "missing" };
  const { data } = await client.auth.getUser();
  if (!data.user) return { status: "missing" };
  return loadSupabaseAccount(data.user);
}

function setSupabaseSession(session: Session | null) {
  supabaseSession = session;
  if (!session) loadedUserId = null;
  supabaseReady = true;
  emit();
}

function hasSupabaseCookie() {
  return document.cookie.split(";").some((item) => item.trim().startsWith("sb-"));
}

function startSupabase() {
  if (started) return;
  started = true;
  const client = getSupabaseBrowserClient();
  if (!client) return;

  // Tamu tanpa cookie sesi tidak perlu menunggu Supabase.
  if (!hasSupabaseCookie()) {
    supabaseReady = true;
    emit();
  }

  client.auth.onAuthStateChange((_event, authSession) => {
    // Panggilan Supabase lain tidak boleh dijalankan langsung di dalam callback ini.
    setTimeout(() => {
      const user = authSession?.user ?? null;
      if (!user) {
        setSupabaseSession(null);
        return;
      }
      if (user.id === loadedUserId && supabaseSession) return;
      void loadSupabaseAccount(user).then((result) => {
        if (result.status === "missing") setSupabaseSession(null);
      });
    }, 0);
  });
}

// ---------------------------------------------------------------------------
// Hook dan aksi
// ---------------------------------------------------------------------------

function getSnapshot() {
  if (combined === undefined) combined = supabaseSession ?? getDemoSession();
  return combined;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  startSupabase();

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      demoCache = undefined;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

// Benar setelah status login diketahui. Penjaga halaman menunggu nilai ini
// agar pengguna yang sudah login tidak sempat diarahkan ke /login.
export function useSessionReady() {
  return useSyncExternalStore(subscribe, () => supabaseReady, () => false);
}

export const sessionActions = {
  // Hanya untuk akun demo. Akun Supabase masuk lewat lib/auth/supabaseAuth.ts.
  signIn(session: Session) {
    writeDemoSession({ ...session, source: "demo" });
  },
  signOut() {
    const client = getSupabaseBrowserClient();
    if (client && supabaseSession) {
      setSupabaseSession(null);
      void client.auth.signOut();
    }
    writeDemoSession(null);
  },
};
