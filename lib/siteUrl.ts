// Alamat situs untuk Open Graph dan sitemap. NEXT_PUBLIC_SITE_URL diisi saat domain
// sudah pasti; bila kosong memakai alamat dari Vercel, lalu localhost saat pengembangan.
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const SITE_URL = resolveSiteUrl();
