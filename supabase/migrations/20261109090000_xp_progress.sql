-- Progres belajar dan XP (PRD FR-05).
-- XP dicatat oleh server Next.js lewat service role setelah lesson divalidasi atau kuis dan
-- challenge dinilai dengan kunci jawaban rahasia. Browser hanya bisa membaca progresnya sendiri.
-- Setiap perolehan XP tercatat di xp_transactions dengan kunci unik per pengguna dan per
-- aktivitas, jadi XP ganda tidak mungkin terjadi walau permintaan dikirim berulang.

-- ---------------------------------------------------------------------------
-- Tabel
-- ---------------------------------------------------------------------------

create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_slug)
);

create table public.challenge_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  challenge_slug text not null,
  challenge_type text not null check (challenge_type in ('quiz', 'bug-hunt', 'test-case', 'locator')),
  score integer not null check (score between 0 and 100),
  passed boolean not null,
  created_at timestamptz not null default now()
);

create index challenge_attempts_user_slug_idx on public.challenge_attempts (user_id, challenge_slug, created_at desc);

create table public.xp_transactions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  -- lesson: course/lesson, course: bonus seluruh lesson, quiz dan challenge: slug latihan.
  source_type text not null check (source_type in ('lesson', 'course', 'quiz', 'challenge')),
  source_id text not null,
  xp integer not null check (xp > 0),
  created_at timestamptz not null default now(),
  unique (user_id, source_type, source_id)
);

create index xp_transactions_user_created_idx on public.xp_transactions (user_id, created_at desc);

comment on table public.xp_transactions is
  'Riwayat XP (PRD FR-05). Hanya ditulis fungsi record_* lewat service role; satu baris per aktivitas.';

-- ---------------------------------------------------------------------------
-- Hak akses: pengguna hanya membaca miliknya; tidak ada penulisan langsung
-- ---------------------------------------------------------------------------

alter table public.lesson_progress enable row level security;
alter table public.challenge_attempts enable row level security;
alter table public.xp_transactions enable row level security;

revoke all on public.lesson_progress, public.challenge_attempts, public.xp_transactions from anon, authenticated;
grant select on public.lesson_progress, public.challenge_attempts, public.xp_transactions to authenticated;

create policy "Pengguna membaca progres lesson-nya sendiri"
  on public.lesson_progress for select to authenticated using (user_id = (select auth.uid()));
create policy "Pengguna membaca percobaannya sendiri"
  on public.challenge_attempts for select to authenticated using (user_id = (select auth.uid()));
create policy "Pengguna membaca riwayat XP-nya sendiri"
  on public.xp_transactions for select to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Penambah XP (internal)
-- ---------------------------------------------------------------------------

-- Mengembalikan XP yang benar-benar ditambahkan (0 bila aktivitas ini sudah pernah dapat XP).
create function private.add_xp(p_user uuid, p_type text, p_source text, p_xp integer)
returns integer
language plpgsql
set search_path = ''
as $$
declare
  awarded integer;
begin
  insert into public.xp_transactions (user_id, source_type, source_id, xp)
  values (p_user, p_type, p_source, p_xp)
  on conflict (user_id, source_type, source_id) do nothing
  returning xp into awarded;

  if awarded is null then
    return 0;
  end if;

  insert into public.user_xp_summary (user_id, total_xp)
  values (p_user, awarded)
  on conflict (user_id) do update
    set total_xp = public.user_xp_summary.total_xp + excluded.total_xp, updated_at = now();
  return awarded;
end;
$$;

-- ---------------------------------------------------------------------------
-- Pencatat untuk server (service role saja)
-- ---------------------------------------------------------------------------

-- Lesson selesai: +XP lesson sekali, dan bonus course saat seluruh lesson course itu selesai.
-- Server memvalidasi lesson dan mengirim jumlah lesson course dari katalog.
create function public.record_lesson_completion(
  p_user uuid,
  p_course text,
  p_lesson text,
  p_course_lesson_count integer,
  p_lesson_xp integer,
  p_course_xp integer
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_new boolean := false;
  lesson_xp integer := 0;
  course_xp integer := 0;
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
    lesson_xp := private.add_xp(p_user, 'lesson', p_course || '/' || p_lesson, p_lesson_xp);
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
    'xp_awarded', lesson_xp + course_xp,
    'course_bonus', course_xp > 0,
    'total_xp', coalesce(summary.total_xp, 0),
    'lessons_completed', coalesce(summary.lessons_completed, 0)
  );
end;
$$;

-- Percobaan kuis atau challenge yang sudah dinilai server. Kelulusan pertama menambah jumlah
-- challenge selesai dan XP (0 untuk Test Case yang tidak tervalidasi otomatis).
create function public.record_challenge_attempt(
  p_user uuid,
  p_slug text,
  p_type text,
  p_score integer,
  p_passed boolean,
  p_xp integer
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  first_pass boolean;
  awarded integer := 0;
  summary public.user_xp_summary%rowtype;
begin
  first_pass := p_passed and not exists (
    select 1 from public.challenge_attempts
    where user_id = p_user and challenge_slug = p_slug and passed
  );

  insert into public.challenge_attempts (user_id, challenge_slug, challenge_type, score, passed)
  values (p_user, p_slug, p_type, p_score, p_passed);

  if first_pass then
    insert into public.user_xp_summary (user_id, challenges_completed)
    values (p_user, 1)
    on conflict (user_id) do update
      set challenges_completed = public.user_xp_summary.challenges_completed + 1, updated_at = now();
    if p_xp > 0 then
      awarded := private.add_xp(p_user, case when p_type = 'quiz' then 'quiz' else 'challenge' end, p_slug, p_xp);
    end if;
  end if;

  select * into summary from public.user_xp_summary where user_id = p_user;
  return json_build_object(
    'first_pass', first_pass,
    'xp_awarded', awarded,
    'total_xp', coalesce(summary.total_xp, 0),
    'challenges_completed', coalesce(summary.challenges_completed, 0)
  );
end;
$$;

revoke all on function private.add_xp(uuid, text, text, integer) from public, anon, authenticated;
revoke all on function public.record_lesson_completion(uuid, text, text, integer, integer, integer) from public, anon, authenticated;
revoke all on function public.record_challenge_attempt(uuid, text, text, integer, boolean, integer) from public, anon, authenticated;
grant execute on function public.record_lesson_completion(uuid, text, text, integer, integer, integer) to service_role;
grant execute on function public.record_challenge_attempt(uuid, text, text, integer, boolean, integer) to service_role;

-- ---------------------------------------------------------------------------
-- Progres milik pengguna yang login (dibaca browser)
-- ---------------------------------------------------------------------------

create function public.get_my_progress()
returns json
language sql
stable
security invoker
set search_path = ''
as $$
  select json_build_object(
    'total_xp', coalesce(s.total_xp, 0),
    'lessons_completed', coalesce(s.lessons_completed, 0),
    'challenges_completed', coalesce(s.challenges_completed, 0),
    'lessons', coalesce((
      select json_agg(json_build_object('course_slug', lp.course_slug, 'lesson_slug', lp.lesson_slug, 'completed_at', lp.completed_at) order by lp.completed_at)
      from public.lesson_progress lp where lp.user_id = u.uid
    ), '[]'::json),
    'challenges', coalesce((
      select json_agg(row_to_json(c))
      from (
        select
          ca.challenge_slug as slug,
          bool_or(ca.passed) as passed,
          max(ca.score) as best_score,
          (array_agg(ca.score order by ca.created_at desc))[1] as last_score,
          count(*) as attempts
        from public.challenge_attempts ca
        where ca.user_id = u.uid
        group by ca.challenge_slug
      ) c
    ), '[]'::json)
  )
  from (select (select auth.uid()) as uid) u
  left join public.user_xp_summary s on s.user_id = u.uid
  where u.uid is not null;
$$;

revoke all on function public.get_my_progress() from public, anon;
grant execute on function public.get_my_progress() to authenticated;
