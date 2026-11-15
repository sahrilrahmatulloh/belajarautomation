import { Suspense } from "react";
import { Trophy } from "lucide-react";

import FeatureBanner from "@/components/common/FeatureBanner";

import LeaderboardBoard from "./LeaderboardBoard";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <FeatureBanner
        icon={<Trophy />}
        title="Leaderboard"
        description={[
          "Peringkat belajar berdasarkan XP dari materi, kuis, dan challenge.",
          "Peringkat berdasarkan total XP dari aktivitas belajar yang valid. Pembelian tidak menambah XP.",
        ]}
      />

      {/* LeaderboardBoard membaca tab aktif dari URL (useSearchParams). */}
      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat leaderboard...</p>}>
        <LeaderboardBoard />
      </Suspense>
    </div>
  );
}
