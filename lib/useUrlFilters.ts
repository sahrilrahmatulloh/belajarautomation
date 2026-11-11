"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Nilai filter disimpan di query URL agar bisa dibagikan dan bertahan saat
// halaman dimuat ulang. Nilai kosong berarti "Semua" dan dihapus dari URL.
// history.replaceState didukung App Router, jadi tidak memicu request ke server.
//
// useSearchParams() diperbarui App Router secara tertunda setelah replaceState
// (Next.js 16.4+). Karena itu nilai filter disimpan juga di state lokal yang
// langsung berubah saat dipilih, dan setiap perubahan dibangun dari URL yang
// sedang berlaku di browser, bukan dari snapshot useSearchParams yang bisa
// tertinggal. Tanpa ini, checkbox terkontrol kembali ke nilai lama dan
// perubahan filter yang beruntun saling menimpa.
export function useUrlFilters<K extends string>(keys: readonly K[]) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const routerQuery = searchParams.toString();

  const [query, setQuery] = useState(routerQuery);
  const [syncedRouterQuery, setSyncedRouterQuery] = useState(routerQuery);

  // Ikuti perubahan dari router (Link, navigasi, tombol kembali). Saat render
  // ini URL browser belum tentu sudah diperbarui router, jadi pakai nilainya.
  if (routerQuery !== syncedRouterQuery) {
    setSyncedRouterQuery(routerQuery);
    setQuery(routerQuery);
  }

  const values = useMemo(() => {
    const params = new URLSearchParams(query);
    return Object.fromEntries(
      keys.map((key) => [key, params.get(key) ?? ""])
    ) as Record<K, string>;
  }, [keys, query]);

  const setFilters = useCallback(
    (updates: Partial<Record<K, string>>) => {
      const params = new URLSearchParams(window.location.search);

      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value as string);
        else params.delete(key);
      }

      const next = params.toString();
      setQuery(next);
      window.history.replaceState(null, "", next ? `${pathname}?${next}` : pathname);
    },
    [pathname]
  );

  const resetFilters = useCallback(() => {
    setFilters(
      Object.fromEntries(keys.map((key) => [key, ""])) as Partial<Record<K, string>>
    );
  }, [keys, setFilters]);

  return { values, setFilters, resetFilters };
}

// Filter katalog dengan pencarian "q". Teks pencarian disimpan lokal agar input
// tetap responsif, lalu ikut ditulis ke URL. Dipakai halaman Belajar dan Playground.
export function useCatalogFilters<K extends string>(keys: readonly K[]) {
  const { values, setFilters, resetFilters } = useUrlFilters(keys);
  const [search, setSearchState] = useState(
    (values as Record<string, string>).q ?? ""
  );

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value);
      setFilters({ q: value.trim() } as Partial<Record<K, string>>);
    },
    [setFilters]
  );

  const reset = useCallback(() => {
    setSearchState("");
    resetFilters();
  }, [resetFilters]);

  return { values, search, setSearch, setFilters, reset };
}
