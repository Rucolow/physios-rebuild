-- 種目の強度（default_load_raw）を選手がそのまま読める文にし、トレーナー向けの目的のメモを trainer_note に分ける（2026-11-24 Rucolow 承認）。
-- 数字（心拍数・10段階の値・重さ）は原文から変えていない。原文と戻し方は supabase/rollback/0010_exercise_load_for_players.sql。
alter table exercise add column if not exists trainer_note text;

update exercise set default_load_raw = 'しっかり息が切れて、かなり疲れるくらいの力で動きます。
心拍数は180回/分を超えないようにします。
きつさは10段階で8より下。かなりきついと感じるくらいです。' where name = 'HIIT Ⅰ';
update exercise set default_load_raw = 'しっかり息が切れて、かなり疲れるくらいの力で動きます。
心拍数は180回/分を超えないようにします。
きつさは10段階で8より下。かなりきついと感じるくらいです。' where name = 'HIIT Ⅱ';
update exercise set default_load_raw = 'しっかり息が切れて、かなり疲れるくらいの力で動きます。
心拍数は180回/分を超えないようにします。
きつさは10段階で8より下。かなりきついと感じるくらいです。' where name = 'HIIT Ⅲ';
update exercise set default_load_raw = '重りは付けず、バーベル（20kg）だけで行います。' where name = 'オーバーヘッドプレスⅡ';
update exercise set trainer_note = '筋発揮増強を目的に。', default_load_raw = null where name = 'オーバーヘッドプレスⅢ';
update exercise set trainer_note = '筋力発揮が目的', default_load_raw = null where name = 'ケーブルアブダクションⅡ';
update exercise set trainer_note = '最大筋力増加が目的', default_load_raw = null where name = 'ケーブルアブダクションⅢ';
update exercise set trainer_note = '検討必要', default_load_raw = null where name = 'ケーブルプッシュダウンⅡ';
update exercise set trainer_note = '検討必要（最大筋力増強）', default_load_raw = null where name = 'ケーブルプッシュダウンⅢ';
update exercise set trainer_note = '筋力発揮向上', default_load_raw = null where name = 'ケーブルラットプルダウンⅡ';
update exercise set trainer_note = '最大筋力の向上', default_load_raw = null where name = 'ケーブルラットプルダウンⅢ';
update exercise set default_load_raw = '息が切れて、疲れるくらいのペースで走ります。
心拍数は180回/分を超えないようにします。
きつさは10段階で8より下。きついと感じるくらいです。' where name = 'ショートラン10/30';
update exercise set default_load_raw = '息が切れて、疲れるくらいのペースで走ります。
心拍数は180回/分を超えないようにします。
きつさは10段階で8より下。きついと感じるくらいです。' where name = 'ショートラン14/16';
update exercise set default_load_raw = '話しながら走れるくらい、とてもゆっくり走ります。
心拍数は120回/分を超えないようにします。
きつさは10段階で5より下。楽に感じるくらいです。' where name = 'ジョグ10/120';
update exercise set default_load_raw = '少し速めでも、まだ余裕が残るペースで走ります。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。やや楽に感じるくらいです。' where name = 'ジョグ10/160';
update exercise set default_load_raw = 'ややきついけれど、最後まで同じペースを保てる速さで走ります。
心拍数は180回/分を超えないようにします。
きつさは10段階で7より下。ややきついくらいです。' where name = 'ジョグ10/180';
update exercise set default_load_raw = '話しながら走れるくらい、とてもゆっくり走ります。
心拍数は120回/分を超えないようにします。
きつさは10段階で5より下。楽に感じるくらいです。' where name = 'ジョグ20/120';
update exercise set default_load_raw = '少し速めでも、まだ余裕が残るペースで走ります。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。やや楽に感じるくらいです。' where name = 'ジョグ20/160';
update exercise set default_load_raw = 'ややきついけれど、最後まで同じペースを保てる速さで走ります。
心拍数は180回/分を超えないようにします。
きつさは10段階で7より下。ややきついくらいです。' where name = 'ジョグ20/180';
update exercise set default_load_raw = '話しながら走れるくらい、とてもゆっくり走ります。
心拍数は120回/分を超えないようにします。
きつさは10段階で5より下。楽に感じるくらいです。' where name = 'ジョグ30/120';
update exercise set default_load_raw = '少し速めでも、まだ余裕が残るペースで走ります。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。やや楽に感じるくらいです。' where name = 'ジョグ30/160';
update exercise set default_load_raw = 'ややきついけれど、最後まで同じペースを保てる速さで走ります。
心拍数は180回/分を超えないようにします。
きつさは10段階で7より下。ややきついくらいです。' where name = 'ジョグ30/180';
update exercise set default_load_raw = '少し息が切れて、少し疲れるくらいのペースで走ります。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。まだ楽に感じるくらいです。' where name = 'ハーフラン10/20';
update exercise set default_load_raw = 'ペダルは負荷をかけず、いちばん軽くしてこぎます。
心拍数は120回/分を超えないようにします。
きつさは10段階で5より下。楽に感じるくらいです。' where name = 'バイク10/120';
update exercise set default_load_raw = 'ペダルは少し重めにしてこぎます。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。楽に感じるくらいです。' where name = 'バイク10/160';
update exercise set default_load_raw = 'ペダルは重めにしてこぎます。
心拍数は180回/分を超えないようにします。
きつさは10段階で7より下。ややきついくらいです。' where name = 'バイク10/180';
update exercise set default_load_raw = 'ペダルは負荷をかけず、いちばん軽くしてこぎます。
心拍数は120回/分を超えないようにします。
きつさは10段階で5より下。楽に感じるくらいです。' where name = 'バイク20/120';
update exercise set default_load_raw = 'ペダルは少し重めにしてこぎます。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。楽に感じるくらいです。' where name = 'バイク20/160';
update exercise set default_load_raw = 'ペダルは重めにしてこぎます。
心拍数は180回/分を超えないようにします。
きつさは10段階で7より下。ややきついくらいです。' where name = 'バイク20/180';
update exercise set default_load_raw = 'ペダルは負荷をかけず、いちばん軽くしてこぎます。
心拍数は120回/分を超えないようにします。
きつさは10段階で5より下。楽に感じるくらいです。' where name = 'バイク30/120';
update exercise set default_load_raw = 'ペダルは少し重めにしてこぎます。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。楽に感じるくらいです。' where name = 'バイク30/160';
update exercise set default_load_raw = 'ペダルは重めにしてこぎます。
心拍数は180回/分を超えないようにします。
きつさは10段階で7より下。ややきついくらいです。' where name = 'バイク30/180';
update exercise set default_load_raw = '重りは付けず、バーベル（20kg）だけで行います。' where name = 'ベンチプレスⅡ';
update exercise set trainer_note = '筋力発揮増量を目的', default_load_raw = null where name = 'ベンチプレスⅢ';
update exercise set default_load_raw = 'バーベルの重さは20kgです。' where name = 'ベントオーバーローⅡ';
update exercise set trainer_note = '筋発揮向上を目的', default_load_raw = null where name = 'ベントオーバーローⅢ';
update exercise set default_load_raw = '息が切れて、疲れるくらいのペースで走ります。
心拍数は180回/分を超えないようにします。
きつさは10段階で8より下。きついと感じるくらいです。' where name = 'ミドルラン 12/18';
update exercise set default_load_raw = '少し息が切れて、少し疲れるくらいのペースで走ります。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。まだ楽に感じるくらいです。' where name = 'ミドルラン 15/45';
update exercise set default_load_raw = '息が切れて、かなり疲れるくらいのペースで走ります。
心拍数は180回/分を超えないようにします。
きつさは10段階で9より下。かなりきついと感じるくらいです。' where name = 'ラン800/3M';
update exercise set default_load_raw = '息が切れて、疲れるくらいのペースで走ります。
心拍数は160回/分を超えないようにします。
きつさは10段階で8より下。きついと感じるくらいです。' where name = 'ラン800/4M';
update exercise set default_load_raw = '少し息が切れて、少し疲れるくらいのペースで走ります。
心拍数は160回/分を超えないようにします。
きつさは10段階で6より下。まだ楽に感じるくらいです。' where name = 'ラン800/6M';
