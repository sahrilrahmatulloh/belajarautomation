"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import RequireAuth from "@/components/auth/RequireAuth";
import MaintenanceBanner from "@/components/maintenance/MaintenanceBanner";
import MaintenancePopup from "@/components/maintenance/MaintenancePopup";
import PromoPopup from "@/components/promo/PromoPopup";
import { isLearnerPath, useViewMode } from "@/lib/viewMode";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SwitchToLearningPrompt from "./SwitchToLearningPrompt";

interface DashboardLayoutProps {
  children: React.ReactNode;
  // Halaman yang bisa dibuka tanpa login. Isinya dirender di server agar bisa dibaca
  // mesin pencari, tidak menunggu sesi terbaca seperti halaman lain.
  publicAccess?: boolean;
}

export default function DashboardLayout({
  children,
  publicAccess = false,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { isRoleMode } = useViewMode();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsDesktopSidebarOpen((prev) => !prev);
    } else {
      setIsMobileSidebarOpen((prev) => !prev);
    }
  };

  const layout = (
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
          <MaintenanceBanner />
          <MaintenancePopup />
          <PromoPopup />

          {/* relative: elemen absolute di dalam isi (mis. teks sr-only) tidak memperpanjang
              dokumen, yang membuat seluruh layout bergeser saat lompat ke heading.
              tabIndex: halaman panjang tanpa tautan tetap bisa digulir dengan keyboard. */}
          <main tabIndex={0} className="relative min-w-0 flex-1 overflow-y-auto bg-background p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:p-5 lg:p-6">
            {isRoleMode && isLearnerPath(pathname) ? <SwitchToLearningPrompt /> : children}
          </main>
        </div>
      </div>
  );

  return publicAccess ? layout : <RequireAuth>{layout}</RequireAuth>;
}
