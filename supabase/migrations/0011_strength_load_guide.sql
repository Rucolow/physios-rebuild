-- 筋力の 9 種目に、選手が読む重さの目安を入れる（2026-11-25 清水の回答「強さの目安は記載している回数よりも1-2回追加でできる余裕がある重さ」）。
-- 回数は各種目の default_reps_raw のまま。trainer_note（目的のメモ）はケーブルプッシュダウンの 2 種目だけ変える（末尾）。戻し方は supabase/rollback/0011_strength_load_guide.sql。
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルプッシュダウンⅡ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルアブダクションⅡ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルラットプルダウンⅡ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ベンチプレスⅢ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ベントオーバーローⅢ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'オーバーヘッドプレスⅢ';
update exercise set default_load_raw = '3〜4回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルプッシュダウンⅢ';
update exercise set default_load_raw = '3〜4回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルアブダクションⅢ';
update exercise set default_load_raw = '3〜4回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルラットプルダウンⅢ';
-- ケーブルプッシュダウンの目的のメモ（元は「検討必要」）。2026-11-26 清水が提案どおりで了承（同じケーブルのアブダクション・ラットプルダウンに合わせた）。セット・回数・休憩は変えない。
update exercise set trainer_note = '筋力発揮が目的' where name = 'ケーブルプッシュダウンⅡ';
update exercise set trainer_note = '最大筋力の向上が目的' where name = 'ケーブルプッシュダウンⅢ';
