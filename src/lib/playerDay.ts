import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, localDate, weekSince } from '@/lib/date'
import { prescribe } from '@/lib/prescribe'

export interface PlayerDayItem {
  id: string
  name: string
  column: string
  category: string
  startPosition: string | null
  movement: string | null
  focus: string[]
  sets: string | null
  reps: string | null
  rest: string | null
  load: string | null
  videoUrl: string | null
  done: boolean
}

export interface PlayerDay {
  date: string
  today: string
  canMoveForward: boolean
  episode: null | { label: string; week: number; period: string | null }
  rest: boolean
  items: PlayerDayItem[] | null
}

/**
 * 選手の画面の一日分。見られるのは明日まで（明日のメニューは前夜の確定で決まる）。
 * まだ組まれていない今日・明日のメニューはここで組む（確定済みの時期から決まるので結果は同じ）。
 */
export async function loadPlayerDay(player: { id: string; trainer_id: string }, requested: string | null): Promise<PlayerDay> {
  const db = adminDb()
  const { data: trainer } = await db.from('trainer').select('time_zone').eq('id', player.trainer_id).single()
  const today = localDate(trainer?.time_zone ?? 'Europe/Berlin')
  const tomorrow = addDays(today, 1)
  const date = requested && /^\d{4}-\d{2}-\d{2}$/.test(requested) && requested <= tomorrow ? requested : today

  const { data: ep } = await db
    .from('injury_episode')
    .select('id, label, injured_on')
    .eq('player_id', player.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!ep) return { date, today, canMoveForward: date < tomorrow, episode: null, rest: false, items: null }

  if (date >= today) await prescribe(ep.id, date)
  const { data: rx } = await db
    .from('prescription')
    .select('id, is_rest_day, row:menu_row_id(period_raw), items:prescription_item(id, column_label, category_label, sort_order, done_at, exercise:exercise_id(name, start_position, movement, focus_points, default_sets_raw, default_reps_raw, default_rest_raw, default_load_raw, video_url))')
    .eq('injury_episode_id', ep.id)
    .eq('target_on', date)
    .maybeSingle()

  const period = (rx?.row as unknown as { period_raw: string } | null)?.period_raw ?? null
  type Ex = { name: string; start_position: string | null; movement: string | null; focus_points: unknown; default_sets_raw: string | null; default_reps_raw: string | null; default_rest_raw: string | null; default_load_raw: string | null; video_url: string | null }
  const items = rx
    ? (rx.items as unknown as { id: string; column_label: string; category_label: string; sort_order: number; done_at: string | null; exercise: Ex }[])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => ({
          id: i.id,
          name: i.exercise.name,
          column: i.column_label,
          category: i.category_label,
          startPosition: i.exercise.start_position,
          movement: i.exercise.movement,
          focus: Array.isArray(i.exercise.focus_points) ? (i.exercise.focus_points as string[]) : [],
          sets: i.exercise.default_sets_raw,
          reps: i.exercise.default_reps_raw,
          rest: i.exercise.default_rest_raw,
          load: i.exercise.default_load_raw,
          videoUrl: i.exercise.video_url,
          done: !!i.done_at,
        }))
    : null
  return {
    date,
    today,
    canMoveForward: date < tomorrow,
    episode: { label: ep.label, week: weekSince(ep.injured_on, date), period },
    rest: !!rx?.is_rest_day,
    items,
  }
}
