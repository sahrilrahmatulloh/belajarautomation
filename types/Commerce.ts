import { MembershipTier } from "./Membership";

// Transaksi dan hak akses (PRD FR-10, FR-16 E, dan Bagian 5).
export type TransactionStatus = "menunggu" | "berhasil" | "gagal" | "kedaluwarsa" | "refund";

export type GatewayResult = Extract<TransactionStatus, "berhasil" | "gagal" | "kedaluwarsa">;

export type ProductKind = "ebook" | "project";

export type EntitlementKind = "membership" | ProductKind;

export type EntitlementSource = "pembelian" | "pemberian-manual" | "klaim-kredit";

export interface TransactionStatusChange {
  status: TransactionStatus;
  at: string;
  // Status hanya berubah dari payment gateway, kecuali refund oleh Admin.
  source: "gateway" | "admin";
  actorId: string | null;
  alasan: string | null;
}

export interface Transaction {
  id: string;
  userId: string;
  kind: EntitlementKind;
  // Tingkat membership atau id produk.
  itemId: string;
  // Judul dan nominal dicatat saat transaksi terjadi, jadi perubahan produk tidak memengaruhinya.
  itemTitle: string;
  amount: number;
  method: string;
  status: TransactionStatus;
  createdAt: string;
  history: TransactionStatusChange[];
}

export interface Entitlement {
  id: string;
  userId: string;
  kind: EntitlementKind;
  itemId: string;
  itemTitle: string;
  source: EntitlementSource;
  transactionId: string | null;
  active: boolean;
  grantedAt: string;
  grantedBy: string | null;
  alasan: string | null;
  revokedAt: string | null;
  revokedBy: string | null;
  revokeReason: string | null;
}

export interface CreditClaim {
  id: string;
  userId: string;
  kind: ProductKind;
  itemId: string;
  itemTitle: string;
  at: string;
}

export type ProductStatus = "draf" | "terbit";

export interface Product {
  id: string;
  kind: ProductKind;
  slug: string;
  title: string;
  description: string;
  cover: string;
  price: number;
  // Upload file masih simulasi: hanya nama file yang dicatat.
  fileName: string;
  status: ProductStatus;
  updatedAt: string;
}

export type ProductInput = Pick<Product, "kind" | "title" | "description" | "cover" | "price" | "fileName" | "status">;

export type { MembershipTier };
