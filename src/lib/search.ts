/**
 * 検索の当て方。打ち方の違い（ひらがな／カタカナ、全角／半角、大文字／小文字、空白、ローマ字）で外さない。
 * 漢字の読みは持っていないので、漢字の名前をかなで探せるのは「呼び方」にかなが入っている選手だけ。
 */

const ROMAJI: Record<string, string> = {
  キャ: 'kya', キュ: 'kyu', キョ: 'kyo', シャ: 'sha', シュ: 'shu', ショ: 'sho', チャ: 'cha', チュ: 'chu', チョ: 'cho',
  ニャ: 'nya', ニュ: 'nyu', ニョ: 'nyo', ヒャ: 'hya', ヒュ: 'hyu', ヒョ: 'hyo', ミャ: 'mya', ミュ: 'myu', ミョ: 'myo',
  リャ: 'rya', リュ: 'ryu', リョ: 'ryo', ギャ: 'gya', ギュ: 'gyu', ギョ: 'gyo', ジャ: 'ja', ジュ: 'ju', ジョ: 'jo',
  ビャ: 'bya', ビュ: 'byu', ビョ: 'byo', ピャ: 'pya', ピュ: 'pyu', ピョ: 'pyo',
  ア: 'a', イ: 'i', ウ: 'u', エ: 'e', オ: 'o', カ: 'ka', キ: 'ki', ク: 'ku', ケ: 'ke', コ: 'ko',
  サ: 'sa', シ: 'shi', ス: 'su', セ: 'se', ソ: 'so', タ: 'ta', チ: 'chi', ツ: 'tsu', テ: 'te', ト: 'to',
  ナ: 'na', ニ: 'ni', ヌ: 'nu', ネ: 'ne', ノ: 'no', ハ: 'ha', ヒ: 'hi', フ: 'fu', ヘ: 'he', ホ: 'ho',
  マ: 'ma', ミ: 'mi', ム: 'mu', メ: 'me', モ: 'mo', ヤ: 'ya', ユ: 'yu', ヨ: 'yo',
  ラ: 'ra', リ: 'ri', ル: 'ru', レ: 're', ロ: 'ro', ワ: 'wa', ヲ: 'o', ン: 'n',
  ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge', ゴ: 'go', ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo',
  ダ: 'da', ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do', バ: 'ba', ビ: 'bi', ブ: 'bu', ベ: 'be', ボ: 'bo',
  パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po', ァ: 'a', ィ: 'i', ゥ: 'u', ェ: 'e', ォ: 'o', ヴ: 'vu',
}

/** 全角半角・大文字小文字・空白と中点をそろえ、ひらがなをカタカナにする */
export function foldKana(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s・･,、]+/g, '')
    .replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
}

/** カタカナをローマ字にする（ヘボン式。長音は落とし、促音は次の子音を重ねる）。かな以外はそのまま */
export function toRomaji(folded: string): string {
  let out = ''
  for (let i = 0; i < folded.length; i++) {
    const two = folded.slice(i, i + 2)
    const c = folded[i]
    if (ROMAJI[two]) { out += ROMAJI[two]; i++ }
    else if (c === 'ッ') { const next = ROMAJI[folded.slice(i + 1, i + 3)] ?? ROMAJI[folded[i + 1]] ?? ''; out += next.charAt(0) }
    else if (c === 'ー') continue
    else out += ROMAJI[c] ?? c
  }
  // 打ち方の揺れをそろえる（si/shi、tu/tsu、hu/fu、zi/ji、長音の ou/oo/uu）
  return out.replace(/shi/g, 'si').replace(/chi/g, 'ti').replace(/tsu/g, 'tu').replace(/fu/g, 'hu').replace(/ji/g, 'zi').replace(/sh/g, 'sy').replace(/ch/g, 'ty').replace(/j/g, 'zy').replace(/ou|oo/g, 'o').replace(/uu/g, 'u')
}

/** text（スペース区切りでよい）が query に当たるか。query の語は全て当たる必要がある */
export function searchMatches(text: string, query: string): boolean {
  const words = query.normalize('NFKC').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const kana = foldKana(text)
  const roma = toRomaji(kana)
  return words.every((w) => {
    const k = foldKana(w)
    return kana.includes(k) || roma.includes(toRomaji(k))
  })
}
