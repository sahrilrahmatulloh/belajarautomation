"use client";

import { useContentData } from "@/lib/content";
import { useSession } from "@/lib/session";
import { ContentItem } from "@/types/ContentWorkflow";

import { waitingDays } from "@/components/reviewer/useReviewerData";

// Batas review yang dianggap terlalu lama menunggu (PRD FR-15).
export const LONG_WAIT_DAYS = 3;

export function useAdminData() {
  const session = useSession();
  const userId = session?.userId ?? "";

  const data = useContentData("admin", async (repository) => {
    const [contents, users, events, roleEvents] = await Promise.all([
      repository.listContents(),
      repository.listUsers(),
      repository.listStatusEvents(),
      repository.listRoleEvents(),
    ]);
    return { contents, users, events, roleEvents, loadedAt: Date.now() };
  });

  return { userId, data };
}

export function isLongWaiting(content: ContentItem, now: number) {
  return content.status === "menunggu-review" && waitingDays(content, now) > LONG_WAIT_DAYS;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date(iso));
}
