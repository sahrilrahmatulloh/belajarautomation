"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Nilai filter disimpan di query URL agar bisa dibagikan dan bertahan saat
// halaman dimuat ulang. Nilai kosong berarti "Semua" dan dihapus dari URL.
// history.replaceState didukung App Router, jadi tidak memicu request ke server.
export function useUrlFilters<K extends string>(keys: readonly K[]) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const values = useMemo(
    () =>
      Object.fromEntries(
        keys.map((key) => [key, searchParams.get(key) ?? ""])
      ) as Record<K, string>,
    [keys, searchParams]
  );

  const setFilters = useCallback(
    (updates: Partial<Record<K, string>>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value as string);
        else params.delete(key);
      }

      const query = params.toString();
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname, searchParams]
  );

  const resetFilters = useCallback(() => {
    setFilters(
      Object.fromEntries(keys.map((key) => [key, ""])) as Partial<Record<K, string>>
    );
  }, [keys, setFilters]);

  return { values, setFilters, resetFilters };
}
