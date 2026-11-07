-- Pengaturan Informasi Profil (PRD FR-13): nama tampilan, Tentang saya (bio), dan
-- penggantian username dengan jeda 30 hari. Email diubah lewat Supabase Auth.

-- ---------------------------------------------------------------------------
-- Batas panjang di database
-- ---------------------------------------------------------------------------

alter table public.profiles
  add constraint profiles_display_name_length check (char_length(display_name) <= 100),
  add constraint profiles_bio_length check (char_length(bio) <= 160);

-- Perubahan profil hanya lewat fungsi di bawah, agar aturannya tidak bisa dilewati
-- dari browser. Hak ubah kolom langsung dari migrasi pertama dicabut.
revoke update (display_name, bio, avatar_id) on public.profiles from authenticated;

-- ---------------------------------------------------------------------------
-- Data akun: ditambah bio dan waktu penggantian username terakhir
-- ---------------------------------------------------------------------------

create or replace function public.get_my_account()
returns json
language sql
stable
security invoker
set search_path = ''
as $$
  select json_build_object(
    'display_name', p.display_name,
    'username', p.username,
    'bio', p.bio,
    'username_changed_at', p.username_changed_at,
    'status', p.status,
    'roles', coalesce(
      (select json_agg(ur.role order by ur.role) from public.user_roles ur where ur.user_id = p.id),
      '[]'::json
    )
  )
  from public.profiles p
  where p.id = (select auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Nama tampilan dan Tentang saya
-- ---------------------------------------------------------------------------

create function public.update_profile(new_display_name text, new_bio text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  clean_name text := trim(coalesce(new_display_name, ''));
  clean_bio text := trim(coalesce(new_bio, ''));
begin
  if uid is null then
    raise exception 'tidak_login' using errcode = '42501';
  end if;
  if clean_name = '' then
    raise exception 'nama_wajib' using errcode = 'P0001';
  end if;
  if char_length(clean_name) > 100 then
    raise exception 'nama_terlalu_panjang' using errcode = 'P0001';
  end if;
  if char_length(clean_bio) > 160 then
    raise exception 'bio_terlalu_panjang' using errcode = 'P0001';
  end if;

  update public.profiles
  set display_name = clean_name, bio = clean_bio
  where id = uid and status = 'active';

  if not found then
    raise exception 'akun_tidak_aktif' using errcode = '42501';
  end if;
end;
$$;

revoke all on function public.update_profile(text, text) from public, anon;
grant execute on function public.update_profile(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Ganti username, paling cepat 30 hari sejak penggantian terakhir
-- ---------------------------------------------------------------------------

-- Pemilihan username pertama (saat daftar atau setelah login Google) tidak
-- dihitung sebagai penggantian. Mengembalikan waktu paling cepat untuk
-- mengganti lagi.
create function public.change_username(new_username text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  candidate text := lower(trim(coalesce(new_username, '')));
  current_profile public.profiles%rowtype;
  availability text;
begin
  if uid is null then
    raise exception 'tidak_login' using errcode = '42501';
  end if;

  select * into current_profile from public.profiles where id = uid for update;
  if not found or current_profile.status <> 'active' then
    raise exception 'akun_tidak_aktif' using errcode = '42501';
  end if;

  if lower(coalesce(current_profile.username, '')) = candidate then
    raise exception 'username_sama' using errcode = 'P0001';
  end if;

  if current_profile.username is not null
     and current_profile.username_changed_at is not null
     and current_profile.username_changed_at > now() - interval '30 days' then
    raise exception 'username_jeda'
      using errcode = 'P0001',
            detail = (current_profile.username_changed_at + interval '30 days')::text;
  end if;

  availability := public.check_username(candidate);
  if availability <> 'tersedia' then
    raise exception 'username_%', availability using errcode = 'P0001';
  end if;

  update public.profiles
  set username = candidate,
      username_changed_at = case when current_profile.username is null then username_changed_at else now() end
  where id = uid;

  return case
    when current_profile.username is null then now()
    else now() + interval '30 days'
  end;
end;
$$;

revoke all on function public.change_username(text) from public, anon;
grant execute on function public.change_username(text) to authenticated;
