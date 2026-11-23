-- 種目動画の置き場（2026-11-23 Rucolow「既存の素材をベースに完成させて」）
-- 清水の縦撮りを 4:5・15 秒に切り抜いた mp4 を置く。選手アプリが <video> で直接読むので公開にする。
-- ファイル名は推測できない uuid にし、種目コードや種目名を URL に出さない。
-- exercise.video_url にはこの置き場の公開 URL を入れる（VideoFrame の isOwnStorageUrl で自前と判定される）。
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exercise-video', 'exercise-video', true, 52428800, array['video/mp4'])
on conflict (id) do nothing;
