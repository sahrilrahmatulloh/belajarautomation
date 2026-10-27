import WelcomeBanner from "@/components/dashboard/sections/WelcomeBanner";
import CategorySection from "@/components/dashboard/sections/CategorySection";
import RoadmapCard from "@/components/roadmap/RoadmapCard";

import ProgressCard from "../cards/ProgressCard";
import ContinueLearningCard from "../cards/ContinueLearningCard";
import ActivityCard from "../cards/ActivityCard";

import BooksSection from "./BooksSection";
import PremiumSection from "./PremiumSection";
import { ROADMAPS } from "@/data/roadmap";

export default function DashboardSection() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-8">
        <WelcomeBanner />
      </div>

      <div className="min-w-0 lg:col-span-4">
        <RoadmapCard roadmap={ROADMAPS[0]} />
      </div>

      <div className="min-w-0 lg:col-span-4">
        <ProgressCard />
      </div>

      <div className="min-w-0 lg:col-span-4">
        <ContinueLearningCard />
      </div>

      <div className="min-w-0 lg:col-span-4">
        <ActivityCard />
      </div>

      <div className="min-w-0 lg:col-span-12">
        <CategorySection />
      </div>

      <div className="min-w-0 lg:col-span-12">
        <BooksSection />
      </div>

      <div className="min-w-0 lg:col-span-12">
        <PremiumSection />
      </div>
    </div>
  );
}