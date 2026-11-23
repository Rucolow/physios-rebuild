-- 0008 トレーナーごとの「よく使う言葉」
-- 音声メモの文字起こしと下書きに、聞き取りの手がかりとして渡す言葉。設定の画面で足す。
-- 何度流しても同じ結果になるように書く。適用前でも録音は動く（この言葉が使われないだけ）。
alter table trainer add column if not exists terms text[] not null default '{}';
