"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart, Zap } from "lucide-react";

import { cartActions, useCart } from "@/lib/cart";

interface AddToCartButtonsProps {
  productId: string;
  buyLabel?: string;
}

export default function AddToCartButtons({
  productId,
  buyLabel = "Beli Sekarang",
}: AddToCartButtonsProps) {
  const router = useRouter();
  const isInCart = useCart().some((product) => product.id === productId);

  const buyNow = () => {
    cartActions.add(productId);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={buyNow}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Zap className="h-4 w-4" aria-hidden="true" />
        {buyLabel}
      </button>

      {isInCart ? (
        <Link
          href="/cart"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
          Sudah di keranjang · Lihat keranjang
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => cartActions.add(productId)}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Tambah ke Keranjang
        </button>
      )}
    </div>
  );
}
