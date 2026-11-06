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
  Trophy,
  Package,
  Receipt,
  BarChart3,
  LibraryBig,
  Megaphone,
  ScrollText,
  ShieldAlert,
  Users,
  Wrench,
} from "lucide-react";

import { isDev } from "@/lib/env";
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

// Menu sidebar per role. Menu tanpa href atau dengan comingSoon ditampilkan
// sebagai "Segera hadir" (lihat data/comingSoonFeatures.ts).
export const NAVIGATION: Record<UserRole, NavItem[]> = {
  user: [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Belajar", href: "/learn", icon: BookOpen },
    { label: "Roadmap", href: "/roadmap", icon: Map },
    { label: "Playground", href: "/playground", icon: FlaskConical },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Blog", href: "/blog", icon: Newspaper },
    { label: "eBook", href: "/ebooks", icon: Library, comingSoon: !isDev },
    { label: "Project", href: "/projects", icon: FolderKanban, comingSoon: !isDev },
    { label: "Karier", href: "/career", icon: Briefcase, comingSoon: true },
    { label: "Membership", href: "/membership", icon: Crown },
  ],
  creator: [
    { label: "Dashboard", href: "/creator", icon: LayoutDashboard },
    { label: "Konten Saya", href: "/creator/konten", icon: FileText },
    { label: "Buat Konten", href: "/creator/buat", icon: FilePlus2 },
    { label: "Catatan Revisi", href: "/creator/revisi", icon: MessageSquareText },
  ],
  reviewer: [
    { label: "Dashboard", href: "/reviewer", icon: LayoutDashboard },
    { label: "Antrean Review", href: "/reviewer/antrean", icon: Inbox },
    { label: "Riwayat Review", href: "/reviewer/riwayat", icon: History },
    { label: "Panduan Review", href: "/reviewer/panduan", icon: BookOpenCheck },
  ],
  admin: [
    { label: "Ringkasan", href: "/admin", icon: LayoutDashboard, group: "Konten" },
    { label: "Semua Konten", href: "/admin/konten", icon: Files, group: "Konten" },
    { label: "Pengguna dan Peran", href: "/admin/pengguna", icon: Users, group: "Pengguna" },
    { label: "Moderasi", href: "/admin/moderasi", icon: ShieldAlert, group: "Pengguna" },
    { label: "Transaksi", href: "/admin/transaksi", icon: Receipt, group: "Bisnis" },
    { label: "Produk Digital", href: "/admin/produk", icon: Package, group: "Bisnis" },
    { label: "Katalog Belajar", href: "/admin/katalog", icon: LibraryBig, group: "Platform" },
    { label: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone, group: "Platform" },
    { label: "Mode Maintenance", href: "/admin/maintenance", icon: Wrench, group: "Platform" },
    { label: "Laporan", href: "/admin/laporan", icon: BarChart3, group: "Laporan" },
    { label: "Log Aktivitas Admin", href: "/admin/log", icon: ScrollText, group: "Laporan" },
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
