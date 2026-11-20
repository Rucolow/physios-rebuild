import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, daysBetween, localDate, weekSince } from '@/lib/date'

export type Participation = 'full' | 'limited' | 'out'

export interface RejoinStep {
  name: string
  order: number
  /** プロトコルの目安の週（null は目安なし） */
  week: number | null
  condition: string | null
  /** 合流できる見込みの日（その週の初日）。目安が無ければ null */
  date: string | null
  reached: boolean
}

export interface Rejoin {
  episodeId: string
  label: string
  /** 今の週。トレーナーが決めた時期（表1の行）の週を使い、無ければ受傷からの週 */
  week: number
  steps: RejoinStep[]
  /** 合流の段階から決まる参加区分。段階のデータが無ければ null */
  status: Participation | null
  /** 全ての段階に合流できる見込みの日 */
  fullOn: string | null
}

const RANK: Record<string, number> = { out: 0, limited: 1, full: 2 }

/**
 * 清水のプロトコルの「チーム練習の段階と目安の週」から、選手ごとの合流の見込みを出す。
 * 怪我が複数あるときは、全合流が一番遅い怪我を採る。進行中の怪我が無い選手は入れない。
 */
export async function loadRejoin(playerIds: string[], today: string): Promise<Map<string, Rejoin>> {
  const db = adminDb()
  const ids = playerIds.concat(['00000000-0000-0000-0000-000000000000'])
  const { data: eps } = await db
    .from('injury_episode')
    .select('id, player_id, label, injured_on, protocol_id')
    .in('player_id', ids)
    .eq('status', 'active')
  const out = new Map<string, Rejoin>()
  if (!eps?.length) return out
  const epIds = eps.map((e) => e.id)
  const protoIds = [...new Set(eps.map((e) => e.protocol_id).filter((x): x is string => !!x))].concat(['00000000-0000-0000-0000-000000000000'])
  const [{ data: pos }, unlocks] = await Promise.all([
    db
      .from('menu_position')
      .select('injury_episode_id, anchor_on, set_at, row:menu_row_id(week_hint)')
      .in('injury_episode_id', epIds)
      .lte('anchor_on', today)
      .order('set_at', { ascending: false }),
    // 0004 の適用前は表が無い
    db.from('protocol_team_unlock').select('protocol_id, unlock_week, condition_raw, step:team_step_id(name, sort_order)').in('protocol_id', protoIds),
  ])
  const hint = new Map<string, number | null>()
  for (const p of pos ?? []) {
    if (hint.has(p.injury_episode_id)) continue
    hint.set(p.injury_episode_id, (p.row as unknown as { week_hint: number | null } | null)?.week_hint ?? null)
  }
  for (const e of eps) {
    const sinceInjury = weekSince(e.injured_on, today)
    const week = hint.get(e.id) ?? sinceInjury
    // 今の週の初日（受傷日から 7 日ごと）
    const weekStart = addDays(today, -(daysBetween(e.injured_on, today) % 7))
    const steps: RejoinStep[] = (unlocks.data ?? [])
      .filter((u) => u.protocol_id === e.protocol_id)
      .map((u) => {
        const step = u.step as unknown as { name: string; sort_order: number }
        const w = u.unlock_week as number | null
        return {
          name: step.name,
          order: step.sort_order,
          week: w,
          condition: (u.condition_raw as string | null) ?? null,
          date: w === null ? null : addDays(weekStart, (w - week) * 7),
          reached: w !== null && week >= w,
        }
      })
      .sort((a, b) => (a.week ?? 999) - (b.week ?? 999) || a.order - b.order)
    const reached = steps.filter((s) => s.reached).length
    const status: Participation | null = steps.length === 0 ? null : reached === 0 ? 'out' : reached === steps.length ? 'full' : 'limited'
    const dated = steps.filter((s) => s.date)
    const fullOn = status === 'full' || dated.length === 0 ? null : dated.map((s) => s.date!).sort().at(-1)!
    const r: Rejoin = { episodeId: e.id, label: e.label, week, steps, status, fullOn }
    const prev = out.get(e.player_id)
    if (!prev || RANK[String(r.status)] < RANK[String(prev.status)] || (r.fullOn ?? '') > (prev.fullOn ?? '')) out.set(e.player_id, r)
  }
  return out
}

/** 参加区分の言葉（全ての画面で同じ） */
export const PART_WORD: Record<Participation, string> = { full: '完全参加', limited: '制限付き', out: '離脱中' }

/** 部分合流のときに、今参加できる練習を一行にする */
export function joinableText(r: Rejoin): string | null {
  if (r.status !== 'limited') return null
  return r.steps.filter((s) => s.reached).map((s) => s.name).join('・')
}

export async function todayFor(trainerId: string) {
  const { data } = await adminDb().from('trainer').select('time_zone').eq('id', trainerId).single()
  return localDate(data?.time_zone ?? 'Europe/Berlin')
}
