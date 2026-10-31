import {
  Check,
  Crown,
} from "lucide-react";

import AddToCartButtons from "@/components/cart/AddToCartButtons";
import { DUMMY_PREMIUM_PRICE } from "@/data/dummy/pricing";
import { PREMIUM_PRODUCT_ID } from "@/lib/cartProducts";
import { formatRupiah } from "@/lib/format";

const features = [
  "Akses tema visual",
  "Warna aksen tambahan",
  "3 klaim eBook",
  "3 klaim project",
  "Berlaku seumur hidup (Lifetime)",
];

export default function PremiumPricing() {
  return (
    <section className="mx-auto max-w-xl">
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
                Lifetime
              </p>
            </div>
          </div>

          <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            Sekali bayar
          </span>
        </div>

        <div className="mt-8">
          <span className="text-4xl font-bold">
            {formatRupiah(DUMMY_PREMIUM_PRICE)}
          </span>

          <p className="mt-2 text-sm text-muted-foreground">
            Sekali bayar, berlaku selamanya. Harga sementara dan dapat berubah sebelum peluncuran.
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

        <div className="mt-8">
          <AddToCartButtons
            productId={PREMIUM_PRODUCT_ID}
            buyLabel="Beli Premium"
          />
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Premium tidak memberikan XP, rank, atau keunggulan leaderboard.
        </p>
      </div>
    </section>
  );
}
