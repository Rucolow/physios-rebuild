#!/usr/bin/env bash
# 清水のプロトコル・種目・メニューを、既存の Rucolow/physios の seeds から新しい DB に写す。
# 清水の資産なので、このリポジトリには中身を置かない。DB から DB へ写すだけ。
#
# 使い方:
#   1. bash scripts/build-source-db.sh <physios リポジトリの場所> "$SOURCE_DB_URL"
#      （既存の physios のマイグレーションと seeds を作業用の DB に入れる）
#   2. bash scripts/import-shimizu.sh "$SOURCE_DB_URL" "$SUPABASE_DB_URL"
#
# 値は一つも作らない・変えない。列を選んで写すだけ。何度流しても同じ結果になる（id で上書き）。
# 対象は清水のプロトコル（provenance = trainer、【架空】を除く）と、そのメニューが参照する種目だけ。
set -euo pipefail
src="$1"; dst="$2"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT

P="(select id from protocol where provenance = 'trainer' and title not like '【架空】%')"

dump() { # $1 = ファイル名、$2 = select
  psql "$src" -v ON_ERROR_STOP=1 -qAt -c "select coalesce(jsonb_agg(to_jsonb(t)), '[]') from ($2) t" > "$tmp/$1.json"
}

dump exercise "select id, name, start_position, movement, focus_points, default_sets_raw, default_reps_raw, default_rest_raw, default_load_raw, video_url, contraindication from exercise where id in (select exercise_id from protocol_menu_item where protocol_id in $P)"
dump protocol "select id, title, injury_key, grade, severity_label, surgery, healing_weeks_min, healing_weeks_max, daily_volume_target from protocol where id in $P"
dump menu_row "select id, protocol_id, row_index, week_hint, period_raw from protocol_menu_row where protocol_id in $P"
dump menu_cell "select c.id, c.menu_row_id, c.column_key, c.column_label, c.column_order, c.category_key, c.category_label, c.category_order from protocol_menu_cell c join protocol_menu_row r on r.id = c.menu_row_id where r.protocol_id in $P"
dump menu_item "select id, menu_cell_id, exercise_id, sort_order from protocol_menu_item where protocol_id in $P"
dump rule "select id, protocol_id, column_key, category_key, category_type, daily_pick_limit, day_group from protocol_menu_category_rule where protocol_id in $P"

{
  echo "create temp table j(name text primary key, data jsonb);"
  for n in exercise protocol menu_row menu_cell menu_item rule; do
    printf "insert into j values ('%s', \$J\$%s\$J\$);\n" "$n" "$(cat "$tmp/$n.json")"
  done
  cat <<'SQL'
begin;
insert into exercise select * from jsonb_populate_recordset(null::exercise, (select data from j where name='exercise'))
on conflict (id) do update set name = excluded.name, start_position = excluded.start_position,
  movement = excluded.movement, focus_points = excluded.focus_points,
  default_sets_raw = excluded.default_sets_raw, default_reps_raw = excluded.default_reps_raw,
  default_rest_raw = excluded.default_rest_raw, default_load_raw = excluded.default_load_raw,
  video_url = excluded.video_url, contraindication = excluded.contraindication;

insert into protocol select * from jsonb_populate_recordset(null::protocol, (select data from j where name='protocol'))
on conflict (id) do update set title = excluded.title, injury_key = excluded.injury_key,
  grade = excluded.grade, severity_label = excluded.severity_label, surgery = excluded.surgery,
  healing_weeks_min = excluded.healing_weeks_min, healing_weeks_max = excluded.healing_weeks_max,
  daily_volume_target = excluded.daily_volume_target;

insert into protocol_menu_row select * from jsonb_populate_recordset(null::protocol_menu_row, (select data from j where name='menu_row'))
on conflict (id) do update set row_index = excluded.row_index, week_hint = excluded.week_hint,
  period_raw = excluded.period_raw;

-- 棚の中身は丸ごと入れ替える（元で消えた種目を残さない）
delete from protocol_menu_item;
delete from protocol_menu_cell;
delete from protocol_menu_category_rule;
insert into protocol_menu_cell select * from jsonb_populate_recordset(null::protocol_menu_cell, (select data from j where name='menu_cell'));
insert into protocol_menu_item select * from jsonb_populate_recordset(null::protocol_menu_item, (select data from j where name='menu_item'));
insert into protocol_menu_category_rule select * from jsonb_populate_recordset(null::protocol_menu_category_rule, (select data from j where name='rule'));
commit;

select 'protocol' t, count(*) from protocol
union all select 'menu_row', count(*) from protocol_menu_row
union all select 'menu_cell', count(*) from protocol_menu_cell
union all select 'menu_item', count(*) from protocol_menu_item
union all select 'rule', count(*) from protocol_menu_category_rule
union all select 'exercise', count(*) from exercise;
SQL
} | psql "$dst" -v ON_ERROR_STOP=1 -q
