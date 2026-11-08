"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { useMaintenance } from "@/components/maintenance/useMaintenance";
import { ACTIVE_PROMO } from "@/data/promoPopups";
import { consumePromoPending, dismissPromo, isPromoDismissed } from "@/lib/promo";
import { useSession } from "@/lib/session";
import { useViewMode } from "@/lib/viewMode";

// Popup promosi di tengah layar setelah pengguna masuk (PRD 4.7). Hanya di Mode Belajar,
// dan mengalah bila popup maintenance sedang tampil.
export default function PromoPopup() {
  const session = useSession();
  const { isRoleMode } = useViewMode();
  const { isLoaded, current, phase } = useMaintenance();
  const [isOpen, setIsOpen] = useState(false);
  const isMaintenancePopupTime = Boolean(current) && (phase === "terjadwal" || phase === "persiapan");

  useEffect(() => {
    // Menunggu status maintenance termuat, agar tidak bertabrakan dengan popup maintenance.
    if (!session || !ACTIVE_PROMO || !isLoaded) return;
    // Tanda dari login dipakai sekali, di halaman pertama setelah login.
    if (!consumePromoPending()) return;
    if (isRoleMode || isMaintenancePopupTime || isPromoDismissed(session.email, ACTIVE_PROMO.id)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- membuka popup sekali setelah login
    setIsOpen(true);
  }, [session, isLoaded, isRoleMode, isMaintenancePopupTime]);

  if (!session || !ACTIVE_PROMO || !isOpen) return null;
  const promo = ACTIVE_PROMO;

  const close = () => setIsOpen(false);
  const neverShowAgain = () => {
    dismissPromo(session.email, promo.id);
    setIsOpen(false);
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card text-foreground shadow-xl">
          <div className="relative aspect-[12/5] w-full overflow-hidden rounded-t-2xl bg-muted">
            <Image src={promo.image} alt="" fill sizes="448px" className="object-cover" />
            <Dialog.Close
              aria-label="Tutup"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-accent">{promo.eyebrow}</p>
            <Dialog.Title className="mt-1 text-lg font-bold leading-snug">{promo.title}</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">{promo.description}</Dialog.Description>

            <div className="mt-5 flex flex-col gap-2">
              {promo.cta && (
                <Link
                  href={promo.cta.href}
                  onClick={close}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  {promo.cta.label}
                </Link>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={neverShowAgain}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Jangan tampilkan lagi
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-3 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  Nanti saja
                </button>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
