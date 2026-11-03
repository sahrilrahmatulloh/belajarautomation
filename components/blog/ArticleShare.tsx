"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Link2, Share2, X } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const MESSAGE_DURATION = 2500;

const WHATSAPP_ICON =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";
const LINKEDIN_ICON =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const subscribeToNothing = () => () => {};

// Alamat situs saat ini, agar tautan yang dibagikan benar di semua lingkungan.
function useOrigin() {
  return useSyncExternalStore(subscribeToNothing, () => window.location.origin, () => "");
}

const optionClass =
  "inline-flex min-h-11 items-center gap-2.5 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-accent";

function BrandIcon({ path, className }: { path: string; className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`h-4 w-4 shrink-0 ${className}`}>
      <path d={path} />
    </svg>
  );
}

interface ShareTarget {
  title: string;
  slug: string;
}

function useCopyLink(slug: string) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), MESSAGE_DURATION);
    return () => window.clearTimeout(timer);
  }, [message]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/blog/${slug}`);
      setMessage("Tautan disalin");
    } catch {
      setMessage("Tautan gagal disalin");
    }
  };

  return { message, copy };
}

function ShareToast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className={
        message
          ? "fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium whitespace-nowrap text-background shadow-lg"
          : "sr-only"
      }
    >
      {message}
    </div>
  );
}

function ShareOptions({
  title,
  slug,
  onCopy,
  className,
}: ShareTarget & {
  onCopy: () => void;
  className: string;
}) {
  const url = `${useOrigin()}/blog/${slug}`;

  return (
    <div className={className}>
      <button type="button" onClick={onCopy} className={optionClass}>
        <Link2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        Salin Tautan
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={optionClass}
      >
        <BrandIcon path={WHATSAPP_ICON} className="text-emerald-600 dark:text-emerald-400" />
        WhatsApp
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={optionClass}
      >
        <BrandIcon path={LINKEDIN_ICON} className="text-blue-700 dark:text-blue-400" />
        LinkedIn
      </a>
    </div>
  );
}

const triggerClass =
  "inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/40 px-4 text-sm font-semibold text-blue-700 transition-colors hover:bg-primary/10 dark:text-blue-300";

// Tombol "Bagikan" di atas artikel: panel dari bawah di mobile, popover di desktop.
export function ArticleShareButton({ title, slug }: ShareTarget) {
  const { message, copy } = useCopyLink(slug);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const trigger = (
    <>
      <Share2 className="h-4 w-4" aria-hidden="true" />
      Bagikan
    </>
  );

  return (
    <>
      <div className="md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger className={triggerClass}>{trigger}</SheetTrigger>
          <SheetContent side="bottom" showCloseButton={false} className="gap-3 rounded-t-2xl p-4 pb-6 text-sm">
            <div className="flex items-center justify-between gap-3">
              <SheetTitle className="text-base font-semibold">Bagikan Artikel</SheetTitle>
              <SheetClose
                aria-label="Tutup"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-accent"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </SheetClose>
            </div>
            <ShareOptions
              title={title}
              slug={slug}
              onCopy={() => {
                setSheetOpen(false);
                void copy();
              }}
              className="flex flex-col gap-2 [&>*]:w-full"
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger className={triggerClass}>{trigger}</PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} aria-label="Bagikan Artikel" className="w-60 gap-0 p-2">
            <ShareOptions
              title={title}
              slug={slug}
              onCopy={() => {
                setPopoverOpen(false);
                void copy();
              }}
              className="flex flex-col gap-1.5 [&>*]:w-full"
            />
          </PopoverContent>
        </Popover>
      </div>

      <ShareToast message={message} />
    </>
  );
}

// Bagian "Bagikan Artikel" di bawah artikel.
export function ArticleShareSection({ title, slug }: ShareTarget) {
  const { message, copy } = useCopyLink(slug);

  return (
    <section aria-labelledby="bagikan-artikel" className="mt-10">
      <h2 id="bagikan-artikel" className="text-lg font-bold">
        Bagikan Artikel
      </h2>
      <ShareOptions title={title} slug={slug} onCopy={() => void copy()} className="mt-3 flex flex-wrap gap-2" />
      <ShareToast message={message} />
    </section>
  );
}
