/** BRÜCKE の /llms-full.txt（公開記事の全文を Markdown で連結したもの）を記事ごとに分ける */
export interface BruckeArticle {
  slug: string
  url: string
  title: string
  author: string | null
  publishedOn: string | null
  category: string | null
  subtitle: string | null
  body: string
}

const URL_LINE = /^- URL: (https:\/\/brucke\.app\/articles\/([^\s]+))\s*$/

/** 「2026年7月3日」→「2026-07-03」 */
export function jaDateToIso(s: string): string | null {
  const m = s.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : null
}

export function parseLlmsFull(text: string): BruckeArticle[] {
  const lines = text.split('\n')
  // 記事の頭: 「# 題」・空行・「- URL: …」の 3 行
  const heads: number[] = []
  for (let i = 2; i < lines.length; i++) {
    if (URL_LINE.test(lines[i]) && lines[i - 1] === '' && lines[i - 2].startsWith('# ')) heads.push(i - 2)
  }
  return heads.map((start, k) => {
    const end = k + 1 < heads.length ? heads[k + 1] : lines.length
    const block = lines.slice(start, end)
    const title = block[0].slice(2).trim()
    const [, url, slug] = block[2].match(URL_LINE)!
    const meta = new Map<string, string>()
    let i = 3
    for (; i < block.length && block[i].startsWith('- '); i++) {
      const m = block[i].match(/^- ([^:]+): (.*)$/)
      if (m) meta.set(m[1], m[2].trim())
    }
    while (i < block.length && block[i] === '') i++
    let subtitle: string | null = null
    if (block[i]?.startsWith('> ')) {
      subtitle = block[i].slice(2).trim()
      i++
    }
    let rest = block.slice(i).join('\n').trim()
    // 本文の先頭は題の繰り返しなので落とす
    if (rest.startsWith(`# ${title}\n`) || rest === `# ${title}`) rest = rest.slice(title.length + 2).trim()
    // 区切りの「---」が末尾に付いていれば落とす
    rest = rest.replace(/\n-{3,}\s*$/, '').trim()
    return {
      slug,
      url,
      title,
      author: meta.get('Author') ?? null,
      publishedOn: jaDateToIso(meta.get('Published') ?? ''),
      category: meta.get('Category') ?? null,
      subtitle,
      body: rest,
    }
  })
}
