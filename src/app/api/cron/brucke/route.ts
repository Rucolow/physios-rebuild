import { NextResponse } from 'next/server'
import { importBrucke } from '@/lib/brucke/import'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** 毎日 BRÜCKE の公開記事をナレッジに写す（Vercel Cron）。公開された記事を読むだけで、何度走っても同じ結果になる */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) return new NextResponse('unauthorized', { status: 401 })
  try {
    return NextResponse.json(await importBrucke())
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
