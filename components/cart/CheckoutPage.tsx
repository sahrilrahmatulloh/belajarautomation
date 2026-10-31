"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Info, Lock, ShoppingCart } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { PAYMENT_METHODS } from "@/data/paymentMethods";
import { cartActions, useCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";

import CartItemRow from "./CartItemRow";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart();
  const [methodId, setMethodId] = useState<string | null>(null);
  const total = items.reduce((sum, product) => sum + product.price, 0);

  // SIMULASI: belum ada payment gateway. Tidak ada uang atau akses yang diproses.
  const handlePay = () => {
    if (!methodId || items.length === 0) return;

    const orderId = `SIM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    cartActions.clear();
    router.push(`/checkout/success?order=${orderId}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Keranjang
      </Link>

      <section className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pembayaran</h1>
          <p className="mt-1 text-muted-foreground">
            Periksa pesanan dan pilih metode pembayaran.
          </p>
        </div>
      </section>

      <p
        role="note"
        className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-800 dark:text-amber-200"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Mode simulasi — tidak ada pembayaran sungguhan, dan eBook atau Premium belum benar-benar aktif.
      </p>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Tidak ada item untuk dibayar"
          description="Keranjangmu kosong. Tambahkan eBook atau Premium terlebih dahulu."
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section
              aria-labelledby="checkout-items"
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h2 id="checkout-items" className="font-semibold">
                Pesanan
              </h2>
              <ul className="mt-4 space-y-4">
                {items.map((product) => (
                  <li key={product.id}>
                    <CartItemRow product={product} />
                  </li>
                ))}
              </ul>
            </section>

            <fieldset className="rounded-2xl border border-border bg-card p-5">
              <legend className="px-1 font-semibold">
                Metode Pembayaran
              </legend>

              <div className="mt-2 space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = methodId === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setMethodId(method.id)}
                        className="mt-1 accent-primary"
                      />
                      <span>
                        <span className="block text-sm font-semibold">
                          {method.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {method.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-6">
            <h2 className="font-semibold">Ringkasan Pembayaran</h2>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Subtotal ({items.length} item)
                </dt>
                <dd className="tabular-nums">{formatRupiah(total)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatRupiah(total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handlePay}
              disabled={!methodId}
              className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Bayar {formatRupiah(total)} (simulasi)
            </button>

            {!methodId && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Pilih metode pembayaran terlebih dahulu.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
