import { Num } from './Num'
import { cn } from '@/lib/utils'

/**
 * 申告の推移（痛み・疲労。§5-15・裁定 J70 / J201 / J227-4 / J223-4）。
 *
 * **プリミティブは語を持たない**（裁定 J85 / J223-4）。辞書（`Messages`）を受け取る形を
 * やめ、日付の書式と `aria-label` を呼び出し側から受ける——選手の経過画面は辞書から、
 * トレーナーの経過タブ（§5-23）は日本語リテラルから渡す（トレーナーは辞書化しない・設計書 6.3）。
 * 同じ図を 2 つ書かないために、部品は `components/ui` の 1 つである。
 *
 * **部品は 1 つで、系列は見出しの語と `aria-label` だけが言う**（裁定 J227-4）。
 * 痛みと疲労を 1 枚に重ねない——重ねると色で系列を分けることになり、
 * §6-1 46（申告値に状態色を付けない）・47（推移グラフにゴールドを使わない）に同時に反する。
 * 「痛みだけ `SIGNAL` で色を付け、疲労を無彩色にする」案は却下済み。
 *
 * 痛みは**低いほど良い**が、色で善悪を付けない。0-6 は報告であって成績ではなく、
 * 赤く塗れば過少申告を招く（ConditionScale と同じ理由）。疲労に閾値・急変の印も付けない
 * （「いくつ変わったら言うか」は臨床領域である）。
 *
 * **目盛の無い棒は絵でしかない。** 直前まで軸が 1 本も無く、棒の高さが何を意味するかを
 * 画面が言っていなかった——上限が見えなければ「3」は半分にも満点にも読める。
 * §5-15 は軸ラベルと目盛線の様式を既に規定していたので、欠けていたのは置き方だけである。
 *
 * 目盛は **0 / 3 / 6 の 3 本固定**（裁定 J201）。1 点刻みの 7 本にすると、
 * 棒の高さが評価の目盛として読める（§5-14 と同じ理由）。
 * 位置は `justify-between` の 3 点配置で決める——inline `style` の `top` も `top-1/2` も使わない
 * （§5-15 の inline 許可は高さのみ・§6-2 12）。
 *
 * **棒の幅は上限であって固定ではない**（裁定 J223-4）。`w-5` 固定のままだと 28 本が
 * 390px に収まらない——棒は `w-full max-w-5`、列は `min-w-0 flex-1`、列間は 7 本なら
 * `gap-2`・28 本なら `gap-1`（`dense`）。**本数は呼び出し側の窓が決める**ので、
 * 点の数から推定しない（記録の無い日は点を作らないため、28 日の窓でも点は 3 つでありうる）。
 *
 * **日付の x ラベルの本数も窓が決める**（裁定 J229）。7 日は全列、28 日（`dense`）は
 * 最初の棒と最後の棒の日付の 2 つだけ——1 列 12px に `M/D` は入らない。
 */
const MAX_SCORE = 6

export function ConditionTrend({
  points,
  formatDay,
  valueAria,
  noRecordAria,
  dense,
}: {
  points: { date: string; score: number | null }[]
  /** 暦日 → 軸の表示（選手は辞書の `formatDayShort`、トレーナーは `M/D`） */
  formatDay: (iso: string) => string
  /** 記録がある日の読み上げ（「M/D 痛み N」／「M/D 疲労 N」）。系列の名はこの語が言う */
  valueAria: (day: string, score: number) => string
  /** 未記録の日の読み上げ（「M/D 未記録」） */
  noRecordAria: (day: string) => string
  /** 28 日の窓。列間を詰める（§5-15・J223-4）。既定は 7 日 */
  dense?: boolean
}) {
  const gap = dense ? 'gap-1' : 'gap-2'
  // 28 日の日付行。**同じ日を 2 度書かない**（点が 1 つなら 1 つだけ）
  const first = points[0]?.date
  const last = points[points.length - 1]?.date
  const ends = first === undefined ? [] : first === last ? [first] : [first, last!]
  return (
    <div className="mt-4 flex gap-2">
      {/* 軸ラベル。棒の値と同じ字体で読めるよう `<Num mono>` を通す（§P4） */}
      <div
        className="flex h-32 shrink-0 flex-col justify-between text-2xs leading-none text-navy-500"
        aria-hidden="true"
      >
        <Num mono>{MAX_SCORE}</Num>
        <Num mono>{MAX_SCORE / 2}</Num>
        <Num mono>0</Num>
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative h-32">
          {/* 目盛線。最下段が基線（§5-15「基線・目盛線は `border-t border-layer-10` のみ」） */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden="true">
            <span className="border-t border-layer-10" />
            <span className="border-t border-layer-10" />
            <span className="border-t border-layer-10" />
          </div>
          {/* items-stretch でないと列の高さが auto になり、棒の height:% が 0 に潰れる */}
          <div className={cn('relative flex h-full items-stretch justify-between', gap)}>
            {points.map((point) => (
              <div key={point.date} className="flex min-w-0 flex-1 items-end justify-center">
                {point.score === null ? (
                  /* 未記録。0（痛みなし／疲労なし）と区別する——記録が無いことを「なし」に読ませない。
                     片方だけ申告した日はもう片方がここに来る（J227-2） */
                  <span
                    className="h-1 w-full max-w-5 rounded-badge bg-layer-5"
                    role="img"
                    aria-label={noRecordAria(formatDay(point.date))}
                  />
                ) : (
                  <span
                    /* 0 でも見える下限を持たせる。0 は「報告した」という記録であって空白ではない。
                       色は全期間で同一の中立の明度（§5-15・裁定 J70）——過去の記録の量は
                       『いま・次の一歩』ではないのでゴールドを使わず、申告値に状態色も付けない。
                       痛みと疲労も同じ明度で描く（系列は色で分けない・J227-4） */
                    className="w-full max-w-5 rounded-badge bg-layer-20"
                    style={{ height: `max(0.5rem, ${(point.score / MAX_SCORE) * 100}%)` }}
                    role="img"
                    aria-label={valueAria(formatDay(point.date), point.score)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 日付は基線の下に別行で置く（棒の列の中に入れない・§5-15）。
            **本数は窓が決める**（裁定 J229）——28 日で全列に置くと 1 列 12px に `M/D` は
            入らず、読めない字が 28 個並ぶ。28 日は最初の棒と最後の棒の日付の 2 つだけ。
            列は等幅なので両端のラベルは両端の棒と揃う。中間の日付は各棒の `aria-label` が言う。
            **7 本ごとの間引きは採らない**——点は届いた日だけで（`progressShape`・J227-4 / J65）
            7 列は 7 日ではなく、暦の週と一致しない刻みが週に見える（§5-7 の同音） */}
        {dense ? (
          <div className="mt-2 flex justify-between gap-2">
            <Num mono className="text-2xs text-navy-500">{formatDay(ends[0]!)}</Num>
            {ends.length > 1 && (
              <Num mono className="text-right text-2xs text-navy-500">{formatDay(ends[1]!)}</Num>
            )}
          </div>
        ) : (
          <div className={cn('mt-2 flex justify-between', gap)}>
            {points.map((point) => (
              <Num key={point.date} mono className="min-w-0 flex-1 text-center text-2xs text-navy-500">
                {formatDay(point.date)}
              </Num>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
