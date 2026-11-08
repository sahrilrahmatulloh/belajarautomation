"use client";

import { useEffect, useState } from "react";

import { DEFAULT_AVATAR_ID } from "@/data/avatars";
import { CURRENT_USER_ID, Participant } from "@/lib/leaderboard";
import { useSession } from "@/lib/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Leaderboard akun Supabase (PRD FR-06), dari fungsi database get_leaderboard.
// Akun demo dan tamu memakai data dummy (lib/leaderboard.ts).

interface LeaderboardDbRow {
  user_id: string;
  username: string;
  display_name: string;
  avatar_id: string | null;
  total_xp: number;
  show_on_leaderboard: boolean;
  is_current_user: boolean;
}

export interface RealLeaderboard {
  status: "loading" | "ready" | "error";
  currentUser: Participant | null;
  showCurrentUser: boolean;
  pool: (Participant & { showOnLeaderboard: boolean })[];
}

const LOADING: RealLeaderboard = { status: "loading", currentUser: null, showCurrentUser: true, pool: [] };

// Mengembalikan null untuk akun demo dan tamu.
export function useRealLeaderboard(): RealLeaderboard | null {
  const session = useSession();
  const isReal = session?.source === "supabase";
  const [state, setState] = useState<RealLeaderboard>(LOADING);

  useEffect(() => {
    if (!isReal) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let cancelled = false;
    void client.rpc("get_leaderboard").then(({ data, error }) => {
      if (cancelled) return;
      if (error || !Array.isArray(data)) {
        setState({ ...LOADING, status: "error" });
        return;
      }
      const rows = data as LeaderboardDbRow[];
      const toParticipant = (row: LeaderboardDbRow): Participant => ({
        id: row.is_current_user ? CURRENT_USER_ID : row.user_id,
        username: row.username,
        displayName: row.display_name || row.username,
        avatarId: row.avatar_id ?? DEFAULT_AVATAR_ID,
        totalXp: row.total_xp,
      });
      const own = rows.find((row) => row.is_current_user);
      setState({
        status: "ready",
        currentUser: own ? toParticipant(own) : null,
        showCurrentUser: own?.show_on_leaderboard ?? true,
        pool: rows.filter((row) => !row.is_current_user).map((row) => ({ ...toParticipant(row), showOnLeaderboard: true })),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [isReal, session?.userId]);

  return isReal ? state : null;
}
