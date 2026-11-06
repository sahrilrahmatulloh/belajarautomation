import type { Metadata } from "next";
import "./globals.css";

import EnvironmentBadge from "@/components/common/EnvironmentBadge";
import SplashScreen from "@/components/common/SplashScreen";
import MaintenanceGate from "@/components/maintenance/MaintenanceGate";
import { isProduction } from "@/lib/env";
import { SITE_URL } from "@/lib/siteUrl";
import { SPLASH_INIT_SCRIPT } from "@/lib/splash";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "belajarautomation.com",
  description: "Belajar QA Automation dari nol hingga siap kerja",
  // Hanya Production yang boleh diindeks mesin pencari (PRD FR-07).
  ...(!isProduction && { robots: { index: false, follow: false } }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_INIT_SCRIPT }} />
      </head>
      <body>
        <SplashScreen />
        <ThemeProvider>
          <TooltipProvider>
            <MaintenanceGate>{children}</MaintenanceGate>
          </TooltipProvider>
        </ThemeProvider>
        <EnvironmentBadge />
      </body>
    </html>
  );
}