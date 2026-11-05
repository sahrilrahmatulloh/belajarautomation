"use client";

import { useEffect, useEffectEvent, useState } from "react";

import { isDev } from "@/lib/env";
import { ProductKind } from "@/types/Commerce";
import { ContentUser } from "@/types/ContentWorkflow";
import { MembershipTier } from "@/types/Membership";

import { createDummyRepository } from "./dummyRepository";
import { ContentRepository, ContentRuleError } from "./repository";

// Satu-satunya tempat yang memilih implementasi. Saat backend siap, cukup diganti di sini.
let repository: ContentRepository | null = null;

export function getContentRepository() {
  if (!repository) {
    repository = createDummyRepository();
    // Pintu untuk test e2e menjalankan aksi peran lain tanpa berganti akun. Hanya di DEV.
    if (isDev && typeof window !== "undefined") Object.assign(window, { __contentRepository: repository });
  }
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

// Akun demo yang mewakili "pengguna saat ini" di leaderboard dan profil.
export const DEMO_LEARNER_ID = "user-sobat";

const NO_USERS: ContentUser[] = [];

// Akun nonaktif, untuk menyembunyikannya dari leaderboard dan profil publik (PRD FR-16 C).
export function useInactiveUsers() {
  const users = useContentData("akun-nonaktif", async (current) => (await current.listUsers()).filter((user) => user.status === "nonaktif"));
  return users ?? NO_USERS;
}

// Katalog publik dan hak akses pengguna yang sedang masuk. Hanya produk Terbit yang tampil (PRD FR-16 F).
export function useProductCatalog(kind: ProductKind, userId: string | undefined) {
  return useContentData(`katalog-${kind}-${userId}`, async (current) => {
    const [products, entitlements] = await Promise.all([current.listProducts(), current.listEntitlements()]);
    return {
      products: products.filter((product) => product.kind === kind && product.status === "terbit"),
      ownedIds: new Set(entitlements.filter((item) => item.userId === userId && item.active).map((item) => item.itemId)),
    };
  });
}

// Membership pengguna yang sedang masuk, mengikuti hak aksesnya.
export function useAccountMembership(userId: string | undefined, fallback: MembershipTier) {
  const tier = useContentData(`membership-${userId}`, async (current) => (await current.listUsers()).find((user) => user.id === userId)?.membership);
  return tier ?? fallback;
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
