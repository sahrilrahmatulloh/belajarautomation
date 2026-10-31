import { PaymentMethod } from "@/types/Cart";

// Pilihan tampilan saja; belum terhubung ke payment gateway.
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "qris",
    label: "QRIS",
    description: "Scan dengan aplikasi bank atau e-wallet apa pun",
  },
  {
    id: "virtual-account",
    label: "Virtual Account",
    description: "Transfer lewat ATM, mobile banking, atau internet banking",
  },
  {
    id: "e-wallet",
    label: "E-Wallet",
    description: "Bayar langsung dari saldo e-wallet",
  },
];
