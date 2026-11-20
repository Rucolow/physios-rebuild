/**
 * 疾患の解説（ナレッジの疾患ページ）。
 * 全ての記述に出典の番号 [n] を付け、出典の無い記述を書かない。
 * 清水の監修が済むまで status は 'draft'（画面に「監修前」と出す）。
 * 清水のプロトコル（メニュー・段階）はここに書かない。DB が正。
 */
export interface DiseaseSource {
  n: number
  text: string
  url: string
}

export interface DiseaseGuide {
  key: string
  status: 'draft' | 'reviewed'
  updatedOn: string
  /** 一行の要約 */
  lead: string
  sections: { id: string; title: string; body: string }[]
  sources: DiseaseSource[]
  /** BRÜCKE・自分の記事から関連記事を探す語 */
  keywords: string[]
}

const hamstring: DiseaseGuide = {
  key: 'hamstring_strain',
  status: 'draft',
  updatedOn: '2026-11-20',
  lead: '太ももの裏の筋肉（ハムストリングス）の損傷。男子プロサッカーで最も多い怪我で、近年さらに増えている [1]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `ハムストリングス肉離れは、太ももの裏にある筋肉が、強く引き伸ばされながら力を出したときに傷つく怪我です。

UEFA のエリートクラブ傷害研究では、2001/02 から 2021/22 までの 21 シーズンで、ハムストリングスの怪我が男子プロサッカーの全ての怪我に占める割合は 12% から 24% に倍増しました。離脱日数に占める割合も 10% から 20% に増えています [1]。

再発が多いのも特徴です。同じ研究では、ハムストリングスの怪我の 18% が再発で、その 69% が復帰から 2 か月以内に起きていました [1]。復帰した直後の数週間が、もっとも気をつけるべき時期だと言えます。`,
    },
    {
      id: 'anatomy',
      title: '解剖',
      body: `ハムストリングスは、大腿二頭筋（長頭・短頭）、半腱様筋、半膜様筋の総称です。大腿二頭筋の短頭を除く三つは、坐骨結節から始まり膝の下に付く二関節筋で、股関節の伸展と膝関節の屈曲の両方に働きます。

スプリントで傷つくのは大腿二頭筋長頭が最も多いと報告されています [2][3]。`,
    },
    {
      id: 'mechanism',
      title: '受傷のしかた',
      body: `受傷のしかたは、大きく二つに分けられます [4]。

**スプリント型**: 全力で走っているときに起きます。脚を前に振り出して接地に向かう「遊脚期の後半」に、ハムストリングスが伸ばされながら強く働く（遠心性収縮）ため、ここで傷つくと考えられています [2][3]。ただし、直接に確かめた証拠はまだ少なく、接地の直後を挙げる研究もあります [3]。

**ストレッチ型**: キックやスライディング、大きく開脚する動作など、股関節を深く曲げ膝を伸ばした姿勢で、筋肉が引き伸ばされて起きます。スウェーデンのエリートサッカー選手の研究では、ストレッチ型はスプリント型より復帰まで長くかかりました [4]。`,
    },
    {
      id: 'classification',
      title: '分類と重症度',
      body: `筋肉の怪我の分類には、主に次の二つが使われています。

**ミュンヘン・コンセンサス（2013）** [5]: 筋線維の目に見える断裂が無い「機能的な障害」（1 型: 使いすぎ、2 型: 神経筋性）と、断裂がある「構造的な損傷」（3 型: 部分断裂、4 型: 完全断裂・腱の剥離）に分けます。

**British Athletics Muscle Injury Classification（BAMIC, 2014）** [6]: MRI の所見から 0〜4 の段階に分け、さらに損傷の場所を a（筋膜）、b（筋腱移行部）、c（腱の中）で表します。陸上のエリート選手の研究では、3 の段階と c（腱に及ぶ損傷）で、練習への完全復帰までが長くかかりました [7]。

このアプリの「軽度・中程度・重度」は清水さんのプロトコルの区分です。上の分類との対応は、ここでは決めていません。`,
    },
    {
      id: 'assessment',
      title: '評価',
      body: `復帰の判断に使われている基準は、研究によってばらばらで、主観的なものが多いと報告されています。よく使われているのは、痛みが無いこと、臨床での評価、動きのテストです [8]。

その中で、Askling H-test（素早く脚を挙げるテスト）を復帰の基準に入れた研究では再発が少なかった一方、復帰までの日数は延びる傾向がありました [8]。`,
    },
    {
      id: 'rehab',
      title: 'リハビリと復帰までの目安',
      body: `スウェーデンのエリートサッカー選手 75 人の無作為化試験では、筋肉を伸ばした位置で負荷をかける種目を中心にしたリハビリ（L プロトコル）で、復帰までの平均は 28 日でした。従来の種目のリハビリ（C プロトコル）では平均 51 日でした [4]。

どちらのリハビリでも、ストレッチ型はスプリント型より長くかかりました（L プロトコルで 43 日と 23 日、C プロトコルで 74 日と 41 日）[4]。この結果はエリートのサッカー選手のもので、他の競技や年代にそのまま当てはまるとは限りません [4]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
    {
      id: 'prevention',
      title: '再発と予防',
      body: `予防の種目として最も調べられているのが、ノルディック・ハムストリング・エクササイズ（膝立ちで足首を押さえてもらい、体を前に倒していく種目）です。

オランダのアマチュアサッカー選手 579 人の無作為化試験では、13 週で 25 回のノルディックを普段の練習に加えたチームで、ハムストリングスの怪我が少なくなりました。ただし、怪我をしたときの重さは変わりませんでした [9]。

15 の研究、8,459 人をまとめた分析では、ノルディックを含む予防の取り組みで、ハムストリングスの怪我が最大 51% 減っていました [10]。無作為化試験だけに絞ると効果はやや小さく見積もられます [10]。`,
    },
  ],
  sources: [
    { n: 1, text: 'Ekstrand J, et al. Hamstring injury rates have increased during recent seasons and now constitute 24% of all injuries in men’s professional football: the UEFA Elite Club Injury Study from 2001/02 to 2021/22. Br J Sports Med. 2023.', url: 'https://pubmed.ncbi.nlm.nih.gov/36588400/' },
    { n: 2, text: 'Danielsson A, et al. The mechanism of hamstring injuries – a systematic review. BMC Musculoskelet Disord. 2020.', url: 'https://link.springer.com/doi/10.1186/s12891-020-03658-8' },
    { n: 3, text: 'Kenneally-Dabrowski CJB, et al. Late swing or early stance? A narrative review of hamstring injury mechanisms during high-speed running. Scand J Med Sci Sports. 2019.', url: 'https://researchportalplus.anu.edu.au/en/publications/late-swing-or-early-stance-a-narrative-review-of-hamstring-injury/' },
    { n: 4, text: 'Askling CM, Tengvar M, Thorstensson A. Acute hamstring injuries in Swedish elite football: a prospective randomised controlled clinical trial comparing two rehabilitation protocols. Br J Sports Med. 2013;47(15):953–959.', url: 'https://bjsm.bmj.com/content/47/15/953' },
    { n: 5, text: 'Mueller-Wohlfahrt HW, et al. Terminology and classification of muscle injuries in sport: the Munich consensus statement. Br J Sports Med. 2013;47(6):342–350.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3607100' },
    { n: 6, text: 'Pollock N, et al. British athletics muscle injury classification: a new grading system. Br J Sports Med. 2014;48(18):1347–1351.', url: 'https://research.tees.ac.uk/en/publications/the-british-athletics-muscle-injury-classification-grading-system/' },
    { n: 7, text: 'Pollock N, et al. A 4-year study of hamstring injury outcomes in elite track and field using the British Athletics rehabilitation approach. Br J Sports Med. 2016.', url: 'https://bjsm.bmj.com/content/early/2015/07/16/bjsports-2015-094657.full.pdf' },
    { n: 8, text: 'Hickey JT, et al. Criteria for progressing rehabilitation and determining return-to-play clearance following hamstring strain injury: a systematic review. Sports Med. 2017.', url: 'https://mural.maynoothuniversity.ie/id/eprint/19701/' },
    { n: 9, text: 'van der Horst N, et al. The preventive effect of the Nordic hamstring exercise on hamstring injuries in amateur soccer players: a randomized controlled trial. Am J Sports Med. 2015.', url: 'https://pubmed.ncbi.nlm.nih.gov/25794868/' },
    { n: 10, text: 'van Dyk N, Behan FP, Whiteley R. Including the Nordic hamstring exercise in injury prevention programmes halves the rate of hamstring injuries: a systematic review and meta-analysis of 8459 athletes. Br J Sports Med. 2019;53:1362–1370.', url: 'https://bjsm.bmj.com/content/53/21/1362.info' },
  ],
  keywords: ['ハムストリングス', 'ハムストリング', '肉離れ', 'ノルディック', 'hamstring'],
}

export const DISEASE_GUIDES: Record<string, DiseaseGuide> = { [hamstring.key]: hamstring }
