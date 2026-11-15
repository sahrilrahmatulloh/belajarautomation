import { Suspense } from "react";

import ChallengeGrid from "./ChallengeGrid";
import PlaygroundBanner from "./PlaygroundBanner";

export default function PlaygroundPage() {
  return (
    <div className="space-y-5">
      <PlaygroundBanner />
      {/* ChallengeGrid membaca filter dari URL (useSearchParams). */}
      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat latihan...</p>}>
        <ChallengeGrid />
      </Suspense>
    </div>
  );
}
