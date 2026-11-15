import { Library } from "lucide-react";

import FeatureBanner from "@/components/common/FeatureBanner";

export default function BooksHeader() {
  return (
    <FeatureBanner
      icon={<Library />}
      title="eBook"
      description="eBook praktis untuk meningkatkan skill QA Automation."
    />
  );
}
