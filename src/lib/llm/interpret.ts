import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'
import { env } from '@/lib/env'

/**
 * 音声メモの文字起こしを、選手ごとの下書きに分ける（設計書 3.1）。
 * ここで出たものは全て draft に入り、トレーナーがダイジェストで確定するまでカルテにはならない。
 */

const Segment = z.object({
  kind: z.enum(['karte', 'injury', 'menu_row', 'schedule']),
  /** 名簿の id。一人に決められないときは null にして candidates に候補を並べる */
  player_id: z.string().nullable(),
  candidates: z.array(z.string()),
  /** どの言葉から選手を決めたか（例: 「ケンタ」と呼んでいる） */
  player_basis: z.string(),
  /** ダイジェストの一行。カルテの正本言語（日本語）で、話した内容だけを短く */
  summary: z.string(),
  subjective: z.string().nullable(),
  objective: z.string().nullable(),
  assessment: z.string().nullable(),
  treatment: z.string().nullable(),
  plan: z.string().nullable(),
  /** この話題が始まる位置（秒）。文字起こしの [秒] の印から選ぶ */
  start_sec: z.number().nullable(),
  /** menu_row: トレーナーが口にした時期。名簿の行の row_index から選ぶ。言っていなければ null */
  menu_row_index: z.number().nullable(),
  /** injury: 新しい怪我。プロトコルの id の候補（話した傷病名と程度に合うもの） */
  protocol_candidates: z.array(z.string()),
  injured_on: z.string().nullable(),
  /** schedule: 新しい試合の日時（ISO 8601、時間帯つき）と内容 */
  kickoff_at: z.string().nullable(),
  schedule_note: z.string().nullable(),
  /** 痛みの急な増悪・外傷の疑い・メンタル面の兆候 */
  alert: z.string().nullable(),
})

const Output = z.object({ segments: z.array(Segment) })
export type InterpretedSegment = z.infer<typeof Segment>

export interface RosterPlayer {
  id: string
  name: string
  aliases: string[]
  team: string | null
  episode: null | {
    label: string
    protocol_title: string | null
    injured_on: string
    current_row: string | null
    rows: { row_index: number; period_raw: string }[]
  }
}

export interface ProtocolRef {
  id: string
  title: string
}

const SYSTEM = `あなたはスポーツフィジオ（理学療法士・トレーナー）の音声メモを、選手ごとの記録の下書きに分ける係です。
トレーナーは選手のケアの合間に、日本語かドイツ語（混ざることもある）で30秒〜1分ほど喋ります。書式はありません。

守ること:
- 話されたことだけを書く。推測で補わない。数値・所見・診断を作らない。言っていない項目は null にする。
- 下書きは全て日本語で書く（カルテの正本言語）。ドイツ語の部分は意味を変えずに日本語にする。
- 一つのメモに複数の選手の話が入ることがある。選手ごと、話題ごとに segment を分ける。
- 選手の同定は名簿だけから行う。名前・呼び方・文脈で一人に決まるときだけ player_id を入れる。少しでも迷うとき（同じ姓が二人いる、聞き取りが怪しい、名簿に無い名前）は player_id を null にして、candidates に可能性のある id を全て入れる。取り違えはカルテの最も重い誤りなので、迷ったら null にする。
- kind:
  - karte: 経過・所見・本人の訴え・行った治療・次の予定。ほぼ全ての話はこれ。
  - injury: 名簿の選手に新しい怪我が起きた、と話したとき。protocol_candidates にプロトコル一覧から話した傷病と程度に合う id を入れる（程度を言っていなければ該当する傷病の全ての程度）。injured_on は話した日付があれば YYYY-MM-DD、無ければ null。
  - menu_row: リハビリの時期（メニューの段階）を進める・戻す、と話したとき。menu_row_index は、その選手の行の一覧から、話した内容に当たる行の row_index。決められなければ null。
  - schedule: 試合の日程が変わった、と話したとき。kickoff_at は新しい日時。
- 一つの発言が karte と menu_row の両方を含むときは、両方の segment を作る。
- alert は、痛みの急な増悪・外傷の疑い・メンタル面の兆候を話したときだけ、その内容を短く書く。
- summary は、トレーナーが夜に読み返す一行。体言止めでよい。敬語や前置きは要らない。`

export async function interpretTranscript(args: {
  transcript: string
  today: string
  timeZone: string
  roster: RosterPlayer[]
  protocols: ProtocolRef[]
}): Promise<InterpretedSegment[]> {
  const client = new Anthropic({ apiKey: env.anthropicKey() })
  const context = {
    today: args.today,
    time_zone: args.timeZone,
    roster: args.roster,
    protocols: args.protocols,
  }
  const response = await client.messages.parse({
    model: env.llmModel(),
    max_tokens: 16000,
    output_config: { format: zodOutputFormat(Output), effort: 'medium' },
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: `名簿とプロトコル一覧:\n${JSON.stringify(context)}\n\n音声メモの文字起こし（[秒] は話し始めの位置）:\n${args.transcript}`,
      },
    ],
  })
  if (response.stop_reason === 'refusal') throw new Error('解釈が拒否されました')
  if (!response.parsed_output) throw new Error('解釈の結果を読めませんでした')
  return response.parsed_output.segments
}
