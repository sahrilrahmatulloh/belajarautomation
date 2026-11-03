"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/lib/cart";

export default function CartButton() {
  const count = useCart().length;

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-accent active:scale-95"
      aria-label={count > 0 ? `Keranjang, ${count} item` : "Keranjang"}
    >
      <ShoppingCart size={20} aria-hidden="true" />

      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
