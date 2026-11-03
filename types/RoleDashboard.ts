import { ContentStatus, ContentType } from "./Content";
import { MembershipTier } from "./Membership";
import { UserRole } from "./Role";

// Tanggal disimpan sebagai string ISO (YYYY-MM-DD).

export interface DraftVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  language: string;
  // Hanya terlihat oleh Reviewer.
  reason: string;
}

export interface DraftImage {
  fileName: string;
  alt: string;
  caption: string;
}

export interface ArticleDraft {
  excerpt: string;
  cover: string;
  cta: string;
  sources: string;
  body: string;
  videos: DraftVideo[];
}

export interface CreatorContent {
  id: number;
  title: string;
  type: ContentType;
  status: ContentStatus;
  updatedAt: string;
  category: string;
  reviewerName?: string;
  // Alamat di website untuk konten yang sudah terbit.
  publicHref?: string;
  article?: ArticleDraft;
}

// Catatan revisi per konten: catatan umum atau catatan yang terhubung ke bagian tertentu (PRD FR-15).
export interface RevisionThread {
  contentId: number;
  reviewerName: string;
  date: string;
  notes: { id: string; section: string; message: string }[];
}

export interface RevisionNote {
  id: number;
  contentTitle: string;
  reviewerName: string;
  summary: string;
  date: string;
}

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
