# PHYSIOS（作り直し版）

knowledge の `fsnz/PHYSIOS/plan.md` の範囲で作る PHYSIOS。清水の一日のうち二つの流れをスマホで最後まで通す。

- 記録: 音声メモ → 文字起こし（Deepgram・EU）→ 選手ごとの下書き（Claude API）→ 夜の「今日のダイジェスト」で要確認だけ答えて一括で確定 → カルテ
- 処方: 確定した今の時期（清水のプロトコルの表1の行）→ 翌日のメニュー → 朝のブリーフィング → 選手の画面で実施を付ける

選手の画面（`/p/<token>`）はストア版で Capacitor に包む前提で、Service Worker・ホーム画面への追加・Web Push を持たない。

## 守っていること

- 臨床の中身（プロトコル・種目・本数・A/B 日）はコードに書かない。全て DB から読む。メニューを採る規則は既存の physios の `dailyPick.ts` / `abDay.ts` を写した（`src/lib/generation/fill.ts`）
- 時期（表1の行）は暦や週数で自動に進めない。トレーナーが確定したものだけで動く
- AI の出力は `draft` に入るだけで、ダイジェストで確定するまでカルテ・怪我・時期・日程に書かない
- 清水のプロトコルはこのリポジトリに置かない。既存の physios の seeds から DB に直接写す
- 全テーブルで RLS を有効にし、ポリシーを作らない。読み書きはサーバ側（service role）だけで、処理の前に担当関係を確かめる
- 見た目は既存の physios の `docs/DESIGN_SYSTEM.md` §0〜§3 のトークン（`tailwind.config.ts` と `globals.css` は §3-10・§3-11 の写し）

## 環境変数

`.env.example` を見る。Vercel にも同じ名前で入れる（`SUPABASE_DB_URL` は不要）。

## 立ち上げの手順

```bash
# 1. 器
psql "$SUPABASE_DB_URL" -f supabase/migrations/0001_init.sql
# 2. 清水のプロトコル（既存の physios の seeds を作業用の DB に入れてから写す）
bash scripts/build-source-db.sh ../physios "$SOURCE_DB_URL"
bash scripts/import-shimizu.sh "$SOURCE_DB_URL" "$SUPABASE_DB_URL"
# 3. トレーナーと架空の選手
node scripts/create-trainer.mjs --email ... --password ... --name '清水 遼'
```

## 検査

```bash
npm run typecheck
npm test
npm run build
```
