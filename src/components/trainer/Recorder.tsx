'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2, Mic, Square, Type } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

type State = 'idle' | 'recording' | 'processing'
const MAX_SEC = 120

const base = 'relative inline-flex h-14 w-14 items-center justify-center rounded-pill transition-colors duration-base ease-out'

function pickMime(): string {
  for (const m of ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus']) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) return m
  }
  return ''
}

/** 録音ボタン（DESIGN_SYSTEM §5-1）。夜のダイジェストには置かない */
export function Recorder() {
  const path = usePathname()
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [sec, setSec] = useState(0)
  const [level, setLevel] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const rec = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const timer = useRef<number | null>(null)
  const stopAll = useRef<() => void>(() => {})

  useEffect(() => () => stopAll.current(), [])
  if (path.startsWith('/digest')) return null

  async function send(body: FormData) {
    setState('processing')
    try {
      const res = await fetch('/api/memo', { method: 'POST', body })
      const json = (await res.json()) as { message: string }
      setMessage(json.message)
      router.refresh()
    } catch {
      setMessage('いま記録の処理ができません。録音は残っていません。もう一度お試しください。')
    } finally {
      setState('idle')
    }
  }

  async function start() {
    setMessage(null)
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setMessage('マイクを使えません。ブラウザの設定でマイクを許可してください。')
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
    const tick = () => {
      analyser.getByteTimeDomainData(buf)
      let peak = 0
      for (const v of buf) peak = Math.max(peak, Math.abs(v - 128))
      setLevel(Math.min(1, peak / 64))
      raf = requestAnimationFrame(tick)
    }
    tick()
    const startedAt = Date.now()
    timer.current = window.setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000)
      setSec(s)
      if (s >= MAX_SEC) stop()
    }, 250)
    stopAll.current = () => {
      cancelAnimationFrame(raf)
      if (timer.current) window.clearInterval(timer.current)
      stream.getTracks().forEach((t) => t.stop())
      void ctx.close()
    }
    r.onstop = () => {
      stopAll.current()
      const type = r.mimeType || mime || 'audio/webm'
      const blob = new Blob(chunks.current, { type })
      const fd = new FormData()
      fd.append('audio', blob, 'memo')
      void send(fd)
    }
    rec.current = r
    r.start()
    setSec(0)
    setState('recording')
  }

  function stop() {
    rec.current?.state === 'recording' && rec.current.stop()
  }

  function submitText() {
    if (!text.trim()) return
    const fd = new FormData()
    fd.append('text', text)
    setText('')
    setTyping(false)
    void send(fd)
  }

  const mm = String(Math.floor(sec / 60))
  const ss = String(sec % 60).padStart(2, '0')

  return (
    <>
      {typing && (
        <div className="fixed inset-0 z-modal flex items-end bg-scrim-70 backdrop-blur-sm" onClick={() => setTyping(false)}>
          <div className="w-full rounded-sheet border border-layer-10 bg-navy p-4 pb-safe" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-white">文字でメモする</p>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="mt-3 w-full rounded-field border border-layer-10 bg-layer-5 p-3 text-sm text-white focus:border-gold-500 focus:outline-none"
              placeholder="話すのと同じように書いてください"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setTyping(false)}>やめる</Button>
              <Button variant="secondary" onClick={submitText}>送る</Button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-fab right-4 z-nav flex flex-col items-end gap-2 md:right-6">
        {message && state === 'idle' && (
          <p role="status" className="max-w-form rounded-field border border-layer-10 bg-navy px-3 py-2 text-2xs text-navy-200 shadow-e2">
            {message}
          </p>
        )}
        <div className="flex items-center gap-2">
          {state === 'recording' && (
            <div className="flex items-center gap-2 rounded-pill border border-layer-10 glass px-3 py-2">
              <span className="font-mono text-2xs font-bold text-white nums">{mm}:{ss}</span>
              <span className="h-2 w-12 overflow-hidden rounded-pill bg-navy-900">
                <span className="block h-full bg-red-400" style={{ width: `${Math.round(level * 100)}%` }} />
              </span>
            </div>
          )}
          {state === 'idle' && (
            <button
              type="button"
              aria-label="文字でメモする"
              onClick={() => setTyping(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-layer-10 bg-navy text-navy-300 transition-colors duration-fast hover:text-white"
            >
              <Type size={16} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            aria-live="polite"
            aria-busy={state === 'processing'}
            aria-label={state === 'recording' ? '録音を止めて送る' : state === 'processing' ? '文字起こし中' : '音声メモを録音'}
            disabled={state === 'processing'}
            onClick={() => (state === 'idle' ? start() : stop())}
            className={cn(
              base,
              state === 'idle' && 'bg-gold-500 text-navy-900 shadow-glow hover:bg-gold-400',
              state === 'recording' && 'bg-red-500 text-navy-900 animate-glow-pulse-danger',
              state === 'processing' && 'cursor-not-allowed bg-layer-10 text-navy-300',
            )}
          >
            {state === 'idle' && <Mic size={24} aria-hidden="true" />}
            {state === 'recording' && <Square size={20} aria-hidden="true" />}
            {state === 'processing' && <Loader2 size={20} className="animate-spin" aria-hidden="true" />}
          </button>
        </div>
        <span className="text-2xs font-medium text-navy-400">
          {state === 'idle' ? '録音' : state === 'recording' ? '録音中' : '文字起こし中'}
        </span>
      </div>
    </>
  )
}
