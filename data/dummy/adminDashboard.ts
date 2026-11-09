// DATA DUMMY — hapus sebelum rilis.
// Angka contoh Dashboard Admin untuk bagian yang belum punya data asli: konten (alur Creator dan
// Reviewer belum di database) dan transaksi (pembayaran belum dibangun). Tampil di DEV dan UAT
// dengan label "Data contoh" (keputusan pemilik), tidak pernah di Production.
export const ADMIN_DASHBOARD_SAMPLE = {
  contentByStatus: { draf: 6, menungguReview: 4, perluRevisi: 2, disetujui: 3, terbit: 18 },
  unassignedReview: 2,
  longWaitingReview: 1,
  transactionsToday: 7,
  pendingPayments: 2,
  refundRequests: 1,
} as const;
