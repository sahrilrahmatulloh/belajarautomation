"use client";

import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { notify, NotifyItem, NotifyTone, useNotifications } from "@/lib/notify";

const TONES: Record<NotifyTone, { icon: typeof Info; className: string; iconClassName: string }> = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-500/40",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    className: "border-destructive/50",
    iconClassName: "text-destructive",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-500/50",
    iconClassName: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    className: "border-primary/40",
    iconClassName: "text-primary-accent",
  },
};

function NotifyCard({ item }: { item: NotifyItem }) {
  const tone = TONES[item.tone];
  const Icon = tone.icon;
  return (
    <div
      data-notify-tone={item.tone}
      className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border bg-card px-4 py-3 text-sm text-foreground shadow-lg animate-in fade-in slide-in-from-top-2 ${tone.className}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.iconClassName}`} aria-hidden="true" />
      <p className="min-w-0 flex-1 font-medium leading-5">{item.message}</p>
      <button
        type="button"
        onClick={() => notify.dismiss(item.id)}
        aria-label="Tutup pemberitahuan"
        className="-m-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// Tempat alert di atas tengah layar (PRD 4.6). Error dan peringatan diumumkan segera oleh
// pembaca layar (assertive); sukses dan info diumumkan tanpa memotong (polite).
export default function Toaster() {
  const items = useNotifications();
  const urgent = items.filter((item) => item.tone === "error" || item.tone === "warning");
  const calm = items.filter((item) => item.tone === "success" || item.tone === "info");

  return (
    <section
      aria-label="Pemberitahuan"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 px-4 pt-3"
    >
      <div aria-live="assertive" className="flex w-full flex-col items-center gap-2">
        {urgent.map((item) => (
          <NotifyCard key={item.id} item={item} />
        ))}
      </div>
      <div aria-live="polite" className="flex w-full flex-col items-center gap-2">
        {calm.map((item) => (
          <NotifyCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
