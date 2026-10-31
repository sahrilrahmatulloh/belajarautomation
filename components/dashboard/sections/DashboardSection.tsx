import ContinueLearningCard from "../cards/ContinueLearningCard";
import DashboardStats from "./DashboardStats";
import LearningRankCard from "./LearningRankCard";
import StudyCalendar from "./StudyCalendar";
import WelcomeBanner from "./WelcomeBanner";

export default function DashboardSection() {
  return (
    <div className="mx-auto grid w-full max-w-[1600px] min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(300px,1fr)] lg:gap-6">
      <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
        <WelcomeBanner />
        <LearningRankCard />
        <ContinueLearningCard />
      </div>

      <aside className="flex min-w-0 flex-col gap-5 lg:gap-6" aria-label="Ringkasan belajar">
        <StudyCalendar />
        <DashboardStats />
      </aside>
    </div>
  );
}
