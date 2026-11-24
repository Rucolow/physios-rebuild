'use client'
import { useRef, useState } from 'react'
import { Play } from 'lucide-react'

/**
 * 自前の置き場の種目動画（4:5・音なし・15 秒の繰り返し）。
 * 再生の操作盤は出さず、映像を押すと止まり、もう一度押すと動く。止めている間だけ再生の印を出す。
 */
export function OwnVideo({ url, title }: { url: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)
  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) void v.play()
    else v.pause()
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={paused ? `${title}の動画を再生する` : `${title}の動画を止める`}
      className="relative mx-auto block aspect-exercise w-full max-w-form overflow-hidden rounded-field border border-layer-10 bg-navy-900"
    >
      {/* 音の無い動作の映像なので字幕の器は要らない */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={ref}
        src={url}
        aria-label={title}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        className="h-full w-full object-cover"
      />
      {paused && (
        <span className="absolute inset-0 flex items-center justify-center bg-scrim-50">
          <span className="flex h-14 w-14 items-center justify-center rounded-pill border border-layer-20 text-white">
            <Play size={24} aria-hidden="true" />
          </span>
        </span>
      )}
    </button>
  )
}
