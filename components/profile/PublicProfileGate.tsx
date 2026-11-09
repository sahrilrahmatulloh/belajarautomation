"use client";

import Link from "next/link";

import { PublicProfile } from "@/data/dummy/publicProfiles";
import { useInactiveUsers, useLeaderboardOverlay, usePublicProfileUserId } from "@/lib/content";

import PublicProfilePage from "./PublicProfilePage";

// Profil akun nonaktif tidak tampil, walaupun datanya tetap ada (PRD FR-16 C).
export default function PublicProfileGate({ profile }: { profile: PublicProfile }) {
  const inactive = useInactiveUsers();
  const { xpOverrides } = useLeaderboardOverlay();
  const user = usePublicProfileUserId(profile.username);

  if (inactive.some((user) => user.username === profile.username)) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Profil tidak ditemukan</h1>
        <Link href="/leaderboard" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">Kembali ke Leaderboard</Link>
      </div>
    );
  }

  return <PublicProfilePage profile={user && xpOverrides[user] !== undefined ? { ...profile, xp: xpOverrides[user] } : profile} />;
}
