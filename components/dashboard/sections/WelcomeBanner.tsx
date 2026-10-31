import { Quote } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-100 p-5 text-slate-950 shadow-sm dark:border-blue-900/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/70 dark:text-white sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-16 hidden h-72 w-44 rotate-[38deg] rounded-[2.5rem] border border-blue-400/20 bg-blue-400/10 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-20 top-12 hidden h-52 w-28 -rotate-[38deg] rounded-[2rem] border border-sky-400/20 bg-sky-300/15 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-6rem] right-48 hidden h-44 w-28 rotate-[38deg] rounded-[2rem] border border-blue-400/15 bg-blue-500/10 lg:block"
      />

      <div className="relative max-w-2xl sm:pr-32">
        <p className="text-xs font-semibold text-brand-blue sm:text-sm">
          Belajar · Practice · Build · Grow
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Halo, <span className="text-primary">Sobat QA!</span>
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-5 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-6">
          Terus belajar dan bangun skill QA Automation untuk masa depan yang lebih baik.
        </p>

        <blockquote className="mt-3 flex max-w-lg items-start gap-2 rounded-lg border border-white/70 bg-white/75 px-3 py-2.5 text-sm leading-5 text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-200">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>Setiap langkah kecil hari ini membawa kamu lebih dekat ke tujuan besar.</span>
        </blockquote>

      </div>
    </section>
  );
}
