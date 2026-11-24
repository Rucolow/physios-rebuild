import 'server-only'
import { env } from '@/lib/env'

/**
 * Deepgram（EU の入口・Nova-3）で文字起こしする。
 * 清水は日本語でもドイツ語でもメモするが、一つのメモの中で混ぜない（Rucolow 2026-11-19）。
 * 既定は言語の判定（detect_language）で、メモごとに日本語かドイツ語の単一言語のモデルで起こす。
 * 2026-11-19 の Rucolow の日本語の録音三本では、multi は「内側側副靭帯」「外反」「圧痛」「ゲーム形式」を崩し、
 * 判定は全て ja（信頼度 0.99 以上）になって専門用語まで正しく出た。ドイツ語の合成音声も de と判定され正しく出た。
 * 言語を固定したいときは PHYSIOS_STT_LANGUAGE（ja / de / multi）で指定する。
 * keyterms には名簿の選手名と呼び方を渡す（「森大和」が「森山と」になったのが、渡すと正しく出た）。
 */
const ENDPOINT = 'https://api.eu.deepgram.com/v1/listen'

export interface Transcript {
  /** [秒] の印つきの本文（解釈に渡す） */
  marked: string
  plain: string
  languages: string[]
  duration: number | null
  raw: unknown
}

interface DgWord { word: string; punctuated_word?: string; start: number; end: number; language?: string }
interface DgUtterance { start: number; end: number; transcript: string; languages?: string[] }

/** Deepgram の keyterm は一回に 100 語まで */
const MAX_KEYTERMS = 100

export async function transcribe(audio: ArrayBuffer, mimeType: string, keyterms: string[] = []): Promise<Transcript> {
  const language = process.env.PHYSIOS_STT_LANGUAGE
  const params = new URLSearchParams({
    model: 'nova-3',
    smart_format: 'true',
    punctuate: 'true',
    utterances: 'true',
    // 選手の所見を含む音声なので、Deepgram のモデル改善（学習）に使わせず、処理の後に残させない
    mip_opt_out: 'true',
  })
  if (language) params.set('language', language)
  else params.set('detect_language', 'true')
  const base = new URLSearchParams(params)
  for (const k of [...new Set(keyterms.map((k) => k.trim()).filter(Boolean))].slice(0, MAX_KEYTERMS)) params.append('keyterm', k)
  const post = (q: URLSearchParams) =>
    fetch(`${ENDPOINT}?${q}`, {
      method: 'POST',
      headers: { Authorization: `Token ${env.deepgramKey()}`, 'Content-Type': mimeType || 'application/octet-stream' },
      body: audio,
    })
  let res = await post(params)
  // keyterm が原因で断られたとき（全体のトークン数の上限）は、後ろ半分を落として試し、最後は手がかりなしで起こす。録音を失うよりよい
  let kept = params.getAll('keyterm')
  while (res.status === 400 && kept.length) {
    console.error(`keyterm ${kept.length} 語つきの文字起こしが断られました: ${(await res.text()).slice(0, 300)}`)
    kept = kept.slice(0, Math.floor(kept.length / 2))
    const q = new URLSearchParams(base)
    for (const k of kept) q.append('keyterm', k)
    res = await post(q)
  }
  if (!res.ok) throw new Error(`文字起こしに失敗しました（${res.status}）: ${(await res.text()).slice(0, 300)}`)
  const json = (await res.json()) as {
    metadata?: { duration?: number }
    results?: {
      channels?: { alternatives?: { transcript?: string; words?: DgWord[]; languages?: string[] }[]; detected_language?: string }[]
      utterances?: DgUtterance[]
    }
  }
  const alt = json.results?.channels?.[0]?.alternatives?.[0]
  const utterances = json.results?.utterances ?? []
  const plain = alt?.transcript ?? ''
  const marked = utterances.length
    ? utterances.map((u) => `[${u.start.toFixed(1)}] ${u.transcript}`).join('\n')
    : plain
  const languages = new Set<string>()
  for (const l of alt?.languages ?? []) languages.add(l)
  for (const w of alt?.words ?? []) if (w.language) languages.add(w.language)
  const detected = json.results?.channels?.[0]?.detected_language
  if (detected) languages.add(detected)
  return { marked, plain, languages: [...languages], duration: json.metadata?.duration ?? null, raw: json }
}
