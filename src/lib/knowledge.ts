import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import type { Trainer } from '@/lib/auth'

/** 記事の分類（旧アプリの分類ピルと同じ語） */
export const ARTICLE_CATEGORIES = {
  protocol_guide: 'プロトコル解説',
  assessment: '評価・検査法',
  exercise: 'エクササイズ',
  evidence: 'エビデンス・ガイドライン',
  other: 'その他',
} as const
export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES

export const BODY_REGIONS = {
  upper: '上肢',
  trunk: '体幹',
  lower: '下肢',
  general: '全身',
} as const

export type KnowledgeFilter = 'all' | 'protocol' | 'brucke' | 'bookmark' | ArticleCategory

export interface KnowledgeCard {
  key: string
  href: string
  kind: string
  sub: string | null
  title: string
  description: string | null
  meta: string[]
  articleId: string | null
  bookmarked: boolean
}

export interface SheetExercise {
  exerciseId: string
  name: string
  startPosition: string | null
  movement: string | null
  focusPoints: string[]
  sets: string | null
  reps: string | null
  load: string | null
  rest: string | null
  videoUrl: string | null
}

export interface SheetRow {
  menuRowId: string
  periodRaw: string
  itemCount: number
  cells: { columnLabel: string; categoryLabel: string; exercises: SheetExercise[] }[]
}

function focusList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean)
  if (typeof v === 'string' && v.trim()) return [v]
  return []
}

/** プロトコルの表1を、行 → マス → 種目の形で読む */
export async function protocolSheet(protocolId: string): Promise<SheetRow[]> {
  const db = adminDb()
  const { data: rows, error } = await db
    .from('protocol_menu_row')
    .select(
      'id, row_index, period_raw, cells:protocol_menu_cell(id, column_label, column_order, category_label, category_order, items:protocol_menu_item(sort_order, exercise:exercise_id(id, name, start_position, movement, focus_points, default_sets_raw, default_reps_raw, default_load_raw, default_rest_raw, video_url)))',
    )
    .eq('protocol_id', protocolId)
    .order('row_index')
  if (error) throw error
  type Ex = {
    id: string
    name: string
    start_position: string | null
    movement: string | null
    focus_points: unknown
    default_sets_raw: string | null
    default_reps_raw: string | null
    default_load_raw: string | null
    default_rest_raw: string | null
    video_url: string | null
  }
  return (rows ?? []).map((r) => {
    const cells = ((r.cells ?? []) as unknown as {
      column_label: string
      column_order: number
      category_label: string
      category_order: number
      items: { sort_order: number; exercise: Ex }[]
    }[])
      .sort((a, b) => a.column_order - b.column_order || a.category_order - b.category_order)
      .map((c) => ({
        columnLabel: c.column_label,
        categoryLabel: c.category_label,
        exercises: [...c.items]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(({ exercise: e }) => ({
            exerciseId: e.id,
            name: e.name,
            startPosition: e.start_position,
            movement: e.movement,
            focusPoints: focusList(e.focus_points),
            sets: e.default_sets_raw,
            reps: e.default_reps_raw,
            load: e.default_load_raw,
            rest: e.default_rest_raw,
            videoUrl: e.video_url,
          })),
      }))
    return { menuRowId: r.id, periodRaw: r.period_raw, itemCount: cells.reduce((s, c) => s + c.exercises.length, 0), cells }
  })
}

export async function loadProtocol(id: string) {
  const { data } = await adminDb()
    .from('protocol')
    .select('id, title, injury_key, grade, severity_label, surgery, healing_weeks_min, healing_weeks_max')
    .eq('id', id)
    .maybeSingle()
  return data
}

function protocolSub(p: { grade: number | null; severity_label: string | null; surgery: string | null }) {
  return [p.grade !== null ? `Grade ${p.grade}` : null, p.severity_label].filter(Boolean).join(' ・ ') || null
}

export function healingText(p: { healing_weeks_min: number | null; healing_weeks_max: number | null }) {
  const { healing_weeks_min: a, healing_weeks_max: b } = p
  if (a === null && b === null) return null
  if (a !== null && b !== null) return a === b ? `${a}週` : `${a}〜${b}週`
  return `${a ?? b}週`
}

/** 一覧。プロトコルは全て、記事は自分が書いたものと BRÜCKE のもの */
export async function loadKnowledge(trainer: Trainer, filter: KnowledgeFilter, query: string) {
  const db = adminDb()
  const q = query.trim().toLowerCase()
  const [{ data: protocols }, { data: articles }, { data: marks }, { data: eps }] = await Promise.all([
    db
      .from('protocol')
      .select('id, title, grade, severity_label, surgery, healing_weeks_min, healing_weeks_max, rows:protocol_menu_row(id)')
      .order('title'),
    db
      .from('knowledge_article')
      .select('id, source, owner_trainer_id, category, body_region, title, summary, tags, evidence_grade, author_name, published_on, updated_at')
      .or(`owner_trainer_id.eq.${trainer.id},source.eq.brucke`)
      .order('published_on', { ascending: false, nullsFirst: false }),
    db.from('knowledge_bookmark').select('article_id').eq('trainer_id', trainer.id),
    db.from('injury_episode').select('protocol_id, player!inner(trainer_id)').eq('status', 'active').eq('player.trainer_id', trainer.id),
  ])
  const marked = new Set((marks ?? []).map((m) => m.article_id))
  const inUse = new Map<string, number>()
  for (const e of eps ?? []) if (e.protocol_id) inUse.set(e.protocol_id, (inUse.get(e.protocol_id) ?? 0) + 1)

  const protocolCards: KnowledgeCard[] = (protocols ?? []).map((p) => {
    // 種目数は一覧では数えない（マスと種目が 2 万行あり、一覧のたびに数えると重い。詳細で出す）
    const rows = (p.rows ?? []) as unknown as { id: string }[]
    const using = inUse.get(p.id) ?? 0
    return {
      key: `protocol:${p.id}`,
      href: `/knowledge/protocol/${p.id}`,
      kind: 'プロトコル',
      sub: protocolSub(p),
      title: p.title,
      description: null,
      meta: [`時期 ${rows.length}`, healingText(p) ? `治癒 ${healingText(p)}` : null, using ? `適用中 ${using}名` : null].filter(
        (x): x is string => Boolean(x),
      ),
      articleId: null,
      bookmarked: false,
    }
  })
  const articleCards: (KnowledgeCard & { category: string; source: string; text: string })[] = (articles ?? []).map((a) => ({
    key: `article:${a.id}`,
    href: `/knowledge/article/${a.id}`,
    kind: a.source === 'brucke' ? 'BRÜCKE' : ARTICLE_CATEGORIES[a.category as ArticleCategory] ?? a.category,
    sub: a.source === 'brucke' ? a.category : a.body_region ? BODY_REGIONS[a.body_region as keyof typeof BODY_REGIONS] ?? null : null,
    title: a.title,
    description: a.summary,
    meta: [a.evidence_grade ? `エビデンス ${a.evidence_grade}` : null, a.author_name, a.published_on].filter((x): x is string => Boolean(x)),
    articleId: a.id,
    bookmarked: marked.has(a.id),
    category: a.category,
    source: a.source,
    text: [a.title, a.summary, ...(a.tags ?? [])].join(' ').toLowerCase(),
  }))

  const counts = {
    all: protocolCards.length + articleCards.length,
    protocol: protocolCards.length,
    brucke: articleCards.filter((a) => a.source === 'brucke').length,
    bookmark: articleCards.filter((a) => a.bookmarked).length,
    ...Object.fromEntries(Object.keys(ARTICLE_CATEGORIES).map((k) => [k, articleCards.filter((a) => a.source === 'trainer' && a.category === k).length])),
  } as Record<KnowledgeFilter, number>

  let cards: KnowledgeCard[]
  if (filter === 'protocol') cards = protocolCards
  else if (filter === 'brucke') cards = articleCards.filter((a) => a.source === 'brucke')
  else if (filter === 'bookmark') cards = articleCards.filter((a) => a.bookmarked)
  else if (filter === 'all') cards = [...protocolCards, ...articleCards]
  else cards = articleCards.filter((a) => a.source === 'trainer' && a.category === filter)

  if (q) cards = cards.filter((c) => ((c as { text?: string }).text ?? c.title.toLowerCase()).includes(q))
  return { cards, counts }
}

export async function loadArticle(trainer: Trainer, id: string) {
  const db = adminDb()
  const { data: a } = await db.from('knowledge_article').select('*').eq('id', id).maybeSingle()
  if (!a || (a.source === 'trainer' && a.owner_trainer_id !== trainer.id)) return null
  const { data: mark } = await db.from('knowledge_bookmark').select('article_id').eq('trainer_id', trainer.id).eq('article_id', id).maybeSingle()
  return { ...a, bookmarked: Boolean(mark), mine: a.owner_trainer_id === trainer.id }
}
