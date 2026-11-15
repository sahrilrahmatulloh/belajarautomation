import { FlaskConical } from "lucide-react";

import FeatureBanner from "@/components/common/FeatureBanner";

export default function PlaygroundBanner() {
  return (
    <FeatureBanner
      icon={<FlaskConical />}
      title="QA Automation Playground"
      description={[
        "Latih skill QA dan automation melalui challenge interaktif.",
        "Latihan boleh diulang kapan saja. XP hanya diberikan saat kamu lulus untuk pertama kalinya.",
      ]}
    />
  );
}
