"use client";

import { useState } from "react";
import {
  Check,
  Crown,
} from "lucide-react";

const features = [
  "Akses seluruh materi premium",
  "Akses semua roadmap",
  "Playground challenge",
  "Project portfolio",
  "Update materi terbaru",
  "Akses selama membership aktif",
];

type BillingPeriod = "monthly" | "yearly";

export default function PremiumPricing() {
  const [billingPeriod, setBillingPeriod] =
    useState<BillingPeriod>("yearly");

  const isYearly = billingPeriod === "yearly";

  return (
    <section className="mx-auto max-w-xl">
      {/* Billing Toggle */}
      <div className="mx-auto mb-6 flex w-fit rounded-xl border border-border bg-muted p-1">
        <button
          type="button"
          onClick={() => setBillingPeriod("monthly")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
            !isYearly
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          Bulanan
        </button>

        <button
          type="button"
          onClick={() => setBillingPeriod("yearly")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
            isYearly
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          Tahunan

          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Hemat 32%
          </span>
        </button>
      </div>

      {/* Pricing Card */}
      <div className="rounded-3xl border border-primary bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Crown className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Premium
              </h2>

              <p className="text-sm text-muted-foreground">
                Full access
              </p>
            </div>
          </div>

          {isYearly && (
            <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              Best Value
            </span>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">
              {isYearly
                ? "Rp399.000"
                : "Rp49.000"}
            </span>

            <span className="pb-1 text-muted-foreground">
              / {isYearly ? "tahun" : "bulan"}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {isYearly
              ? "Setara Rp33.250/bulan. Hemat Rp189.000 per tahun."
              : "Fleksibel dan dapat dibatalkan kapan saja."}
          </p>
        </div>

        <div className="my-8 border-t border-border" />

        <div className="space-y-4">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>

              <span className="text-sm">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-8 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Upgrade {isYearly ? "Tahunan" : "Bulanan"}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Pembayaran aman dan akses aktif setelah transaksi berhasil.
        </p>
      </div>
    </section>
  );
}