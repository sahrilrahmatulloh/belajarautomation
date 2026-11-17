-- Id dan nama file avatar mengikuti nama panggilan kucing (PRD FR-12, v2.50), mis. kucing-putih
-- menjadi mochi dan kucing-oren-wizard menjadi oyen-wizard. Katalog dan avatar pilihan pengguna
-- dipindahkan ke id baru di migrasi yang sama, sehingga tidak ada pilihan yang hilang.
-- Harus sama dengan data/avatars.ts (dicek npm run check:cosmetics).

insert into private.cosmetic_items (id, kind, access, included_in) values
  ('mochi', 'avatar', 'free', '{}'),
  ('oyen', 'avatar', 'free', '{}'),
  ('kopi', 'avatar', 'paid', '{pro,premium}'),
  ('domino', 'avatar', 'paid', '{pro,premium}'),
  ('mendung', 'avatar', 'paid', '{pro,premium}'),
  ('karamel', 'avatar', 'paid', '{pro,premium}'),
  ('belang', 'avatar', 'paid', '{pro,premium}'),
  ('latte', 'avatar', 'paid', '{pro,premium}'),
  ('mochi-bug-hunter', 'avatar', 'paid', '{pro,premium}'),
  ('oyen-bug-hunter', 'avatar', 'paid', '{pro,premium}'),
  ('kopi-bug-hunter', 'avatar', 'paid', '{pro,premium}'),
  ('domino-bug-hunter', 'avatar', 'paid', '{pro,premium}'),
  ('mendung-bug-hunter', 'avatar', 'paid', '{pro,premium}'),
  ('karamel-bug-hunter', 'avatar', 'paid', '{pro,premium}'),
  ('belang-bug-hunter', 'avatar', 'paid', '{pro,premium}'),
  ('latte-bug-hunter', 'avatar', 'paid', '{pro,premium}'),
  ('mochi-cyberpunk', 'avatar', 'paid', '{pro,premium}'),
  ('oyen-cyberpunk', 'avatar', 'paid', '{pro,premium}'),
  ('kopi-cyberpunk', 'avatar', 'paid', '{pro,premium}'),
  ('domino-cyberpunk', 'avatar', 'paid', '{pro,premium}'),
  ('mendung-cyberpunk', 'avatar', 'paid', '{pro,premium}'),
  ('karamel-cyberpunk', 'avatar', 'paid', '{pro,premium}'),
  ('belang-cyberpunk', 'avatar', 'paid', '{pro,premium}'),
  ('latte-cyberpunk', 'avatar', 'paid', '{pro,premium}'),
  ('mochi-wizard', 'avatar', 'paid', '{pro,premium}'),
  ('oyen-wizard', 'avatar', 'paid', '{pro,premium}'),
  ('kopi-wizard', 'avatar', 'paid', '{pro,premium}'),
  ('domino-wizard', 'avatar', 'paid', '{pro,premium}'),
  ('mendung-wizard', 'avatar', 'paid', '{pro,premium}'),
  ('karamel-wizard', 'avatar', 'paid', '{pro,premium}'),
  ('belang-wizard', 'avatar', 'paid', '{pro,premium}'),
  ('latte-wizard', 'avatar', 'paid', '{pro,premium}');

-- Avatar pilihan pengguna: id Basic, atau id Basic diikuti gaya kostum.
with renamed (old_id, new_id) as (
  values
    ('kucing-putih', 'mochi'),
    ('kucing-oren', 'oyen'),
    ('kucing-hitam', 'kopi'),
    ('kucing-tuxedo', 'domino'),
    ('kucing-abu', 'mendung'),
    ('kucing-coklat', 'karamel'),
    ('kucing-corak-tiga', 'belang'),
    ('kucing-siam', 'latte')
)
update public.profiles p
set avatar_id = r.new_id || substr(p.avatar_id, length(r.old_id) + 1)
from renamed r
where p.avatar_id = r.old_id
   or p.avatar_id in (r.old_id || '-bug-hunter', r.old_id || '-cyberpunk', r.old_id || '-wizard');

delete from private.cosmetic_items where id = 'kucing-putih';
delete from private.cosmetic_items where id = 'kucing-oren';
delete from private.cosmetic_items where id = 'kucing-hitam';
delete from private.cosmetic_items where id = 'kucing-tuxedo';
delete from private.cosmetic_items where id = 'kucing-abu';
delete from private.cosmetic_items where id = 'kucing-coklat';
delete from private.cosmetic_items where id = 'kucing-corak-tiga';
delete from private.cosmetic_items where id = 'kucing-siam';
delete from private.cosmetic_items where id = 'kucing-putih-bug-hunter';
delete from private.cosmetic_items where id = 'kucing-oren-bug-hunter';
delete from private.cosmetic_items where id = 'kucing-hitam-bug-hunter';
delete from private.cosmetic_items where id = 'kucing-tuxedo-bug-hunter';
delete from private.cosmetic_items where id = 'kucing-abu-bug-hunter';
delete from private.cosmetic_items where id = 'kucing-coklat-bug-hunter';
delete from private.cosmetic_items where id = 'kucing-corak-tiga-bug-hunter';
delete from private.cosmetic_items where id = 'kucing-siam-bug-hunter';
delete from private.cosmetic_items where id = 'kucing-putih-cyberpunk';
delete from private.cosmetic_items where id = 'kucing-oren-cyberpunk';
delete from private.cosmetic_items where id = 'kucing-hitam-cyberpunk';
delete from private.cosmetic_items where id = 'kucing-tuxedo-cyberpunk';
delete from private.cosmetic_items where id = 'kucing-abu-cyberpunk';
delete from private.cosmetic_items where id = 'kucing-coklat-cyberpunk';
delete from private.cosmetic_items where id = 'kucing-corak-tiga-cyberpunk';
delete from private.cosmetic_items where id = 'kucing-siam-cyberpunk';
delete from private.cosmetic_items where id = 'kucing-putih-wizard';
delete from private.cosmetic_items where id = 'kucing-oren-wizard';
delete from private.cosmetic_items where id = 'kucing-hitam-wizard';
delete from private.cosmetic_items where id = 'kucing-tuxedo-wizard';
delete from private.cosmetic_items where id = 'kucing-abu-wizard';
delete from private.cosmetic_items where id = 'kucing-coklat-wizard';
delete from private.cosmetic_items where id = 'kucing-corak-tiga-wizard';
delete from private.cosmetic_items where id = 'kucing-siam-wizard';
