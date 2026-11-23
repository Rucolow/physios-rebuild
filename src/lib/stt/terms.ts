/**
 * 文字起こしに渡す、現場でよく口にする評価・所見の言葉。
 * Deepgram の keyterm（聞き取りの手がかり）にだけ使う。臨床の判断や表示には使わない。
 * 2026-11-23 の実録音で、ここにある言葉が別の語に化けた（健側→原則、圧痛→圧、NRS→n rs など）。
 */
export const CLINICAL_TERMS = [
  'NRS', 'SLR', '健側', '患側', '圧痛', '荷重', '荷重時痛', '腫脹', '腫れ', '可動域', '背屈', '底屈',
  'ストレッチ痛', '収縮時痛', '運動時痛', '安静時痛', '片脚', 'カーフレイズ', '内返し', '外返し',
  '部分合流', '完全合流', 'テーピング', 'アイシング',
]

/** 傷病名（プロトコルの題の先頭）と、そこから「損傷」「肉離れ」などを外した部位の名前 */
export function injuryTerms(protocolTitles: string[]): string[] {
  const out = new Set<string>()
  for (const t of protocolTitles) {
    const name = t.split('・')[0]?.trim()
    if (!name) continue
    out.add(name)
    const part = name.replace(/(損傷|肉離れ|症候群|ヘルニア)$/, '')
    if (part && part !== name) out.add(part)
  }
  return [...out]
}
