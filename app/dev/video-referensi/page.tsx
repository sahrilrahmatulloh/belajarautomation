import { notFound } from "next/navigation";

import VideoReferensi from "@/components/content/VideoReferensi";
import { DUMMY_VIDEO_REFERENSI } from "@/data/dummy/videoReferensi";
import { isDev } from "@/lib/env";

// Pratinjau komponen dengan data dummy, untuk test dan pengembangan. Hanya ada di DEV.
export default function Page() {
  if (!isDev) notFound();

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="text-2xl font-bold tracking-tight">Pratinjau Video Referensi</h1>
      {DUMMY_VIDEO_REFERENSI.map((video) => (
        <VideoReferensi key={video.id} {...video} />
      ))}
    </main>
  );
}
