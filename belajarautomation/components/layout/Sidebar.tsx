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
  ArrowRight,
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
    label: "Project",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Books",
    href: "/books",
    icon: Library,
  },
  {
    label: "Blog",
    href: "/blog",
    icon: Newspaper,
  },
  {
    label: "Career",
    href: "/career",
    icon: Briefcase,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-background text-foreground">
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
            <h1 className="whitespace-nowrap text-lg font-bold tracking-tight">
              belajarautomation.id
            </h1>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Learn QA Automation
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
              className={`
                flex w-full items-center gap-3 rounded-xl px-4 py-3
                transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }
              `}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Premium CTA */}
      <div className="p-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Crown className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Upgrade Premium
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Akses semua materi dan fitur belajar.
              </p>
            </div>
          </div>

          <Link
            href="/premium"
            className="mt-4 flex w-full items-center justify-between rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Lihat Premium
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}