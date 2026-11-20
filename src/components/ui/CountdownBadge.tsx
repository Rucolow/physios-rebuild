import { COUNTDOWN_BADGE_TONE, COUNTDOWN_TEXT, countdownLabel, countdownTone } from '@/lib/design/countdown'
import { cn } from '@/lib/utils'
import { Badge } from './Badge'
import { Num } from './Num'

/** 復帰カウントダウン（§1-7 + §4-3）。しきい値はここ 1 箇所でのみ解釈する。 */
export function CountdownBadge({ days }: { days: number | null }) {
  return <Badge tone={COUNTDOWN_BADGE_TONE[countdownTone(days)]}><Num>{countdownLabel(days)}</Num></Badge>
}

/** 一覧の行末など、面を持たせずテキストとして出す場合（§1-7） */
export function CountdownText({ days, className }: { days: number | null; className?: string }) {
  const tone = countdownTone(days)
  return <Num mono className={cn('text-sm', COUNTDOWN_TEXT[tone], (tone === 'act' || tone === 'now' || tone === 'watch') && 'font-bold', className)}>{countdownLabel(days)}</Num>
}
