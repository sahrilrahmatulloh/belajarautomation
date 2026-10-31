export type CartProductKind = "ebook" | "premium";

export interface CartProduct {
  id: string;
  kind: CartProductKind;
  title: string;
  subtitle: string;
  price: number;
  href: string;
  cover?: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  description: string;
}
