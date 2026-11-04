import 'server-only'
import { env } from '@/lib/env'

/**
 * Deepgram（EU の入口・Nova-3）で文字起こしする。
 * 清水は日本語でもドイツ語でもメモするので、既定は言語の切り替えを含む multi にする。
 * 言語の指定は PHYSIOS_STT_LANGUAGE で変えられる（試験の結果で決める）。
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

export async function transcribe(audio: ArrayBuffer, mimeType: string): Promise<Transcript> {
  const language = process.env.PHYSIOS_STT_LANGUAGE || 'multi'
  const params = new URLSearchParams({
    model: 'nova-3',
    language,
    smart_format: 'true',
    punctuate: 'true',
    utterances: 'true',
  })
  const res = await fetch(`${ENDPOINT}?${params}`, {
    method: 'POST',
    headers: { Authorization: `Token ${env.deepgramKey()}`, 'Content-Type': mimeType || 'application/octet-stream' },
    body: audio,
  })
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
