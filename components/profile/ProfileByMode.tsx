"use client";

import { useViewMode } from "@/lib/viewMode";

import RoleProfile from "./RoleProfile";

// Profil mengikuti mode aktif (PRD FR-15). Profil pelajar dikirim sebagai children.
export default function ProfileByMode({ children }: { children: React.ReactNode }) {
  const { isRoleMode } = useViewMode();

  return isRoleMode ? <RoleProfile /> : children;
}
