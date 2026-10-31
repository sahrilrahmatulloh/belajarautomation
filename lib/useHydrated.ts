"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false saat render server dan hidrasi pertama, true setelahnya.
// Dipakai agar keputusan berbasis localStorage tidak diambil terlalu dini.
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
