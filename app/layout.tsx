import type { Metadata } from "next";
import "./globals.css";

import SplashScreen from "@/components/common/SplashScreen";
import { SPLASH_INIT_SCRIPT } from "@/lib/splash";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "belajarautomation.id",
  description: "Belajar QA Automation dari nol hingga siap kerja",
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
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}