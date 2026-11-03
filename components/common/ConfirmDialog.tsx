"use client";

import { Dialog } from "@base-ui/react/dialog";

// Dialog konfirmasi aksi penting, dengan isian tambahan opsional.
export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  isConfirmDisabled = false,
  isDestructive = false,
  error,
  children,
  onConfirm,
  onClose,
}: {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  isConfirmDisabled?: boolean;
  isDestructive?: boolean;
  error?: string;
  children?: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const confirmClass = isDestructive
    ? "bg-red-700 text-white enabled:hover:bg-red-800"
    : "bg-primary text-primary-foreground enabled:hover:bg-primary-hover";

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">{description}</Dialog.Description>
          {children}
          {error && <p role="alert" className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close className="min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent">
              Batal
            </Dialog.Close>
            <button
              type="button"
              disabled={isConfirmDisabled}
              onClick={onConfirm}
              className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground ${confirmClass}`}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
