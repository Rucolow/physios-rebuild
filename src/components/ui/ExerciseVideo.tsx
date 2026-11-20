import { ExternalLink } from 'lucide-react'
import { isOwnStorageUrl } from '@/lib/format/ownStorageUrl'

/**
 * 種目の動画（DESIGN_SYSTEM §5-18「動画の様式」・裁定 J224-3）。
 *
 * **埋め込まない。** 動画共有サイトのフレーム埋め込み・oEmbed・サムネ取得は、閲覧の時点で
 * 第三者ホストに読者の閲覧を送る。§5-21 が記事の本文画像に課した「自前の Supabase Storage の
 * ホストだけ描き、それ以外はリンクの文字にする」を動画にも同じ規律で適用する（§6-4 48）。
 * ホストの判定は画像と**同じ 1 関数**（`isOwnStorageUrl()`）を通す。
 *
 * **選手シートとトレーナーの種目モーダルで共通の 1 部品**として置く（J224-3）。
 * ただし第1弾で実際にマウントするのは選手シートだけである——`trainer_exercise_view` は
 * 動画 2 列を開いておらず、開く/開かないの裁定は T15 / J21-9 の留保のまま（裁定 J228-1）。
 * 部品を読者ごとに 2 つ作らないために、語は**呼び出し側が辞書から渡す**（J85）。
 *
 * **ポスター・自動再生・ループを付けない**（J224-3）。`preload="none"` ——開いただけで
 * 動画の取得を始めない。
 */
export function ExerciseVideo({
  url,
  provenance,
  labels,
}: {
  /** `exercise.video_url`。空文字・null はこの部品を出さない（呼び出し側で判定する） */
  url: string
  /**
   * `exercise.video_provenance`。**`'ai_generated'` のときだけ**メタを出す
   * ——`filmed` は常態で無印（規則 13）。バッジ・色にしない（§4-15 と同根）
   */
  provenance: string | null
  labels: {
    /** 外部ホストのときのリンク文言（例「動画を見る」） */
    watch: string
    /** 生成物のメタ（例「AI 生成の動画」） */
    aiGenerated: string
  }
}) {
  const own = isOwnStorageUrl(url)
  // **`href` に置けるのは http / https だけ。** `exercise.video_url` は CHECK の無い
  // 自由な `text` で、`javascript:` / `data:text/html,…` が入りうる。`isOwnStorageUrl()` は
  // 判定できない値を「自前ではない」と答えるので、そのまま外部リンクの枝に落ちる
  // ——記事本文の画像が `react-markdown` の `urlTransform` で守られているのと同じ関所を、
  // この部品は自分で持つ。**通せない値は節ごと出さない**（「壊れたリンク」を描かない）
  if (!own && !/^https?:\/\//i.test(url)) return null
  return (
    <div className="mt-4">
      {own ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption -- 字幕トラックの器が無い（スキーマ §9.5 は video_url の 1 列）。字幕を発明しない
        <video
          src={url}
          controls
          preload="none"
          playsInline
          className="w-full rounded-field border border-layer-10"
        />
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300"
        >
          {labels.watch}
          <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      )}
      {/* 生成物を無印で見せない。**語だけで言う**（印・色にしない） */}
      {provenance === 'ai_generated' && (
        <p className="mt-1 text-2xs text-navy-400">{labels.aiGenerated}</p>
      )}
    </div>
  )
}
