import Image from "next/image";
import { Quote } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-xl border border-border bg-card p-5 text-foreground shadow-sm sm:p-6 lg:min-h-64">
      {/* Ilustrasi mengisi sisi kanan (seluruh latar di layar kecil) */}
      <div className="absolute inset-y-0 right-0 -z-20 w-full sm:w-3/5">
        <Image
          src="/banner/basic-banner.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 45vw, (min-width: 640px) 60vw, 100vw"
          className="object-cover object-[50%_40%]"
        />
      </div>

      {/* Gradien agar teks tetap terbaca di atas ilustrasi */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/50 sm:from-40% sm:via-background/60 sm:via-60% sm:to-transparent"
      />

      <div className="relative max-w-xl">
        <p className="text-xs font-semibold text-brand-blue sm:text-sm">
          Belajar · Practice · Build · Grow
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Halo, <span className="text-primary">Sobat QA!</span>
        </h1>

        <p className="mt-2 max-w-md text-sm leading-5 text-muted-foreground sm:text-base sm:leading-6">
          Terus belajar dan bangun skill QA Automation untuk masa depan yang lebih baik.
        </p>

        <blockquote className="mt-3 flex max-w-md items-start gap-2 rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm leading-5 shadow-sm backdrop-blur-sm">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>Setiap langkah kecil hari ini membawa kamu lebih dekat ke tujuan besar.</span>
        </blockquote>
      </div>
    </section>
  );
}
