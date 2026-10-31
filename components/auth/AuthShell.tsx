import Image from "next/image";
import Link from "next/link";

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
      {/* Panel ilustrasi (desktop) */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/banner/basic-banner.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="text-sm font-semibold text-sky-300">
            Learn · Practice · Build · Grow
          </p>
          <p className="mt-3 max-w-md text-2xl font-bold leading-snug">
            Belajar QA Automation dari nol hingga siap kerja.
          </p>
        </div>
      </aside>

      {/* Form */}
      <main className="flex min-w-0 flex-col px-4 py-6 sm:px-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-3"
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-base font-bold tracking-tight">
            belajarautomation.id
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
  );
}
