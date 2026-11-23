import Link from 'next/link'
import type { ReactNode } from 'react'
import { InterruptBand, List, ListRow, Num, button } from '@/components/ui'
import { SIGNAL, type Signal } from '@/lib/design/signal'
import { requireTrainer } from '@/lib/auth'
import { loadDashboard, type DashboardSlot } from '@/lib/dashboard'
import { cn } from '@/lib/utils'

/**
 * ダッシュボード（元の physios のモーニングブリーフィングの組み方を写す）。
 * ヘッダ帯（挨拶・副指標・次の試合まで）→ 割込み帯（繰り越し／今日の要確認）→
 * 近況報告 → 本日の予定 → 本日のメニュー配信。≥lg は左右 2 ペイン。
 */
/** 挨拶はトレーナーの時間帯の時刻で変える（夜に開いても「おはようございます」と出さない） */
function greeting(timeZone: string) {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', hourCycle: 'h23' }).format(new Date()))
  return h >= 4 && h < 11 ? 'おはようございます' : h >= 11 && h < 18 ? 'こんにちは' : 'こんばんは'
}

export default async function DashboardPage() {
  const trainer = await requireTrainer()
  const b = await loadDashboard(trainer)

  return <main className="px-4 py-6 md:px-6 md:py-8">
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-navy-400"><Num>{b.date}</Num> {b.weekday}</p>
            <h1 className="mt-1 text-3xl font-bold text-white">{greeting(trainer.time_zone)}</h1>
          </div>
          <div className="flex items-stretch">
            {b.metrics.map((m, i) => <div key={m.id} className={cn('px-4', i === 0 ? 'pl-0' : 'border-l border-layer-5')}>
              <p className="text-2xs text-navy-400">{m.label}</p>
              <p className={cn('text-xl font-bold', m.tone && m.value > 0 ? SIGNAL[m.tone].text : 'text-white')}>
                <Num mono>{m.value}</Num><span className="text-2xs font-normal text-navy-400"> {m.unit}</span>
              </p>
            </div>)}
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">次節まで</p>
          <p className="mt-1">
            {b.nextMatch === null
              ? <Num mono className="text-4xl font-bold text-navy-500">—</Num>
              : <><Num mono className="text-4xl font-bold text-white">{b.nextMatch.days}</Num><span className="ml-1 text-sm text-navy-400">日</span></>}
          </p>
          {b.nextMatch && <p className="mt-1 text-2xs text-navy-400"><Num>{b.nextMatch.note}</Num></p>}
        </div>
      </header>

      {b.carried.total > 0 && <InterruptBand
        tone="now"
        title="未確定の記録が繰り越されています"
        body={<>
          未確定 <Num>{b.carried.total}</Num> 件（うち要確認 <Num>{b.carried.review}</Num> 件）
          {b.carried.oldest && <> ・ 最も古い記録 <Num>{b.carried.oldest}</Num></>}
        </>}
        action={<Link href="/digest" className={cn(button({ variant: 'primary', size: 'sm' }))}>ダイジェストを開く</Link>}
      />}
      {b.carried.total === 0 && b.todayReview > 0 && <InterruptBand
        tone="now"
        title="今日の記録に答えが要ります"
        body={<>要確認 <Num>{b.todayReview}</Num> 件</>}
        action={<Link href="/digest" className={cn(button({ variant: 'primary', size: 'sm' }))}>ダイジェストを開く</Link>}
      />}

      <div className="space-y-6 lg:flex lg:items-start lg:space-y-0">
        <section className="space-y-3 lg:min-h-pane lg:min-w-0 lg:flex-1 lg:border-r lg:border-layer-10 lg:pr-6">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">近況報告</h2>
            {b.alerts.length > 0 && <span className="text-2xs text-navy-400">要対応 <Num>{b.alerts.length}</Num> 件</span>}
          </div>
          {b.alerts.length === 0 && b.watching.length === 0
            ? <p className="text-sm text-navy-400">要対応なし</p>
            : <List>
                {b.alerts.map((a) => <Link key={a.playerId} href={`/players/${a.playerId}`} className="block">
                  <ListRow variant="interactive">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-white">{a.playerName}</span>
                      {a.note && <span className="block text-2xs text-navy-400"><Num>{a.note}</Num></span>}
                    </span>
                    <StateWord tone={a.tone}><Num>{a.label}</Num></StateWord>
                  </ListRow>
                </Link>)}
                {b.watching.map((w) => <ListRow key={w.playerId} variant="standard">
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-navy-200">{w.playerName}</span>
                    <span className="block text-2xs text-navy-400">要観察 ・ 経過 <Num>{w.week}</Num> 週目</span>
                  </span>
                  <StateWord tone="none">変化なし</StateWord>
                </ListRow>)}
              </List>}
        </section>

        <div className="space-y-6 lg:min-w-0 lg:flex-1 lg:pl-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">本日の予定</h2>
              <span className="text-2xs text-navy-400"><Num>{b.slots.length}</Num> 件</span>
            </div>
            {b.slots.length === 0
              ? <p className="text-sm text-navy-400">本日の予定はありません</p>
              : <List>{b.slots.map((s) => <SlotRow key={s.id} slot={s} />)}</List>}
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">本日のメニュー配信</h2>
            <List>
              <ListRow variant="completed">
                <span className="min-w-0 flex-1 text-sm text-navy-300">
                  <Num>{b.menuDelivered}</Num> 名に配信済み ・ 実施はダイジェストで確認
                </span>
                <StateWord tone="none">済</StateWord>
              </ListRow>
              {b.menuGaps.map((g) => <Link key={g.playerId} href={`/players/${g.playerId}`} className="block focus-visible:bg-layer-10">
                <ListRow variant="interactive">
                  <span className="min-w-0 flex-1 text-sm text-white">{g.playerName}</span>
                  {g.kind === 'menu_row_not_set'
                    ? <StateWord gold>未指定</StateWord>
                    : <StateWord tone="watch">プロトコル未設定</StateWord>}
                </ListRow>
              </Link>)}
            </List>
          </section>
        </div>
      </div>
    </div>
  </main>
}

function StateWord({ tone, gold, children }: { tone?: Signal; gold?: boolean; children: ReactNode }) {
  return <span className={cn('w-col-state shrink-0 text-right text-2xs font-bold', gold ? 'text-gold-400' : SIGNAL[tone ?? 'none'].text)}>{children}</span>
}

function SlotRow({ slot }: { slot: DashboardSlot }) {
  if (slot.state === 'past') {
    return <ListRow variant="completed">
      <Num mono className="w-16 shrink-0 text-sm text-navy-400">{slot.time}</Num>
      <span className="min-w-0 flex-1 text-sm text-navy-400">{slot.title}</span>
      <StateWord tone="none">済</StateWord>
    </ListRow>
  }
  if (slot.state === 'next') {
    return <ListRow variant="current">
      <Num mono className="w-16 shrink-0 text-sm font-bold text-white">{slot.time}</Num>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-white">{slot.title}</span>
        {slot.detail && <span className="block text-2xs text-navy-400">{slot.detail}</span>}
      </span>
      <StateWord gold>次</StateWord>
    </ListRow>
  }
  return <ListRow variant="standard">
    <Num mono className="w-16 shrink-0 text-sm text-navy-200">{slot.time}</Num>
    <span className="min-w-0 flex-1">
      <span className="block text-sm text-navy-100">{slot.title}</span>
      {slot.detail && <span className="block text-2xs text-navy-400">{slot.detail}</span>}
    </span>
    <span className="w-col-state shrink-0" aria-hidden="true" />
  </ListRow>
}
