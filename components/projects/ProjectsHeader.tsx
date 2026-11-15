import { FolderKanban } from "lucide-react";

import FeatureBanner from "@/components/common/FeatureBanner";

export default function ProjectsHeader() {
  return (
    <FeatureBanner
      icon={<FolderKanban />}
      title="Project"
      description={[
        "Bangun portfolio melalui project QA Automation berbasis studi kasus nyata.",
        "Project akan tersedia secara bertahap.",
      ]}
    />
  );
}
