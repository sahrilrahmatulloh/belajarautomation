import { Crown, Sparkles } from "lucide-react";

export default function PremiumHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 text-center sm:px-10 sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Crown className="h-7 w-7" />
      </div>

      <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
        <Sparkles className="h-3.5 w-3.5" />
        belajarautomation.id Premium
      </div>

      <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
        Tingkatkan skill QA Automation tanpa batas
      </h1>

      <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
        Dapatkan akses penuh ke materi premium, roadmap, playground,
        project, dan berbagai resource untuk membantu perjalanan
        belajarmu.
      </p>
    </section>
  );
}