// DATA DUMMY — hapus sebelum rilis (PRD FR-04).
// Skor terakhir akun demo per latihan. Status "Lulus" tetap berasal dari riwayat
// aktivitas (data/dummy/activity.ts); latihan yang ada di sini tetapi tidak ada di
// riwayat berarti belum lulus dan belum mendapat XP. Diperiksa oleh npm run check:activity.
export const DUMMY_CHALLENGE_SCORES: Record<string, number> = {
  "find-checkout-bug": 100,
  "kuis-qa-fundamental": 80,
  "playwright-locator": 100,
  "kuis-git-github": 50,
};
