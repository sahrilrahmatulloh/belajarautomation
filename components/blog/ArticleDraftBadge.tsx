// Artikel draf hanya sampai ke halaman saat lingkungan DEV (lib/blog.ts), jadi badge ini
// tidak pernah tampil di UAT dan Production.
export default function ArticleDraftBadge() {
  return (
    <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
      Draf
    </span>
  );
}
