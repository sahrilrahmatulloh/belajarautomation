import { BOOKS } from "@/data/books";
import { DUMMY_PREMIUM_PRICE } from "@/data/dummy/pricing";
import { CartProduct } from "@/types/Cart";

export const PREMIUM_PRODUCT_ID = "premium-lifetime";

export function getEbookProductId(slug: string) {
  return `ebook:${slug}`;
}

// Judul dan harga selalu diambil dari data, keranjang hanya menyimpan id.
export function getCartProduct(id: string): CartProduct | undefined {
  if (id === PREMIUM_PRODUCT_ID) {
    return {
      id,
      kind: "premium",
      title: "Premium Lifetime",
      subtitle: "Tema visual, warna aksen, 3 klaim eBook, 3 klaim project",
      price: DUMMY_PREMIUM_PRICE,
      href: "/premium",
    };
  }

  const book = BOOKS.find(
    (item) => getEbookProductId(item.slug) === id
  );

  if (!book || book.owned) {
    return undefined;
  }

  return {
    id,
    kind: "ebook",
    title: book.title,
    subtitle: `eBook ${book.format} · ${book.pages} halaman`,
    price: book.price,
    href: `/ebooks/${book.slug}`,
    cover: book.cover,
  };
}
