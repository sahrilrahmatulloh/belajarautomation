import Link from "next/link";
import { Crown } from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { formatRupiah } from "@/lib/format";
import { CartProduct } from "@/types/Cart";

interface CartItemRowProps {
  product: CartProduct;
  action?: React.ReactNode;
}

export default function CartItemRow({
  product,
  action,
}: CartItemRowProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
        {product.cover ? (
          <ContentCover
            src={product.cover}
            title={product.title}
            category="eBook"
            kind="book"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-300">
            <Crown className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={product.href}
          className="line-clamp-2 text-sm font-semibold hover:underline"
        >
          {product.title}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {product.subtitle}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="text-sm font-bold tabular-nums">
          {formatRupiah(product.price)}
        </p>
        {action}
      </div>
    </div>
  );
}
