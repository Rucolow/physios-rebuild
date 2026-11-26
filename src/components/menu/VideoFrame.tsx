import { isOwnStorageUrl } from '@/lib/format/ownStorageUrl'
import { OwnVideo } from './OwnVideo'

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
 * YouTube・Vimeo は 16:9 で埋め込む。動画の無い種目と、埋め込めない URL では何も出さない（有酸素は動画を付けないと 2026-11-24 に Rucolow が決めたので「準備中」は事実と違う）。
 */
export function VideoFrame({ url, title }: { url: string | null; title: string }) {
  const own = url ? isOwnStorageUrl(url) : false
  const embed = url && !own ? embedUrl(url) : null
  if (url && own) {
    return <OwnVideo url={url} title={title} />
  }
  if (!embed) return null
  return (
    <div className="aspect-video w-full overflow-hidden rounded-field border border-layer-10 bg-navy-900">
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
