"use client";

import { useState } from "react";

import RequireAuth from "@/components/auth/RequireAuth";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsDesktopSidebarOpen((prev) => !prev);
    } else {
      setIsMobileSidebarOpen((prev) => !prev);
    }
  };

  return (
    <RequireAuth>
      <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
        {/* Desktop Sidebar: saat disembunyikan menjadi rel ikon */}
        <div className="hidden shrink-0 lg:block">
          <Sidebar collapsed={!isDesktopSidebarOpen} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <>
            <button
              type="button"
              aria-label="Tutup sidebar"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-[2px] lg:hidden"
            />

            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <Sidebar />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onToggleSidebar={toggleSidebar} />

          <main className="min-w-0 flex-1 overflow-y-auto bg-background p-4 sm:p-5 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
