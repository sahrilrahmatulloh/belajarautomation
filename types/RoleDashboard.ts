import { MembershipTier } from "./Membership";
import { UserRole } from "./Role";

// Tanggal disimpan sebagai string ISO (YYYY-MM-DD).

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
