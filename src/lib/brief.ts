import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, daysBetween, localDate, weekSince } from '@/lib/date'
import { personName } from '@/lib/format/name'
import { activeEpisodes } from '@/lib/roster'
import { prescribe } from '@/lib/prescribe'
import type { Trainer } from '@/lib/auth'

export interface BriefPlayer {
  id: string
  name: string
  token: string
  episode: null | { label: string; week: number; period: string | null }
  today: null | { rest: boolean; count: number; dayGroup: string | null }
  yesterday: null | { done: number; total: number }
  lastKarte: null | { on: string; summary: string }
}

export interface BriefData {
  today: string
  unconfirmed: number
  nextMatch: null | { kickoff_at: string; days: number; note: string | null; opponent: string | null }
  players: BriefPlayer[]
}

/** 朝のブリーフィングの材料。数字と状態は全てデータからその場で出す（文に凍結しない） */
export async function loadBrief(trainer: Trainer): Promise<BriefData> {
  const db = adminDb()
  const today = localDate(trainer.time_zone)
  const yesterday = addDays(today, -1)
  const eps = await activeEpisodes(trainer.id)

  // 今日のメニューがまだ無ければ組む（確定した時期から決まるので、いつ組んでも同じ）
  for (const e of eps) await prescribe(e.id, today)

  const [{ data: players }, { data: rx }, { count: unconfirmed }, { data: matches }, { data: kartes }] = await Promise.all([
    db.from('player').select('id, family_name, given_name, share_token').eq('trainer_id', trainer.id).eq('is_active', true).order('family_name'),
    db
      .from('prescription')
      .select('player_id, target_on, is_rest_day, day_group, items:prescription_item(done_at)')
      .in('player_id', eps.map((e) => e.player_id).concat(['00000000-0000-0000-0000-000000000000']))
      .in('target_on', [today, yesterday]),
    db.from('draft').select('id', { count: 'exact', head: true }).eq('trainer_id', trainer.id).eq('status', 'pending').lt('local_date', today),
    db
      .from('match_schedule')
      .select('kickoff_at, note, opponent')
      .eq('trainer_id', trainer.id)
      .gte('kickoff_at', new Date().toISOString())
      .order('created_at', { ascending: false }),
    db
      .from('karte_entry')
      .select('player_id, written_on, summary, confirmed_at')
      .gte('written_on', addDays(today, -7))
      .order('confirmed_at', { ascending: false }),
  ])

  // 同じ試合の日程が変わったときは新しい行を足しているので、一番早い試合を出す
  const upcoming = [...(matches ?? [])].sort((a, b) => a.kickoff_at.localeCompare(b.kickoff_at))[0]

  return {
    today,
    unconfirmed: unconfirmed ?? 0,
    nextMatch: upcoming
      ? { ...upcoming, days: daysBetween(today, localDate(trainer.time_zone, new Date(upcoming.kickoff_at))) }
      : null,
    players: (players ?? []).map((p) => {
      const e = eps.find((x) => x.player_id === p.id)
      const t = (rx ?? []).find((r) => r.player_id === p.id && r.target_on === today)
      const y = (rx ?? []).find((r) => r.player_id === p.id && r.target_on === yesterday)
      const yItems = (y?.items ?? []) as { done_at: string | null }[]
      const k = (kartes ?? []).find((x) => x.player_id === p.id)
      return {
        id: p.id,
        name: personName(p.family_name, p.given_name),
        token: p.share_token,
        episode: e ? { label: e.label, week: weekSince(e.injured_on, today), period: e.position?.period_raw ?? null } : null,
        today: t ? { rest: t.is_rest_day, count: (t.items as unknown[]).length, dayGroup: t.day_group } : null,
        yesterday: y && !y.is_rest_day ? { done: yItems.filter((i) => i.done_at).length, total: yItems.length } : null,
        lastKarte: k ? { on: k.written_on, summary: k.summary } : null,
      }
    }),
  }
}
