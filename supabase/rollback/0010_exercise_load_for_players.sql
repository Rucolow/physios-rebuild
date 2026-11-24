-- 0010 を戻す。強度の原文を戻し、trainer_note を消す。
update exercise set default_load_raw = '・ペースはしっかり息切れする程度（かなり疲れる強度）  
・心拍数は180回/分未満  
・自覚的な強度はかなりきつい（10段階中8未満）' where name = 'HIIT Ⅰ';
update exercise set default_load_raw = '・ペースはしっかり息切れする程度（かなり疲れる強度）  
・心拍数は180回/分未満  
・自覚的な強度はかなりきつい（10段階中8未満）' where name = 'HIIT Ⅱ';
update exercise set default_load_raw = '・ペースはしっかり息切れする程度（かなり疲れる強度）  
・心拍数は180回/分未満  
・自覚的な強度はかなりきつい（10段階中8未満）' where name = 'HIIT Ⅲ';
update exercise set default_load_raw = '・バーベルのみ（20kg）' where name = 'オーバーヘッドプレスⅡ';
update exercise set default_load_raw = '・筋発揮増強を目的に。' where name = 'オーバーヘッドプレスⅢ';
update exercise set default_load_raw = '・筋力発揮が目的' where name = 'ケーブルアブダクションⅡ';
update exercise set default_load_raw = '・最大筋力増加が目的' where name = 'ケーブルアブダクションⅢ';
update exercise set default_load_raw = '**・検討必要**' where name = 'ケーブルプッシュダウンⅡ';
update exercise set default_load_raw = '・検討必要（最大筋力増強）' where name = 'ケーブルプッシュダウンⅢ';
update exercise set default_load_raw = '・筋力発揮向上' where name = 'ケーブルラットプルダウンⅡ';
update exercise set default_load_raw = '・最大筋力の向上' where name = 'ケーブルラットプルダウンⅢ';
update exercise set default_load_raw = '・ペースは息切れする程度（疲れる強度）  
・心拍数は180回/分未満  
・自覚的な強度はきつい（10段階中8未満）' where name = 'ショートラン10/30';
update exercise set default_load_raw = '・ペースは息切れする程度（疲れる強度）  
・心拍数は180回/分未満  
・自覚的な強度はきつい（10段階中8未満）' where name = 'ショートラン14/16';
update exercise set default_load_raw = '・ペースは非常にゆっくり（会話が可能な強度）  
・心拍数は120回/分未満  
・自覚的な強度は楽（10段階中5未満）' where name = 'ジョグ10/120';
update exercise set default_load_raw = '・ペースはやや速めだが余裕あり  
・心拍数は160回/分未満  
・自覚的な強度はやや楽（10段階中6未満）' where name = 'ジョグ10/160';
update exercise set default_load_raw = '・ペースはややきついが維持可能  
・心拍数は180回/分未満  
・自覚的な強度はややきつい（10段階中7未満）' where name = 'ジョグ10/180';
update exercise set default_load_raw = '・ペースは非常にゆっくり（会話が可能な強度）  
・心拍数は120回/分未満  
・自覚的な強度は楽（10段階中5未満）' where name = 'ジョグ20/120';
update exercise set default_load_raw = '・ペースはやや速めだが余裕あり  
・心拍数は160回/分未満  
・自覚的な強度はやや楽（10段階中6未満）' where name = 'ジョグ20/160';
update exercise set default_load_raw = '・ペースはややきついが維持可能  
・心拍数は180回/分未満  
・自覚的な強度はややきつい（10段階中7未満）' where name = 'ジョグ20/180';
update exercise set default_load_raw = '・ペースは非常にゆっくり（会話が可能な強度）  
・心拍数は120回/分未満  
・自覚的な強度は楽（10段階中5未満）' where name = 'ジョグ30/120';
update exercise set default_load_raw = '・ペースはやや速めだが余裕あり  
・心拍数は160回/分未満  
・自覚的な強度はやや楽（10段階中6未満）' where name = 'ジョグ30/160';
update exercise set default_load_raw = '・ペースはややきついが維持可能  
・心拍数は180回/分未満  
・自覚的な強度はややきつい（10段階中7未満）' where name = 'ジョグ30/180';
update exercise set default_load_raw = '・ペースは少し息切れする程度（少し疲れる強度）  
・心拍数は160回/分未満  
・自覚的な強度は楽（10段階中6未満）' where name = 'ハーフラン10/20';
update exercise set default_load_raw = '・負荷なしで実施。  
・心拍数は120回/分未満。  
・自覚的な強度は楽。10段階中5未満。' where name = 'バイク10/120';
update exercise set default_load_raw = '・負荷は少し重い。  
・心拍数は160回/分未満。  
・自覚的な強度は楽。10段階中6未満。' where name = 'バイク10/160';
update exercise set default_load_raw = '・負荷は重い。  
・心拍数は180回/分未満。  
・自覚的な強度はややきつい。10段階中7未満。' where name = 'バイク10/180';
update exercise set default_load_raw = '・負荷なしで実施。  
・心拍数は120回/分未満。  
・自覚的な強度は楽。10段階中5未満。' where name = 'バイク20/120';
update exercise set default_load_raw = '・負荷は少し重い。  
・心拍数は160回/分未満。  
・自覚的な強度は楽。10段階中6未満。' where name = 'バイク20/160';
update exercise set default_load_raw = '・負荷は重い。  
・心拍数は180回/分未満。  
・自覚的な強度はややきつい。10段階中7未満。' where name = 'バイク20/180';
update exercise set default_load_raw = '・負荷なしで実施。  
・心拍数は120回/分未満。  
・自覚的な強度は楽。10段階中5未満。' where name = 'バイク30/120';
update exercise set default_load_raw = '・負荷は少し重い。  
・心拍数は160回/分未満。  
・自覚的な強度は楽。10段階中6未満。' where name = 'バイク30/160';
update exercise set default_load_raw = '・負荷は重い。  
・心拍数は180回/分未満。  
・自覚的な強度はややきつい。10段階中7未満。' where name = 'バイク30/180';
update exercise set default_load_raw = '・バーバルのみ（20kg）' where name = 'ベンチプレスⅡ';
update exercise set default_load_raw = '・筋力発揮増量を目的' where name = 'ベンチプレスⅢ';
update exercise set default_load_raw = '・バーベル（20kg）' where name = 'ベントオーバーローⅡ';
update exercise set default_load_raw = '・筋発揮向上を目的' where name = 'ベントオーバーローⅢ';
update exercise set default_load_raw = '・ペースは息切れする程度（疲れる強度）  
・心拍数は180回/分未満  
・自覚的な強度はきつい（10段階中8未満）' where name = 'ミドルラン 12/18';
update exercise set default_load_raw = '・ペースは少し息切れする程度（少し疲れる強度）  
・心拍数は160回/分未満  
・自覚的な強度は楽（10段階中6未満）' where name = 'ミドルラン 15/45';
update exercise set default_load_raw = '・ペースは息切れする程度（かなり疲れる強度）  
・心拍数は180回/分未満  
・自覚的な強度はかなりきつい（10段階中9未満）' where name = 'ラン800/3M';
update exercise set default_load_raw = '・ペースは息切れする程度（疲れる強度）  
・心拍数は160回/分未満  
・自覚的な強度はきつい（10段階中8未満）' where name = 'ラン800/4M';
update exercise set default_load_raw = '・ペースは少し息切れする程度（少し疲れる強度）  
・心拍数は160回/分未満  
・自覚的な強度は楽（10段階中6未満）' where name = 'ラン800/6M';
alter table exercise drop column if exists trainer_note;
