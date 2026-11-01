import { Suspense } from "react";

import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { DUMMY_EARNED_ACHIEVEMENTS } from "@/data/dummy/userAchievements";
import { getCompletedLessonCount } from "@/lib/learningProgress";

import FeaturedAchievements from "./FeaturedAchievements";
import LearningProgress from "./LearningProgress";
import ProfileAchievements from "./ProfileAchievements";
import ProfileActivity from "./ProfileActivity";
import ProfileCustomization from "./ProfileCustomization";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import RecentActivity from "./RecentActivity";

export default function ProfilePage() {
  const summary = (
    <div className="space-y-6">
      <ProfileStats
        xp={DUMMY_ACCOUNT.xp}
        lessons={getCompletedLessonCount()}
        challenges={DUMMY_ACCOUNT.completedChallenges}
        achievements={DUMMY_EARNED_ACHIEVEMENTS.length}
      />

      <FeaturedAchievements />

      <div className="grid gap-6 lg:grid-cols-2">
        <LearningProgress />
        <RecentActivity />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileHeader />

      {/* Tab dibaca dari URL, jadi butuh Suspense saat prerender. */}
      <Suspense fallback={summary}>
        <ProfileTabs
          panels={{
            ringkasan: summary,
            aktivitas: <ProfileActivity />,
            pencapaian: <ProfileAchievements />,
            kustomisasi: <ProfileCustomization />,
          }}
        />
      </Suspense>
    </div>
  );
}
