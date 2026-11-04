import { NextResponse } from 'next/server'
import { currentTrainer } from '@/lib/auth'
import { ingestMemo } from '@/lib/memo'

export const maxDuration = 60

export async function POST(req: Request) {
  const trainer = await currentTrainer()
  if (!trainer) return NextResponse.json({ message: 'ログインしてください。' }, { status: 401 })
  const form = await req.formData()
  const audio = form.get('audio')
  const text = form.get('text')
  try {
    const r =
      audio instanceof Blob
        ? await ingestMemo(trainer, { kind: 'voice', audio: await audio.arrayBuffer(), mimeType: audio.type })
        : typeof text === 'string' && text.trim()
          ? await ingestMemo(trainer, { kind: 'text', text })
          : null
    if (!r) return NextResponse.json({ message: '録音の音声を読み込めませんでした。' }, { status: 400 })
    return NextResponse.json({
      message: r.drafts ? `下書きを ${r.drafts} 件作成しました。` : '記録にする内容は見つかりませんでした。',
      drafts: r.drafts,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { message: '記録にできませんでした。録音は残り、ダイジェストの「処理できなかった録音」に出ます。' },
      { status: 500 },
    )
  }
}
