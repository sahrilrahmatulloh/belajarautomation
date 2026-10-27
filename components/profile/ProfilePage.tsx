import LearningProgress from "./LearningProgress";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import RecentActivity from "./RecentActivity";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileHeader />

      <ProfileStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <LearningProgress />
        <RecentActivity />
      </div>
    </div>
  );
}