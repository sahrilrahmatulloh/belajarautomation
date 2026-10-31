"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  getRoleFromPath,
  NAVIGATION,
  ROLE_HOME,
  ROLE_LABELS,
} from "@/data/navigation";

interface SidebarProps {
  // Mode ringkas: hanya logo dan ikon menu.
  collapsed?: boolean;
}

export default function Sidebar({
  collapsed = false,
}: SidebarProps) {
  const pathname = usePathname();
  const role = getRoleFromPath(pathname);
  const home = ROLE_HOME[role];
  const menuItems = NAVIGATION[role];

  return (
    <aside
      className={`flex h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      {/* Brand */}
      <div className={collapsed ? "flex justify-center px-2 py-6" : "p-6"}>
        <Link
          href={home}
          className="flex items-center gap-3"
          aria-label={collapsed ? "belajarautomation.id" : undefined}
        >
          <Image
            src="/logo.png"
            alt="belajarautomation.id logo"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
            priority
          />

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="whitespace-nowrap text-base font-bold tracking-tight">
                belajarautomation.id
              </h1>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {role === "user"
                  ? "Learn · Practice · Build · Grow"
                  : `Panel ${ROLE_LABELS[role]}`}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav
        aria-label={`Menu ${ROLE_LABELS[role]}`}
        className={`flex-1 space-y-2 overflow-y-auto ${collapsed ? "px-3" : "px-4"}`}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const layoutClass = `flex w-full items-center gap-3 rounded-lg py-2.5 text-sm ${
            collapsed ? "justify-center px-0" : "px-3"
          }`;

          if (item.comingSoon || !item.href) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                title={collapsed ? `${item.label} (Segera hadir)` : undefined}
                className={`${layoutClass} cursor-not-allowed text-muted-foreground/60`}
              >
                <Icon size={collapsed ? 20 : 18} aria-hidden="true" />

                <span className={collapsed ? "sr-only" : "min-w-0 flex-1"}>
                  <span className="block truncate font-medium">{item.label}</span>
                  <span className={collapsed ? undefined : "block text-[11px] leading-4"}>
                    {collapsed ? " (Segera hadir)" : "Segera hadir"}
                  </span>
                </span>
              </span>
            );
          }

          const isActive =
            item.href === home
              ? pathname === home
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={`${layoutClass} transition-colors duration-150 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon size={collapsed ? 20 : 18} aria-hidden="true" />

              <span className={collapsed ? "sr-only" : "font-medium"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {role !== "user" && (
        <div className={`border-t border-sidebar-border py-4 ${collapsed ? "px-3" : "px-4"}`}>
          <Link
            href="/"
            title={collapsed ? "Kembali ke mode belajar" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
          >
            <ArrowLeft size={collapsed ? 20 : 18} aria-hidden="true" />
            <span className={collapsed ? "sr-only" : undefined}>
              Kembali ke mode belajar
            </span>
          </Link>
        </div>
      )}
    </aside>
  );
}
