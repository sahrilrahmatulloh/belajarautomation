"use client";

import { useSyncExternalStore } from "react";

import { getCartProduct } from "@/lib/cartProducts";
import { CartProduct } from "@/types/Cart";

// Keranjang disimpan di localStorage browser (belum ada backend).
// Hanya id produk yang disimpan; detail diambil dari data saat dibaca.
const STORAGE_KEY = "belajarautomation-cart";
const EMPTY: CartProduct[] = [];

let cache: CartProduct[] | null = null;
const listeners = new Set<() => void>();

function readIds(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]"
    );
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function getSnapshot() {
  if (cache === null) {
    cache = [...new Set(readIds())]
      .map(getCartProduct)
      .filter((product): product is CartProduct => Boolean(product));
  }
  return cache;
}

function writeIds(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Penyimpanan tidak tersedia (mis. mode privat); keranjang hanya di memori.
  }
  cache = ids
    .map(getCartProduct)
    .filter((product): product is CartProduct => Boolean(product));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Sinkron antar tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export const cartActions = {
  // Produk digital: setiap item maksimal satu.
  add(id: string) {
    const ids = getSnapshot().map((product) => product.id);
    if (!ids.includes(id) && getCartProduct(id)) {
      writeIds([...ids, id]);
    }
  },
  remove(id: string) {
    writeIds(
      getSnapshot()
        .map((product) => product.id)
        .filter((item) => item !== id)
    );
  },
  clear() {
    writeIds([]);
  },
};
