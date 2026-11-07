// Konfigurasi Supabase yang aman dipakai di browser maupun server.
// Hanya URL project dan publishable key (dibatasi RLS). Kunci rahasia
// (service role) tidak pernah dibaca dari file ini.
//
// process.env ditulis lengkap agar Next.js dapat menyisipkan nilainya saat build.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseUrl = url.replace(/\/+$/, "");
export const supabasePublishableKey = publishableKey;

// Selama variabel belum diisi (mis. di CI atau sebelum project dibuat),
// aplikasi tetap berjalan dengan data dummy dan proxy tidak melakukan apa-apa.
export const isSupabaseConfigured = supabaseUrl.length > 0 && supabasePublishableKey.length > 0;
