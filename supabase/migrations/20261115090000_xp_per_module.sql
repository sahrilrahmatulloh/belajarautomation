-- XP materi per modul, bukan per lesson (PRD FR-05, v2.47).
-- Lesson tetap dicatat selesai satu per satu (statistik "Materi Selesai"), tetapi XP materi baru
-- diberikan saat seluruh lesson dalam satu modul selesai. Bonus course tidak berubah.
-- Riwayat XP per lesson yang sudah ada tidak diubah; penyesuaiannya dicatat sebagai transaksi
-- koreksi baru lewat convert_lesson_xp_to_modules (PRD 27, koreksi = catatan baru).

alter table public.xp_transactions drop constraint xp_transactions_source_type_check;
alter table public.xp_transactions add constraint xp_transactions_source_type_check
  check (source_type in ('lesson', 'module', 'course', 'quiz', 'challenge', 'correction'));

comment on column public.xp_transactions.source_id is
  'lesson: course/lesson (aturan lama), module: course/modul-<id>, course: slug course, quiz dan challenge: slug latihan, correction: id koreksi.';

-- ---------------------------------------------------------------------------
-- Pencatat lesson selesai (menggantikan versi XP per lesson)
-- ---------------------------------------------------------------------------

drop function public.record_lesson_completion(uuid, text, text, integer, integer, integer);

-- Server memvalidasi lesson dan mengirim modul lesson tersebut beserta daftar lesson-nya dan
-- jumlah lesson course dari katalog.
create function public.record_lesson_completion(
  p_user uuid,
  p_course text,
  p_lesson text,
  p_module text,
  p_module_lessons text[],
  p_course_lesson_count integer,
  p_module_xp integer,
  p_course_xp integer
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_new boolean := false;
  module_xp integer := 0;
  course_xp integer := 0;
  done_in_module integer;
  done_in_course integer;
  summary public.user_xp_summary%rowtype;
begin
  insert into public.lesson_progress (user_id, course_slug, lesson_slug)
  values (p_user, p_course, p_lesson)
  on conflict do nothing;
  is_new := found;

  if is_new then
    insert into public.user_xp_summary (user_id, lessons_completed)
    values (p_user, 1)
    on conflict (user_id) do update
      set lessons_completed = public.user_xp_summary.lessons_completed + 1, updated_at = now();
  end if;

  select count(*) into done_in_module
  from public.lesson_progress
  where user_id = p_user and course_slug = p_course and lesson_slug = any (p_module_lessons);
  if coalesce(array_length(p_module_lessons, 1), 0) > 0 and done_in_module >= array_length(p_module_lessons, 1) then
    module_xp := private.add_xp(p_user, 'module', p_course || '/' || p_module, p_module_xp);
  end if;

  select count(*) into done_in_course
  from public.lesson_progress
  where user_id = p_user and course_slug = p_course;
  if p_course_lesson_count > 0 and done_in_course >= p_course_lesson_count then
    course_xp := private.add_xp(p_user, 'course', p_course, p_course_xp);
  end if;

  select * into summary from public.user_xp_summary where user_id = p_user;
  return json_build_object(
    'is_new', is_new,
    'xp_awarded', module_xp + course_xp,
    'module_bonus', module_xp > 0,
    'course_bonus', course_xp > 0,
    'total_xp', coalesce(summary.total_xp, 0),
    'lessons_completed', coalesce(summary.lessons_completed, 0)
  );
end;
$$;

revoke all on function public.record_lesson_completion(uuid, text, text, text, text[], integer, integer, integer) from public, anon, authenticated;
grant execute on function public.record_lesson_completion(uuid, text, text, text, text[], integer, integer, integer) to service_role;

-- ---------------------------------------------------------------------------
-- Penyesuaian akun lama (sekali per pengguna)
-- ---------------------------------------------------------------------------

-- Dipanggil scripts/convert-xp-to-modules.ts untuk akun yang sudah punya XP per lesson:
-- 1. Koreksi negatif sebesar seluruh XP lesson, dengan id tetap sehingga hanya terjadi sekali.
-- 2. XP modul untuk setiap modul yang seluruh lesson-nya sudah selesai (dihitung server dari katalog).
-- Riwayat lama tetap ada. Aman dipanggil berulang.
create function public.convert_lesson_xp_to_modules(p_user uuid, p_modules text[], p_module_xp integer)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  lesson_total integer;
  current_total integer;
  module_gain integer := 0;
  module_id text;
  converted boolean := false;
begin
  if not exists (
    select 1 from public.xp_transactions
    where user_id = p_user and source_type = 'correction' and source_id = 'aturan-xp-per-modul'
  ) then
    select coalesce(sum(xp), 0) into lesson_total
    from public.xp_transactions
    where user_id = p_user and source_type = 'lesson';

    if lesson_total > 0 then
      insert into public.user_xp_summary (user_id) values (p_user) on conflict (user_id) do nothing;
      select total_xp into current_total from public.user_xp_summary where user_id = p_user for update;

      insert into public.xp_transactions (user_id, source_type, source_id, xp, reason)
      values (
        p_user, 'correction', 'aturan-xp-per-modul', -lesson_total,
        'Penyesuaian aturan XP: XP materi diberikan per modul selesai, bukan per lesson (PRD v2.47).'
      );

      update public.user_xp_summary
      set total_xp = greatest(current_total - lesson_total, 0), updated_at = now()
      where user_id = p_user;
      converted := true;
    end if;
  end if;

  foreach module_id in array coalesce(p_modules, '{}') loop
    module_gain := module_gain + private.add_xp(p_user, 'module', module_id, p_module_xp);
  end loop;

  return json_build_object(
    'converted', converted,
    'module_xp', module_gain,
    'total_xp', (select total_xp from public.user_xp_summary where user_id = p_user)
  );
end;
$$;

revoke all on function public.convert_lesson_xp_to_modules(uuid, text[], integer) from public, anon, authenticated;
grant execute on function public.convert_lesson_xp_to_modules(uuid, text[], integer) to service_role;
