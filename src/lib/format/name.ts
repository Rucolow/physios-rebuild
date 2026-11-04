const CJK = /[぀-ヿ㐀-鿿가-힯]/

/** 人名の語順は名前の文字種で決める（DESIGN_SYSTEM §2-2）。CJK は姓→名、それ以外は名→姓 */
export function personName(family: string, given: string): string {
  return CJK.test(family + given) ? `${family} ${given}` : `${given} ${family}`
}
