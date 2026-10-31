"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Map,
  FlaskConical,
  FolderKanban,
  Library,
  Newspaper,
  Briefcase,
  Crown,
  Trophy,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Belajar",
    href: "/learn",
    icon: BookOpen,
  },
  {
    label: "Roadmap",
    href: "/roadmap",
    icon: Map,
  },
  {
    label: "Playground",
    href: "/playground",
    icon: FlaskConical,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Blog",
    href: "/blog",
    icon: Newspaper,
  },
  {
    label: "eBook",
    href: "/ebooks",
    icon: Library,
  },
  {
    label: "Project",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Karier",
    href: "/career",
    icon: Briefcase,
  },
  {
    label: "Premium",
    href: "/premium",
    icon: Crown,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="p-6">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <Image
            src="/logo.png"
            alt="belajarautomation.id logo"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
            priority
          />

          <div className="min-w-0">
            <h1 className="whitespace-nowrap text-base font-bold tracking-tight">
              belajarautomation.id
            </h1>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Learn · Practice · Build · Grow
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`
                flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                text-sm transition-colors duration-150
                ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }
              `}
            >
              <Icon size={18} aria-hidden="true" />

              <span className="font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
