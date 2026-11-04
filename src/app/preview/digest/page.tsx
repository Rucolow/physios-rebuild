import { notFound } from 'next/navigation'
import { DigestView, type DigestItem, type DigestContext } from '@/components/trainer/DigestView'
import { TrainerNav } from '@/components/trainer/TrainerNav'
import type { InterpretedSegment } from '@/lib/llm/interpret'

/** 夜のダイジェストの見本（架空のデータ）。方向の確定のためだけに置く。本番では PHYSIOS_PREVIEW=1 のときだけ開く */
export default function PreviewDigest() {
  if (process.env.NODE_ENV === 'production' && process.env.PHYSIOS_PREVIEW !== '1') notFound()

  const seg = (p: Partial<InterpretedSegment>): InterpretedSegment => ({
    kind: 'karte', player_id: null, candidates: [], player_basis: '', summary: '', subjective: null, objective: null,
    assessment: null, treatment: null, plan: null, start_sec: 0, menu_row_index: null, protocol_candidates: [],
    injured_on: null, kickoff_at: null, schedule_note: null, alert: null, ...p,
  })
  const rows = (pid: string, n: number) => Array.from({ length: n }, (_, i) => ({ id: `${pid}-r${i + 1}`, row_index: i + 1, week_hint: i + 1, period_raw: `${i + 1}週目〜` }))
  const ctx: DigestContext = {
    today: '2026-11-04',
    timeZone: 'Europe/Berlin',
    players: [
      { id: 'p1', name: '森 大和' },
      { id: 'p2', name: '田中 健太' },
      { id: 'p3', name: '田中 陸' },
      { id: 'p4', name: 'Lukas Becker' },
    ],
    protocols: [
      { id: 'h2', title: 'ハムストリングス肉離れ・中程度' },
      { id: 'a1', title: '足関節側副靭帯損傷・軽度' },
      { id: 'a2', title: '足関節側副靭帯損傷・中程度' },
    ],
    rows: { h2: rows('h2', 7), a1: rows('a1', 4), a2: rows('a2', 7) },
    episodes: { p1: { protocolId: 'h2', label: 'ハムストリングス肉離れ・中程度', week: 2, currentRowId: 'h2-r2' } },
  }
  const base = { status: 'pending' as const, carried: false, localDate: '2026-11-04', audioUrl: null, answer: null }
  const items: DigestItem[] = [
    { ...base, id: 'd1', kind: 'karte', time: '09:12', playerId: 'p1', playerName: '森 大和', reason: null,
      seg: seg({ summary: '右ハムの張りは横ばい。SLR は左右差 10° ほど。ブリッジで痛みなし。メニューは継続。' }) },
    { ...base, id: 'd2', kind: 'karte', time: '10:42', playerId: null, playerName: null, reason: 'player',
      seg: seg({ candidates: ['p2', 'p3'], player_basis: '「田中」とだけ呼んでいる', summary: '右足首、前回より張りが強い。可動域は維持。試合前に再チェック。', start_sec: 38 }) },
    { ...base, id: 'd3', kind: 'karte', time: '11:18', playerId: 'p1', playerName: '森 大和', reason: null,
      seg: seg({ summary: 'ジョギングで痛みの訴えなし。片脚ブリッジも左右差なし。' }) },
    { ...base, id: 'd4', kind: 'menu_row', time: '11:18', playerId: 'p1', playerName: '森 大和', reason: 'menu_row',
      seg: seg({ kind: 'menu_row', player_id: 'p1', summary: '明日から 3 週目のメニューに進める。', menu_row_index: 3, start_sec: 21 }) },
    { ...base, id: 'd5', kind: 'injury', time: '14:03', playerId: 'p4', playerName: 'Lukas Becker', reason: 'protocol',
      seg: seg({ kind: 'injury', player_id: 'p4', summary: '練習中に左足首を内反。腫れは軽度、荷重は可能。', protocol_candidates: ['a1', 'a2'], injured_on: '2026-11-04',
        alert: '外傷。明日の朝に腫れをもう一度見る。' }) },
    { ...base, id: 'd6', kind: 'schedule', time: '17:26', playerId: null, playerName: null, reason: 'schedule',
      seg: seg({ kind: 'schedule', summary: '土曜の練習試合が日曜 15 時に変更。', kickoff_at: '2026-11-08T15:00:00+01:00', schedule_note: '練習試合' }) },
  ]
  return (
    <div className="min-h-screen shell-bg text-navy-100">
      <div className="pb-nav">
        <DigestView preview dateLabel={{ full: '2026年11月4日', wd: '水曜日' }} pending={items} resolved={[]} failed={[]} ctx={ctx} />
      </div>
      <TrainerNav />
    </div>
  )
}
