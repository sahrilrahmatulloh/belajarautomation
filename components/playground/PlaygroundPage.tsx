import PlaygroundHeader from "./PlaygroundHeader";
import RankCard from "./RankCard";
import ChallengeGrid from "./ChallengeGrid";

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      <PlaygroundHeader />
      <RankCard />
      <ChallengeGrid />
    </div>
  );
}