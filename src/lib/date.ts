/** トレーナーの時間帯での日付（YYYY-MM-DD） */
export function localDate(timeZone: string, at: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at)
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86400000)
}

/** 受傷からの週（1 週目 = 受傷日から 6 日後まで）。表示の参考だけに使い、行は選ばない */
export function weekSince(injuredOn: string, on: string): number {
  return Math.floor(daysBetween(injuredOn, on) / 7) + 1
}

export function localTime(timeZone: string, at: string | Date): string {
  return new Intl.DateTimeFormat('ja-JP', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(at))
}

const WD = ['日', '月', '火', '水', '木', '金', '土']
export function jaDate(iso: string): { md: string; wd: string; full: string } {
  const d = new Date(`${iso}T00:00:00Z`)
  const md = `${d.getUTCMonth() + 1}月${d.getUTCDate()}日`
  return { md, wd: `${WD[d.getUTCDay()]}曜日`, full: `${d.getUTCFullYear()}年${md}` }
}
