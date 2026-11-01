import { Suspense } from "react";
import { Trophy } from "lucide-react";

import LearningProgress from "./LearningProgress";
import ProfileActivity from "./ProfileActivity";
import ProfileCustomization from "./ProfileCustomization";
import ProfileHeader from "./ProfileHeader";
import ProfilePlaceholder from "./ProfilePlaceholder";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import RecentActivity from "./RecentActivity";

export default function ProfilePage() {
  const summary = (
    <div className="space-y-6">
      <ProfileStats />

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
            pencapaian: (
              <ProfilePlaceholder
                icon={Trophy}
                title="Achievement segera hadir"
                description="Achievement dari aktivitas belajar akan tampil di sini, dikelompokkan per kategori. Achievement tidak memberikan XP."
              />
            ),
            kustomisasi: <ProfileCustomization />,
          }}
        />
      </Suspense>
    </div>
  );
}
