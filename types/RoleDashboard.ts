import { ContentType } from "./Content";
import { MembershipTier } from "./Membership";
import { UserRole } from "./Role";

// Tanggal disimpan sebagai string ISO (YYYY-MM-DD).

export type ReviewPriority = "Tinggi" | "Sedang" | "Rendah";

export interface ReviewQueueItem {
  id: number;
  title: string;
  type: ContentType;
  creatorName: string;
  submittedAt: string;
  priority: ReviewPriority;
}

export interface ReviewActivity {
  id: number;
  title: string;
  creatorName: string;
  result: "approved" | "needs-revision";
  date: string;
}

export interface AdminStats {
  totalUsers: number;
  proUsers: number;
  premiumUsers: number;
  publishedContent: number;
  pendingReview: number;
  transactionsThisMonth: number;
  pendingTransactions: number;
}

export interface AdminRecentUser {
  id: number;
  name: string;
  maskedEmail: string;
  role: UserRole;
  membership: MembershipTier;
  joinedAt: string;
}

export interface AdminActivityLog {
  id: number;
  message: string;
  time: string;
}
