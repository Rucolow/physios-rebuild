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
 * 種目の動画。詳細の一番上に 16:9 の枠で置く。
 * 自前の置き場の動画はそのまま再生し、YouTube・Vimeo は埋め込む。動画がまだ無い種目は空の枠を出す。
 */
export function VideoFrame({ url, title }: { url: string | null; title: string }) {
  const own = url ? isOwnStorageUrl(url) : false
  const embed = url && !own ? embedUrl(url) : null
  return (
    <div className="aspect-video w-full overflow-hidden rounded-field border border-layer-10 bg-navy-900">
      {url && own ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption -- 字幕の器が無い
        <video src={url} controls preload="metadata" playsInline className="h-full w-full" />
      ) : embed ? (
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
