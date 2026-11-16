"use client";

import { useState } from "react";

import { getRank } from "@/data/ranks";
import { runContentAction } from "@/lib/content";
import { formatNumber } from "@/lib/format";

import ReasonDialog from "./ReasonDialog";

const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal dark:bg-card";

// Koreksi XP (PRD FR-16 D): dari Moderasi (flagId diisi, penandaan ikut ditangani) atau dari detail
// pengguna (flagId null). Dicatat sebagai transaksi koreksi; riwayat lama tidak diubah.
export default function XpCorrectionDialog({
  userId,
  name,
  xp,
  adminId,
  flagId = null,
  onClose,
}: {
  userId: string;
  name: string;
  xp: number;
  adminId: string;
  flagId?: string | null;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const parsed = Number(amount);
  const next = xp + (Number.isFinite(parsed) ? parsed : 0);

  const save = async (alasan: string) => {
    const result = await runContentAction((repository) => repository.correctXp(adminId, userId, parsed, alasan, flagId));
    if (result.ok) onClose();
    else setError(result.message);
  };

  return (
    <ReasonDialog
      title={`Koreksi XP ${name}`}
      description="Dicatat sebagai transaksi XP koreksi, dan riwayat lama tidak diubah. Rank dihitung ulang."
      confirmLabel="Simpan koreksi"
      error={error}
      onConfirm={(alasan) => void save(alasan)}
      onClose={onClose}
    >
      <label className="mt-3 block text-sm font-medium">
        Jumlah koreksi (negatif untuk mengurangi)
        <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className={fieldClass} />
      </label>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatNumber(xp)} XP menjadi {formatNumber(Math.max(0, next))} XP ({getRank(Math.max(0, next)).name})
      </p>
    </ReasonDialog>
  );
}
