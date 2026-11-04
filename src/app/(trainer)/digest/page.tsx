import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { localDate, localTime, jaDate, weekSince } from '@/lib/date'
import { personName } from '@/lib/format/name'
import { activeEpisodes } from '@/lib/roster'
import type { InterpretedSegment } from '@/lib/llm/interpret'
import { DigestView, type DigestItem, type DigestContext } from '@/components/trainer/DigestView'

export default async function DigestPage() {
  const trainer = await requireTrainer()
  const db = adminDb()
  const today = localDate(trainer.time_zone)

  const [{ data: pending }, { data: doneToday }, { data: failed }, { data: players }, episodes] = await Promise.all([
    db
      .from('draft')
      .select('id, kind, player_id, payload, confirm_reason, local_date, seq, status, answer, voice_memo:voice_memo_id(recorded_at, storage_path)')
      .eq('trainer_id', trainer.id)
      .eq('status', 'pending')
      .lte('local_date', today)
      .order('created_at')
      .order('seq'),
    db
      .from('draft')
      .select('id, kind, player_id, payload, confirm_reason, local_date, seq, status, answer, voice_memo:voice_memo_id(recorded_at, storage_path)')
      .eq('trainer_id', trainer.id)
      .neq('status', 'pending')
      .eq('local_date', today)
      .order('created_at')
      .order('seq'),
    db
      .from('voice_memo')
      .select('id, recorded_at, storage_path, error')
      .eq('trainer_id', trainer.id)
      .eq('status', 'failed')
      .eq('local_date', today)
      .order('recorded_at'),
    db.from('player').select('id, family_name, given_name').eq('trainer_id', trainer.id).eq('is_active', true).order('family_name'),
    activeEpisodes(trainer.id),
  ])

  // 元音声（非公開の置き場から1時間だけ開けるURL）
  const paths = [...(pending ?? []), ...(doneToday ?? [])]
    .map((d) => (d.voice_memo as unknown as { storage_path: string | null } | null)?.storage_path)
    .concat((failed ?? []).map((m) => m.storage_path))
    .filter((p): p is string => !!p)
  const signed = new Map<string, string>()
  if (paths.length) {
    const { data } = await db.storage.from('voice').createSignedUrls([...new Set(paths)], 3600)
    for (const s of data ?? []) if (s.path && s.signedUrl) signed.set(s.path, s.signedUrl)
  }

  const names = new Map((players ?? []).map((p) => [p.id, personName(p.family_name, p.given_name)]))
  const toItem = (d: NonNullable<typeof pending>[number]): DigestItem => {
    const memo = d.voice_memo as unknown as { recorded_at: string; storage_path: string | null } | null
    const seg = d.payload as InterpretedSegment
    return {
      id: d.id,
      kind: d.kind as DigestItem['kind'],
      status: d.status as DigestItem['status'],
      carried: d.local_date < today,
      localDate: d.local_date,
      time: memo ? localTime(trainer.time_zone, memo.recorded_at) : '',
      playerId: d.player_id,
      playerName: d.player_id ? names.get(d.player_id) ?? null : null,
      reason: d.confirm_reason as DigestItem['reason'],
      seg,
      audioUrl: memo?.storage_path ? (signed.get(memo.storage_path) ?? null) : null,
      answer: d.answer as DigestItem['answer'],
    }
  }

  // 要確認に出す選択肢
  const [{ data: protocols }, { data: allRows }] = await Promise.all([
    db.from('protocol').select('id, title').order('title'),
    db.from('protocol_menu_row').select('id, protocol_id, row_index, week_hint, period_raw').order('row_index'),
  ])
  const rows: DigestContext['rows'] = {}
  for (const r of allRows ?? []) (rows[r.protocol_id] ??= []).push(r)

  const ctx: DigestContext = {
    today,
    timeZone: trainer.time_zone,
    players: (players ?? []).map((p) => ({ id: p.id, name: names.get(p.id)! })),
    protocols: protocols ?? [],
    rows,
    episodes: Object.fromEntries(
      episodes.map((e) => [
        e.player_id,
        {
          protocolId: e.protocol_id,
          label: e.label,
          week: weekSince(e.injured_on, today),
          currentRowId: e.position?.menu_row_id ?? null,
        },
      ]),
    ),
  }

  const d = jaDate(today)
  return (
    <DigestView
      dateLabel={{ full: d.full, wd: d.wd }}
      pending={(pending ?? []).map(toItem)}
      resolved={(doneToday ?? []).map(toItem)}
      failed={(failed ?? []).map((m) => ({
        id: m.id,
        time: localTime(trainer.time_zone, m.recorded_at),
        audioUrl: m.storage_path ? (signed.get(m.storage_path) ?? null) : null,
      }))}
      ctx={ctx}
    />
  )
}
