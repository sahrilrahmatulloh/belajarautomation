import { Suspense } from "react";

import PlaygroundHeader from "./PlaygroundHeader";
import RankCard from "./RankCard";
import ChallengeGrid from "./ChallengeGrid";

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      <PlaygroundHeader />
      <RankCard />
      {/* ChallengeGrid membaca filter dari URL (useSearchParams). */}
      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat challenge...</p>}>
        <ChallengeGrid />
      </Suspense>
    </div>
  );
}