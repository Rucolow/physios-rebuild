-- 0005: 指導者ボードはチームごとのリンクで開く（ログインなし）。リンクの鍵をチームに持たせる
-- 何度流しても同じ結果になる
alter table team add column if not exists coach_token text not null default replace(gen_random_uuid()::text, '-', '');
create unique index if not exists team_coach_token on team (coach_token);
notify pgrst, 'reload schema';
