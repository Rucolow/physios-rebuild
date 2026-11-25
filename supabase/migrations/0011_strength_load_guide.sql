-- 筋力の 9 種目に、選手が読む重さの目安を入れる（2026-11-25 清水の回答「強さの目安は記載している回数よりも1-2回追加でできる余裕がある重さ」）。
-- 回数は各種目の default_reps_raw のまま。trainer_note（目的のメモ）は変えない。戻し方は supabase/rollback/0011_strength_load_guide.sql。
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルプッシュダウンⅡ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルアブダクションⅡ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルラットプルダウンⅡ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ベンチプレスⅢ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ベントオーバーローⅢ';
update exercise set default_load_raw = '6回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'オーバーヘッドプレスⅢ';
update exercise set default_load_raw = '3〜4回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルプッシュダウンⅢ';
update exercise set default_load_raw = '3〜4回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルアブダクションⅢ';
update exercise set default_load_raw = '3〜4回やり終えても、あと1〜2回できる余裕がある重さで行います。' where name = 'ケーブルラットプルダウンⅢ';
