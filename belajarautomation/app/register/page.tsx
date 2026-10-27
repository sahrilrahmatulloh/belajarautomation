import Image from "next/image";
import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Branding */}
      <section className="hidden border-r border-border bg-muted/30 p-12 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="belajarautomation.id"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />

          <span className="text-xl font-bold">
            belajarautomation.id
          </span>
        </Link>

        <div className="max-w-lg">
          <h2 className="text-4xl font-bold leading-tight">
            Mulai perjalananmu menjadi QA Automation Engineer.
          </h2>

          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Belajar dengan roadmap terstruktur, materi praktis,
            playground, dan project portfolio.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          © 2026 belajarautomation.id
        </p>
      </section>

      {/* Register */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex items-center gap-3 lg:hidden"
          >
            <Image
              src="/logo.png"
              alt="belajarautomation.id"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />

            <span className="font-bold">
              belajarautomation.id
            </span>
          </Link>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}