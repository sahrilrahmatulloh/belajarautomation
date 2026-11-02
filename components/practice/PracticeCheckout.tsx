"use client";

import { FormEvent, useState } from "react";
import { Minus, Plus } from "lucide-react";

const ITEMS = [
  { id: "kaos", name: "Kaos Polos", price: 100000, quantity: 1 },
  { id: "buku", name: "Buku Catatan", price: 50000, quantity: 2 },
];
const PAYMENT_METHODS = [
  { id: "transfer", label: "Transfer bank" },
  { id: "ewallet", label: "Dompet digital" },
  { id: "cod", label: "Bayar di tempat" },
];
const DISCOUNT_PERCENT = 10;
const SHIPPING = 15000;

const rupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

// Bug yang ditanam (data/challengeDetails.ts, find-checkout-bug):
// - subtotal selalu memakai jumlah awal, bukan jumlah saat ini;
// - total tidak dikurangi diskon;
// - tombol kurang tetap aktif saat jumlah 1, sehingga jumlah bisa 0 atau negatif.
const INITIAL_SUBTOTAL = ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default function PracticeCheckout() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(ITEMS.map((item) => [item.id, item.quantity]))
  );
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [ordered, setOrdered] = useState(false);

  const discount = (INITIAL_SUBTOTAL * DISCOUNT_PERCENT) / 100;
  const total = INITIAL_SUBTOTAL + SHIPPING;

  const changeQuantity = (id: string, delta: number) => {
    setOrdered(false);
    setQuantities((current) => ({ ...current, [id]: current[id] + delta }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setOrdered(true);
  };

  return (
    <form onSubmit={handleSubmit} data-practice-id="checkout-form" className="mx-auto max-w-lg space-y-5">
      <h2 data-practice-id="checkout-title" className="text-xl font-bold">
        Checkout TokoLatihan
      </h2>

      <ul data-practice-id="checkout-items" className="divide-y divide-border rounded-xl border border-border">
        {ITEMS.map((item) => (
          <li
            key={item.id}
            data-practice-id={`checkout-item-${item.id}`}
            className="flex flex-wrap items-center justify-between gap-3 p-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{item.name}</p>
              <p data-practice-id={`checkout-price-${item.id}`} className="text-xs text-muted-foreground">
                {rupiah(item.price)} / barang
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Kurangi jumlah ${item.name}`}
                  data-practice-id={`checkout-minus-${item.id}`}
                  onClick={() => changeQuantity(item.id, -1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <output
                  aria-label={`Jumlah ${item.name}`}
                  data-practice-id={`checkout-quantity-${item.id}`}
                  className="w-8 text-center text-sm font-semibold"
                >
                  {quantities[item.id]}
                </output>
                <button
                  type="button"
                  aria-label={`Tambah jumlah ${item.name}`}
                  data-practice-id={`checkout-plus-${item.id}`}
                  onClick={() => changeQuantity(item.id, 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="w-20 text-right text-sm font-medium">{rupiah(item.price * quantities[item.id])}</p>
            </div>
          </li>
        ))}
      </ul>

      <fieldset data-practice-id="checkout-methods" className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Metode pembayaran</legend>
        {PAYMENT_METHODS.map((option) => (
          <label key={option.id} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="metode"
              value={option.id}
              checked={method === option.id}
              onChange={() => setMethod(option.id)}
              data-practice-id={`checkout-method-${option.id}`}
              className="h-4 w-4 accent-primary"
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <dl data-practice-id="checkout-summary" className="space-y-1.5 rounded-xl bg-muted/50 p-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd data-practice-id="checkout-subtotal">{rupiah(INITIAL_SUBTOTAL)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Diskon {DISCOUNT_PERCENT}%</dt>
          <dd data-practice-id="checkout-discount">-{rupiah(discount)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Ongkos kirim</dt>
          <dd data-practice-id="checkout-shipping">{rupiah(SHIPPING)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border pt-1.5 font-semibold">
          <dt>Total pembayaran</dt>
          <dd data-practice-id="checkout-total">{rupiah(total)}</dd>
        </div>
      </dl>

      {ordered && (
        <p role="status" data-practice-id="checkout-success" className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Pesanan latihan dibuat. Tidak ada pembayaran yang terjadi.
        </p>
      )}

      <button
        type="submit"
        data-practice-id="checkout-submit"
        className="min-h-10 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Buat Pesanan
      </button>
    </form>
  );
}
