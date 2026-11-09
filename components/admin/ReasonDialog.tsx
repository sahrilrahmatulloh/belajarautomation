"use client";

import { useState } from "react";

import ConfirmDialog from "@/components/common/ConfirmDialog";

const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm dark:bg-card";

// Konfirmasi dengan alasan wajib, untuk aksi yang mengubah hak akses, XP, status akun, atau uang
// (PRD FR-16).
export default function ReasonDialog({
  title,
  description,
  confirmLabel,
  reasonLabel = "Alasan",
  isDestructive = false,
  error,
  children,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  reasonLabel?: string;
  isDestructive?: boolean;
  error: string;
  children?: React.ReactNode;
  onConfirm: (alasan: string) => void;
  onClose: () => void;
}) {
  const [alasan, setAlasan] = useState("");

  return (
    <ConfirmDialog
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      isDestructive={isDestructive}
      isConfirmDisabled={!alasan.trim()}
      error={error}
      onConfirm={() => onConfirm(alasan)}
      onClose={onClose}
    >
      {children}
      <label className="mt-3 block text-sm font-medium">
        {reasonLabel}
        <textarea rows={3} value={alasan} onChange={(event) => setAlasan(event.target.value)} className={fieldClass} />
      </label>
    </ConfirmDialog>
  );
}
