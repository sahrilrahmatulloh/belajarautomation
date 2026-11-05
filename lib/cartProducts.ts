import { BOOKS } from "@/data/books";
import { getMembershipPlan, MEMBERSHIP_PLANS } from "@/data/membership";
import { CartProduct } from "@/types/Cart";
import { MembershipTier } from "@/types/Membership";

export function getEbookProductId(slug: string) {
  return `ebook:${slug}`;
}

export function getMembershipProductId(tier: MembershipTier) {
  return `membership:${tier}`;
}

export function isMembershipProductId(id: string) {
  return id.startsWith("membership:");
}

// Judul dan harga selalu diambil dari data, keranjang hanya menyimpan id.
export function getCartProduct(id: string): CartProduct | undefined {
  const plan = MEMBERSHIP_PLANS.find(
    (item) => item.price !== null && getMembershipProductId(item.tier) === id
  );
  if (plan) {
    const { ebookCredits, projectCredits } = getMembershipPlan(plan.tier);
    return {
      id,
      kind: "membership",
      title: `Membership ${plan.name} Lifetime`,
      subtitle: `Course premium, ${ebookCredits} kredit eBook, ${projectCredits} kredit project`,
      price: plan.price!,
      href: "/membership",
    };
  }

  const book = BOOKS.find(
    (item) => getEbookProductId(item.slug) === id
  );

  if (!book) {
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
