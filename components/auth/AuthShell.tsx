import Image from "next/image";
import Link from "next/link";

import MaintenanceBanner from "@/components/maintenance/MaintenanceBanner";

import AuthShowcase from "./AuthShowcase";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

// Tampilan bersama untuk halaman masuk dan daftar (semua role).
export default function AuthShell({
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="grid min-h-dvh bg-background text-foreground lg:grid-cols-2">
      {/* Panel promosi bergeser (desktop), PRD 4.5 */}
      <aside className="relative hidden overflow-hidden lg:block">
        <AuthShowcase />
      </aside>

      {/* Form */}
      <div className="flex min-w-0 flex-col">
      <MaintenanceBanner />
      <main className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-3"
        >
          <Image
            src="/logo.webp"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-base font-bold tracking-tight">
            belajarautomation.com
          </span>
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {description}
          </p>

          <div className="mt-8">
            {children}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
