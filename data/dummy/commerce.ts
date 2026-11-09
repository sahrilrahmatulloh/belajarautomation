// DATA DUMMY — hapus sebelum rilis (PRD FR-10 dan FR-16).
// Transaksi, hak akses, klaim kredit, dan produk digital untuk tahap antarmuka dengan data dummy.
// Membership berbayar setiap pengguna dummy punya transaksi dan hak aksesnya sendiri.
import { BOOKS } from "@/data/books";
import { getMembershipPlan } from "@/data/membership";
import { PROJECTS } from "@/data/projects";
import { CreditClaim, Entitlement, EntitlementKind, Product, Transaction, TransactionStatus, TransactionStatusChange } from "@/types/Commerce";
import { MembershipTier } from "@/types/Membership";

import { DUMMY_USERS } from "./users";

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

// Harga project belum ada di data katalog; ini harga simulasi.
const SIMULATED_PROJECT_PRICE = 99_000;

const products: Product[] = [
  ...BOOKS.map(
    (book): Product => ({
      id: `ebook-${book.slug}`,
      kind: "ebook",
      slug: book.slug,
      title: book.title,
      description: book.description,
      cover: book.cover,
      price: book.price,
      fileName: `${book.slug}.pdf`,
      status: "terbit",
      updatedAt: daysAgo(40),
    })
  ),
  {
    id: "ebook-panduan-test-data",
    kind: "ebook",
    slug: "panduan-test-data",
    title: "Panduan Menyiapkan Test Data",
    description: "Cara menyiapkan test data yang rapi untuk pengujian manual dan automation.",
    cover: "",
    price: 59_000,
    fileName: "",
    status: "draf",
    updatedAt: daysAgo(2),
  },
  ...PROJECTS.map(
    (project): Product => ({
      id: `project-${project.id}`,
      kind: "project",
      slug: `project-${project.id}`,
      title: project.title,
      description: project.description,
      cover: "",
      price: SIMULATED_PROJECT_PRICE,
      fileName: `project-${project.id}.zip`,
      status: "terbit",
      updatedAt: daysAgo(40),
    })
  ),
];

const OWNED_EBOOK = products[0];
const OTHER_EBOOK = products[1];
const PROJECT = products.find((product) => product.kind === "project") as Product;

function changes(status: TransactionStatus, createdDaysAgo: number, finishedDaysAgo = createdDaysAgo): TransactionStatusChange[] {
  const gateway = (value: TransactionStatus, days: number): TransactionStatusChange => ({ status: value, at: daysAgo(days), source: "gateway", actorId: null, alasan: null });
  const start = gateway("menunggu", createdDaysAgo);
  if (status === "menunggu") return [start];
  if (status === "refund") {
    return [start, gateway("berhasil", createdDaysAgo), { status: "refund", at: daysAgo(finishedDaysAgo), source: "admin", actorId: "user-admin", alasan: "Contoh refund pada data dummy." }];
  }
  return [start, gateway(status, finishedDaysAgo)];
}

function transaction(id: string, userId: string, kind: EntitlementKind, itemId: string, itemTitle: string, amount: number, status: TransactionStatus, createdDaysAgo: number): Transaction {
  return { id, userId, kind, itemId, itemTitle, amount, method: id.length % 2 === 0 ? "Virtual Account" : "E-Wallet", status, createdAt: daysAgo(createdDaysAgo), history: changes(status, createdDaysAgo) };
}

const membershipTitle = (tier: MembershipTier) => `Membership ${getMembershipPlan(tier).name}`;

const membershipTransactions = DUMMY_USERS.filter((user) => user.membership !== "basic").map((user, index) =>
  transaction(`trx-m-${index + 1}`, user.id, "membership", user.membership, membershipTitle(user.membership), getMembershipPlan(user.membership).price ?? 0, "berhasil", 20 + index)
);

const specialTransactions: Transaction[] = [
  transaction("trx-sobat-ebook", "user-sobat", "ebook", OWNED_EBOOK.id, OWNED_EBOOK.title, OWNED_EBOOK.price, "berhasil", 15),
  transaction("trx-sobat-pro", "user-sobat", "membership", "pro", membershipTitle("pro"), getMembershipPlan("pro").price ?? 0, "menunggu", 0),
  transaction("trx-galih-project", "user-galih", "project", PROJECT.id, PROJECT.title, PROJECT.price, "menunggu", 1),
  transaction("trx-dewi-ebook", "user-dewi", "ebook", OTHER_EBOOK.id, OTHER_EBOOK.title, OTHER_EBOOK.price, "berhasil", 0),
  transaction("trx-dewi-gagal", "user-dewi", "ebook", OWNED_EBOOK.id, OWNED_EBOOK.title, OWNED_EBOOK.price, "gagal", 3),
  transaction("trx-budi-ebook", "user-budi", "ebook", OTHER_EBOOK.id, OTHER_EBOOK.title, OTHER_EBOOK.price, "kedaluwarsa", 4),
  transaction("trx-bima-project", "user-bima", "project", PROJECT.id, PROJECT.title, PROJECT.price, "refund", 12),
];

function entitlementOf(trx: Transaction): Entitlement {
  return {
    id: `akses-${trx.id}`,
    userId: trx.userId,
    kind: trx.kind,
    itemId: trx.itemId,
    itemTitle: trx.itemTitle,
    source: "pembelian",
    transactionId: trx.id,
    active: trx.status === "berhasil",
    grantedAt: trx.createdAt,
    grantedBy: null,
    alasan: null,
    revokedAt: trx.status === "refund" ? trx.history[trx.history.length - 1].at : null,
    revokedBy: trx.status === "refund" ? "user-admin" : null,
    revokeReason: trx.status === "refund" ? trx.history[trx.history.length - 1].alasan : null,
  };
}

function claim(id: string, userId: string, product: Product, days: number): { claim: CreditClaim; entitlement: Entitlement } {
  return {
    claim: { id, userId, kind: product.kind, itemId: product.id, itemTitle: product.title, at: daysAgo(days) },
    entitlement: {
      id: `akses-${id}`,
      userId,
      kind: product.kind,
      itemId: product.id,
      itemTitle: product.title,
      source: "klaim-kredit",
      transactionId: null,
      active: true,
      grantedAt: daysAgo(days),
      grantedBy: null,
      alasan: null,
      revokedAt: null,
      revokedBy: null,
      revokeReason: null,
    },
  };
}

const claimed = [claim("klaim-andi-ebook", "user-andi", OWNED_EBOOK, 8), claim("klaim-rahma-ebook", "user-rahma", OTHER_EBOOK, 10), claim("klaim-rahma-project", "user-rahma", PROJECT, 9)];

const transactions = [...specialTransactions, ...membershipTransactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const DUMMY_COMMERCE = {
  products,
  transactions,
  entitlements: [...transactions.filter((item) => item.status === "berhasil" || item.status === "refund").map(entitlementOf), ...claimed.map((item) => item.entitlement)],
  claims: claimed.map((item) => item.claim),
};
