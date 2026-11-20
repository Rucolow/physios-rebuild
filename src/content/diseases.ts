/**
 * 疾患の解説（ナレッジの疾患ページ）。
 * 全ての記述に出典の番号 [n] を付け、出典の無い記述を書かない。
 * 清水の監修が済むまで status は 'draft'（画面に「監修前」と出す）。
 * 清水のプロトコル（メニュー・段階）はここに書かない。DB が正。
 */
import { MORE_GUIDES } from './diseases-more'

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
  /** 材料に使った Quelle のリサーチ番号 */
  quelle?: string[]
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
      body: `ハムストリングスの肉離れには、いくつもの分類があります。どれを使うかで、必要な検査も、言えることも変わります。

**昔からの I〜III 度**: 軽度（少しの線維の損傷）、中等度（部分断裂）、重度（完全断裂）の三段階。痛みや筋力低下などの診察で決め、画像は要りません。ただ、新しい分類を提案した論文は、この三段階が損傷の実体を正しく表しておらず、復帰までの期間を確かに予測できるとは示されていない、と指摘しています [12]。

**ミュンヘン・コンセンサス（2013）** [5]: 筋線維の目に見える断裂が無い「機能的な障害」と、断裂がある「構造的な損傷」に分けます。機能的な障害は、疲労による 1A、遅発性筋痛の 1B、脊柱由来の 2A、筋肉由来の 2B。構造的な損傷は、軽い部分断裂の 3A、中等度の部分断裂の 3B、（ほぼ）完全な断裂・腱の剥離の 4 です。見分けるには MRI か超音波が要ります [5]。欧州のプロサッカー 31 チームで 1 シーズンに起きた太ももの筋肉の怪我 393 件にこの分類を当てた研究では、3 分の 2 が構造的な損傷で、機能的な障害より離脱が長く、構造的な損傷の中でも重いほど離脱が長くなりました。機能的な障害の離脱は中央値 5〜8 日でした [11]。

**British Athletics Muscle Injury Classification（BAMIC, 2014）** [6]: MRI で損傷の大きさを 0〜4 に分け（0 は構造的な損傷なし、4 は完全断裂）、場所を a（筋膜）、b（筋腱移行部）、c（腱の中）で表します。陸上のエリート選手の研究では、c（腱に及ぶ損傷）で練習への完全復帰までが長く、再発も多くなりました [7]。数字の大きさより、腱に及ぶかどうかが見通しを分けるというのがこの分類の主張です。

**MLG-R（2017）** [13]: 受傷のしかた（M: 直接の打撲か、伸ばされて起きたか、スプリントで起きたか）、場所（L）、重さ（G）、再受傷の回数（R）の四つの軸で表す分類です。復帰までの期間を予測することを目的に作られています [13]。

**坐骨結節からの腱の剥離**: 筋肉の中の肉離れとは別の怪我として扱われ、治療の進め方も別です。24 の研究・795 例をまとめた分析では、手術で修復した方が手術しないより成績が良く、受傷してすぐの修復の方が時間がたってからの修復より良好でした。合併症は 23% にありました [14]。

このアプリの「軽度・中程度・重度」は清水さんのプロトコルの区分です。上の分類との対応は、ここでは決めていません。`,
    },
    {
      id: 'assessment',
      title: '評価',
      body: `復帰の判断に使われている基準は、研究によってばらばらで、主観的なものが多いと報告されています。よく使われているのは、痛みが無いこと、臨床での評価、動きのテストです [8]。

その中で、Askling H-test（素早く脚を挙げるテスト）を復帰の基準に入れた研究では再発が少なかった一方、復帰までの日数は延びる傾向がありました [8]。`,
    },
    {
      id: 'rtp',
      title: '復帰の判断',
      body: `復帰は「受傷から何週たったか」ではなく、決めておいた基準を満たしたかで判断する、というのが今の考え方です。ハムストリングスの復帰の基準を扱った 25 の研究をまとめたレビューでは、痛みが無いこと、可動域、筋力、動きのテストが繰り返し使われていましたが、どこまでできればよいかの値は研究ごとにばらばらでした [15]。

ただ、週数が要らなくなるわけではありません。筋肉の修復は、壊れた組織の片付け、修復、作り直しという時間のかかる過程をたどります [16]。テストの値は傷んだ場所の強さを直接測っていないので、組織が治るより先に基準を満たしてしまうことがあります。

「復帰」の中身も一つではありません。2016 年のベルンの合意声明は、制限付きで練習に参加する段階、競技に制限なく戻る段階、受傷前のパフォーマンスに戻る段階の三つを続きとして考えるよう勧めています [17]。サッカーのハムストリングスについての世界規模の Delphi 調査では、「復帰」はチーム練習に完全に参加でき、試合のメンバー選考の対象になる状態と定義されました [18]。

復帰の判断は「安全かどうか」の二択ではなく、組織の状態とどこまでの危険を受け入れるか（シーズンの時期、選手の立場など）を突き合わせる作業だ、とする考え方もあります [19]。`,
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
    { n: 11, text: 'Ekstrand J, Askling C, Magnusson H, Mithoefer K. Return to play after thigh muscle injury in elite football players: implementation and validation of the Munich muscle injury classification. Br J Sports Med. 2013;47(12):769–774.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3717808' },
    { n: 12, text: 'Chan O, Del Buono A, Best TM, Maffulli N. Acute muscle strain injuries: a proposed new classification system. Knee Surg Sports Traumatol Arthrosc. 2012;20(11):2356–2362.', url: 'https://doi.org/10.1007/s00167-012-2118-z' },
    { n: 13, text: 'Valle X, et al. Muscle injuries in sports: a new evidence-informed and expert consensus-based classification with clinical application. Sports Med. 2017;47(7):1241–1253.', url: 'https://doi.org/10.1007/s40279-016-0647-1' },
    { n: 14, text: 'Bodendorfer BM, et al. Outcomes after operative and nonoperative treatment of proximal hamstring avulsions: a systematic review and meta-analysis. Am J Sports Med. 2018;46(11):2798–2808.', url: 'https://doi.org/10.1177/0363546517732526' },
    { n: 15, text: 'van der Horst N, et al. Return to play after hamstring injuries: a qualitative systematic review of definitions and criteria. Sports Med. 2016;46(6):899–912.', url: 'https://doi.org/10.1007/s40279-015-0468-7' },
    { n: 16, text: 'Järvinen TAH, et al. Muscle injuries: biology and treatment. Am J Sports Med. 2005;33(5):745–764.', url: 'https://doi.org/10.1177/0363546505274714' },
    { n: 17, text: 'Ardern CL, et al. 2016 Consensus statement on return to sport from the First World Congress in Sports Physical Therapy, Bern. Br J Sports Med. 2016;50(14):853–864.', url: 'https://doi.org/10.1136/bjsports-2016-096278' },
    { n: 18, text: 'van der Horst N, et al. Return to play after hamstring injuries in football (soccer): a worldwide Delphi procedure regarding definition, medical criteria and decision-making. Br J Sports Med. 2017;51(22):1583–1591.', url: 'https://doi.org/10.1136/bjsports-2016-097206' },
    { n: 19, text: 'Shrier I. Strategic Assessment of Risk and Risk Tolerance (StARRT) framework for return-to-play decision-making. Br J Sports Med. 2015;49(20):1311–1315.', url: 'https://doi.org/10.1136/bjsports-2014-094569' },
  ],
  keywords: ['ハムストリングス', 'ハムストリング', '肉離れ', 'ノルディック', 'hamstring'],
  quelle: ['research-0040'],
}

export const DISEASE_GUIDES: Record<string, DiseaseGuide> = Object.fromEntries(
  [hamstring, ...MORE_GUIDES].map((g) => [g.key, g]),
)
