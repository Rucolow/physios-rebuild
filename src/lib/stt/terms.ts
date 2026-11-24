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

/**
 * ドイツ語のメモでよく口にする評価・所見の言葉。CLINICAL_TERMS と同じく聞き取りの手がかりにだけ使う。
 * 2026-11-24 の合成音声で「Dehnschmerz」が「den Schmerz」になり、手がかりに入れると正しく出た。
 */
export const CLINICAL_TERMS_DE = [
  'Druckschmerz', 'Dehnschmerz', 'Belastungsschmerz', 'Ruheschmerz', 'Schwellung', 'Beweglichkeit',
  'Dorsalextension', 'Plantarflexion', 'Zerrung', 'Muskelfaserriss', 'Sprunggelenk', 'Außenband', 'Innenband',
  'Teilbelastung', 'Vollbelastung', 'Mannschaftstraining', 'Wadenheben', 'Einbeinstand',
]

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/

/**
 * Deepgram は keyterm 全体で 500 トークンまでしか受け付けず、超えると要求ごと断る。
 * 2026-11-24 に測ると、かな・漢字は 146 字で通り 152 字で断られた。原綴りは人名 91 人分（1210 字）でも通った。
 * ここでは余裕を見て、かな・漢字 1 字を 3.4、それ以外の 1 字を 0.35、1 語につき 1 と数える。
 */
export function keytermCost(term: string): number {
  let n = 1
  for (const ch of term) n += CJK.test(ch) ? 3.4 : 0.35
  return n
}

/** 並び順を優先度として、上限に収まる言葉だけを残す。収まらない言葉は飛ばして次を試す */
export function fitKeyterms(terms: string[], budget = 480, maxCount = 100): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  let used = 0
  for (const raw of terms) {
    const t = raw.trim()
    if (!t || seen.has(t)) continue
    seen.add(t)
    const c = keytermCost(t)
    if (used + c > budget) continue
    out.push(t)
    used += c
    if (out.length >= maxCount) break
  }
  return out
}

/** 最近のメモの言語（stt_language）から、そのトレーナーが主に話す言語を決める。分からなければ null */
export function mainLanguage(recent: (string | null)[]): 'ja' | 'de' | null {
  let ja = 0
  let de = 0
  for (const l of recent) {
    if (!l) continue
    if (l.split(',').includes('de')) de++
    if (l.split(',').includes('ja')) ja++
  }
  if (ja === 0 && de === 0) return null
  return de > ja ? 'de' : 'ja'
}

/** 原綴りの名前では「名 姓」、かな・漢字の名前では続けて書く */
export function keytermName(family: string, given: string): string {
  return CJK.test(family + given) ? `${family}${given}` : `${given} ${family}`
}

/**
 * 手がかりの並び。姓名とトレーナーの言葉を先に、その後は主に話す言語の言葉を先に置く。
 * 言語がまだ分からないときは、名簿の名前が原綴りならドイツ語を先にする。
 */
export function orderKeyterms(input: {
  names: string[]
  own: string[]
  injuries: string[]
  aliases: string[]
  language: 'ja' | 'de' | null
}): string[] {
  const lang = input.language ?? (input.names.length && input.names.every((n) => !CJK.test(n)) ? 'de' : 'ja')
  const injuries = [...input.injuries].sort((a, b) => a.length - b.length)
  const ja = [...CLINICAL_TERMS, ...injuries]
  return lang === 'de'
    ? [...input.names, ...input.own, ...CLINICAL_TERMS_DE, ...ja, ...input.aliases]
    : [...input.names, ...input.own, ...ja, ...input.aliases, ...CLINICAL_TERMS_DE]
}
