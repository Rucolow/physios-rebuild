-- PHYSIOS 作り直し版の器（plan.md v1.6）。
-- 方針: 全てのテーブルで RLS を有効にし、ポリシーは作らない。
-- anon / authenticated の鍵からは何も読めず、読み書きはサーバ側（service role）だけが行う。
-- サーバ側は処理の前に、ログインしたトレーナーと選手の担当関係を必ず確かめる（src/lib/auth.ts）。

create extension if not exists pgcrypto;

-- ── 人 ───────────────────────────────────────────────
create table trainer (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  -- 一日の区切り（ダイジェスト・翌日のメニュー）に使う
  time_zone text not null default 'Europe/Berlin',
  created_at timestamptz not null default now()
);

create table player (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references trainer(id),
  family_name text not null,
  given_name text not null,
  -- 音声メモでの呼び方（「ケンタ」「健太くん」など）。選手の同定に使う
  aliases text[] not null default '{}',
  team text,
  -- 選手の画面の URL に入る。ログインなしで本人の画面だけを開く
  share_token text not null unique default encode(gen_random_bytes(18), 'base64url'),
  is_active boolean not null default true,
  is_fictional boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── 臨床ナレッジ（清水のプロトコル。中身は scripts/import-shimizu.sh で既存の physios の seeds から入れる） ──
create table exercise (
  id uuid primary key,
  name text not null,
  start_position text,
  movement text,
  focus_points jsonb,
  default_sets_raw text,
  default_reps_raw text,
  default_rest_raw text,
  default_load_raw text,
  video_url text,
  contraindication text
);

create table protocol (
  id uuid primary key,
  title text not null,
  injury_key text not null,
  grade smallint,
  severity_label text,
  surgery text,
  healing_weeks_min smallint,
  healing_weeks_max smallint,
  -- 1日の種目数（清水の基準 16。null なら上限を当てない）
  daily_volume_target smallint
);

-- 表1の行（時期）。どの行を使うかはトレーナーが決める（暦や週数で自動で進めない）
create table protocol_menu_row (
  id uuid primary key,
  protocol_id uuid not null references protocol(id) on delete cascade,
  row_index smallint not null,
  week_hint smallint,
  period_raw text not null,
  unique (protocol_id, row_index)
);

create table protocol_menu_cell (
  id uuid primary key,
  menu_row_id uuid not null references protocol_menu_row(id) on delete cascade,
  column_key text not null,
  column_label text not null,
  column_order smallint not null,
  category_key text not null,
  category_label text not null,
  category_order smallint not null
);

create table protocol_menu_item (
  id uuid primary key,
  menu_cell_id uuid not null references protocol_menu_cell(id) on delete cascade,
  exercise_id uuid not null references exercise(id),
  sort_order smallint not null
);

-- 日ごとの採用規則（見出しごとの本数と A/B 日）
create table protocol_menu_category_rule (
  id uuid primary key,
  protocol_id uuid not null references protocol(id) on delete cascade,
  column_key text not null,
  category_key text not null,
  category_type text not null check (category_type in ('general','cardio','high_intensity')),
  daily_pick_limit smallint,
  day_group text not null check (day_group in ('A','B','both')),
  unique (protocol_id, column_key, category_key)
);

-- ── 選手の状態（確定したものだけが入る） ─────────────────────
create table injury_episode (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references player(id),
  protocol_id uuid references protocol(id),
  injured_on date not null,
  label text not null,
  status text not null default 'active' check (status in ('active','closed')),
  created_at timestamptz not null default now()
);

-- 現在の時期（表1の行）。追記だけで履歴が残る。最新の一行が今の時期
create table menu_position (
  id uuid primary key default gen_random_uuid(),
  injury_episode_id uuid not null references injury_episode(id) on delete cascade,
  menu_row_id uuid not null references protocol_menu_row(id),
  -- A/B 日の数え始め。行が変わった日から数え直す
  anchor_on date not null,
  set_by uuid references trainer(id),
  set_at timestamptz not null default now(),
  source_draft_id uuid
);

create table match_schedule (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references trainer(id),
  team text,
  kickoff_at timestamptz not null,
  opponent text,
  note text,
  replaced_by uuid references match_schedule(id),
  created_at timestamptz not null default now()
);

-- ── 記録の流れ ───────────────────────────────────────
create table voice_memo (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references trainer(id),
  recorded_at timestamptz not null default now(),
  -- その日の区切りはトレーナーの時間帯で決める
  local_date date not null,
  storage_path text,
  duration_sec numeric,
  input_kind text not null default 'voice' check (input_kind in ('voice','text')),
  transcript text,
  stt_language text,
  stt_detail jsonb,
  status text not null default 'received'
    check (status in ('received','transcribed','interpreted','failed')),
  error text,
  created_at timestamptz not null default now()
);

-- AI の下書き。トレーナーがダイジェストで確定するまで本テーブルには何も書かない
create table draft (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references trainer(id),
  voice_memo_id uuid references voice_memo(id) on delete cascade,
  local_date date not null,
  seq smallint not null default 0,
  kind text not null check (kind in ('karte','injury','menu_row','schedule')),
  -- 同定できた選手。要確認のときは null で、候補は payload.candidates に入る
  player_id uuid references player(id),
  payload jsonb not null,
  -- 要確認の理由（null = 読むだけ）
  confirm_reason text check (confirm_reason in ('player','protocol','menu_row','schedule')),
  answer jsonb,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index draft_trainer_date on draft (trainer_id, local_date, status);

create table karte_entry (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references player(id),
  injury_episode_id uuid references injury_episode(id),
  written_on date not null,
  summary text not null,
  subjective text,
  objective text,
  assessment text,
  treatment text,
  plan text,
  source_draft_id uuid references draft(id),
  confirmed_by uuid references trainer(id),
  confirmed_at timestamptz not null default now(),
  edited_at timestamptz
);

-- ── 処方 ───────────────────────────────────────────
create table prescription (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references player(id),
  injury_episode_id uuid not null references injury_episode(id),
  target_on date not null,
  menu_row_id uuid not null references protocol_menu_row(id),
  menu_position_id uuid not null references menu_position(id),
  day_group text check (day_group in ('A','B')),
  is_rest_day boolean not null default false,
  generated_at timestamptz not null default now(),
  generation_log jsonb,
  unique (injury_episode_id, target_on)
);

create table prescription_item (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references prescription(id) on delete cascade,
  exercise_id uuid not null references exercise(id),
  column_label text not null,
  category_label text not null,
  sort_order smallint not null,
  done_at timestamptz
);

-- 朝のブリーフィングの文（読み物。状態を変えないので承認を経ない）
create table briefing_text (
  trainer_id uuid not null references trainer(id),
  local_date date not null,
  body text not null,
  generated_at timestamptz not null default now(),
  primary key (trainer_id, local_date)
);

-- ── RLS（ポリシーは作らない＝service role だけが通る） ─────────
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- 音声の置き場（非公開）
insert into storage.buckets (id, name, public)
values ('voice', 'voice', false)
on conflict (id) do nothing;
