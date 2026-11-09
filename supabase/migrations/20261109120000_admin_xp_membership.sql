-- Koreksi XP dan pemberian membership manual oleh Admin (PRD FR-16 D dan E).
-- Semua aksi Admin lewat fungsi database yang memeriksa has_role('admin'), yang hanya berlaku
-- untuk sesi aal2 (verifikasi dua langkah, PRD 8.3), dan dicatat di admin_audit_logs.
-- Koreksi dan pemberian akses ditulis sebagai catatan baru, bukan mengubah riwayat (PRD 27).

-- ---------------------------------------------------------------------------
-- Koreksi XP
-- ---------------------------------------------------------------------------

alter table public.xp_transactions drop constraint xp_transactions_source_type_check;
alter table public.xp_transactions add constraint xp_transactions_source_type_check
  check (source_type in ('lesson', 'course', 'quiz', 'challenge', 'correction'));

-- Hanya koreksi yang boleh bernilai negatif.
alter table public.xp_transactions drop constraint xp_transactions_xp_check;
alter table public.xp_transactions add constraint xp_transactions_xp_check
  check (xp <> 0 and (xp > 0 or source_type = 'correction'));

alter table public.xp_transactions
  add column reason text,
  add column created_by uuid references auth.users (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Membership
-- ---------------------------------------------------------------------------

create table public.membership_grants (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  tier text not null check (tier in ('pro', 'premium')),
  -- manual: diberikan Admin tanpa transaksi. payment: dari pembayaran (Fase 5).
  source text not null check (source in ('manual', 'payment')),
  reason text not null,
  starts_at timestamptz not null default now(),
  -- Kosong berarti tanpa batas waktu.
  ends_at timestamptz,
  granted_by uuid references auth.users (id) on delete set null,
  revoked_at timestamptz,
  revoked_by uuid references auth.users (id) on delete set null,
  revoke_reason text,
  created_at timestamptz not null default now()
);

create index membership_grants_user_idx on public.membership_grants (user_id, created_at desc);

comment on table public.membership_grants is
  'Hak akses membership (PRD FR-10, FR-16 E). Pencabutan mengisi revoked_at, baris tidak dihapus.';

alter table public.membership_grants enable row level security;
revoke all on public.membership_grants from anon, authenticated;
grant select on public.membership_grants to authenticated;
create policy "Pengguna membaca membership-nya sendiri"
  on public.membership_grants for select to authenticated using (user_id = (select auth.uid()));

-- Tingkat membership yang berlaku saat ini: premium, pro, atau basic.
create function private.active_tier(p_user uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select case when bool_or(g.tier = 'premium') then 'premium' else 'pro' end
      from public.membership_grants g
      where g.user_id = p_user
        and g.revoked_at is null
        and g.starts_at <= now()
        and (g.ends_at is null or g.ends_at > now())
      having count(*) > 0
    ),
    'basic'
  );
$$;

revoke all on function private.active_tier(uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Log aksi Admin
-- ---------------------------------------------------------------------------

create table public.admin_audit_logs (
  id bigint generated always as identity primary key,
  admin_id uuid references auth.users (id) on delete set null,
  action text not null,
  target_user uuid references auth.users (id) on delete set null,
  reason text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_audit_logs_target_idx on public.admin_audit_logs (target_user, created_at desc);

alter table public.admin_audit_logs enable row level security;
revoke all on public.admin_audit_logs from anon, authenticated;
grant select on public.admin_audit_logs to authenticated;
create policy "Admin membaca log aksi Admin"
  on public.admin_audit_logs for select to authenticated using ((select public.has_role('admin')));

-- ---------------------------------------------------------------------------
-- Pemeriksaan bersama
-- ---------------------------------------------------------------------------

create function private.require_admin()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.has_role('admin') then
    raise exception 'bukan_admin' using errcode = '42501';
  end if;
  return (select auth.uid());
end;
$$;

create function private.require_reason(p_reason text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
begin
  if p_reason is null or char_length(btrim(p_reason)) < 5 or char_length(p_reason) > 500 then
    raise exception 'alasan_wajib' using errcode = 'P0001';
  end if;
  return btrim(p_reason);
end;
$$;

revoke all on function private.require_admin() from public, anon, authenticated;
revoke all on function private.require_reason(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Fungsi Admin
-- ---------------------------------------------------------------------------

-- Daftar pengguna untuk halaman Admin (PRD FR-16 C), dicari dari nama, username, atau email.
create function public.admin_search_users(p_query text)
returns table (
  user_id uuid,
  display_name text,
  username text,
  email text,
  total_xp integer,
  tier text,
  roles text[],
  status text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  q text := '%' || coalesce(btrim(p_query), '') || '%';
begin
  perform private.require_admin();
  return query
    select
      p.id,
      p.display_name,
      p.username,
      u.email::text,
      coalesce(s.total_xp, 0),
      private.active_tier(p.id),
      coalesce((select array_agg(ur.role::text order by ur.role) from public.user_roles ur where ur.user_id = p.id), '{}'),
      p.status::text,
      p.created_at
    from public.profiles p
    join auth.users u on u.id = p.id
    left join public.user_xp_summary s on s.user_id = p.id
    where p.display_name ilike q or coalesce(p.username, '') ilike q or u.email ilike q
    order by p.created_at desc
    limit 50;
end;
$$;

-- Detail pengguna beserta riwayat koreksi XP dan membership.
create function public.admin_get_user(p_user uuid)
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result json;
begin
  perform private.require_admin();
  select json_build_object(
    'user_id', p.id,
    'display_name', p.display_name,
    'username', p.username,
    'email', u.email,
    'status', p.status,
    'created_at', p.created_at,
    'total_xp', coalesce(s.total_xp, 0),
    'lessons_completed', coalesce(s.lessons_completed, 0),
    'challenges_completed', coalesce(s.challenges_completed, 0),
    'tier', private.active_tier(p.id),
    'roles', coalesce((select json_agg(ur.role order by ur.role) from public.user_roles ur where ur.user_id = p.id), '[]'::json),
    'xp_corrections', coalesce((
      select json_agg(json_build_object('amount', x.xp, 'reason', x.reason, 'created_at', x.created_at) order by x.created_at desc)
      from (select * from public.xp_transactions where user_id = p.id and source_type = 'correction' order by created_at desc limit 20) x
    ), '[]'::json),
    'memberships', coalesce((
      select json_agg(json_build_object(
        'id', g.id, 'tier', g.tier, 'source', g.source, 'reason', g.reason,
        'starts_at', g.starts_at, 'ends_at', g.ends_at,
        'revoked_at', g.revoked_at, 'revoke_reason', g.revoke_reason
      ) order by g.created_at desc)
      from (select * from public.membership_grants where user_id = p.id order by created_at desc limit 20) g
    ), '[]'::json)
  ) into result
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.user_xp_summary s on s.user_id = p.id
  where p.id = p_user;

  if result is null then
    raise exception 'pengguna_tidak_ditemukan' using errcode = 'P0001';
  end if;
  return result;
end;
$$;

-- Menambah atau mengurangi XP. Total XP tidak boleh kurang dari 0.
create function public.admin_adjust_xp(p_user uuid, p_amount integer, p_reason text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  admin_id uuid := private.require_admin();
  clean_reason text := private.require_reason(p_reason);
  current_total integer;
begin
  if p_amount is null or p_amount = 0 or abs(p_amount) > 100000 then
    raise exception 'jumlah_tidak_valid' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.profiles where id = p_user) then
    raise exception 'pengguna_tidak_ditemukan' using errcode = 'P0001';
  end if;

  insert into public.user_xp_summary (user_id) values (p_user) on conflict (user_id) do nothing;
  select total_xp into current_total from public.user_xp_summary where user_id = p_user for update;
  if current_total + p_amount < 0 then
    raise exception 'xp_negatif' using errcode = 'P0001';
  end if;

  insert into public.xp_transactions (user_id, source_type, source_id, xp, reason, created_by)
  values (p_user, 'correction', gen_random_uuid()::text, p_amount, clean_reason, admin_id);

  update public.user_xp_summary
  set total_xp = current_total + p_amount, updated_at = now()
  where user_id = p_user;

  insert into public.admin_audit_logs (admin_id, action, target_user, reason, details)
  values (admin_id, 'xp_correction', p_user, clean_reason, json_build_object('amount', p_amount, 'total_after', current_total + p_amount)::jsonb);

  return current_total + p_amount;
end;
$$;

-- Memberi membership manual (hadiah atau kompensasi). Pemberian manual yang masih berlaku
-- diganti oleh yang baru. p_days kosong berarti tanpa batas waktu.
create function public.admin_grant_membership(p_user uuid, p_tier text, p_days integer, p_reason text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  admin_id uuid := private.require_admin();
  clean_reason text := private.require_reason(p_reason);
  new_end timestamptz;
begin
  if p_tier not in ('pro', 'premium') then
    raise exception 'tier_tidak_valid' using errcode = 'P0001';
  end if;
  if p_days is not null and (p_days < 1 or p_days > 3650) then
    raise exception 'durasi_tidak_valid' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.profiles where id = p_user) then
    raise exception 'pengguna_tidak_ditemukan' using errcode = 'P0001';
  end if;

  update public.membership_grants
  set revoked_at = now(), revoked_by = admin_id, revoke_reason = 'Diganti pemberian manual baru'
  where user_id = p_user and source = 'manual' and revoked_at is null and (ends_at is null or ends_at > now());

  new_end := case when p_days is null then null else now() + make_interval(days => p_days) end;
  insert into public.membership_grants (user_id, tier, source, reason, ends_at, granted_by)
  values (p_user, p_tier, 'manual', clean_reason, new_end, admin_id);

  insert into public.admin_audit_logs (admin_id, action, target_user, reason, details)
  values (admin_id, 'membership_grant', p_user, clean_reason, json_build_object('tier', p_tier, 'days', p_days)::jsonb);

  return json_build_object('tier', private.active_tier(p_user), 'ends_at', new_end);
end;
$$;

-- Mencabut membership manual yang masih berlaku. Membership dari pembayaran tidak dicabut di
-- sini; pembatalannya lewat refund (PRD FR-16 E).
create function public.admin_revoke_membership(p_user uuid, p_reason text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  admin_id uuid := private.require_admin();
  clean_reason text := private.require_reason(p_reason);
begin
  update public.membership_grants
  set revoked_at = now(), revoked_by = admin_id, revoke_reason = clean_reason
  where user_id = p_user and source = 'manual' and revoked_at is null and (ends_at is null or ends_at > now());

  if not found then
    raise exception 'tidak_ada_membership_manual' using errcode = 'P0001';
  end if;

  insert into public.admin_audit_logs (admin_id, action, target_user, reason, details)
  values (admin_id, 'membership_revoke', p_user, clean_reason, '{}'::jsonb);

  return private.active_tier(p_user);
end;
$$;

revoke all on function public.admin_search_users(text) from public, anon;
revoke all on function public.admin_get_user(uuid) from public, anon;
revoke all on function public.admin_adjust_xp(uuid, integer, text) from public, anon;
revoke all on function public.admin_grant_membership(uuid, text, integer, text) from public, anon;
revoke all on function public.admin_revoke_membership(uuid, text) from public, anon;
grant execute on function public.admin_search_users(text) to authenticated;
grant execute on function public.admin_get_user(uuid) to authenticated;
grant execute on function public.admin_adjust_xp(uuid, integer, text) to authenticated;
grant execute on function public.admin_grant_membership(uuid, text, integer, text) to authenticated;
grant execute on function public.admin_revoke_membership(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Membership dipakai akun sendiri
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
    'avatar_id', p.avatar_id,
    'theme_id', p.theme_id,
    'status', p.status,
    'roles', coalesce(
      (select json_agg(ur.role order by ur.role) from public.user_roles ur where ur.user_id = p.id),
      '[]'::json
    ),
    'membership', coalesce((
      select case when bool_or(g.tier = 'premium') then 'premium' else 'pro' end
      from public.membership_grants g
      where g.user_id = p.id
        and g.revoked_at is null
        and g.starts_at <= now()
        and (g.ends_at is null or g.ends_at > now())
      having count(*) > 0
    ), 'basic')
  )
  from public.profiles p
  where p.id = (select auth.uid());
$$;

-- Avatar dan tema berbayar kini boleh dipakai sesuai membership yang berlaku (PRD FR-12).
create or replace function public.set_appearance(new_avatar_id text, new_theme_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  avatar_item private.cosmetic_items%rowtype;
  theme_item private.cosmetic_items%rowtype;
  tier text;
begin
  if uid is null then
    raise exception 'tidak_login' using errcode = '42501';
  end if;

  select * into avatar_item from private.cosmetic_items where id = new_avatar_id and kind = 'avatar';
  if not found then
    raise exception 'avatar_tidak_dikenal' using errcode = 'P0001';
  end if;
  select * into theme_item from private.cosmetic_items where id = new_theme_id and kind = 'theme';
  if not found then
    raise exception 'tema_tidak_dikenal' using errcode = 'P0001';
  end if;

  tier := private.active_tier(uid);
  if (avatar_item.access <> 'free' and not (tier = any (avatar_item.included_in)))
    or (theme_item.access <> 'free' and not (tier = any (theme_item.included_in))) then
    raise exception 'item_terkunci' using errcode = 'P0001';
  end if;

  update public.profiles
  set avatar_id = new_avatar_id, theme_id = new_theme_id
  where id = uid and status = 'active';

  if not found then
    raise exception 'akun_tidak_aktif' using errcode = '42501';
  end if;
end;
$$;
