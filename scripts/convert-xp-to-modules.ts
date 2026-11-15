// Penyesuaian XP akun lama ke aturan XP per modul (PRD FR-05 v2.47). Dijalankan sekali per
// lingkungan setelah migrasi 20261115090000_xp_per_module.sql diterapkan:
//
//   npx -y tsx --env-file=.env.local scripts/convert-xp-to-modules.ts          (pratinjau)
//   npx -y tsx --env-file=.env.local scripts/convert-xp-to-modules.ts --apply  (menerapkan)
//
// Untuk setiap akun yang punya progres lesson: modul yang seluruh lesson-nya selesai dihitung
// dari katalog, lalu public.convert_lesson_xp_to_modules mencatat koreksi negatif sebesar XP
// lesson lama (sekali saja) dan XP modul. Riwayat lama tidak diubah. Aman dijalankan ulang.
import { createClient } from "@supabase/supabase-js";

import { XP_PER_MODULE } from "@/data/xp";
import { completedModules } from "@/lib/xpRules";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const apply = process.argv.includes("--apply");

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi (mis. lewat --env-file=.env.local).");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  const { data: rows, error } = await admin.from("lesson_progress").select("user_id, course_slug, lesson_slug");
  if (error) throw new Error(`Gagal membaca lesson_progress: ${error.message}`);

  // Lesson selesai per pengguna per course.
  const byUser = new Map<string, Map<string, Set<string>>>();
  for (const row of rows ?? []) {
    const courses = byUser.get(row.user_id) ?? new Map<string, Set<string>>();
    courses.set(row.course_slug, (courses.get(row.course_slug) ?? new Set()).add(row.lesson_slug));
    byUser.set(row.user_id, courses);
  }

  console.log(`${byUser.size} akun dengan progres lesson. Mode: ${apply ? "MENERAPKAN" : "pratinjau (tambahkan --apply untuk menerapkan)"}`);
  for (const [userId, courses] of byUser) {
    const modules = [...courses].flatMap(([courseSlug, lessons]) =>
      completedModules(courseSlug, lessons).map((module) => `${courseSlug}/${module.key}`)
    );
    if (!apply) {
      console.log(`- ${userId}: ${modules.length} modul selesai (${modules.join(", ") || "-"})`);
      continue;
    }
    const { data, error: rpcError } = await admin.rpc("convert_lesson_xp_to_modules", {
      p_user: userId,
      p_modules: modules,
      p_module_xp: XP_PER_MODULE,
    });
    if (rpcError) throw new Error(`Gagal menyesuaikan ${userId}: ${rpcError.message}`);
    console.log(`- ${userId}: ${JSON.stringify(data)}`);
  }
}

main().catch((reason: unknown) => {
  console.error(reason instanceof Error ? reason.message : reason);
  process.exit(1);
});
