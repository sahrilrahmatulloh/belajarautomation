"use client";

import { useContentData } from "@/lib/content";
import { useSession } from "@/lib/session";
import { ContentItem, ContentUser } from "@/types/ContentWorkflow";
import { MembershipTier } from "@/types/Membership";

import { waitingDays } from "@/components/reviewer/useReviewerData";

// Batas review yang dianggap terlalu lama menunggu (PRD FR-15).
export const LONG_WAIT_DAYS = 3;
export const NEW_USER_DAYS = 7;

export const MEMBERSHIP_LABELS: Record<MembershipTier, string> = { basic: "Basic", pro: "Pro", premium: "Premium" };

const DAY_MS = 86_400_000;

export function isToday(iso: string, now: number) {
  return new Date(iso).toDateString() === new Date(now).toDateString();
}

export function isNewUser(user: ContentUser, now: number) {
  return now - Date.parse(user.joinedAt) < NEW_USER_DAYS * DAY_MS;
}

export function useAdminData() {
  const session = useSession();
  const userId = session?.userId ?? "";

  const data = useContentData("admin", async (repository) => {
    const [contents, users, events, roleEvents, agreements, auditLog, transactions, entitlements, claims, products] = await Promise.all([
      repository.listContents(),
      repository.listUsers(),
      repository.listStatusEvents(),
      repository.listRoleEvents(),
      repository.listAgreements(),
      repository.listAuditLog(),
      repository.listTransactions(),
      repository.listEntitlements(),
      repository.listClaims(),
      repository.listProducts(),
    ]);
    return { contents, users, events, roleEvents, agreements, auditLog, transactions, entitlements, claims, products, loadedAt: Date.now() };
  });

  return { userId, data };
}

export function isLongWaiting(content: ContentItem, now: number) {
  return content.status === "menunggu-review" && waitingDays(content, now) > LONG_WAIT_DAYS;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date(iso));
}
