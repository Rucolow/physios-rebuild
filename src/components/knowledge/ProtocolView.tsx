'use client'
import { useState } from 'react'
import { ChevronDown, Layers } from 'lucide-react'
import { VideoFrame } from '@/components/menu/VideoFrame'
import type { SheetExercise, SheetRow } from '@/lib/knowledge'

const strip = (s: string) => s.replace(/^・/, '')

/** 用量の 1 行に出すもの（セット・回数・負荷）と、改行を含む列・休憩（開いた中で読む） */
function doseParts(e: SheetExercise) {
  const cols = [
    ['sets', e.sets],
    ['reps', e.reps],
    ['load', e.load],
  ] as const
  const chips: { key: string; text: string }[] = []
  const folded: string[] = []
  for (const [key, raw] of cols) {
    if (!raw) continue
    if (raw.includes('\n')) folded.push(strip(raw))
    else chips.push({ key, text: strip(raw) })
  }
  if (e.rest) folded.push(`休憩 ${strip(e.rest)}`)
  return { row: chips, folded }
}

export function ProtocolView({ rows, articles }: { rows: SheetRow[]; articles: { id: string; title: string }[] }) {
  const evidence: string[] = []
  // 初期状態は 1 週目（director「初期状態 = 1 週目タブ選択・全カテゴリ展開・種目行は全て閉」）
  const [active, setActive] = useState(0)
  const row = rows[active]

  return <>
    {/* 週の行タブ。旧 Phase タブバー（`ref-old-protocol-tabs.json`: 包み r12 / p4 / bg white 3% /
        border white 10%、タブ r12 / p 10px 12px / h64、選択 cyan・非選択 white 40%）。
        **390 は 3 列の grid で折り返す**（裁定 D1）——横スクロールにすると 4〜7 本目が隠れ、
        「全期間が同時に見える等幅タブ」という参照の型が変わる。「寸法側を文言に合わせる」の規則どおり
        行数を増やし、1 タブ幅は旧 390 と同じ (358−8−8)/3 ≒ 113.3 に保つ */}
    <div
      data-measure="protocol-tabs"
      className="grid grid-cols-3 gap-1 rounded-[var(--oa-radius-md)] border border-[color:var(--oa-border)] bg-white/[0.03] p-1 md:flex md:items-center"
    >
      {rows.map((r, i) => <button
        key={r.menuRowId}
        type="button"
        onClick={() => setActive(i)}
        aria-current={i === active ? 'true' : undefined}
        // 遷移は旧と同じ時間と値（裁定 M1）。旧は全プロパティ指定の 200ms だが、PHYSIOS は
        // 全プロパティ指定が禁止（DESIGN_SYSTEM §6）なので、動く性質＝色に絞って 200ms で書く
        className={`rounded-[var(--oa-radius-md)] border px-3 py-2.5 text-left text-[14px] font-medium leading-[20px] transition-colors duration-200 md:flex-1 ${
          i === active
            ? 'border-[rgba(6,182,212,0.3)] bg-[rgba(6,182,212,0.1)] text-[rgb(34,211,238)]'
            : 'border-transparent text-white/40 hover:bg-[color:var(--oa-surface)] hover:text-white/60'
        }`}
      >
        <span className="block truncate text-[14px] font-medium leading-[20px]">{r.periodRaw}</span>
        <span className="mt-0.5 block text-[10px] font-medium leading-[20px] tabular-nums">{r.itemCount} 種目</span>
      </button>)}
    </div>

    <div className="space-y-4">
      {/* 週カード。旧 Phase カード（`ref-old-protocol-week.json`: r12 / p16 / emerald 30% 枠 /
          emerald 20% → 透明のグラデーション、題 18px/700 emerald、右上 12px white 50%）。
          旧のチップ（安静・疼痛管理）と進行基準は**行データに無いので置かない**（高さは派生）。
          「未N」も置かない（PHYSIOS に未レビューの概念が無い） */}
      <div
        data-measure="protocol-week"
        className="flex items-start justify-between gap-4 rounded-[var(--oa-radius-md)] border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-transparent p-4"
      >
        <h2 className="text-[18px] font-bold leading-[28px] text-[rgb(52,211,153)]">{row?.periodRaw ?? ''}</h2>
        <div className="shrink-0 text-right text-[12px] leading-[16px] text-white/50">
          <div className="tabular-nums">{row?.cells.length ?? 0} カテゴリ</div>
          <div className="mt-0.5 tabular-nums">{row?.itemCount ?? 0} 種目</div>
        </div>
      </div>

      {/* 関連（PHYSIOS 専用）。旧「週間ローテーション」カードの位置と様式（r12 / p16 /
          bg white 3% / border white 10%、12px 淡色の題）。0 件の側は節ごと出さない */}
      {(articles.length > 0 || evidence.length > 0) && <div
        data-measure="protocol-related"
        className="rounded-[var(--oa-radius-md)] border border-[color:var(--oa-border)] bg-white/[0.03] p-4"
      >
        {/* 題は旧 `DayRotationBar` の h4 と同じ（12px / 500 / white 50% / uppercase /
            letter-spacing 0.05em = 0.6px、題の行に margin-bottom 12）。裁定 M2 / M4。
            **`tracking-wider` の語は使えない**——旧アプリの Tailwind は 0.05em だが PHYSIOS の
            `tailwind.config.ts` は同じ語を 0.08em に上書きしている。**参照の計算済み値を優先する**
            規則（SKILL.md §11）どおり、値で書く。
            **題の行を包む div は旧と同じ**——旧は h4 の margin が 0 で、12px は包みが持つ */}
        {articles.length > 0 && <>
          <div className="mb-3">
            <h3 className="text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-white/50">解説記事</h3>
          </div>
          <ul className="space-y-1">
            {articles.map((a) => <li key={a.id}>
              <a
                href={`/knowledge/article/${a.id}`}
                className="text-[14px] leading-[20px] text-[rgb(34,211,238)] transition-colors duration-[var(--oa-transition)] hover:text-[rgb(103,232,249)]"
              >{a.title}</a>
            </li>)}
          </ul>
        </>}
        {evidence.length > 0 && <>
          <div className={articles.length > 0 ? 'mb-3 mt-4' : 'mb-3'}>
            <h3 className="text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-white/50">出典</h3>
          </div>
          <ul className="space-y-1">
            {evidence.map((e) => <li key={e} className="text-[14px] leading-[20px] text-white/50">{e}</li>)}
          </ul>
        </>}
      </div>}

      {/* 列カテゴリ。旧カテゴリカード（`ref-old-protocol-cat.json`: r16 / bg white 3% /
          border white 10% / overflow-hidden、ヘッダ px16 py12）。**題のみ**——アイコン・
          「両日実施」・全○全×・Day A/B 切替は置かない（director）。全カテゴリ展開が初期状態。
          **カテゴリ群は独自の包みに入れる**（旧と同じ。週カード・関連と同じ space-y に混ぜると
          先頭カードに margin-top が付き、参照の margin 0 と食い違う） */}
      <div className="space-y-2">
      {(row?.cells ?? []).map((cell) => <CategoryCard key={`${row!.menuRowId}:${cell.columnLabel}:${cell.categoryLabel}`} cell={cell} />)}
      </div>

      {(row?.cells.length ?? 0) === 0 && <div className="rounded-[var(--oa-radius-lg)] border border-[color:var(--oa-border)] bg-white/[0.03] px-4 py-3">
        <p className="text-[12px] leading-[16px] text-white/40">この行のマスは未投入です。</p>
      </div>}
    </div>
  </>
}

/** 見出し（カテゴリ）。押すと種目が開く。初めは閉じておく */
function CategoryCard({ cell }: { cell: SheetRow['cells'][number] }) {
  const [open, setOpen] = useState(false)
  const n = cell.exercises.length
  return <div className="overflow-hidden rounded-[var(--oa-radius-lg)] border border-[color:var(--oa-border)] bg-white/[0.03]">
    <button type="button" aria-expanded={open} disabled={n === 0} onClick={() => setOpen(!open)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] disabled:cursor-default disabled:hover:bg-transparent">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--oa-radius-md)] bg-[color:var(--oa-surface)]">
        <Layers size={16} strokeWidth={2} aria-hidden="true" className="text-white/40" />
      </span>
      <span className={`min-w-0 flex-1 truncate text-[14px] font-[600] leading-[20px] ${n ? 'text-white' : 'text-white/40'}`}>{cell.categoryLabel}</span>
      <span className="shrink-0 text-[12px] text-white/40 tabular-nums">{n ? `${n} 種目` : 'なし'}</span>
      {n > 0 && <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />}
    </button>
    {open && <div className="border-t border-white/5">
      {cell.exercises.map((exercise) => <ExerciseRow key={exercise.exerciseId} exercise={exercise} />)}
    </div>}
  </div>
}

/**
 * 種目行（旧レビューツールの種目行。`ref-old-protocol-row.json`: 内側 px16 py12、
 * chevron 16px、名前 14px/500 白、用量チップ 12px/白50%・bg white5%・r4・p 2px 8px、
 * チップ行は名前の下に 28px 字下げ）。Lv と ○× は置かない（director 確定）。
 *
 * **`<details>` を使わない。** 閉じた `<details>` の中身は `content-visibility: hidden` で
 * 描画されないのに矩形だけが残り、measure が「参照に無い要素」として拾ってしまう。
 * 状態を持って**閉じている間は DOM に出さない**ほうが、計測にも読み込みにも正しい。
 * 初期は閉（director 確定）。
 */
function ExerciseRow({ exercise }: { exercise: SheetExercise }) {
  const [open, setOpen] = useState(false)
  const { row: chips, folded } = doseParts(exercise)
  const empty = folded.length === 0 && !exercise.trainerNote && !exercise.startPosition && !exercise.movement && exercise.focusPoints.length === 0

  return <div className="border-b border-white/5 transition-colors duration-200 last:border-b-0">
    <button
      type="button"
      data-measure="protocol-row"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="group block w-full px-4 py-3 text-left"
    >
      <span className="flex items-center gap-3">
        {/* chevron の遷移は旧と同じ（色 150ms・`hover:text-white/80`）。回転は
            性質を絞って書く——全プロパティ指定は PHYSIOS の禁止（裁定 M1） */}
        <ChevronDown
          size={16} strokeWidth={2} aria-hidden="true"
          // 旧の chevron は `text-white/40 hover:text-white/80 transition-colors`（150ms）で、
          // 開閉は ChevronUp / ChevronDown の差し替え。PHYSIOS は 1 つの字面を回すので
          // **色と回転の 2 つ**を同じ 150ms で名指しして書く（全プロパティ指定は禁止・裁定 M1）
          className={`shrink-0 text-white/40 transition-[color,transform] duration-[var(--oa-transition)] group-hover:text-white/80 ${
            open ? 'rotate-180' : ''
          }`}
        />
        <span className="text-[14px] font-medium leading-[20px] text-white">{exercise.name}</span>
      </span>
      {/* チップ行の包みも参照どおり 12px/16px/白50%（旧 div#3）。チップが 1 つも無い列の
          余白と行送りがここで決まる */}
      {chips.length > 0 && <span className="ml-7 mt-1.5 flex flex-wrap gap-2 text-[12px] leading-[16px] text-white/50">
        {chips.map((p) => <span
          key={p.key}
          className="rounded-[var(--oa-radius-xs)] bg-[color:var(--oa-surface)] px-2 py-0.5 text-[12px] leading-[16px] text-white/50 tabular-nums"
        >{p.text}</span>)}
      </span>}
    </button>
    {/* 折り畳みの中身（旧の種目モーダル本文の様式を行内に展開・director 暫定）。
        行に載せなかった逐語（休憩・改行を含む列）を捨てずにここで読む（§5-9・J174-2）。
        改行は保つ——著者の箇条書きを潰さない */}
    {open && <div className="space-y-3 border-t border-white/5 py-3 pl-11 pr-4">
      {exercise.videoUrl && <div className="max-w-md"><VideoFrame url={exercise.videoUrl} title={exercise.name} /></div>}
      {folded.length > 0 && <p className="whitespace-pre-line text-[12px] leading-[16px] text-white/50 tabular-nums">
        {folded.join('\n')}
      </p>}
      {exercise.startPosition && <div>
        <div className="text-[12px] leading-[16px] text-white/40">開始姿勢</div>
        <p className="mt-1 whitespace-pre-line text-[14px] leading-[20px] text-white/80">{exercise.startPosition}</p>
      </div>}
      {exercise.movement && <div>
        <div className="text-[12px] leading-[16px] text-white/40">動作</div>
        <p className="mt-1 whitespace-pre-line text-[14px] leading-[20px] text-white/80">{exercise.movement}</p>
      </div>}
      {exercise.focusPoints.length > 0 && <div>
        <div className="text-[12px] leading-[16px] text-white/40">ポイント</div>
        <ul className="mt-1 space-y-1">
          {exercise.focusPoints.map((f) => <li key={f} className="text-[14px] leading-[20px] text-white/80">{f}</li>)}
        </ul>
      </div>}
      {exercise.trainerNote && <div>
        <div className="text-[12px] leading-[16px] text-white/40">トレーナー向けメモ（選手には出ない）</div>
        <p className="mt-1 whitespace-pre-line text-[14px] leading-[20px] text-white/80">{exercise.trainerNote}</p>
      </div>}
      {/* J18-3: 未登録は文言で言う。空欄で表さない */}
      {empty && <p className="text-[12px] leading-[16px] text-white/40">この種目の詳細は登録されていません。</p>}
    </div>}
  </div>
}
