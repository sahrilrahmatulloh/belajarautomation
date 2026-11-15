import { GraduationCap } from "lucide-react";

import FeatureBanner from "@/components/common/FeatureBanner";

export default function LearnHeader() {
  return (
    <FeatureBanner
      icon={<GraduationCap />}
      title="Belajar QA Automation"
      description="Pilih teknologi dan skill yang ingin kamu kuasai."
    />
  );
}
