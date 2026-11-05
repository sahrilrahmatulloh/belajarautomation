"use client";

import { useState } from "react";
import Link from "next/link";

import { getMembershipPlan, MEMBERSHIP_PLANS } from "@/data/membership";
import { runContentAction } from "@/lib/content";
import { formatContentDate } from "@/lib/content/document";
import { formatRupiah } from "@/lib/format";
import { CreditClaim, Entitlement, EntitlementKind, EntitlementSource, Product, Transaction } from "@/types/Commerce";
import { ContentUser } from "@/types/ContentWorkflow";

import ReasonDialog from "./ReasonDialog";
import TransactionStatusBadge from "./TransactionStatusBadge";
import { MEMBERSHIP_LABELS } from "./useAdminData";

const panelClass = "rounded-2xl border border-border bg-card p-5 text-sm";
const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal dark:bg-card";

const SOURCE_LABELS: Record<EntitlementSource, string> = {
  pembelian: "Pembelian",
  "pemberian-manual": "Pemberian manual",
  "klaim-kredit": "Klaim kredit",
};

function GrantDialog({ userId, adminId, products, onClose }: { userId: string; adminId: string; products: Product[]; onClose: () => void }) {
  const [kind, setKind] = useState<EntitlementKind>("membership");
  const options =
    kind === "membership"
      ? MEMBERSHIP_PLANS.filter((plan) => plan.tier !== "basic").map((plan) => ({ id: plan.tier as string, label: `Membership ${plan.name}` }))
      : products.filter((product) => product.kind === kind).map((product) => ({ id: product.id, label: product.title }));
  const [itemId, setItemId] = useState("pro");
  const [error, setError] = useState("");
  const selected = options.some((option) => option.id === itemId) ? itemId : (options[0]?.id ?? "");

  const grant = async (alasan: string) => {
    const result = await runContentAction((repository) => repository.grantEntitlement(adminId, userId, { kind, itemId: selected }, alasan));
    if (result.ok) onClose();
    else setError(result.message);
  };

  return (
    <ReasonDialog
      title="Berikan hak akses manual"
      description='Dicatat sebagai "Pemberian manual" tanpa transaksi pembayaran, mis. kompensasi atau hadiah.'
      confirmLabel="Berikan akses"
      error={error}
      onConfirm={(alasan) => void grant(alasan)}
      onClose={onClose}
    >
      <label className="mt-3 block text-sm font-medium">
        Jenis
        <select value={kind} onChange={(event) => setKind(event.target.value as EntitlementKind)} className={fieldClass}>
          <option value="membership">Membership</option>
          <option value="ebook">eBook</option>
          <option value="project">Project</option>
        </select>
      </label>
      <label className="mt-3 block text-sm font-medium">
        Item
        <select value={selected} onChange={(event) => setItemId(event.target.value)} className={fieldClass}>
          {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </label>
    </ReasonDialog>
  );
}

// Membership, hak akses, klaim kredit, dan riwayat transaksi di detail pengguna (PRD FR-16 C dan E).
export default function UserAccessSections({
  user,
  adminId,
  entitlements,
  claims,
  transactions,
  products,
}: {
  user: ContentUser;
  adminId: string;
  entitlements: Entitlement[];
  claims: CreditClaim[];
  transactions: Transaction[];
  products: Product[];
}) {
  const [isGranting, setIsGranting] = useState(false);
  const [revoking, setRevoking] = useState<Entitlement | null>(null);
  const [revokeError, setRevokeError] = useState("");

  const plan = getMembershipPlan(user.membership);
  const usedCredits = (kind: "ebook" | "project") => claims.filter((claim) => claim.kind === kind).length;

  const revoke = async (alasan: string) => {
    if (!revoking) return;
    const result = await runContentAction((repository) => repository.revokeEntitlement(adminId, revoking.id, alasan));
    if (result.ok) setRevoking(null);
    else setRevokeError(result.message);
  };

  return (
    <>
      <section aria-labelledby="membership-akses" className={`${panelClass} lg:col-span-2`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="membership-akses" className="font-bold">Membership dan Hak Akses</h2>
          <button type="button" onClick={() => setIsGranting(true)} className="min-h-10 rounded-xl border border-border px-4 font-semibold transition-colors hover:bg-accent">
            Berikan hak akses manual
          </button>
        </div>
        <dl className="mt-3 grid gap-2 sm:grid-cols-3">
          <div><dt className="text-muted-foreground">Membership</dt><dd className="font-medium">{MEMBERSHIP_LABELS[user.membership]}</dd></div>
          <div><dt className="text-muted-foreground">Kredit eBook terpakai</dt><dd className="font-medium">{usedCredits("ebook")} dari {plan.ebookCredits}</dd></div>
          <div><dt className="text-muted-foreground">Kredit project terpakai</dt><dd className="font-medium">{usedCredits("project")} dari {plan.projectCredits}</dd></div>
        </dl>
        {entitlements.length > 0 ? (
          <ul aria-label="Daftar hak akses" className="mt-4 space-y-2">
            {entitlements.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3">
                <span className="min-w-0">
                  <span className="block font-medium">{item.itemTitle}</span>
                  <span className="block text-muted-foreground">
                    {SOURCE_LABELS[item.source]} · {formatContentDate(item.grantedAt)} · {item.active ? "Aktif" : "Dicabut"}
                  </span>
                  {item.alasan && <span className="block text-muted-foreground">Alasan: {item.alasan}</span>}
                  {item.revokeReason && <span className="block text-muted-foreground">Alasan dicabut: {item.revokeReason}</span>}
                </span>
                {item.source === "pemberian-manual" && item.active && (
                  <button
                    type="button"
                    aria-label={`Cabut hak akses ${item.itemTitle}`}
                    onClick={() => {
                      setRevokeError("");
                      setRevoking(item);
                    }}
                    className="min-h-9 rounded-lg border border-destructive/40 px-3 font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Cabut
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-muted-foreground">Belum ada hak akses.</p>
        )}
      </section>

      <section aria-labelledby="riwayat-transaksi" className={panelClass}>
        <h2 id="riwayat-transaksi" className="font-bold">Riwayat Transaksi</h2>
        {transactions.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {transactions.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0">
                  <Link href={`/admin/transaksi/${item.id}`} className="block font-medium text-primary-accent underline-offset-2 hover:underline">{item.itemTitle}</Link>
                  <span className="block text-muted-foreground">{formatRupiah(item.amount)} · {formatContentDate(item.createdAt)}</span>
                </span>
                <TransactionStatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">Belum ada transaksi.</p>
        )}
      </section>

      <section aria-labelledby="riwayat-klaim" className={panelClass}>
        <h2 id="riwayat-klaim" className="font-bold">Riwayat Klaim Kredit</h2>
        {claims.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {claims.map((claim) => (
              <li key={claim.id}>
                <span className="block font-medium">{claim.itemTitle}</span>
                <span className="block text-muted-foreground">{claim.kind === "ebook" ? "eBook" : "Project"} · {formatContentDate(claim.at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">Belum ada klaim kredit.</p>
        )}
      </section>

      {isGranting && <GrantDialog userId={user.id} adminId={adminId} products={products} onClose={() => setIsGranting(false)} />}
      {revoking && (
        <ReasonDialog
          title="Cabut hak akses manual?"
          description={`${user.name} kehilangan akses ke "${revoking.itemTitle}". Catatannya tetap tersimpan.`}
          confirmLabel="Cabut akses"
          isDestructive
          error={revokeError}
          onConfirm={(alasan) => void revoke(alasan)}
          onClose={() => setRevoking(null)}
        />
      )}
    </>
  );
}
