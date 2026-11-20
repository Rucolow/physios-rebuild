-- 0003: 元の physios の画面を移すための器（plan.md v2.0）。
-- チーム（複数）・チームの予定と成績・参加区分と復帰見込み・要観察・選手の調子・
-- カルテの画像・ナレッジの記事・チーム合流の段階・指導者。
-- 全テーブルで RLS を有効にし、ポリシーは作らない（読み書きはサーバ側の service role だけ）。
-- 何度流しても同じ結果になるように書く。

-- ── チーム ─────────────────────────────────────────
create table if not exists team (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references trainer(id),
  name text not null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  unique (trainer_id, name)
);

alter table player add column if not exists team_id uuid references team(id);

-- 今の player.team（文字）からチームを作って結び付ける
insert into team (trainer_id, name)
select distinct trainer_id, team from player where team is not null and team <> ''
on conflict (trainer_id, name) do nothing;
update player p set team_id = t.id from team t
where p.team_id is null and t.trainer_id = p.trainer_id and t.name = p.team;

-- チームの予定（試合・練習・オフ）と試合の成績
create table if not exists team_event (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references team(id) on delete cascade,
  kind text not null check (kind in ('match', 'training', 'off')),
  starts_at timestamptz not null,
  opponent text,
  venue text,
  home_away text check (home_away in ('home', 'away')),
  note text,
  -- 試合の成績（自チーム・相手）。試合の後にトレーナーが入れる
  score_for smallint check (score_for >= 0),
  score_against smallint check (score_against >= 0),
  -- 日程の変更: 古い行は消さずに新しい行を指す（「8/2 から移動」の表示に使う）
  replaced_by uuid references team_event(id),
  source text not null default 'manual' check (source in ('manual', 'voice')),
  created_at timestamptz not null default now(),
  check (kind = 'match' or (score_for is null and score_against is null))
);
create index if not exists team_event_team_starts on team_event (team_id, starts_at);

-- 今の match_schedule を写す（同じ id を使い、二度目は何もしない）。
-- チームの無い行は、そのトレーナーの最初のチームに入れる（無ければ写さない）
insert into team_event (id, team_id, kind, starts_at, opponent, note, source, created_at)
select m.id,
       coalesce(t.id, (select t2.id from team t2 where t2.trainer_id = m.trainer_id order by t2.created_at limit 1)),
       'match', m.kickoff_at, m.opponent, m.note, 'manual', m.created_at
from match_schedule m
left join team t on t.trainer_id = m.trainer_id and t.name = m.team
where coalesce(t.id, (select t2.id from team t2 where t2.trainer_id = m.trainer_id order by t2.created_at limit 1)) is not null
on conflict (id) do nothing;
update team_event e set replaced_by = m.replaced_by
from match_schedule m
where e.id = m.id and m.replaced_by is not null and e.replaced_by is null
  and exists (select 1 from team_event x where x.id = m.replaced_by);

-- ── 選手の状態 ───────────────────────────────────────
-- 参加区分と復帰見込み。トレーナーが決めた値だけを持つ（推測で埋めない）。
-- 変えるときは今の行の valid_to を閉じて新しい行を足す
create table if not exists availability_status (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references player(id) on delete cascade,
  status text not null check (status in ('full', 'limited', 'out')),
  restriction text,
  expected_return date,
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  declared_by uuid not null references trainer(id),
  created_at timestamptz not null default now()
);
create unique index if not exists availability_status_current on availability_status (player_id) where valid_to is null;

-- 要観察（完全参加でも変化を見続ける選手）
create table if not exists watch_period (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references player(id) on delete cascade,
  reason text,
  added_by uuid not null references trainer(id),
  added_at timestamptz not null default now(),
  released_at timestamptz
);
create unique index if not exists watch_period_current on watch_period (player_id) where released_at is null;

-- 選手が選手の画面で付ける今日の調子（0〜6）
create table if not exists condition_report (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references player(id) on delete cascade,
  reported_on date not null,
  pain_score smallint check (pain_score between 0 and 6),
  fatigue smallint check (fatigue between 0 and 6),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, reported_on)
);

-- ── カルテの画像 ─────────────────────────────────────
create table if not exists karte_attachment (
  id uuid primary key default gen_random_uuid(),
  karte_entry_id uuid not null references karte_entry(id) on delete cascade,
  storage_path text not null unique,
  content_type text not null,
  byte_size integer,
  uploaded_by uuid not null references trainer(id),
  created_at timestamptz not null default now()
);
-- 画像の置き場（非公開。読むときはサーバが期限つきの URL を出す）
insert into storage.buckets (id, name, public)
values ('karte', 'karte', false)
on conflict (id) do nothing;

-- ── チーム合流の段階（清水のプロトコルから写す）────────────
create table if not exists team_step (
  id uuid primary key,
  name text not null,
  sort_order smallint not null
);
create table if not exists protocol_team_unlock (
  id uuid primary key default gen_random_uuid(),
  protocol_id uuid not null references protocol(id) on delete cascade,
  team_step_id uuid not null references team_step(id),
  unlock_week smallint,
  condition_raw text,
  unique (protocol_id, team_step_id)
);

-- ── ナレッジの記事 ───────────────────────────────────
create table if not exists knowledge_article (
  id uuid primary key default gen_random_uuid(),
  -- null = BRÜCKE から写した記事（トレーナーの持ち物ではない）
  owner_trainer_id uuid references trainer(id) on delete cascade,
  source text not null check (source in ('trainer', 'brucke')),
  -- BRÜCKE の記事の元の場所（写し直しで重複させない）
  source_ref text unique,
  source_url text,
  category text not null,
  body_region text,
  title text not null,
  summary text,
  body_md text not null,
  tags text[] not null default '{}',
  evidence_grade text check (evidence_grade in ('A', 'B', 'C')),
  thumbnail_url text,
  author_name text,
  published_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((source = 'trainer') = (owner_trainer_id is not null))
);
create table if not exists knowledge_bookmark (
  trainer_id uuid not null references trainer(id) on delete cascade,
  article_id uuid not null references knowledge_article(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (trainer_id, article_id)
);

-- ── 指導者 ─────────────────────────────────────────
create table if not exists coach (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  created_at timestamptz not null default now()
);
create table if not exists coach_team (
  coach_id uuid not null references coach(id) on delete cascade,
  team_id uuid not null references team(id) on delete cascade,
  primary key (coach_id, team_id)
);

-- ── RLS ────────────────────────────────────────────
alter table team enable row level security;
alter table team_event enable row level security;
alter table availability_status enable row level security;
alter table watch_period enable row level security;
alter table condition_report enable row level security;
alter table karte_attachment enable row level security;
alter table team_step enable row level security;
alter table protocol_team_unlock enable row level security;
alter table knowledge_article enable row level security;
alter table knowledge_bookmark enable row level security;
alter table coach enable row level security;
alter table coach_team enable row level security;

grant all on all tables in schema public to service_role;
revoke all on all tables in schema public from anon, authenticated;
notify pgrst, 'reload schema';
