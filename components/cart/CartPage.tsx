"use client";

import Link from "next/link";
import { ArrowRight, Library, ShoppingCart, Trash2 } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { cartActions, useCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";

import CartItemRow from "./CartItemRow";

export default function CartPage() {
  const items = useCart();
  const total = items.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ShoppingCart className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Keranjang
          </h1>
          <p className="mt-1 text-muted-foreground">
            eBook dan Premium yang siap kamu beli.
          </p>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            icon={ShoppingCart}
            title="Keranjang masih kosong"
            description="Tambahkan eBook atau Premium Lifetime untuk mulai berbelanja."
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/ebooks"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              <Library className="h-4 w-4" aria-hidden="true" />
              Lihat eBook
            </Link>
            <Link
              href="/premium"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium hover:bg-accent"
            >
              Lihat Premium
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section
            aria-label="Item di keranjang"
            className="rounded-2xl border border-border bg-card"
          >
            <ul className="divide-y divide-border">
              {items.map((product) => (
                <li key={product.id} className="p-4 sm:p-5">
                  <CartItemRow
                    product={product}
                    action={
                      <button
                        type="button"
                        onClick={() => cartActions.remove(product.id)}
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Hapus ${product.title} dari keranjang`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Hapus
                      </button>
                    }
                  />
                </li>
              ))}
            </ul>
          </section>

          <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-6">
            <h2 className="font-semibold">Ringkasan</h2>

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

            <Link
              href="/checkout"
              className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Lanjut ke Pembayaran
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              href="/ebooks"
              className="mt-2 flex min-h-10 w-full items-center justify-center text-sm font-medium text-primary hover:underline"
            >
              Lanjut belanja
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
