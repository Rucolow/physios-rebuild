'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

type State = 'idle' | 'starting' | 'recording' | 'processing'

/** 一度の録音の上限（秒）。処理の上限 300 秒に余裕を持たせる */
const MAX_SEC = 180
/** これより短い押下は誤って触れたものとして送らない（ミリ秒） */
const MIN_HOLD_MS = 700
/** 録音を始めてからこの時間、音が一度も届かなければ知らせる（ミリ秒） */
const SILENT_AFTER_MS = 1500
/** 無音と見なす振れ幅（0〜128）。OS がマイクを止めていると 0 のまま動かない */
const SILENT_PEAK = 1
const SILENT_MESSAGE = 'マイクから音が届いていませんでした。端末の設定で、このブラウザのマイクの許可と、入力に選ばれている機器を確かめてください。'

interface RecorderApi {
  state: State
  sec: number
  level: number
  /** 録音を始めてから一度も音が届いていない（マイクが無音を返している） */
  silent: boolean
  /** 押し始め。マイクの用意ができてから録音が始まる */
  press: () => void
  /** 指を離した。録音中なら止めて送る */
  release: () => void
  openText: () => void
}

const Ctx = createContext<RecorderApi | null>(null)

export function useRecorder(): RecorderApi {
  const v = useContext(Ctx)
  if (!v) throw new Error('RecorderProvider の外です')
  return v
}

function pickMime(): string {
  for (const m of ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus']) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) return m
  }
  return ''
}

/**
 * 録音の仕組み（下部ナビ中央のボタンを長押ししている間だけ録音し、離すと止めて送る）と、
 * 文字のメモの面・結果の知らせを持つ。
 */
export function RecorderProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [sec, setSec] = useState(0)
  const [level, setLevel] = useState(0)
  const [silent, setSilent] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const rec = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const held = useRef(false)
  const startedAt = useRef(0)
  const cleanup = useRef<() => void>(() => {})

  useEffect(() => () => cleanup.current(), [])
  useEffect(() => {
    if (!message) return
    const t = window.setTimeout(() => setMessage(null), 8000)
    return () => window.clearTimeout(t)
  }, [message])

  const send = useCallback(
    async (body: FormData, wasSilent = false) => {
      setState('processing')
      try {
        const res = await fetch('/api/memo', { method: 'POST', body })
        const json = (await res.json().catch(() => null)) as { message: string } | null
        // 受け取った後にサーバが時間切れになったときは JSON が返らない。録音は先に保存してあり、ダイジェストに「やり直す」で出る
        // 判定を誤っても録音を失わないよう、無音に見えた録音も送ってから知らせる
        setMessage(wasSilent ? SILENT_MESSAGE : (json?.message ?? '処理が途中で止まりました。録音は残っていて、ダイジェストからやり直せます。'))
        router.refresh()
      } catch {
        setMessage('いま記録の処理ができません。録音は残っていません。もう一度お試しください。')
      } finally {
        setState('idle')
      }
    },
    [router],
  )

  const stop = useCallback(() => {
    if (rec.current?.state === 'recording') rec.current.stop()
  }, [])

  const press = useCallback(async () => {
    if (state !== 'idle') return
    held.current = true
    setMessage(null)
    setState('starting')
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setState('idle')
      setMessage('マイクを使えません。ブラウザの設定でマイクを許可してください。')
      return
    }
    // マイクの許可を聞いている間に指が離れた（初回）。録音は始めない
    if (!held.current) {
      stream.getTracks().forEach((t) => t.stop())
      setState('idle')
      setMessage('マイクを使えるようになりました。押している間だけ録音します。')
      return
    }
    const mime = pickMime()
    const r = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
    chunks.current = []
    r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data)
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    ctx.createMediaStreamSource(stream).connect(analyser)
    const buf = new Uint8Array(analyser.fftSize)
    let raf = 0
    let maxPeak = 0
    // 音量を測れている時間だけで無音を判定する。AudioContext が止まったまま（iOS で起きる）だと値が動かず、
    // 本当は録れている録音を無音と見誤るので、動き出した時刻から数える
    let measuringSince = 0
    const noSound = () => measuringSince > 0 && Date.now() - measuringSince > SILENT_AFTER_MS && maxPeak <= SILENT_PEAK
    void ctx.resume().catch(() => {})
    setSilent(false)
    const tick = () => {
      if (ctx.state === 'running' && !measuringSince) measuringSince = Date.now()
      analyser.getByteTimeDomainData(buf)
      let peak = 0
      for (const v of buf) peak = Math.max(peak, Math.abs(v - 128))
      maxPeak = Math.max(maxPeak, peak)
      setLevel(Math.min(1, peak / 64))
      setSilent(noSound())
      raf = requestAnimationFrame(tick)
    }
    tick()
    startedAt.current = Date.now()
    const timer = window.setInterval(() => {
      const s = Math.floor((Date.now() - startedAt.current) / 1000)
      setSec(s)
      if (s >= MAX_SEC) r.state === 'recording' && r.stop()
    }, 200)
    cleanup.current = () => {
      cancelAnimationFrame(raf)
      window.clearInterval(timer)
      stream.getTracks().forEach((t) => t.stop())
      void ctx.close()
    }
    r.onstop = () => {
      cleanup.current()
      const heldMs = Date.now() - startedAt.current
      if (heldMs < MIN_HOLD_MS) {
        setState('idle')
        setMessage('押している間だけ録音します。')
        return
      }
      const type = r.mimeType || mime || 'audio/webm'
      const fd = new FormData()
      fd.append('audio', new Blob(chunks.current, { type }), 'memo')
      void send(fd, noSound())
    }
    rec.current = r
    r.start()
    setSec(0)
    setState('recording')
    navigator.vibrate?.(15)
  }, [send, state])

  const release = useCallback(() => {
    held.current = false
    stop()
  }, [stop])

  function submitText() {
    if (!text.trim()) return
    const fd = new FormData()
    fd.append('text', text)
    setText('')
    setTyping(false)
    void send(fd)
  }

  return (
    <Ctx.Provider value={{ state, sec, level, silent, press: () => void press(), release, openText: () => setTyping(true) }}>
      {children}
      {message && state === 'idle' && (
        <p
          role="status"
          className="fixed inset-x-4 bottom-fab z-nav mx-auto max-w-form rounded-field border border-layer-10 bg-navy px-4 py-3 text-sm text-navy-100 shadow-e2"
        >
          {message}
        </p>
      )}
      {typing && (
        <div className="fixed inset-0 z-modal flex items-end bg-scrim-70 backdrop-blur-sm" onClick={() => setTyping(false)}>
          <div className="mx-auto w-full max-w-form rounded-sheet border border-layer-10 bg-navy p-4 pb-safe" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-white">文字でメモする</p>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              aria-label="メモ"
              className="mt-3 w-full rounded-field border border-layer-10 bg-layer-5 p-3 text-sm text-white focus:border-gold-500 focus:outline-none"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setTyping(false)}>やめる</Button>
              <Button variant="primary" onClick={submitText}>送る</Button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}
