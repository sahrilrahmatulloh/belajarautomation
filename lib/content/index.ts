"use client";

import { useEffect, useEffectEvent, useState } from "react";

import { createDummyRepository } from "./dummyRepository";
import { ContentRepository, ContentRuleError } from "./repository";

// Satu-satunya tempat yang memilih implementasi. Saat backend siap, cukup diganti di sini.
let repository: ContentRepository | null = null;

export function getContentRepository() {
  repository ??= createDummyRepository();
  return repository;
}

// Membaca data dari repository dan memuat ulang saat data berubah. `key` menentukan kapan
// kueri berganti, mis. saat id konten berubah.
export function useContentData<T>(key: string, load: (repository: ContentRepository) => Promise<T>) {
  const [result, setResult] = useState<{ key: string; data: T } | null>(null);

  const loadLatest = useEffectEvent(() => load(getContentRepository()));

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void loadLatest().then((data) => {
        if (active) setResult({ key, data });
      });
    };
    refresh();
    const unsubscribe = getContentRepository().subscribe(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [key]);

  return result?.key === key ? result.data : undefined;
}

// Menjalankan aksi repository dan mengubah pelanggaran aturan menjadi pesan untuk pengguna.
export async function runContentAction<T>(action: (repository: ContentRepository) => Promise<T>) {
  try {
    return { ok: true as const, data: await action(getContentRepository()) };
  } catch (error) {
    if (error instanceof ContentRuleError) return { ok: false as const, message: error.message };
    throw error;
  }
}
