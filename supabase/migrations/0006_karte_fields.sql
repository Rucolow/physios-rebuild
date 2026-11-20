-- 0006: カルテの記入項目を選手ごとに決める（2026-11-20 Rucolow）。
-- player.karte_fields が空なら既定の五項目（訴え・所見・評価・治療・次の予定）を使う。
-- 既定の五項目の値は今までどおり karte_entry の列に入れ、それ以外の項目は karte_entry.fields に入れる。
-- 何度流しても同じ結果になる。
alter table player add column if not exists karte_fields text[] not null default '{}';
alter table karte_entry add column if not exists fields jsonb not null default '{}'::jsonb;
notify pgrst, 'reload schema';
