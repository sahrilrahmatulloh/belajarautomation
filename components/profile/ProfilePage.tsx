"use client";

import { Suspense } from "react";

import { getCatModel } from "@/data/catModels";
import { getPublicProfile } from "@/data/dummy/publicProfiles";
import { DUMMY_PROFILE } from "@/data/dummy/profile";
import { useAccountStats, useLessonProgress } from "@/lib/lessonProgress";
import { useSession } from "@/lib/session";
import { useAppearance } from "@/lib/useAppearance";
import { useXpHistory } from "@/lib/xpHistory";

import AchievementSummary from "./AchievementSummary";
import ProfileAchievements from "./ProfileAchievements";
import ProfileActivity from "./ProfileActivity";
import ProfileCustomization from "./ProfileCustomization";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import RankProgressCard from "./RankProgressCard";
import RecentActivity from "./RecentActivity";
import ShareProfileDialog from "./ShareProfileDialog";
import XpProgressChart from "./XpProgressChart";

// Profil sendiri (PRD FR-13, acuan docs/desain/profil.webp).
export default function ProfilePage() {
  // Profil akun demo selalu ada; datanya sama dengan yang tampil di profil publik.
  const profile = getPublicProfile(DUMMY_PROFILE.username)!;
  // Nama mengikuti akun yang masuk, agar sama di semua mode (PRD FR-15).
  const session = useSession();
  const displayName = session?.name ?? profile.displayName;
  // Akun sungguhan memakai username dan Tentang saya miliknya (PRD FR-13); akun demo memakai data dummy.
  const isRealAccount = session?.source === "supabase";
  const username = isRealAccount ? (session.username ?? "") : profile.username;
  const bio = isRealAccount ? (session.bio ?? "") : profile.bio;
  const appearance = useAppearance();
  const avatarImage = isRealAccount ? appearance.avatar.image : profile.avatarImage;
  const avatarName = isRealAccount ? appearance.avatar.name : profile.avatarName;
  const themeImage = isRealAccount ? appearance.theme.image : profile.themeImage;
  const themeVideo = isRealAccount ? appearance.theme.video : profile.themeVideo;
  const catModel = isRealAccount ? getCatModel(appearance.avatar, appearance.theme) : profile.catModel;
  const { extraXp, extraLessons } = useLessonProgress();
  const stats = useAccountStats();
  // Akun Supabase memakai XP dan progres dari database; akun demo dari data dummy.
  const xp = isRealAccount ? stats.xp : profile.xp + extraXp;
  const lessons = isRealAccount ? stats.lessons : profile.lessons + extraLessons;
  const challenges = isRealAccount ? stats.challenges : profile.challenges;
  const history = useXpHistory();
  const historyReady = history.isLoaded && stats.isLoaded;

  const earnedAchievements = profile.achievements.filter((state) => state.earned).length;

  const summary = (
    <div className="space-y-6">
      <ProfileStats xp={xp} lessons={lessons} challenges={challenges} achievements={earnedAchievements} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 md:col-span-2 xl:col-span-1 [&>section]:h-full">
          {historyReady ? (
            <XpProgressChart totalXp={xp} gainsByDaysAgo={history.gainsByDaysAgo} />
          ) : (
            <section aria-label="Progres XP" className="flex h-full min-h-56 items-center justify-center rounded-2xl border border-border bg-card p-5">
              <p role="status" className="text-sm text-muted-foreground">Memuat progres XP...</p>
            </section>
          )}
        </div>
        <AchievementSummary states={profile.achievements} href="/profile?tab=pencapaian" />
        <RankProgressCard xp={xp} />
      </div>

      <RecentActivity entries={history.recent} isLoaded={historyReady} />
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileHeader
        displayName={displayName}
        username={username}
        bio={bio}
        avatarImage={avatarImage}
        avatarName={avatarName}
        themeImage={themeImage}
        themeVideo={themeVideo}
        catModel={catModel}
        xp={xp}
        isOwner
        shareAction={
          <ShareProfileDialog
            displayName={displayName}
            username={username || profile.username}
            avatarImage={avatarImage}
            themeImage={themeImage}
            xp={xp}
            lessons={lessons}
            challenges={challenges}
            achievements={earnedAchievements}
            isProfilePublic={profile.isProfilePublic}
          />
        }
      />

      {/* Tab dibaca dari URL, jadi butuh Suspense saat prerender. */}
      <Suspense fallback={summary}>
        <ProfileTabs
          panels={{
            ringkasan: summary,
            aktivitas: <ProfileActivity />,
            pencapaian: <ProfileAchievements states={profile.achievements} />,
          }}
          customization={<ProfileCustomization />}
        />
      </Suspense>
    </div>
  );
}
