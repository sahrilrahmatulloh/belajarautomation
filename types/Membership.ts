export type MembershipTier = "basic" | "pro" | "premium";

export interface MembershipPlan {
  tier: MembershipTier;
  name: string;
  tagline: string;
  // null untuk Basic (gratis).
  price: number | null;
  ebookCredits: number;
  projectCredits: number;
  highlights: string[];
  recommended?: boolean;
}
