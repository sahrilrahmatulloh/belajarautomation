"use client";

import { useCallback, useEffect, useState } from "react";

import { useSession } from "@/lib/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type MfaStatus =
  | { status: "demo" }
  | { status: "loading" }
  | { status: "aktif"; factorId: string; since: string }
  | { status: "belum" };

// Status verifikasi dua langkah Admin (PRD FR-16 L, 8.3). Akun demo DEV tidak memakainya.
export function useMfaStatus() {
  const session = useSession();
  const isReal = session?.source === "supabase";
  const [state, setState] = useState<MfaStatus>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!isReal || !client) return;
    let active = true;
    void client.auth.mfa.listFactors().then(({ data }) => {
      if (!active) return;
      const factor = data?.totp.find((item) => item.status === "verified");
      setState(factor ? { status: "aktif", factorId: factor.id, since: factor.created_at } : { status: "belum" });
    });
    return () => {
      active = false;
    };
  }, [isReal, attempt]);

  const refresh = useCallback(() => setAttempt((value) => value + 1), []);
  return { mfa: isReal ? state : ({ status: "demo" } as MfaStatus), refresh };
}

// Inisial nama untuk identitas Admin tanpa foto, mis. "Admin Belajar" menjadi "AB".
export function initialsOf(name: string | undefined) {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "A";
  return (words.length === 1 ? words[0].slice(0, 2) : `${words[0][0]}${words[words.length - 1][0]}`).toUpperCase();
}
