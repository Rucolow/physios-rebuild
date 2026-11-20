/**
 * 自前の Storage の URL か（裁定 J215-3。2026-09-16・J224-3 で `data/knowledgeRules.ts` から
 * ここへ持ち上げた——記事の画像（§5-21）と種目の動画（§5-18）が**同じ 1 関数**で判定する。
 * 判定が 2 箇所にあると、片方だけが第三者ホストを通す日が来る）。
 *
 * **origin で厳密に比べる。** 前方一致だと `https://abc.supabase.co.example.invalid/x.png` が
 * 自前を名乗れてしまい、**プロトコル相対**（`//example.invalid/x.png`）はスキームを持たないので
 * 「相対パス＝自前」の判定をすり抜けて実際に第三者へリクエストが飛ぶ。どちらも
 * 「読者の閲覧が第三者ホストへ漏れない」（§5-21・§5-18・§6-4 48）をそのまま破る。
 *
 * ホスト名を持たない参照（`/x.png`・`x.png`）だけが同一オリジンであり自前である。
 * **判定できない値は自前と見なさない**（通さない側に倒す）。
 */
export function isOwnStorageUrl(src: string): boolean {
  if (src === '') return false
  // ホスト名を持つ形（`scheme://…` と プロトコル相対 `//…`）は絶対参照として扱う
  const hasHost = /^[a-z][a-z0-9+.-]*:\/\//i.test(src) || src.startsWith('//')
  if (!hasHost) return !/^[a-z][a-z0-9+.-]*:/i.test(src) // `data:` `mailto:` 等は自前ではない

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (base === undefined || base === '') return false
  try {
    return new URL(src, base).origin === new URL(base).origin
  } catch {
    return false
  }
}
