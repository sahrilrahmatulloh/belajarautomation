"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { DEFAULT_AVATAR_ID, getAvatar } from "@/data/avatars";
import { ACHIEVEMENTS } from "@/data/achievements";
import { PublicProfile } from "@/data/dummy/publicProfiles";
import { DEFAULT_THEME_ID, getTheme } from "@/data/themes";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

import PublicProfilePage from "./PublicProfilePage";

// Profil publik akun sungguhan (PRD FR-13), dari fungsi database get_public_profile.
// Hanya untuk pengguna yang login; akun nonaktif dan username yang tidak ada menampilkan
// "Profil tidak ditemukan".

interface PublicProfileDbRow {
  username: string;
  display_name: string;
  bio: string;
  avatar_id: string | null;
  theme_id: string | null;
  total_xp: number;
  lessons_completed: number;
  challenges_completed: number;
  profile_public: boolean;
  is_current_user: boolean;
}

function toPublicProfile(row: PublicProfileDbRow): PublicProfile {
  const avatar = getAvatar(row.avatar_id ?? DEFAULT_AVATAR_ID) ?? getAvatar(DEFAULT_AVATAR_ID)!;
  const theme = getTheme(row.theme_id ?? DEFAULT_THEME_ID) ?? getTheme(DEFAULT_THEME_ID)!;
  // Achievement belum dihitung di backend; semua ditampilkan belum diperoleh.
  const achievements = ACHIEVEMENTS.map((achievement) => ({ achievement, earned: undefined, progress: undefined }));
  return {
    username: row.username,
    displayName: row.display_name || row.username,
    bio: row.bio,
    avatarImage: avatar.image,
    avatarName: avatar.name,
    themeImage: theme.image,
    themeVideo: theme.video,
    xp: row.total_xp,
    isProfilePublic: row.profile_public,
    isCurrentUser: row.is_current_user,
    lessons: row.lessons_completed,
    challenges: row.challenges_completed,
    achievements,
    featured: [],
  };
}

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; profile: PublicProfile };

export default function RealPublicProfile({ username }: { username: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- tanpa Supabase, profil di luar data dummy tidak ada
      setState({ status: "missing" });
      return;
    }
    let cancelled = false;
    void client.rpc("get_public_profile", { candidate: username }).then(({ data, error }) => {
      if (cancelled) return;
      const row = Array.isArray(data) ? (data[0] as PublicProfileDbRow | undefined) : undefined;
      setState(error || !row ? { status: "missing" } : { status: "ready", profile: toPublicProfile(row) });
    });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (state.status === "loading") {
    return (
      <p role="status" className="py-16 text-center text-sm text-muted-foreground">
        Memuat profil...
      </p>
    );
  }

  if (state.status === "missing") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Profil tidak ditemukan</h1>
        <Link href="/leaderboard" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">
          Kembali ke Leaderboard
        </Link>
      </div>
    );
  }

  return <PublicProfilePage profile={state.profile} />;
}
