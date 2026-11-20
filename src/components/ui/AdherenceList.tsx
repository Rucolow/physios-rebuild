import { Num } from './Num'

/**
 * 実施の記録（§5-19・裁定 J201 / J223-4）。
 *
 * **プリミティブは語を持たない**（裁定 J85 / J223-4）。辞書（`Messages`）を受け取る形を
 * やめ、日付の書式・`aria-label`・分数の組み立てを呼び出し側から受ける——選手の経過画面は
 * 辞書から、トレーナーの経過タブ（§5-23）は日本語リテラルから渡す。
 * **窓は呼び出し側が決める**（選手 7 日・トレーナー 7 / 28 日）。
 *
 * **行が出るのは処方が届いた日だけ。** 届いていない日を 0 件の行で埋めると、
 * 未着が「やらなかった」に見える（J65・§2-9 規則10）。行数が窓の日数に満たないのは
 * 欠陥ではなくデータの事実である。
 *
 * 達成率で色を変えない（§4-8・§6-1 10）。全実施の日を緑で褒めると、
 * できなかった日が咎められた側になる。**長さだけが違いを言う。**
 *
 * 種目数ぶんのセグメント列は廃止した（J201）——§5-5 のフェーズ列と同じ形を
 * 「種目 1 つ」という別の意味に使う視覚的同音であり、1 日 16 種目では 1 本が極細になる。
 */
export function AdherenceList({
  adherence,
  formatDay,
  ariaLabel,
  fraction,
}: {
  adherence: { date: string; done: number; total: number }[]
  /** 暦日 → 行頭の表示（選手は辞書の `formatDayShort`、トレーナーは `M/D`） */
  formatDay: (iso: string) => string
  /** 行の読み上げ（「M/D N / M 実施」） */
  ariaLabel: (day: string, done: number, total: number) => string
  /** 右列の分数（語順は呼び出し側が持つ） */
  fraction: (done: number, total: number) => string
}) {
  return (
    <ul className="mt-3 space-y-2">
      {adherence.map((day) => {
        const label = ariaLabel(formatDay(day.date), day.done, day.total)
        return (
          <li key={day.date} className="flex items-center gap-3">
            <Num mono className="w-12 shrink-0 text-2xs text-navy-500">{formatDay(day.date)}</Num>
            <div
              role="progressbar"
              aria-valuenow={day.done}
              aria-valuemin={0}
              aria-valuemax={day.total}
              aria-label={label}
              className="h-1.5 w-full overflow-hidden rounded-pill bg-layer-10"
            >
              {/* 幅の指定のみ inline `style` を許可する（§4-8） */}
              <div
                className="h-full rounded-pill bg-emerald-400"
                style={{ width: `${day.total === 0 ? 0 : (day.done / day.total) * 100}%` }}
              />
            </div>
            <Num mono className="w-10 shrink-0 text-right text-2xs text-navy-400">
              {fraction(day.done, day.total)}
            </Num>
          </li>
        )
      })}
    </ul>
  )
}
