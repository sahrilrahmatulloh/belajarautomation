"use client";

import AdminProfilePage from "@/components/admin/AdminProfilePage";
import CreatorProfilePage from "@/components/creator/CreatorProfilePage";
import ReviewerProfilePage from "@/components/reviewer/ReviewerProfilePage";
import { useViewMode } from "@/lib/viewMode";

// Profil mengikuti mode aktif (PRD FR-15). Profil pelajar dikirim sebagai children. Mode peran
// (Creator, Reviewer, Admin) memakai profil perannya tanpa foto.
export default function ProfileByMode({ children }: { children: React.ReactNode }) {
  const { isRoleMode, activeRole } = useViewMode();

  if (!isRoleMode) return children;
  if (activeRole === "reviewer") return <ReviewerProfilePage />;
  if (activeRole === "admin") return <AdminProfilePage />;
  return <CreatorProfilePage />;
}
