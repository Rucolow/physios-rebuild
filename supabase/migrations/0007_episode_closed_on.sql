-- 0007 復帰の日付
-- 怪我から復帰した日を残す。復帰した怪我は status = 'closed' にし、記録（怪我・カルテ・メニュー）は消さない。
-- 何度流しても同じ結果になるように書く。適用前でも復帰の操作は動く（日付だけが残らない）。
alter table injury_episode add column if not exists closed_on date;
