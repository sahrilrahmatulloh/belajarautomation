"use server";

import { XP_PER_COURSE_COMPLETION, XP_PER_LESSON } from "@/data/xp";
import { getLessonPageData } from "@/lib/courseLessons";
import { showsDraftLearning } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedUserId } from "@/lib/xp/record";
import { LessonCompletionResult } from "@/types/Xp";

interface LessonRecordRow {
  xp_awarded: number;
  course_bonus: boolean;
  total_xp: number;
  lessons_completed: number;
}

// Menandai lesson selesai untuk akun Supabase (PRD FR-05): +XP lesson sekali, dan bonus
// course saat seluruh lesson course itu selesai. Lesson divalidasi dari katalog di server.
export async function completeLessonAction(courseSlug: string, lessonSlug: string): Promise<LessonCompletionResult> {
  const data = typeof courseSlug === "string" && typeof lessonSlug === "string" ? getLessonPageData(courseSlug, lessonSlug) : null;
  if (!data) return { ok: false, message: "Lesson tidak ditemukan." };
  // Course draf hanya bisa diselesaikan di DEV dan UAT (lib/env.ts).
  if (data.course.contentStatus === "draft" && !showsDraftLearning) return { ok: false, message: "Lesson ini belum terbit." };
  // Hak akses membership belum tersambung ke backend (Fase 5), jadi XP course premium belum bisa dicatat.
  if (data.course.access === "premium") {
    return { ok: false, message: "XP course premium tersedia setelah hak akses membership aktif." };
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: "Sesi sudah berakhir. Silakan masuk lagi." };
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, message: "Pencatatan XP belum aktif. Coba lagi nanti." };

  const { data: row, error } = await admin.rpc("record_lesson_completion", {
    p_user: userId,
    p_course: courseSlug,
    p_lesson: lessonSlug,
    p_course_lesson_count: data.total,
    p_lesson_xp: XP_PER_LESSON,
    p_course_xp: XP_PER_COURSE_COMPLETION,
  });
  if (error || !row) return { ok: false, message: "Progres belum tersimpan. Coba lagi beberapa saat lagi." };

  const result = row as LessonRecordRow;
  return {
    ok: true,
    xpAwarded: result.xp_awarded,
    courseBonus: result.course_bonus,
    totalXp: result.total_xp,
    lessonsCompleted: result.lessons_completed,
  };
}
