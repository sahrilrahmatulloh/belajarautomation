import { Suspense } from "react";

import ChallengeGrid from "./ChallengeGrid";
import PlaygroundBanner from "./PlaygroundBanner";
import PlaygroundInfo from "./PlaygroundInfo";

export default function PlaygroundPage() {
  return (
    <div className="space-y-5">
      <PlaygroundBanner />
      <PlaygroundInfo />
      {/* ChallengeGrid membaca filter dari URL (useSearchParams). */}
      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat latihan...</p>}>
        <ChallengeGrid />
      </Suspense>
    </div>
  );
}
