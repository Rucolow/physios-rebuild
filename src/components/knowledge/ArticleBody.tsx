import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { isOwnStorageUrl } from '@/lib/format/ownStorageUrl'

/**
 * 記事本文の描画（DESIGN_SYSTEM「旧アプリ準拠ページ」・人間決定 2026-09-16）。
 *
 * **本文は著述の逐語である**（スキーマ設計 §0-6）。整形・要約・切り出しをせず、
 * 絵文字も逐語で出す（§6-4 規則 26 の既存例外）。
 *
 * 見た目は旧アプリ（RYO）の記事本文に合わせる。寸法は
 * `docs/design-verify/old-app/verify/ref-old-article{,-extra,-wrap}.json` の計測から
 * 写しており、目分量で置いた数字は 1 つも無い:
 *
 * - 版面 848px の**素の本文**（カード包みを持たない）。送りは見出しの `margin`
 * - `h1` 30/700・`h2` 24/700＋下線・`h3` 20/700・段落 16/400 行送り 26
 * - 箇条書きは `list-inside`（行頭記号が段落の上の行に乗る旧の見え方をそのまま写す）
 * - **markdown の `#` は `h2` に読み替える**（審査 1 回目 D7・暫定）。旧アプリは題と本文の
 *   `h1` が 2 つ並ぶ作りだが、**見た目に出ない参照の欠点は写さない**。計算済みスタイルは
 *   旧 `h1#1`（30/700/36・`mt-8 mb-4`）のままなので box は不変で、計測名だけが 1 つずれる
 *   （C3 の改名で吸収。旧 `h1#1` drop → 出力 `h2#0`、旧 `h2#k` → 出力 `h2#(k+1)`）
 * - 色は PHYSIOS のトークンと一致する（旧 `rgb(189,199,221)` = `navy-200` 等）。
 *   一致しない 1 色（表の枠は `layer-10`）だけ素の値で書く
 *
 * - **生 HTML を描かない**（`skipHtml`）。`rehype-raw` を入れない
 * - **画像は自前の Supabase Storage のホストだけ** `<img>` にする
 * - **本文の数字を `<Num>` で包まない**（J214: `<Num>` は著述の逐語を包まない）
 * - **折り畳み・`line-clamp` を禁止する**（§5-17 J178）——読み物を切らない
 */
export function ArticleBody({ markdown }: { markdown: string }) {
  // 包みに padding / border / flow-root を持たせない——先頭見出しの margin-top が
  // 包みの外へ相殺して抜けるのが旧アプリの版面である（本文の始まりが 32px 下がる）
  // 継承色は白（旧と同じ）。段落・箇条書き・セルは各々が `navy-200` を指定する——
  // 表や `hr` のように色を指定しない要素の計算値が参照とずれないようにする
  return <div className="text-[16px] leading-[24px] text-white">
    <Markdown skipHtml remarkPlugins={[remarkGfm]} components={COMPONENTS}>{markdown}</Markdown>
  </div>
}

type Props<T extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<T> & { children?: ReactNode }

/** 箇条書きの共通（旧: `list-inside space-y-2 mb-4`・16/24・`navy-200`） */
const LIST = 'mb-4 space-y-2 text-[16px] leading-[24px] text-navy-200'
// M1: 旧は `underline`（`RYO app` の記事本文のリンク）。`text-decoration` は measure の
// styles に無いので compare が拾えない——切り出しで確認する項目である
const LINK = 'text-gold-400 underline transition-colors duration-fast ease-out hover:text-gold-300'

const COMPONENTS = {
  // D7（暫定）: 旧アプリは題と本文先頭が両方 `h1` だが、**見た目に出ない参照の欠点は写さない**。
  // 計算済みスタイルは旧 `h1#1`（30/700/36・mt32 mb16）のままで、要素だけ `h2` に読み替える
  h1: (p: Props<'h1'>) => <h2 className="mb-4 mt-8 text-[30px] font-bold leading-[36px] text-white">{p.children}</h2>,
  h2: (p: Props<'h2'>) => (
    <h2 className="mb-3 mt-6 border-b border-layer-10 pb-2 text-[24px] font-bold leading-[32px] text-white">{p.children}</h2>
  ),
  h3: (p: Props<'h3'>) => <h3 className="mb-2 mt-4 text-[20px] font-bold leading-[28px] text-white">{p.children}</h3>,
  h4: (p: Props<'h4'>) => <h4 className="mb-2 mt-3 text-[18px] font-[600] leading-[28px] text-navy-100">{p.children}</h4>,
  h5: (p: Props<'h5'>) => <h5 className="mb-2 mt-3 text-[16px] font-[600] leading-[24px] text-navy-100">{p.children}</h5>,
  h6: (p: Props<'h6'>) => <h6 className="mb-2 mt-3 text-[14px] font-[600] leading-[20px] text-navy-100">{p.children}</h6>,
  p: (p: Props<'p'>) => <p className="mb-4 text-[16px] leading-[26px] text-navy-200">{p.children}</p>,
  strong: (p: Props<'strong'>) => <strong className="font-bold text-white">{p.children}</strong>,
  // M4: 旧 `italic text-primary-100`
  em: (p: Props<'em'>) => <em className="italic text-navy-100">{p.children}</em>,
  ul: (p: Props<'ul'>) => <ul className={`list-inside list-disc ${LIST}`}>{p.children}</ul>,
  ol: (p: Props<'ol'>) => <ol className={`list-inside list-decimal ${LIST}`}>{p.children}</ol>,
  li: (p: Props<'li'>) => <li className="ml-4">{p.children}</li>,
  // M4: 旧 `border-l-4 border-accent-500 pl-4 py-2 my-4 bg-white/5 rounded-r-lg`
  blockquote: (p: Props<'blockquote'>) => (
    <blockquote className="my-4 rounded-r-field border-l-4 border-gold-500 bg-layer-5 px-4 py-2 text-[16px] leading-[26px] text-navy-200">{p.children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-layer-10" />,
  // 表は版面を越えるので**表だけを横スクロールさせる**（本文ごと横に流さない・§3-1）
  table: (p: Props<'table'>) => <div className="my-6 overflow-x-auto">
    <table className="min-w-full overflow-hidden rounded-field border border-layer-10">{p.children}</table>
  </div>,
  thead: (p: Props<'thead'>) => <thead className="bg-layer-10">{p.children}</thead>,
  // 行の区切りは `divide-y`（旧と同じ）。1 行目には線が付かず、行の高さが 1px 増える
  tbody: (p: Props<'tbody'>) => <tbody className="divide-y divide-layer-10">{p.children}</tbody>,
  // §6: 旧 `tr hover:bg-white/5 transition-colors`
  tr: (p: Props<'tr'>) => <tr className="transition-colors duration-fast ease-out hover:bg-layer-5">{p.children}</tr>,
  th: (p: Props<'th'>) => <th className="px-4 py-3 text-left text-[14px] font-[600] leading-[20px] text-white">{p.children}</th>,
  td: (p: Props<'td'>) => <td className="px-4 py-3 text-[14px] leading-[20px] text-navy-200">{p.children}</td>,
  // M4: 旧 inline `bg-white/10 text-accent-300`
  code: (p: Props<'code'>) => <code className="rounded-badge bg-layer-10 px-1.5 py-0.5 font-mono text-[14px] text-gold-300">{p.children}</code>,
  // M4: 旧 block は `block px-4 py-3` ＋ 角丸 12 ＋ `bg-black/30` ＋ `text-accent-300`。
  // 中の `code` は面を二重に敷かない（旧は `code` 1 枚で block も inline も描いている）
  pre: (p: Props<'pre'>) => <pre className="mb-4 overflow-x-auto rounded-field bg-[rgb(0_0_0/0.30)] px-4 py-3 font-mono text-[14px] text-gold-300 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-gold-300">{p.children}</pre>,
  a: (p: Props<'a'>) => <a href={p.href} target="_blank" rel="noopener noreferrer" className={LINK}>{p.children}</a>,
  // 第三者ホストの画像は**読み込まない**。参照はリンクの文字として残す（捨てない）
  img: (p: Props<'img'>) => {
    const src = typeof p.src === 'string' ? p.src : ''
    const alt = p.alt ?? ''
    // `react-markdown` の `urlTransform` が `javascript:` 等を空に落とした後。
    // 行き先の無いリンクを描かない（§2-9: 押せる項目は押した通りに動く）
    if (src === '') return <span className="text-[14px] text-navy-400">{alt}</span>
    if (!isOwnStorageUrl(src)) return <a href={src} target="_blank" rel="noopener noreferrer" className={LINK}>
      {alt === '' ? src : alt}
    </a>
    // eslint-disable-next-line @next/next/no-img-element -- 本文の画像は寸法が不明で、逐語の参照をそのまま出す
    return <img src={src} alt={alt} className="rounded-field border border-layer-10" />
  },
}
