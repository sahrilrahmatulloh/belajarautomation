-- Angka Dashboard Admin dari data asli (PRD FR-16 A): pengguna, membership aktif, sebaran rank,
-- dan aksi Admin terbaru. Hanya Admin dengan sesi verifikasi dua langkah (aal2).

-- p_rank_thresholds: batas minimal XP setiap rank, urut naik (data/ranks.ts), agar batas rank
-- tidak ditulis dua kali di database.
create function public.admin_dashboard_stats(p_rank_thresholds integer[])
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();
  return json_build_object(
    'total_users', (select count(*) from public.profiles),
    'new_users_7d', (select count(*) from public.profiles where created_at >= now() - interval '7 days'),
    'active_users', (select count(*) from public.profiles where status = 'active'),
    'memberships', json_build_object(
      'pro', (select count(*) from public.profiles p where private.active_tier(p.id) = 'pro'),
      'premium', (select count(*) from public.profiles p where private.active_tier(p.id) = 'premium')
    ),
    'total_xp', (select coalesce(sum(total_xp), 0) from public.user_xp_summary),
    'rank_counts', (
      select coalesce(json_agg(bucket.n order by bucket.position), '[]'::json)
      from (
        select t.position, (
          select count(*)
          from public.profiles p
          left join public.user_xp_summary s on s.user_id = p.id
          where coalesce(s.total_xp, 0) >= t.min_xp
            and (t.next_min is null or coalesce(s.total_xp, 0) < t.next_min)
        ) as n
        from (
          select position, min_xp, lead(min_xp) over (order by position) as next_min
          from unnest(p_rank_thresholds) with ordinality as x(min_xp, position)
        ) t
      ) bucket
    ),
    'recent_actions', (
      select coalesce(json_agg(row_to_json(a) order by a.created_at desc), '[]'::json)
      from (
        select l.action, l.reason, l.created_at,
          coalesce(nullif(target.display_name, ''), target_user.email) as target_name,
          coalesce(nullif(actor.display_name, ''), actor_user.email) as admin_name
        from public.admin_audit_logs l
        left join public.profiles target on target.id = l.target_user
        left join auth.users target_user on target_user.id = l.target_user
        left join public.profiles actor on actor.id = l.admin_id
        left join auth.users actor_user on actor_user.id = l.admin_id
        order by l.created_at desc
        limit 5
      ) a
    )
  );
end;
$$;

revoke all on function public.admin_dashboard_stats(integer[]) from public, anon;
grant execute on function public.admin_dashboard_stats(integer[]) to authenticated;
