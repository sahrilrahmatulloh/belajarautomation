import {
  BookOpen,
  BookOpenCheck,
  Briefcase,
  Crown,
  FilePlus2,
  Files,
  FileText,
  FlaskConical,
  FolderKanban,
  History,
  Inbox,
  LayoutDashboard,
  Library,
  Map,
  MessageSquareText,
  Newspaper,
  Palette,
  Receipt,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

import { NavItem } from "@/types/Navigation";
import { UserRole } from "@/types/Role";

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  creator: "Creator",
  reviewer: "Reviewer",
  admin: "Admin",
};

export const ROLE_HOME: Record<UserRole, string> = {
  user: "/",
  creator: "/creator",
  reviewer: "/reviewer",
  admin: "/admin",
};

// Menu sidebar per role. Menu tanpa href ditampilkan sebagai "Segera hadir".
export const NAVIGATION: Record<UserRole, NavItem[]> = {
  user: [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Belajar", href: "/learn", icon: BookOpen },
    { label: "Roadmap", href: "/roadmap", icon: Map },
    { label: "Playground", href: "/playground", icon: FlaskConical },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Blog", href: "/blog", icon: Newspaper },
    { label: "eBook", href: "/ebooks", icon: Library },
    { label: "Project", href: "/projects", icon: FolderKanban },
    { label: "Karier", href: "/career", icon: Briefcase },
    { label: "Premium", href: "/premium", icon: Crown },
  ],
  creator: [
    { label: "Dashboard", href: "/creator", icon: LayoutDashboard },
    { label: "Konten Saya", icon: FileText, comingSoon: true },
    { label: "Buat Konten", icon: FilePlus2, comingSoon: true },
    { label: "Catatan Revisi", icon: MessageSquareText, comingSoon: true },
  ],
  reviewer: [
    { label: "Dashboard", href: "/reviewer", icon: LayoutDashboard },
    { label: "Antrean Review", icon: Inbox, comingSoon: true },
    { label: "Riwayat Review", icon: History, comingSoon: true },
    { label: "Panduan Review", icon: BookOpenCheck, comingSoon: true },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Pengguna & Role", icon: Users, comingSoon: true },
    { label: "Konten", icon: Files, comingSoon: true },
    { label: "Paket Premium", icon: Crown, comingSoon: true },
    { label: "Skin", icon: Palette, comingSoon: true },
    { label: "Transaksi", icon: Receipt, comingSoon: true },
    { label: "Pengaturan", icon: Settings, comingSoon: true },
  ],
};

// Role ditentukan dari route yang sedang dibuka (belum ada autentikasi).
export function getRoleFromPath(pathname: string): UserRole {
  const role = (["creator", "reviewer", "admin"] as const).find(
    (item) =>
      pathname === ROLE_HOME[item] ||
      pathname.startsWith(`${ROLE_HOME[item]}/`)
  );

  return role ?? "user";
}
