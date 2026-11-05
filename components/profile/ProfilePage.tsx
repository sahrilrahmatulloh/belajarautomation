"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

import { getPublicProfile } from "@/data/dummy/publicProfiles";
import { DUMMY_PROFILE } from "@/data/dummy/profile";
import { useSession } from "@/lib/session";

import FeaturedAchievements from "./FeaturedAchievements";
import LearningProgress from "./LearningProgress";
import ProfileAchievements from "./ProfileAchievements";
import ProfileActivity from "./ProfileActivity";
import ProfileCustomization from "./ProfileCustomization";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import RecentActivity from "./RecentActivity";
import { useLessonProgress } from "@/lib/lessonProgress";

import ShareProfileDialog from "./ShareProfileDialog";

export default function ProfilePage() {
  // Profil akun demo selalu ada; datanya sama dengan yang tampil di profil publik.
  const profile = getPublicProfile(DUMMY_PROFILE.username)!;
  // Nama mengikuti akun yang masuk, agar sama di semua mode (PRD FR-15).
  const session = useSession();
  const displayName = session?.name ?? profile.displayName;
  const { extraXp, extraLessons } = useLessonProgress();
  const xp = profile.xp + extraXp;
  const lessons = profile.lessons + extraLessons;

  const earnedAchievements = profile.achievements.filter((state) => state.earned).length;

  const summary = (
    <div className="space-y-6">
      <ProfileStats
        xp={xp}
        lessons={lessons}
        challenges={profile.challenges}
        achievements={earnedAchievements}
      />

      <FeaturedAchievements featured={profile.featured} allHref="/profile?tab=pencapaian" />

      <div className="grid gap-6 lg:grid-cols-2">
        <LearningProgress />
        <RecentActivity />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileHeader
        displayName={displayName}
        username={profile.username}
        bio={profile.bio}
        avatarImage={profile.avatarImage}
        avatarName={profile.avatarName}
        themeImage={profile.themeImage}
        xp={xp}
        isOwner
        shareAction={
          <ShareProfileDialog
            displayName={displayName}
            username={profile.username}
            avatarImage={profile.avatarImage}
            themeImage={profile.themeImage}
            xp={xp}
            lessons={lessons}
            challenges={profile.challenges}
            achievements={earnedAchievements}
            isProfilePublic={profile.isProfilePublic}
          />
        }
      />

      <div className="flex justify-end">
        <Link
          href={`/u/${profile.username}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Lihat sebagai publik
        </Link>
      </div>

      {/* Tab dibaca dari URL, jadi butuh Suspense saat prerender. */}
      <Suspense fallback={summary}>
        <ProfileTabs
          panels={{
            ringkasan: summary,
            aktivitas: <ProfileActivity />,
            pencapaian: <ProfileAchievements states={profile.achievements} />,
            kustomisasi: <ProfileCustomization />,
          }}
        />
      </Suspense>
    </div>
  );
}
