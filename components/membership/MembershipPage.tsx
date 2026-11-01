import { Check, Crown, Info, Minus, Sparkles } from "lucide-react";

import AddToCartButtons from "@/components/cart/AddToCartButtons";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { MEMBERSHIP_COMPARISON, MEMBERSHIP_PLANS } from "@/data/membership";
import { getMembershipProductId } from "@/lib/cartProducts";
import { formatRupiah } from "@/lib/format";
import { MembershipTier } from "@/types/Membership";

function ComparisonValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <>
        <Check className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <span className="sr-only">Ya</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus className="mx-auto h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Tidak</span>
      </>
    );
  }
  return <span className="text-xs font-medium">{value}</span>;
}

export default function MembershipPage() {
  const currentTier: MembershipTier = DUMMY_ACCOUNT.membership;
  const tiers = MEMBERSHIP_PLANS.map((plan) => plan.tier);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <section className="rounded-3xl border border-border bg-card px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Crown className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Membership belajarautomation.com
        </div>
        <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Belajar dasar gratis, buka materi lanjutan saat kamu siap
        </h1>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
          Basic tetap bisa belajar dari nol, mengikuti roadmap, berlatih, dan mencapai rank
          tertinggi. Pro dan Premium membuka course premium serta benefit tambahan, cukup sekali bayar.
        </p>
      </section>

      <section aria-labelledby="membership-plans-title" className="space-y-4">
        <h2 id="membership-plans-title" className="sr-only">Pilihan paket</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isCurrent = plan.tier === currentTier;
            return (
              <article
                key={plan.tier}
                className={`relative flex flex-col rounded-3xl border bg-card p-6 ${
                  plan.recommended ? "border-primary shadow-md ring-1 ring-primary/30" : "border-border"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Rekomendasi
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

                <p className="mt-5 text-3xl font-bold">
                  {plan.price === null ? "Gratis" : formatRupiah(plan.price)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {plan.price === null ? "Untuk semua pengguna" : "Sekali bayar · Lifetime · harga simulasi"}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {isCurrent ? (
                    <p className="flex min-h-11 items-center justify-center rounded-xl border border-border text-sm font-medium text-muted-foreground">
                      Paket kamu saat ini
                    </p>
                  ) : plan.price === null ? null : (
                    <AddToCartButtons
                      productId={getMembershipProductId(plan.tier)}
                      buyLabel={`Beli ${plan.name}`}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="membership-compare-title" className="space-y-4">
        <h2 id="membership-compare-title" className="text-2xl font-bold">
          Perbandingan paket
        </h2>
        <div className="relative overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="sr-only">Perbandingan benefit Basic, Pro, dan Premium</caption>
            <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium">Benefit</th>
                {MEMBERSHIP_PLANS.map((plan) => (
                  <th key={plan.tier} scope="col" className="w-28 px-3 py-3 text-center font-semibold text-foreground">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MEMBERSHIP_COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <th scope="row" className="px-4 py-3 text-left font-normal">{row.feature}</th>
                  {tiers.map((tier) => (
                    <td key={tier} className="px-3 py-3 text-center">
                      <ComparisonValue value={row.values[tier]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Apa arti Lifetime?</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
            <li>Akses permanen ke course premium yang tersedia pada saat pembelian.</li>
            <li>Course premium baru yang terbit setelah pembelian tidak otomatis termasuk.</li>
            <li>Perbaikan bug, koreksi, dan pembaruan course yang sama diberikan tanpa biaya tambahan.</li>
            <li>Kredit eBook dan project bukan uang tunai dan tidak dapat dipindahtangankan.</li>
          </ul>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-5 text-sm leading-6 text-muted-foreground">
          <Info className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Membership tidak memberikan bonus XP, pengganda XP, atau rank. Semua paket memakai
            aturan XP yang sama, dan rank Master tetap bisa dicapai pengguna Basic hanya dari
            materi gratis.
          </p>
        </div>
      </section>
    </div>
  );
}
