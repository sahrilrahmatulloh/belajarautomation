// Lingkungan aplikasi (PRD Bagian 13.3): dev (branch develop), uat (branch uat),
// dan production (branch main). Diatur lewat NEXT_PUBLIC_APP_ENV; kosong atau
// nilai tak dikenal dianggap "dev". Berbeda dari NODE_ENV, yang hanya
// membedakan `next dev` dan build Next.js.
export type AppEnv = "dev" | "uat" | "production";

const APP_ENVS: readonly AppEnv[] = ["dev", "uat", "production"];

// Ditulis lengkap agar Next.js bisa menyisipkan nilainya ke kode browser saat build.
const rawAppEnv = process.env.NEXT_PUBLIC_APP_ENV;

export const APP_ENV: AppEnv = APP_ENVS.includes(rawAppEnv as AppEnv) ? (rawAppEnv as AppEnv) : "dev";

// Fitur bantu pengembangan (badge "Draf", info data dummy) hanya aktif di dev.
export const isDev = APP_ENV === "dev";
export const isUat = APP_ENV === "uat";
export const isProduction = APP_ENV === "production";
