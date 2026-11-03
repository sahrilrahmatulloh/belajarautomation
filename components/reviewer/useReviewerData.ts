"use client";

import { useContentData } from "@/lib/content";
import { useSession } from "@/lib/session";
import { ContentItem, StatusEvent } from "@/types/ContentWorkflow";

const DAY_MS = 86_400_000;

export interface ReviewerData {
  contents: ContentItem[];
  users: { id: string; name: string }[];
  events: StatusEvent[];
  loadedAt: number;
}

export function useReviewerData() {
  const session = useSession();
  const userId = session?.userId ?? "";

  const data = useContentData<ReviewerData>(`reviewer-${userId}`, async (repository) => {
    const [contents, users, events] = await Promise.all([repository.listContents(), repository.listUsers(), repository.listStatusEvents()]);
    return { contents, users, events, loadedAt: Date.now() };
  });

  return { userId, data };
}

// Keputusan yang pernah dibuat Reviewer ini, terbaru lebih dulu.
export function ownDecisions(events: StatusEvent[], userId: string) {
  return events.filter((event) => event.actorId === userId && (event.action === "setujui" || event.action === "minta-revisi")).reverse();
}

export function reviewQueues({ contents, events }: Pick<ReviewerData, "contents" | "events">, userId: string) {
  const waiting = contents
    .filter((content) => content.status === "menunggu-review")
    // Paling lama menunggu di atas.
    .sort((a, b) => (a.submittedAt ?? "").localeCompare(b.submittedAt ?? ""));
  const decidedIds = new Set(ownDecisions(events, userId).map((event) => event.contentId));

  return {
    assigned: waiting.filter((content) => content.reviewerId === userId),
    unassigned: waiting.filter((content) => !content.reviewerId),
    history: contents.filter((content) => decidedIds.has(content.id)),
  };
}

export function waitingDays(content: ContentItem, now: number) {
  return content.submittedAt ? Math.max(0, Math.floor((now - Date.parse(content.submittedAt)) / DAY_MS)) : 0;
}

export function submissionLabel(count: number) {
  return count <= 1 ? "Pertama" : `Ulang (ke-${count})`;
}
