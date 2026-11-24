import { Play } from 'lucide-react'
import { isOwnStorageUrl } from '@/lib/format/ownStorageUrl'

/** YouTube・Vimeo の URL を埋め込み用の URL にする。分からないものは null */
function embedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const id = u.searchParams.get('v') ?? u.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.match(/^\/(\d+)/)?.[1]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    if (host === 'player.vimeo.com') return url
  } catch {}
  return null
}

/**
 * 種目の動画。詳細の一番上に置く。
 * 自前の置き場の動画は清水の縦撮りを 4:5 に切り抜いたもので、音なしで自動再生して繰り返す（2026-11-23 Rucolow）。
 * YouTube・Vimeo は 16:9 で埋め込む。動画がまだ無い種目は 16:9 の空の枠を出す。
 */
export function VideoFrame({ url, title }: { url: string | null; title: string }) {
  const own = url ? isOwnStorageUrl(url) : false
  const embed = url && !own ? embedUrl(url) : null
  if (url && own) {
    return (
      <div className="mx-auto aspect-exercise w-full max-w-form overflow-hidden rounded-field border border-layer-10 bg-navy-900">
        {/* 音の無い動作の映像なので字幕の器は要らない */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={url}
          aria-label={title}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="auto"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-field border border-layer-10 bg-navy-900">
      {embed ? (
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-navy-500">
          <span className="flex h-12 w-12 items-center justify-center rounded-pill border border-layer-10">
            <Play size={20} aria-hidden="true" />
          </span>
          <span className="text-2xs">動画は準備中です</span>
        </div>
      )}
    </div>
  )
}
