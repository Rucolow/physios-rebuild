/**
 * 疾患の解説（ハムストリングス以外の 9 疾患）。規則は diseases.ts と同じ:
 * 全ての記述に出典の番号 [n] を付け、出典の無い記述を書かない。清水の監修が済むまで 'draft'。
 */
import type { DiseaseGuide } from './diseases'

const MAPPING_NOTE = 'このアプリの区分（題に付いている程度や術式）は清水さんのプロトコルの区分です。上の分類との対応は、ここでは決めていません。'

const groin: DiseaseGuide = {
  key: 'groin_pain_syndrome',
  status: 'draft',
  updatedOn: '2026-11-20',
  lead: '鼠径部（脚の付け根のあたり）の痛みの総称。男子プロサッカーでは、毎シーズンの怪我の 12〜16% を股関節・鼠径部の怪我が占める [1]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `鼠径部の痛みは、一つの病気の名前ではなく、脚の付け根のあたりに出る痛みをまとめた呼び方です。原因になる場所は、内転筋、腸腰筋、鼠径管、恥骨など複数あります [2]。

UEFA の研究では、ヨーロッパのプロクラブで 7 シーズンに 628 件の股関節・鼠径部の怪我が記録され、各シーズンの全ての怪我の 12〜16% を占めていました。離脱が長くなりやすいことも報告されています [1]。発生率は試合中が 1000 時間あたり 3.5 件で、練習中の 0.6 件より高くなっていました [1]。

呼び方がばらばらだったことも、この怪我を分かりにくくしてきました。治療の研究 72 本を集めた系統的レビューでは、33 通りの診断名が使われていました [2]。`,
    },
    {
      id: 'classification',
      title: '分類（ドーハ合意）',
      body: `2014 年にドーハで 14 か国の専門家 24 人が集まり、アスリートの鼠径部痛の呼び方と定義を決めました（ドーハ合意、2015 年発表）[2]。分類は問診と身体の診察で決めるもので、画像は前提にしていません [2]。

分類は大きく三つです [2]。

- **1. はっきりした臨床像があるもの**: 内転筋に関連した痛み、腸腰筋に関連した痛み、鼠径管に関連した痛み、恥骨に関連した痛みの四つ。
- **2. 股関節に関連した痛み**
- **3. その他の原因による痛み**

「鼠径管に関連した痛み」は、鼠径管のあたりの痛みと押したときの痛みがあり、触って分かる鼠径ヘルニアは無いものを指します [2]。本物の鼠径ヘルニアとは別の状態です。

ドーハ合意より前の研究ですが、長く続く鼠径部痛のアスリート 207 人を診察した研究では、主な原因は内転筋が 58%、腸腰筋が 35%、腹直筋が 10% でした。33% の人には二つ目、三つ目の原因も見つかっています [3]。一人に原因が一つとは限らないということです。

${MAPPING_NOTE}`,
    },
    {
      id: 'course',
      title: '急性の怪我か、長く続く痛みか',
      body: `ドーハ合意はどこが痛みの源かで分けますが、それぞれの中の重さの段階は決めていません [2]。復帰までの見通しを大きく分けるのは、はっきりした受傷の場面がある急性の怪我か、何週も何か月も続く痛みか、という違いです。

**急性の内転筋の怪我**: 男子アスリート 81 人の前向きコホートでは、MRI で 0〜3 の段階（0 は所見なし、3 は完全断裂・剥離）に分け、基準に沿ったリハビリを行いました。0〜2 の段階では、痛みが消えるまで中央値 13 日、チーム練習に完全に戻るまで 18 日でした。3 の段階では、チーム練習まで中央値 78 日でした [6]。1 年以内の再受傷は 8% で、痛みが消えてから復帰した選手では 5%、そうでない選手では 21% でした [6]。同じ集団で、最初の診察で長内転筋の付け根の圧痛や触れて分かるへこみがあると、復帰が遅れる傾向がありました [7]。

**長く続く鼠径部痛**: 下の「リハビリ」の運動療法の試験の対象はこちらです [4]。

股関節が原因の痛みのうち、大腿骨寛骨臼インピンジメント（FAI）症候群は、症状・診察所見・画像の三つがそろったときにだけ診断する、とワーウィック合意は定めています。画像で骨の形の特徴があるだけでは診断しません [8]。`,
    },
    {
      id: 'rehab',
      title: 'リハビリ',
      body: `長く続く内転筋の鼠径部痛（中央値 40 週）のアスリート 68 人の無作為化試験では、骨盤まわりの筋肉、特に内転筋の筋力と協調性を鍛える運動療法のグループで 23 人が痛みなく元の競技に戻りました。運動療法を含まない理学療法のグループでは 4 人でした [4]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
    {
      id: 'prevention',
      title: '予防',
      body: `ノルウェーのセミプロのサッカー 35 チーム（652 人）の無作為化試験では、コペンハーゲン・アダクション（横向きで上の脚を台に乗せ、体を持ち上げる内転筋の種目）一種目を、プレシーズンは週 3 回、シーズン中は週 1 回行いました。シーズン中に鼠径部の問題を抱えていた割合は 13.5% で、普段どおりに練習したチームの 21.3% より低く、問題を抱えるリスクは 41% 低くなりました [5]。

この試験の結果は選手自身の申告による「鼠径部の問題」で、医師が診断した怪我の数ではありません [5]。`,
    },
  ],
  sources: [
    { n: 1, text: 'Werner J, Hägglund M, Waldén M, Ekstrand J. UEFA injury study: a prospective study of hip and groin injuries in professional football over seven consecutive seasons. Br J Sports Med. 2009;43(13):1036–1040.', url: 'https://pubmed.ncbi.nlm.nih.gov/19945984/' },
    { n: 2, text: 'Weir A, et al. Doha agreement meeting on terminology and definitions in groin pain in athletes. Br J Sports Med. 2015;49(12):768–774.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4484366' },
    { n: 3, text: 'Hölmich P. Long-standing groin pain in sportspeople falls into three primary patterns, a “clinical entity” approach: a prospective study of 207 patients. Br J Sports Med. 2007;41(4):247–252.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2658954' },
    { n: 4, text: 'Hölmich P, et al. Effectiveness of active physical training as treatment for long-standing adductor-related groin pain in athletes: randomised trial. Lancet. 1999;353(9151):439–443.', url: 'https://pubmed.ncbi.nlm.nih.gov/9989713/' },
    { n: 5, text: 'Harøy J, et al. The Adductor Strengthening Programme prevents groin problems among male football players: a cluster-randomised controlled trial. Br J Sports Med. 2019;53(3):150–157.', url: 'https://bjsm.bmj.com/content/53/3/150.info' },
    { n: 6, text: 'Serner A, et al. Return to sport after criteria-based rehabilitation of acute adductor injuries in male athletes: a prospective cohort study. Orthop J Sports Med. 2020;8(1):2325967119897247.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6990618' },
    { n: 7, text: 'Serner A, et al. Associations between initial clinical examination and imaging findings and return-to-sport in male athletes with acute adductor injuries: a prospective cohort study. Am J Sports Med. 2020;48(5):1151–1159.', url: 'https://doi.org/10.1177/0363546520908610' },
    { n: 8, text: 'Griffin DR, et al. The Warwick Agreement on femoroacetabular impingement syndrome (FAI syndrome): an international consensus statement. Br J Sports Med. 2016;50(19):1169–1176.', url: 'https://doi.org/10.1136/bjsports-2016-096743' },
  ],
  keywords: ['鼠径', 'グロイン', 'グロウイン', '内転筋', '恥骨', 'groin'],
  quelle: ['research-0043'],
}

const rectusFemoris: DiseaseGuide = {
  key: 'rectus_femoris_strain',
  status: 'draft',
  updatedOn: '2026-11-20',
  quelle: ['research-0045'],
  lead: '太ももの前にある大腿直筋の肉離れ。キックで起きることが多く、損傷が筋肉の中の腱（中央腱）や骨盤の付着部の腱に及ぶかどうかで、離脱の長さが大きく変わる [1][2]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `大腿直筋は大腿四頭筋のうち、股関節と膝関節の両方をまたぐただ一つの筋肉です。疫学の研究の多くは大腿直筋だけを数えず、「大腿四頭筋の肉離れ」としてまとめて数えています。

欧州の男子プロサッカー（51 チーム、2,299 人）では、筋肉の怪我 2,908 件のうち大腿四頭筋は 19% で、ハムストリングス（37%）、内転筋（23%）に次ぐ三番目でした [3]。女子では、欧州の女子エリートクラブ 15 チームの 4 シーズンで、大腿四頭筋の筋肉の怪我が全ての怪我の 11%（171 件）を占め、ハムストリングス（12%）と並んで最も多い怪我でした [4]。スペインの同じクラブの男女を比べた研究では、大腿四頭筋の肉離れは女子で 2.25 倍多く、ハムストリングスの肉離れは男子で 1.93 倍多くなっていました [5]。女子で多い理由を調べた研究は見つかっていません。

大腿四頭筋の肉離れのうち、ほとんどが大腿直筋です。オーストラリアン・フットボールのトップ選手 164 件では 91.3% が大腿直筋を含み、72% が蹴り脚に起きていました [2]。サッカーで同じ割合を前向きに数えた大きな研究はありません。

離脱の長さは、UEFA のエリートクラブ傷害研究で、筋線維の断裂を伴う大腿四頭筋の怪我（914 件）が中央値 13 日、平均 19.5 日でした [6]。断裂の無い機能的な障害は中央値 4 日でした [6]。オーストラリアン・フットボールでは復帰まで平均 25.4 日で、大腿直筋の怪我は広筋の怪我より約 14 日長くかかりました [2]。`,
    },
    {
      id: 'anatomy',
      title: '解剖',
      body: `- **二本の起始腱**：直頭は下前腸骨棘から、反転頭は寛骨臼の上外側の縁と股関節の関節包から始まり、合わさって一本の腱になります [7][8]。反転頭の腱膜の広がり方には型があり、48 の骨盤の解剖で四つの型に分かれました [8]。
- **筋肉の中の腱（中央腱）**：直頭の腱は筋肉の前の面を覆う膜になり、反転頭の腱は筋肉の深いところに入り込んで、筋肉の中を縦に走る腱（central septum）になります。深い部分は、この腱の両側から筋線維が出る羽根の形（二羽状）をしていて、浅い部分の中に別の筋肉が入っているような作りです [9]。浅い部分と深い部分が剥がれるように分かれる損傷も、この作りで説明されています [10]。
- **第三の頭と副頭**：96 側の解剖で、83% に股関節の関節包の近くから出る第三の頭が見つかりました [11]。プロサッカー選手 7 人で、本体とは別の副頭の損傷も報告されています [12]。これらが怪我にどう関わるかは、まだ分かっていません。
- **傷つく場所**：プロサッカー選手の急性の損傷 105 件では、骨盤側の腱（自由腱）が 19%、筋腱移行部か中央腱が 64%、筋肉の外側の膜（筋膜）が 17% でした [1]。MRI を撮った選手の集計なので、軽い損傷や膝に近い損傷は少なく数えられている可能性があります。`,
    },
    {
      id: 'mechanism',
      title: '受傷のしかたと危険因子',
      body: `プロサッカー選手 105 件では、キックが 54.3%、スプリントが 30.4% でした。骨盤側の腱の損傷 20 件は全てキックで起き、その 75% は腱の完全な断裂でした [1]。映像の残っていた 20 件の分析では、キックが 80% で、蹴り脚の損傷は全て、股関節が伸びた位置から曲がる方向へ、膝が曲がった位置から伸びる方向へ急に切り替わる瞬間に起きていました [13]。キックで軸足の大腿直筋を傷めた例も 2 件ありました [13]。

前向きの研究で一貫して示されている危険因子は、次の三つです。

- **同じ場所の怪我の既往**：欧州の男子プロサッカーで、前のシーズンに大腿四頭筋を傷めた選手は、次に傷める率が 3.10 倍でした [14]。オーストラリアン・フットボールでは、8 週以内の既往でオッズ比 25.2 でした [15]。
- **蹴り脚**：欧州の男子プロサッカーで、大腿四頭筋の怪我の 63% が蹴り脚に起きていました [14]。
- **時期**：大腿四頭筋の怪我はプレシーズンに多くなっていました [14]。

年齢と柔軟性は、大腿四頭筋の怪我と関連しませんでした [16]。プレシーズンの筋力や柔軟性の左右差で予測しようとした研究（プロ選手 100 人）は、大腿四頭筋の怪我が 7 件と少なく、危険因子とは確かめられていません [17]。`,
    },
    {
      id: 'classification',
      title: '分類と重症度',
      body: `大腿直筋にも、ハムストリングスと同じ筋肉の怪我の分類が使われます。

- **ミュンヘン分類（2013）**：筋線維の断裂が無い機能的な障害と、断裂のある構造的な損傷に分けます [18]。欧州のプロサッカーで検証され、太ももの前の怪我 95 件のうち 74% が構造的な損傷で、構造的な損傷ほど離脱が長くなりました [19]。
- **BAMIC（英国陸上の分類）**：MRI で 0〜4 の程度に分け、場所を a（筋膜）、b（筋腱移行部）、c（腱の中）で表します [20]。英国の陸上のエリート選手の大腿直筋 38 件では、腱の中に及ぶ損傷（c）は練習への完全復帰までが長く、程度 3 は再発が多くなりました [21]。

分類とは別に、大腿直筋では**中央腱にかかっているか**が離脱の長さに強く関わります。オーストラリアン・フットボールでは、中央腱の周りの損傷は練習への完全復帰まで平均 26.9 日で、筋肉の外側の損傷の 9.2 日より長くなりました [22]。スペインのプロサッカー選手 35 人の超音波の研究では、中央腱の損傷は骨盤に近いほど長く、長さが 4 cm のとき離脱は約 45 日で、1 cm 長くなるごとに約 5 日延びました [23]。

一方で、膝に近い腱膜の損傷のほうが長引くという報告もあります（日本のプロサッカー選手 13 人、プロサッカー選手の MRI の系統的レビュー）[24][25]。どちらが正しいかは、まだ決まっていません。サッカー選手の大腿直筋で、分類が治療の方針や見通しを決められると確かめた研究はありません。

${MAPPING_NOTE}`,
    },
    {
      id: 'assessment',
      title: '評価',
      body: `典型的な所見は、股関節を曲げるときや膝を伸ばすときの痛みと腫れで、重い例ではへこみを触れることがあります [26]。ただし、触診などの診察が大腿直筋の損傷をどれだけ正しく見分けるかを調べた研究はありません。

臨床的に肉離れと判断しても、MRI で所見が無い例があり、その場合は離脱が短くなります。オーストラリアン・フットボールでは MRI が正常だった 3 件は平均 5.7 日、欧州のプロサッカーでは MRI に所見の無い筋肉の怪我は 6 ± 7 日でした [22][27]。

中央腱の損傷が慢性になると、太ももの前のしこりとして現れ、腫瘍との区別が問題になることがあります [28]。`,
    },
    {
      id: 'treatment',
      title: '治療の選択',
      body: `筋肉の中の損傷（筋腱移行部・中央腱・筋膜）は、手術をせずに治療するのが前提です。治療法を無作為に比べた試験はありません。

手術が話題になるのは、**骨盤側の腱の完全な断裂や剥離**です。競技者 132 人を集めた系統的レビューでは、競技への復帰率は手術をしない治療で 93.3%、手術で 100%、復帰までの平均は手術をしない治療で 11.7 週、手術で 22.1 週でした [29]。別の系統的レビュー（152 人）では、手術の 73% は手術をしない治療がうまくいかなかった後に行われていて、根拠の確かさは低いとされています [30]。どちらが良いかは、まだ決められません。

術式では、プロの競技者 55 人で、腱を縫い付ける修復より腱を固定する方法（腱固定）のほうが受傷前のレベルへの復帰が早く（12.4 週と 15.8 週）、再発も少なくなりました（0% と 16%）[31]。

成長期の選手では、腱ではなく下前腸骨棘ごと剥がれる裂離骨折が起きます。骨盤の裂離骨折 596 人の系統的レビューでは、下前腸骨棘が 33.2% で最も多く、89.6% が手術をせずに治療されていました [32]。

PRP 注射は、筋肉の怪我全体のメタ分析で結論が分かれていて、大腿直筋を対象にした試験はありません [33][34]。`,
    },
    {
      id: 'rtp',
      title: '復帰と再発',
      body: `再発は、大腿直筋の肉離れの後に最もよく起きることです。

- 欧州の男子プロサッカーで、断裂を伴う大腿四頭筋の怪我の再発率は 15.6% で、再発のときの離脱は初回より長くなりました [6]。
- オーストラリアン・フットボールでは、大腿四頭筋の再発は全て大腿直筋に起き、70% が前の怪我から 6 か月以内でした [2]。
- 同じ競技の 23 年間のデータでは、復帰後最初の試合での大腿四頭筋の再発の危険は 5% で、筋肉の怪我の再発の危険は復帰後 15 週まで高いままでした [15]。

プロサッカー選手の映像分析の研究者は、走る・跳ぶ・方向を変える動きが痛みなくできても、ボールを蹴るとまだ痛む時期があると、経験として述べています [13]。キックを再開する時期と再発の関係を調べた研究や、復帰の基準が再発を減らすかを確かめた研究は、まだありません。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
    {
      id: 'prevention',
      title: '長期の経過と予防',
      body: `中央腱の周りの損傷が慢性になると、深い腱を包む瘢痕や袋状のたまり（偽嚢腫）になり、長引く太ももの痛みやしこりになることがあります [28]。骨盤側の付着部では、怪我の後に骨ができて（異所性骨化）股関節の詰まりの原因になることがあり、関節鏡で取り除いたトップレベルのサッカー選手 16 人のうち、受傷前のレベルに戻れたのは 11 人でした [35]。

大腿直筋や大腿四頭筋の怪我を減らすことを目的にした無作為化試験はありません。FIFA 11+ は大学の男子サッカーで怪我全体とハムストリングスの怪我を減らしましたが、大腿四頭筋の怪我は率比 0.72 で、はっきりした差は出ませんでした [36]。10 代の女子サッカーでも、太ももの前の怪我は両群 9 件ずつでした [37]。件数が少ないので、効果が無いとも、あるとも言えません。`,
    },
  ],
  sources: [
    { n: 1, text: 'Geiss Santos, R. C., Van Hellemnondt, F., Yamashiro, E., et al. (2022). Association Between Injury Mechanisms and Magnetic Resonance Imaging Findings in Rectus Femoris Injuries in 105 Professional Football Players. Clinical Journal of Sport Medicine, 32(4), e430-e435.', url: 'https://doi.org/10.1097/JSM.0000000000000935' },
    { n: 2, text: 'Pietsch, S., Green, B., Schache, A. G., Pizzari, T. (2024). Epidemiology of quadriceps muscle strain injuries in elite male Australian football players. Scandinavian Journal of Medicine & Science in Sports, 34(1), e14542.', url: 'https://doi.org/10.1111/sms.14542' },
    { n: 3, text: 'Ekstrand, J., Hägglund, M., Waldén, M. (2011). Epidemiology of muscle injuries in professional football (soccer). The American Journal of Sports Medicine, 39(6), 1226-1232.', url: 'https://doi.org/10.1177/0363546510395879' },
    { n: 4, text: 'Hallén, A., Tomás, R., Ekstrand, J., et al. (2024). UEFA Women\'s Elite Club Injury Study: a prospective study on 1527 injuries over four consecutive seasons 2018/2019 to 2021/2022 reveals thigh muscle injuries to be most common and ACL injuries most burdensome. British Journal of Sports Medicine, 58(3), 128-135.', url: 'https://doi.org/10.1136/bjsports-2023-107133' },
    { n: 5, text: 'Larruskain, J., Lekue, J. A., Diaz, N., et al. (2018). A comparison of injuries in elite male and female football players: A five-season prospective study. Scandinavian Journal of Medicine & Science in Sports, 28(1), 237-245.', url: 'https://doi.org/10.1111/sms.12860' },
    { n: 6, text: 'Ekstrand, J., Krutsch, W., Spreco, A., et al. (2020). Time before return to play for the most common injuries in professional football: a 16-year follow-up of the UEFA Elite Club Injury Study. British Journal of Sports Medicine, 54(7), 421-426.', url: 'https://doi.org/10.1136/bjsports-2019-100666' },
    { n: 7, text: 'Ryan, J. M., Harris, J. D., Graham, W. C., et al. (2014). Origin of the direct and reflected head of the rectus femoris: an anatomic study. Arthroscopy, 30(7), 796-802.', url: 'https://doi.org/10.1016/j.arthro.2014.03.003' },
    { n: 8, text: 'Mechó, S., Iriarte, I., Lisbona, R., et al. (2024). Different anatomic patterns of the indirect tendon of the rectus femoris. Surgical and Radiologic Anatomy, 46(9), 1421-1428.', url: 'https://doi.org/10.1007/s00276-024-03411-z' },
    { n: 9, text: 'Hasselman, C. T., Best, T. M., Hughes, C., et al. (1995). An explanation for various rectus femoris strain injuries using previously undescribed muscle architecture. The American Journal of Sports Medicine, 23(4), 493-499.', url: 'https://doi.org/10.1177/036354659502300421' },
    { n: 10, text: 'Kassarjian, A., Rodrigo, R. M., Santisteban, J. M. (2014). Intramuscular degloving injuries to the rectus femoris: findings at MRI. American Journal of Roentgenology, 202(5), W475-W480.', url: 'https://doi.org/10.2214/AJR.13.10931' },
    { n: 11, text: 'Tubbs RS, et al. Does a third head of the rectus femoris muscle exist? Folia Morphol. 2006;65(4):377–380.', url: 'https://pubmed.ncbi.nlm.nih.gov/17171618/' },
    { n: 12, text: 'Balius, R., Pedret, C., Mecho, S., et al. (2026). Injuries to accessory head of rectus femoris in professional football players: anatomical description, imaging findings, and clinical implications. Folia Morphologica, 85, e01726016.', url: 'https://doi.org/10.5603/fm.109644' },
    { n: 13, text: 'Jokela, A., Mechó, S., Pasta, G., et al. (2023). Indirect Rectus Femoris Injury Mechanisms in Professional Soccer Players: Video Analysis and Magnetic Resonance Imaging Findings. Clinical Journal of Sport Medicine, 33(5), 475-482.', url: 'https://doi.org/10.1097/JSM.0000000000001131' },
    { n: 14, text: 'Hägglund, M., Waldén, M., Ekstrand, J. (2013). Risk factors for lower extremity muscle injury in professional soccer: the UEFA Injury Study. The American Journal of Sports Medicine, 41(2), 327-335.', url: 'https://doi.org/10.1177/0363546512470634' },
    { n: 15, text: 'Orchard, J. W., Chaker Jomaa, M., Orchard, J. J., et al. (2020). Fifteen-week window for recurrent muscle strains in football: a prospective cohort of 3600 muscle strains over 23 years in professional Australian rules football. British Journal of Sports Medicine, 54(18), 1103-1107.', url: 'https://doi.org/10.1136/bjsports-2019-100755' },
    { n: 16, text: 'Pietsch, S., Pizzari, T. (2022). Risk Factors for Quadriceps Muscle Strain Injuries in Sport: A Systematic Review. Journal of Orthopaedic & Sports Physical Therapy, 52(6), 389-400.', url: 'https://doi.org/10.2519/jospt.2022.10870' },
    { n: 17, text: 'Fousekis, K., Tsepis, E., Poulmedis, P., et al. (2011). Intrinsic risk factors of non-contact quadriceps and hamstring strains in soccer: a prospective study of 100 professional players. British Journal of Sports Medicine, 45(9), 709-714.', url: 'https://doi.org/10.1136/bjsm.2010.077560' },
    { n: 18, text: 'Mueller-Wohlfahrt, H. W., Haensel, L., Mithoefer, K., et al. (2013). Terminology and classification of muscle injuries in sport: the Munich consensus statement. British Journal of Sports Medicine, 47(6), 342-350.', url: 'https://doi.org/10.1136/bjsports-2012-091448' },
    { n: 19, text: 'Ekstrand, J., Askling, C., Magnusson, H., Mithoefer, K. (2013). Return to play after thigh muscle injury in elite football players: implementation and validation of the Munich muscle injury classification. British Journal of Sports Medicine, 47(12), 769-774.', url: 'https://doi.org/10.1136/bjsports-2012-092092' },
    { n: 20, text: 'Pollock, N., James, S. L., Lee, J. C., Chakraverty, R. (2014). British athletics muscle injury classification: a new grading system. British Journal of Sports Medicine, 48(18), 1347-1351.', url: 'https://doi.org/10.1136/bjsports-2013-093302' },
    { n: 21, text: 'McAleer, S., Macdonald, B., Lee, J., et al. (2022). Time to return to full training and recurrence of rectus femoris injuries in elite track and field athletes 2010-2019; a 9-year study using the British Athletics Muscle Injury Classification. Scandinavian Journal of Medicine & Science in Sports, 32(7), 1109-1118.', url: 'https://doi.org/10.1111/sms.14160' },
    { n: 22, text: 'Cross, T. M., Gibbs, N., Houang, M. T., Cameron, M. (2004). Acute quadriceps muscle strains: magnetic resonance imaging features and prognosis. The American Journal of Sports Medicine, 32(3), 710-719.', url: 'https://doi.org/10.1177/0363546503261734' },
    { n: 23, text: 'Balius, R., Maestro, A., Pedret, C., et al. (2009). Central aponeurosis tears of the rectus femoris: practical sonographic prognosis. British Journal of Sports Medicine, 43(11), 818-824.', url: 'https://doi.org/10.1136/bjsm.2008.052332' },
    { n: 24, text: 'Shimozaki, K., Nakase, J., Asai, K., et al. (2022). Relationship between anatomical injury site of rectus femoris muscle strain and time taken to return to play in Japanese professional soccer players. Journal of Orthopaedic Surgery (Hong Kong), 30(3), 10225536221141786.', url: 'https://doi.org/10.1177/10225536221141786' },
    { n: 25, text: 'Faiella, E., Pileri, M., D\'Andrea, V., et al. (2026). MRI Features of Acute Muscle Injuries in Professional Soccer Players: A Systematic Review of Prognostic Associations With Return to Play. American Journal of Roentgenology, 226(3), e2533710.', url: 'https://doi.org/10.2214/AJR.25.33710' },
    { n: 26, text: 'Lempainen, L., Mechó, S., Valle, X., et al. (2022). Management of anterior thigh injuries in soccer players: practical guide. BMC Sports Science, Medicine and Rehabilitation, 14(1), 41.', url: 'https://doi.org/10.1186/s13102-022-00428-y' },
    { n: 27, text: 'Hallén, A., Ekstrand, J. (2014). Return to play following muscle injuries in professional footballers. Journal of Sports Sciences, 32(13), 1229-1236.', url: 'https://doi.org/10.1080/02640414.2014.905695' },
    { n: 28, text: 'Hughes, C., Hasselman, C. T., Best, T. M., et al. (1995). Incomplete, intrasubstance strain injuries of the rectus femoris muscle. The American Journal of Sports Medicine, 23(4), 500-506.', url: 'https://doi.org/10.1177/036354659502300422' },
    { n: 29, text: 'Knapik, D. M., Alter, T. D., Ganapathy, A., et al. (2023). Isolated, Full-Thickness Proximal Rectus Femoris Injury in Competitive Athletes: A Systematic Review of Injury Characteristics and Return to Play. Orthopaedic Journal of Sports Medicine, 11(1), 23259671221144984.', url: 'https://doi.org/10.1177/23259671221144984' },
    { n: 30, text: 'Bogwasi, L., Holtzhausen, L., Janse van Rensburg, D. C., et al. (2023). Management of proximal rectus femoris injuries - do we know what we\'re doing?: A systematic review. Biology of Sport, 40(2), 497-512.', url: 'https://doi.org/10.5114/biolsport.2023.116454' },
    { n: 31, text: 'Kayani, B., Singh, S., Chang, J. S., et al. (2021). Outcomes of Surgical Repair Versus Primary Tenodesis for Proximal Rectus Femoris Avulsion Injuries in Professional Athletes. The American Journal of Sports Medicine, 49(1), 121-129.', url: 'https://doi.org/10.1177/0363546520970912' },
    { n: 32, text: 'Eberbach, H., Hohloch, L., Feucht, M. J., et al. (2017). Operative versus conservative treatment of apophyseal avulsion fractures of the pelvis in the adolescents: a systematical review with meta-analysis of clinical outcome and return to sports. BMC Musculoskeletal Disorders, 18(1), 162.', url: 'https://doi.org/10.1186/s12891-017-1527-z' },
    { n: 33, text: 'Grassi, A., Napoli, F., Romandini, I., et al. (2018). Is Platelet-Rich Plasma (PRP) Effective in the Treatment of Acute Muscle Injuries? A Systematic Review and Meta-Analysis. Sports Medicine, 48(4), 971-989.', url: 'https://doi.org/10.1007/s40279-018-0860-1' },
    { n: 34, text: 'Bensa, A., Fattini Fellini, G., Boffa, A., et al. (2026). Platelet-Rich Plasma Accelerates the Return to Sport in Athletes with Acute Muscle Injuries: A Systematic Review and Statistical Fragility Index-Based Meta-Analysis of Randomized Controlled Trials. Sports Medicine - Open, 12(1).', url: 'https://doi.org/10.1186/s40798-026-01017-w' },
    { n: 35, text: 'Zini, R., Panascì, M. (2018). Post-traumatic ossifications of the rectus femoris: Arthroscopic treatment and clinical outcome after 2 years. Injury, 49(Suppl 3), S100-S104.', url: 'https://doi.org/10.1016/j.injury.2018.09.062' },
    { n: 36, text: 'Silvers-Granelli, H., Mandelbaum, B., Adeniji, O., et al. (2015). Efficacy of the FIFA 11+ Injury Prevention Program in the Collegiate Male Soccer Player. The American Journal of Sports Medicine, 43(11), 2628-2637.', url: 'https://doi.org/10.1177/0363546515602009' },
    { n: 37, text: 'Soligard, T., Myklebust, G., Steffen, K., et al. (2008). Comprehensive warm-up programme to prevent injuries in young female footballers: cluster randomised controlled trial. BMJ, 337, a2469.', url: 'https://doi.org/10.1136/bmj.a2469' },
  ],
  keywords: ['大腿直筋', '大腿四頭筋', '肉離れ', 'rectus femoris', 'quadriceps'],
}

const acl: DiseaseGuide = {
  key: 'acl_injury',
  status: 'draft',
  updatedOn: '2026-11-20',
  lead: '膝の中にある前十字靱帯の損傷。プロサッカーでは 88% が膝への直接の接触なしに起きている [1]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `前十字靱帯（ACL）は、膝の中で太ももの骨とすねの骨をつなぎ、すねの骨が前にずれるのを止めている靱帯です。前内側線維束と後外側線維束という二つの線維の束でできています [3]。

イタリアのプロサッカーで 10 シーズンに起きた ACL 損傷 148 件を映像で調べた研究では、分析できた 134 件のうち、接触なしが 44%、膝以外への接触（体を押されるなど）が 44%、膝への直接の接触が 12% でした [1]。

復帰までの道のりは長く、復帰した後も簡単ではありません。ヨーロッパの男子プロサッカーの 15 年の研究では、ACL 断裂の 3 年後もトップレベルでプレーしていた選手は 65% でした [2]。`,
    },
    {
      id: 'mechanism',
      title: '受傷のしかた',
      body: `上の映像の研究で、接触なし・膝以外への接触で起きた損傷の場面は、相手へのプレスとタックルが 55 件、タックルを受けたときが 24 件、ボールを蹴った後にバランスを立て直すときが 19 件、ジャンプの着地が 8 件でした。どの場面でも、膝が内側に入る（外反）負荷が中心でした [1]。

時期にも偏りがあり、62% が試合の前半に起き、シーズンの始め（9〜10 月）と終わり（3〜5 月）に多くなっていました [1]。`,
    },
    {
      id: 'classification',
      title: '分類',
      body: `ACL の総説は、実際には「完全に切れているか（完全断裂）、一部が残っているか（部分断裂）」の二つで考えます [7]。靱帯の怪我に慣例で使う I〜III 度の分け方は、ACL では治療の方針を決めません。ACL は自分で治る力が乏しく、完全に切れた靱帯がつながることは期待できないためです [7]。上のプロサッカーの 15 年の研究では、完全断裂が 140 人、部分断裂が 17 人でした [2]。

部分断裂なら必ず経過が良いわけでもありません。部分断裂を追った研究では、切れた線維の割合が大きいと、完全断裂と同じような機能の低下に進む例がありました [8]。部分断裂か完全断裂かを確かに見分けるには、MRI か関節鏡が要ります [7]。

ゆるさの評価には、国際膝関節記録委員会（IKDC）の評価表が使われます。すねの骨が前に出る量の左右差が 3mm 未満を A（正常）、3〜5mm を B、6〜10mm を C、10mm を超えると D とします [9]。

${MAPPING_NOTE}`,
    },
    {
      id: 'treatment',
      title: '手術するか、しないか',
      body: `ACL の怪我の後の治療は、リハビリだけで進めるか、再建術をしてリハビリをするかに分かれます。

若く活動的な成人 121 人の無作為化試験（KANON）では、すぐに再建術をする方法は、まずリハビリを行い必要になったら再建する方法より、2 年後の膝の状態（KOOS）で優れていませんでした。リハビリを先にした方では、再建術を受けた人が実際に少なくなりました [10]。5 年後にも、本人が答える膝の状態や、X 線での変形性関節症の所見に差はありませんでした [11]。

2020 年の国際的な合意（Panther Symposium）は、全員に合う一つの治療は無く、本人と医療者が一緒に決めるべきだとしています。手術しない場合も、組み立てたリハビリが欠かせないとしています [12]。

手術しないで激しい運動に戻れる人（コーパー）かどうかは、ホップテストなどで判断します。ただ、この判断は固定したものではありません。Delaware-Oslo のコホート（271 人）では、最初に戻れないと判断された人の約半数が、神経筋と筋力のトレーニングの後には戻れる側に移りました [13]。

再建術の移植腱（大腿四頭筋腱、膝蓋腱、ハムストリングス腱）による成績は、まとめた分析でおおむね同じで、違いは腱を取った場所の痛みなどに出ます [14]。一方、半月板の縫合を一緒にした場合は、荷重や可動域、ひねる動きを許す時期が遅くなります [15]。`,
    },
    {
      id: 'rehab',
      title: '復帰の時期と基準',
      body: `ACL 再建術を受けて元のプロのレベルに戻った男子選手 158 人の研究では、26 人（16.5%）が復帰後に移植腱を再び切りました。復帰前に筋力やホップテストなど 6 つの基準を全て満たさずにチーム練習へ戻った選手は、満たした選手より再断裂の危険が約 4 倍でした [16]。

ノルウェーの ACL 再建術を受けた 106 人の研究（Delaware-Oslo ACL コホート）では、競技への復帰を 1 か月遅らせるごとに、再受傷の率が 51% 下がりました。この効果は術後 9 か月まで見られ、それより後では下がりませんでした [4]。復帰の前に大腿四頭筋の筋力の左右差が小さいことも、再受傷を減らしていました [4]。

復帰した後の二度目の ACL 損傷も多く、19 の研究をまとめた分析では全体で 15%（同じ側 7%、反対側 8%）でした。25 歳未満では 21%、25 歳未満で競技に戻った人では 23% でした [5]。若く、高いレベルの競技に戻る人ほど注意が要ります [5]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
    {
      id: 'prevention',
      title: '予防',
      body: `ACL 損傷を減らすトレーニングの効果を調べたメタ分析 8 本をまとめた研究では、予防のトレーニングで全ての ACL 損傷が約 50% 減り、女性の接触なしの ACL 損傷では 67% 減っていました [6]。

ただし、まとめられたメタ分析の多くは女性のデータで、男性の選手での効果は結論を出すだけのデータが無いとされています [6]。`,
    },
  ],
  sources: [
    { n: 1, text: 'Della Villa F, et al. Systematic video analysis of ACL injuries in professional male football (soccer): injury mechanisms, situational patterns and biomechanics study on 134 consecutive cases. Br J Sports Med. 2020;54(23):1423–1432.', url: 'https://bjsm.bmj.com/content/54/23/1423.info' },
    { n: 2, text: 'Waldén M, Hägglund M, Magnusson H, Ekstrand J. ACL injuries in men’s professional football: a 15-year prospective study on time trends and return-to-play rates reveals only 65% of players still play at the top level 3 years after ACL rupture. Br J Sports Med. 2016;50(12):744–750.', url: 'https://bjsm.bmj.com/content/50/12/744.full' },
    { n: 3, text: 'Petersen W, Zantop T. Anatomy of the anterior cruciate ligament with regard to its two bundles. Clin Orthop Relat Res. 2007;454:35–47.', url: 'https://www.pubmed.gov/17142430/' },
    { n: 4, text: 'Grindem H, et al. Simple decision rules can reduce reinjury risk by 84% after ACL reconstruction: the Delaware-Oslo ACL cohort study. Br J Sports Med. 2016;50(13):804–808.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4912389' },
    { n: 5, text: 'Wiggins AJ, et al. Risk of secondary injury in younger athletes after anterior cruciate ligament reconstruction: a systematic review and meta-analysis. Am J Sports Med. 2016;44(7):1861–1876.', url: 'https://pubmed.ncbi.nlm.nih.gov/26772611/' },
    { n: 7, text: 'Musahl V, Karlsson J. Anterior cruciate ligament tear. N Engl J Med. 2019;380(24):2341–2348.', url: 'https://doi.org/10.1056/NEJMcp1805931' },
    { n: 8, text: 'Noyes FR, et al. Partial tears of the anterior cruciate ligament: progression to complete ligament deficiency. J Bone Joint Surg Br. 1989;71(5):825–833.', url: 'https://doi.org/10.1302/0301-620X.71B5.2584255' },
    { n: 9, text: 'Hefti F, et al. Evaluation of knee ligament injuries with the IKDC form. Knee Surg Sports Traumatol Arthrosc. 1993;1(3-4):226–234.', url: 'https://doi.org/10.1007/BF01560215' },
    { n: 10, text: 'Frobell RB, et al. A randomized trial of treatment for acute anterior cruciate ligament tears. N Engl J Med. 2010;363(4):331–342.', url: 'https://doi.org/10.1056/NEJMoa0907797' },
    { n: 11, text: 'Frobell RB, et al. Treatment for acute anterior cruciate ligament tear: five year outcome of randomised trial. BMJ. 2013;346:f232.', url: 'https://doi.org/10.1136/bmj.f232' },
    { n: 12, text: 'Diermeier T, et al. Treatment after anterior cruciate ligament injury: Panther Symposium ACL Treatment Consensus Group. Knee Surg Sports Traumatol Arthrosc. 2020;28(8):2390–2402.', url: 'https://doi.org/10.1007/s00167-020-06012-6' },
    { n: 13, text: 'Thoma LM, et al. Coper classification early after anterior cruciate ligament rupture changes with progressive neuromuscular and strength training and is associated with 2-year success: the Delaware-Oslo ACL Cohort Study. Am J Sports Med. 2019;47(4):807–814.', url: 'https://doi.org/10.1177/0363546519825500' },
    { n: 14, text: 'Mouarbes D, et al. Anterior cruciate ligament reconstruction: a systematic review and meta-analysis of outcomes for quadriceps tendon autograft versus bone-patellar tendon-bone and hamstring-tendon autografts. Am J Sports Med. 2019;47(14):3531–3540.', url: 'https://doi.org/10.1177/0363546518825340' },
    { n: 15, text: 'van Melick N, et al. Evidence-based clinical practice update: practice guidelines for anterior cruciate ligament rehabilitation based on a systematic review and multidisciplinary consensus. Br J Sports Med. 2016;50(24):1506–1515.', url: 'https://doi.org/10.1136/bjsports-2015-095898' },
    { n: 16, text: 'Kyritsis P, Bahr R, Landreau P, Miladi R, Witvrouw E. Likelihood of ACL graft rupture: not meeting six clinical discharge criteria before return to sport is associated with a four times greater risk of rupture. Br J Sports Med. 2016;50(15):946–951.', url: 'https://doi.org/10.1136/bjsports-2015-095908' },
    { n: 6, text: 'Webster KE, Hewett TE. Meta-analysis of meta-analyses of anterior cruciate ligament injury reduction training programs. J Orthop Res. 2018;36(10):2696–2708.', url: 'https://pubmed.ncbi.nlm.nih.gov/29737024/' },
  ],
  keywords: ['前十字', 'ACL', '靱帯', '靭帯', '膝'],
  quelle: ['research-0044'],
}

const meniscus: DiseaseGuide = {
  key: 'meniscus_injury',
  status: 'draft',
  updatedOn: '2026-11-20',
  quelle: ['research-0053'],
  lead: '膝の中で骨と骨の間にある半月板の損傷。切除するか縫合するかで、復帰までの時間と長い目で見た膝の状態が変わる [1][2]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `半月板は、太ももの骨とすねの骨の間に内側と外側に一つずつある、三日月の形をした線維軟骨です。荷重を分散し、衝撃を吸収し、関節を安定させる働きを持っています [3]。

UEFA のエリートクラブ傷害研究（男子）では、外側の半月板の損傷の離脱は中央値 36 日で、よく起きる 31 の診断のうち中央値が 28 日を超えたのは ACL 損傷と外側の半月板の損傷の二つだけでした [4]。欧州 5 大リーグの半月板断裂 250 人では、離脱の中央値は 57.5 日で、同じリーグに戻れたのは 70% でした。30 歳を超えると戻りにくくなりました [5]。サッカーでの半月板損傷の発生率を内側・外側に分けて前向きに数えた研究は見つかっていません。

**外傷性と変性**：半月板の損傷には性質の違う二つがあります。外傷性の断裂は、はっきりした怪我で急に症状が出たものです [6]。変性の断裂は、急な怪我の無い 35 歳を超えた人に起きるものとされています [7]。50〜90 歳の一般の人の MRI では、断裂のあった人の 61% は膝の症状がありませんでした [8]。症状の無いアスリートでも、MRI で断裂が 3.9% に見つかっています [9]。MRI で断裂が見えても、それが症状の原因とは限りません。

**ACL 損傷との合併**：ACL 再建の時に半月板断裂が見つかった割合は、米国の登録で 63%、ノルウェーの登録で 49% でした [10]。ACL 損傷から 3 か月を超えて再建した場合、3 か月以内より内側の半月板の断裂が多くなりました（オッズ比 2.24）。外側では差がありませんでした [11]。後ろ向きの研究が多く、因果関係かどうかは確かめられていません [11]。`,
    },
    {
      id: 'anatomy',
      title: '解剖と働き',
      body: `- **形と動き**：内側は半円形で、すねの骨の関節面の約 60% を覆い、外側はほぼ円形で約 80% を覆います [3]。外側の半月板は関節包への付着が緩く、内側よりよく動きます [3]。
- **線維の向きと根部**：深いところのコラーゲン線維は円周方向に走り、前と後ろの端（根部）で骨に止まっています。上からの圧縮を円周方向の張力に変えて、半月板が外に押し出されないようにしています [3]。内側の後ろの根部が切れると、内側の最大接触圧は 25% 上がり、半月板を全て取ったのと差がありませんでした（屍体の実験）[12]。根部の断裂が重く扱われるのはこのためです。
- **荷重の分担**：内側の半月板を全て取ると接触面積が 50〜70% 減り、外側を全て取ると接触応力が正常の 200〜300% になると記述されています（主に屍体の実験）[3]。
- **ACL のない膝**：ACL が切れた膝では、内側の半月板の後ろの部分が、すねの骨が前にずれるのを止める最も大事な構造になります [3]。
- **血行**：血管が入っているのは外側の縁だけで、縁の 10〜25% です [13]。縁の血行のある部分を red zone、内側の薄い部分を white zone と呼びます [3]。50 歳を過ぎると血管は縁の 4 分の 1 にしか残らないとされています [3]。この区分の根拠は主に少数の屍体の観察で、境界の位置や個人差は確立していません [13][14]。`,
    },
    {
      id: 'healing',
      title: '治り方',
      body: `血行と治りの関係の基本は犬の実験から来ています。縁まで達する切れ目は、縁からの血管の反応で 10 週までに瘢痕組織で治りましたが、血行のない部分の切れ目は治りませんでした [15]。治ったのは元の半月板の組織ではなく瘢痕です [15]。

人では、縫合した半月板を後で関節鏡で見た研究 41 本（1,908 人）のメタ分析で、完全に治ったのが 74%、部分的に治ったのが 10%、治らなかったのが 12% でした。40 歳未満、red-red の位置、縦の断裂、ACL 再建と同時の縫合で治りやすくなりました [16]。

血行の境界（red-white）にかかる断裂を縫合した 767 件のまとめでは、平均 4 年で 83% が再手術や症状なしに経過しました [17]。ただし組織が実際にくっついたかを全て確かめたものではありません。血行のない white-white の断裂が人で治るかは、まとまった証拠が見つかっていません。

ACL 再建の時に見つかった安定した断裂は、そのままにしても処置した場合と成績に差がありませんでした [18]。

人の半月板が縫合後どれくらいで組織としてくっつくかを直接示した研究はありません。`,
    },
    {
      id: 'mechanism',
      title: '受傷のしかたと危険因子',
      body: `半月板の損傷は、体重をかけた状態で膝をひねる動きや、深くしゃがむ動きで起きると一般に説明されます。ただし、サッカーで単独の半月板断裂が起きた場面を映像で分析した研究は見つかっていません。

ACL 損傷に伴う半月板の損傷では、非接触の ACL 損傷 138 人で、最も多いのは外側の半月板だけの損傷でした（サッカー 50.0%、バスケットボール 45.0%）[19]。外側の半月板の損傷が起きやすいのが接触か非接触かは、研究によって逆の結果が出ています [20][21]。

危険因子の系統的レビューは、急性の断裂についてサッカーとラグビーをすること、内側の断裂について ACL 損傷から再建まで 12 か月を超えて待つことを、強い証拠のある因子としました [22]。すねの骨の外側の後ろへの傾きが大きいと、外側の半月板の断裂が多くなるという報告もあります [20]。

サッカー選手の筋力や動きの型などを受傷前に測って、半月板の損傷を予測できるかを調べた前向きの研究は見つかっていません。`,
    },
    {
      id: 'assessment',
      title: '評価',
      body: `- **一つひとつの検査**：9 研究のメタ分析で、McMurray テストは感度 61%・特異度 84%、関節裂隙の圧痛は 83%・83%、Thessaly テストは 75%・87% でした。研究の質は低く、精度は「依然として低い」とされています [23]。Thessaly テストを確かめるために計画された英国の研究では、どの検査も正診率は 53〜59% で、MRI の代わりにはならないと結論しています [24]。
- **組み合わせた診察と MRI**：関節鏡を基準にした研究のメタ分析では、経験のある臨床家が病歴と所見を組み合わせた診察は、内側の断裂で感度 85%・特異度 95%、MRI は 90%・91% で、近い精度でした [25]。
- **MRI**：外側の断裂は内側より見逃されやすく、感度は内側 89%、外側 78% でした [26]。ACL 損傷に伴う ramp 病変（内側の後ろの付着部の損傷）は MRI の感度が 71% で、関節鏡で確かめるよう勧められています [27]。

MRI の精度は「断裂があるか」についての数字で、「その断裂が今の症状の原因か」について確かめた研究はありません。`,
    },
    {
      id: 'classification',
      title: '分類',
      body: `- **断裂の形（ISAKOS 分類）**：関節鏡で、深さ、縁からの距離、場所、形、組織の質を記録します。医師どうしの一致は、形で 79% と良好でしたが、縁からの距離では 54% でした [28]。
- **根部の断裂**：形で 5 つの型に分ける分類があります [29]。内側の後ろの根部の断裂を手術せずに治療した 52 人（平均 58 歳）では、約 5 年で 31% が人工膝関節になりました [30]。
- **ramp 病変**：分類はいくつか提案されていますが、MRI に当てはめたときの精度はばらつき、基準は関節鏡のままです [31]。

断裂の形と治りやすさの関係（縦の断裂や血行のある位置で治りやすい）は示されていますが [16]、分類だけで予後や復帰の期間を予測できると前向きに確かめた研究はありません。手術を受けた 443 人の研究では、手術で見た構造の所見は、術前の痛みや機能とほとんど関係がありませんでした [32]。

${MAPPING_NOTE}`,
    },
    {
      id: 'treatment',
      title: '治療の選択',
      body: `**変性の断裂**：中高年の変性の断裂では、部分切除は偽の手術や運動療法より良くありませんでした [33][34]。若いアスリートの外傷性の断裂には、この結果をそのまま当てはめられません。

**若い人の外傷性の断裂**：18〜40 歳を早期の手術と 12 週間の運動療法に割り付けた試験の探索的な解析では、外傷性の断裂でも 12 か月後の成績に差がありませんでした [35]。競技選手に限った試験ではなく、若いアスリートで手術と手術をしない治療を比べた無作為化試験はありません。

**縫合と部分切除**：再手術は部分切除の方が少なく（長期で 3.9% と 20.7%）、長期の成績と画像の変化は縫合の方が良好でした [36]。縫合の後の失敗は時間とともに増え、1 年以内 12%、4〜6 年で 19% でした [37]。欧州膝関節学会（ESSKA）の合意は、できるだけ半月板を残すことを第一にしていますが、根拠の質は全体に低いと書いています [6]。

**内側と外側**：エリートのアスリート 421 人のまとめでは、部分切除の後の再手術 12 人のうち 10 人が外側でした。外側の切除は、再手術と軟骨が溶ける合併症（軟骨融解）の危険が高いとされています [1]。`,
    },
    {
      id: 'rtp',
      title: '復帰と再受傷',
      body: `- **エリートのアスリート**：部分切除（327 人）の 84.7%、縫合（94 人）の 85.1% が競技に戻りました。縫合の方が復帰まで時間がかかり、17.0% が後で切除を要しました [1]。
- **縫合後**：単独の縫合のまとめでは、受傷前のレベルに戻ったのが 89%、復帰まで 4.3〜6.5 か月、失敗率は 21% でした [38]。
- **プロサッカー選手の外側の断裂（89 人）**：98.9% がプレーに戻り、復帰までの中央値は部分切除 4 か月、縫合 6 か月でした。同じかより上のリーグでプレーしていた割合は、5 年後には縫合 36%、部分切除 20.9% に減っていました [39]。
- **部分切除だけ（90 人）**：プレーに戻るまでの中央値は外側 7 週、内側 5 週で、外側の 69% に痛みや腫れが出ました（内側 8%）[2]。

縫合の後に体重をかけるのを制限する方法と、早くから全て体重をかける方法は、同じくらいの成績でした [40]。縫合後の走る再開と復帰の基準は研究ごとに違い、根拠の水準は低いとされています [41]。どの時期・基準で戻れば再断裂が減るかを確かめた研究はありません。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
    {
      id: 'prevention',
      title: '長期の経過と予防',
      body: `膝の怪我の後の変形性膝関節症のメタ分析では、半月板損傷の後に関節症になるオッズは、損傷の無い膝の 6.3 倍でした [42]。1973 年に開いて半月板を取った 107 人の 21 年後には、48% に関節症が見られました（対照は 7%）[43]。これは今の関節鏡による部分切除の結果ではありません。外傷性の内側の断裂で、縫合した人と部分切除をした人を約 9 年追った研究では、関節症が進まなかったのは縫合 80.8%、部分切除 40.0% でした [44]。無作為に割り付けた比較ではなく、縫合できる断裂とできない断裂の違いが影響している可能性があります。

ACL 損傷の後に膝くずれを繰り返すことは、内側の半月板の損傷と関連していました [45]。

半月板の損傷を減らすことを主な目的にした予防の無作為化試験は見つかっていません。10 代の女子サッカーのウォームアップの試験は重い怪我を減らしましたが、半月板の損傷は別に数えていません [46]。高校の FIFA 11+ の試験では下肢の怪我は減らず、週 2 回以上やったチームは 32% だけでした [47]。`,
    },
  ],
  sources: [
    { n: 1, text: 'D\'Ambrosi, R., et al. (2023). In elite athletes with meniscal injuries, always repair the lateral, think about the medial! A systematic review. Knee Surgery, Sports Traumatology, Arthroscopy, 31(6), 2500-2510.', url: 'https://doi.org/10.1007/s00167-022-07208-8' },
    { n: 2, text: 'Nawabi, D. H., Cro, S., Hamid, I. P., & Williams, A. (2014). Return to play after lateral meniscectomy compared with medial meniscectomy in elite professional soccer players. American Journal of Sports Medicine, 42(9), 2193-2198.', url: 'https://doi.org/10.1177/0363546514540271' },
    { n: 3, text: 'Fox, A. J., Bedi, A., & Rodeo, S. A. (2012). The basic science of human knee menisci: structure, composition, and function. Sports Health, 4(4), 340-351.', url: 'https://doi.org/10.1177/1941738111429419' },
    { n: 4, text: 'Ekstrand, J., et al. (2020). Time before return to play for the most common injuries in professional football: a 16-year follow-up of the UEFA Elite Club Injury Study. British Journal of Sports Medicine, 54(7), 421-426.', url: 'https://doi.org/10.1136/bjsports-2019-100666' },
    { n: 5, text: 'Lavoie-Gagne, O. Z., et al. (2022). Return to Play and Player Performance After Meniscal Tear Among Elite-Level European Soccer Players: A Matched Cohort Analysis of Injuries From 2006 to 2016. Orthopaedic Journal of Sports Medicine, 10(1), 23259671211059541.', url: 'https://doi.org/10.1177/23259671211059541' },
    { n: 6, text: 'Kopf, S., et al. (2020). Management of traumatic meniscus tears: the 2019 ESSKA meniscus consensus. Knee Surgery, Sports Traumatology, Arthroscopy, 28(4), 1177-1194.', url: 'https://doi.org/10.1007/s00167-020-05847-3' },
    { n: 7, text: 'Beaufils, P., et al. (2017). Surgical management of degenerative meniscus lesions: the 2016 ESSKA meniscus consensus. Knee Surgery, Sports Traumatology, Arthroscopy, 25(2), 335-346.', url: 'https://doi.org/10.1007/s00167-016-4407-4' },
    { n: 8, text: 'Englund, M., et al. (2008). Incidental meniscal findings on knee MRI in middle-aged and elderly persons. New England Journal of Medicine, 359(11), 1108-1115.', url: 'https://doi.org/10.1056/NEJMoa0800777' },
    { n: 9, text: 'Beals, C. T., Magnussen, R. A., Graham, W. C., & Flanigan, D. C. (2016). The Prevalence of Meniscal Pathology in Asymptomatic Athletes. Sports Medicine, 46(10), 1517-1524.', url: 'https://doi.org/10.1007/s40279-016-0540-y' },
    { n: 10, text: 'Granan, L. P., et al. (2012). Intraoperative findings and procedures in culturally and geographically different patient and surgeon populations: an anterior cruciate ligament reconstruction registry comparison between Norway and the USA. Acta Orthopaedica, 83(6), 577-582.', url: 'https://doi.org/10.3109/17453674.2012.741451' },
    { n: 11, text: 'Prodromidis, A. D., et al. (2021). Timing of Anterior Cruciate Ligament Reconstruction and Relationship With Meniscal Tears: A Systematic Review and Meta-analysis. American Journal of Sports Medicine, 49(9), 2551-2562.', url: 'https://doi.org/10.1177/0363546520964486' },
    { n: 12, text: 'Allaire, R., Muriuki, M., Gilbertson, L., & Harner, C. D. (2008). Biomechanical consequences of a tear of the posterior root of the medial meniscus. Similar to total meniscectomy. The Journal of Bone and Joint Surgery-American Volume, 90(9), 1922-1931.', url: 'https://doi.org/10.2106/JBJS.G.00748' },
    { n: 13, text: 'Arnoczky, S. P., & Warren, R. F. (1982). Microvasculature of the human meniscus. American Journal of Sports Medicine, 10(2), 90-95.', url: 'https://doi.org/10.1177/036354658201000205' },
    { n: 14, text: 'Śmigielski, R., et al. (2024). A Novel Description of Medial Meniscus Vascularization: A Multicenter Study Introducing the “Medial Meniscal Artery”. American Journal of Sports Medicine, 52(14), 3551-3560.', url: 'https://doi.org/10.1177/03635465241291802' },
    { n: 15, text: 'Arnoczky, S. P., & Warren, R. F. (1983). The microvasculature of the meniscus and its response to injury. An experimental study in the dog. American Journal of Sports Medicine, 11(3), 131-141.', url: 'https://doi.org/10.1177/036354658301100305' },
    { n: 16, text: 'Dai, W., Leng, X., Wang, J., Hu, X., & Ao, Y. (2021). Second-Look Arthroscopic Evaluation of Healing Rates After Arthroscopic Repair of Meniscal Tears: A Systematic Review and Meta-analysis. Orthopaedic Journal of Sports Medicine, 9(10), 23259671211038289.', url: 'https://doi.org/10.1177/23259671211038289' },
    { n: 17, text: 'Barber-Westin, S. D., & Noyes, F. R. (2014). Clinical healing rates of meniscus repairs of tears in the central-third (red-white) zone. Arthroscopy, 30(1), 134-146.', url: 'https://doi.org/10.1016/j.arthro.2013.10.003' },
    { n: 18, text: 'Rothermich, M. A., Cohen, J. A., & Wright, R. (2015). Stable Meniscal Tears Left In Situ at the Time of Arthroscopic Anterior Cruciate Ligament Reconstruction: A Systematic Review. Journal of Knee Surgery, 29(3), 228-234.', url: 'https://doi.org/10.1055/s-0035-1549020' },
    { n: 19, text: 'Shi, H., et al. (2021). Comparison Between Soccer and Basketball of Bone Bruise and Meniscal Injury Patterns in Anterior Cruciate Ligament Injuries. Orthopaedic Journal of Sports Medicine, 9(4), 2325967121995844.', url: 'https://doi.org/10.1177/2325967121995844' },
    { n: 20, text: 'Kim, S. H., et al. (2022). Steep posterior lateral tibial slope, bone contusion on lateral compartments and combined medial collateral ligament injury are associated with the increased risk of lateral meniscal tear. Knee Surgery, Sports Traumatology, Arthroscopy, 30(1), 298-308.', url: 'https://doi.org/10.1007/s00167-021-06504-z' },
    { n: 21, text: 'Feucht, M. J., et al. (2015). Associated tears of the lateral meniscus in anterior cruciate ligament injuries: risk factors for different tear patterns. Journal of Orthopaedic Surgery and Research, 10, 34.', url: 'https://doi.org/10.1186/s13018-015-0184-x' },
    { n: 22, text: 'Snoeker, B. A., Bakker, E. W., Kegel, C. A., & Lucas, C. (2013). Risk factors for meniscal tears: a systematic review including meta-analysis. Journal of Orthopaedic & Sports Physical Therapy, 43(6), 352-367.', url: 'https://doi.org/10.2519/jospt.2013.4295' },
    { n: 23, text: 'Smith, B. E., Thacker, D., Crewesmith, A., & Hall, M. (2015). Special tests for assessing meniscal tears within the knee: a systematic review and meta-analysis. Evidence Based Medicine, 20(3), 88-97.', url: 'https://doi.org/10.1136/ebmed-2014-110160' },
    { n: 24, text: 'Blyth, M., et al. (2015). Diagnostic accuracy of the Thessaly test, standardised clinical history and other clinical examination tests (Apley\'s, McMurray\'s and joint line tenderness) for meniscal tears in comparison with magnetic resonance imaging diagnosis. Health Technology Assessment, 19(62), 1-62.', url: 'https://doi.org/10.3310/hta19620' },
    { n: 25, text: 'Rana, R., et al. (2026). Diagnostic accuracy of clinical examination versus MRI for meniscal tears: a systematic review and meta-analysis. British Medical Bulletin, 159(1).', url: 'https://doi.org/10.1093/bmb/ldag023' },
    { n: 26, text: 'Phelan, N., Rowland, P., Galvin, R., & O\'Byrne, J. M. (2016). A systematic review and meta-analysis of the diagnostic accuracy of MRI for suspected ACL and meniscal tears of the knee. Knee Surgery, Sports Traumatology, Arthroscopy, 24(5), 1525-1539.', url: 'https://doi.org/10.1007/s00167-015-3861-8' },
    { n: 27, text: 'Koo, B., Lee, S. H., Yun, S. J., & Song, J. G. (2020). Diagnostic Performance of Magnetic Resonance Imaging for Detecting Meniscal Ramp Lesions in Patients With Anterior Cruciate Ligament Tears: A Systematic Review and Meta-analysis. American Journal of Sports Medicine, 48(8), 2051-2059.', url: 'https://doi.org/10.1177/0363546519880528' },
    { n: 28, text: 'Anderson, A. F., et al. (2011). Interobserver reliability of the International Society of Arthroscopy, Knee Surgery and Orthopaedic Sports Medicine (ISAKOS) classification of meniscal tears. American Journal of Sports Medicine, 39(5), 926-932.', url: 'https://doi.org/10.1177/0363546511400533' },
    { n: 29, text: 'LaPrade, C. M., et al. (2015). Meniscal root tears: a classification system based on tear morphology. American Journal of Sports Medicine, 43(2), 363-369.', url: 'https://doi.org/10.1177/0363546514559684' },
    { n: 30, text: 'Krych, A. J., et al. (2017). Non-operative management of medial meniscus posterior horn root tears is associated with worsening arthritis and poor clinical outcome at 5-year follow-up. Knee Surgery, Sports Traumatology, Arthroscopy, 25(2), 383-389.', url: 'https://doi.org/10.1007/s00167-016-4359-8' },
    { n: 31, text: 'Allende, F., et al. (2024). Meniscal ramp lesion classification systems: A systematic review. Knee Surgery, Sports Traumatology, Arthroscopy, 32(7), 1710-1724.', url: 'https://doi.org/10.1002/ksa.12188' },
    { n: 32, text: 'Tornbjerg, S. M., et al. (2017). Structural pathology is not related to patient-reported pain and function in patients undergoing meniscal surgery. British Journal of Sports Medicine, 51(6), 525-530.', url: 'https://doi.org/10.1136/bjsports-2016-096456' },
    { n: 33, text: 'Sihvonen, R., et al. (2013). Arthroscopic partial meniscectomy versus sham surgery for a degenerative meniscal tear. New England Journal of Medicine, 369(26), 2515-2524.', url: 'https://doi.org/10.1056/NEJMoa1305189' },
    { n: 34, text: 'Kise, N. J., et al. (2016). Exercise therapy versus arthroscopic partial meniscectomy for degenerative meniscal tear in middle aged patients: randomised controlled trial with two year follow-up. BMJ, 354, i3740.', url: 'https://doi.org/10.1136/bmj.i3740' },
    { n: 35, text: 'Damsted, C., et al. (2024). Early Surgery Versus Exercise Therapy and Patient Education for Traumatic and Nontraumatic Meniscal Tears in Young Adults-An Exploratory Analysis From the DREAM Trial. Journal of Orthopaedic & Sports Physical Therapy, 54(5), 340-349.', url: 'https://doi.org/10.2519/jospt.2024.12245' },
    { n: 36, text: 'Paxton, E. S., Stock, M. V., & Brophy, R. H. (2011). Meniscal repair versus partial meniscectomy: a systematic review comparing reoperation rates and clinical outcomes. Arthroscopy, 27(9), 1275-1288.', url: 'https://doi.org/10.1016/j.arthro.2011.03.088' },
    { n: 37, text: 'Ow, Z. G. W., et al. (2021). All-Cause Failure Rates Increase With Time Following Meniscal Repair Despite Favorable Outcomes: A Systematic Review and Meta-analysis. Arthroscopy, 37(12), 3518-3528.', url: 'https://doi.org/10.1016/j.arthro.2021.05.033' },
    { n: 38, text: 'Eberbach, H., et al. (2018). Sport-specific outcomes after isolated meniscal repair: a systematic review. Knee Surgery, Sports Traumatology, Arthroscopy, 26(3), 762-771.', url: 'https://doi.org/10.1007/s00167-017-4463-4' },
    { n: 39, text: 'Ackermann, J., Jones, M., Ball, S. V., & Williams, A. (2025). Comparative Outcomes of Isolated Lateral Meniscal Repair and Meniscectomy in Professional Soccer Players: Implications for Return to Play, Career Longevity, and Performance. American Journal of Sports Medicine, 53(11), 2514-2522.', url: 'https://doi.org/10.1177/03635465251362504' },
    { n: 40, text: 'VanderHave, K. L., Perkins, C., & Le, M. (2015). Weightbearing Versus Nonweightbearing After Meniscus Repair. Sports Health, 7(5), 399-402.', url: 'https://doi.org/10.1177/1941738115576898' },
    { n: 41, text: 'Schwach, M., et al. (2023). Return-to-sport criteria after isolated meniscus suture: Scoping review of the literature. Orthopaedics & Traumatology: Surgery & Research, 109(6), 103604.', url: 'https://doi.org/10.1016/j.otsr.2023.103604' },
    { n: 42, text: 'Poulsen, E., et al. (2019). Knee osteoarthritis risk is increased 4-6 fold after knee injury - a systematic review and meta-analysis. British Journal of Sports Medicine, 53(23), 1454-1463.', url: 'https://doi.org/10.1136/bjsports-2018-100022' },
    { n: 43, text: 'Roos, H., et al. (1998). Knee osteoarthritis after meniscectomy: prevalence of radiographic changes after twenty-one years, compared with matched controls. Arthritis & Rheumatism, 41(4), 687-693.', url: 'https://doi.org/10.1002/1529-0131(199804)41:4<687::AID-ART16>3.0.CO;2-2' },
    { n: 44, text: 'Stein, T., et al. (2010). Long-term outcome after arthroscopic meniscal repair versus arthroscopic partial meniscectomy for traumatic meniscal tears. American Journal of Sports Medicine, 38(8), 1542-1548.', url: 'https://doi.org/10.1177/0363546510364052' },
    { n: 45, text: 'Sommerfeldt, M., et al. (2018). Recurrent Instability Episodes and Meniscal or Cartilage Damage After Anterior Cruciate Ligament Injury: A Systematic Review. Orthopaedic Journal of Sports Medicine, 6(7), 2325967118786507.', url: 'https://doi.org/10.1177/2325967118786507' },
    { n: 46, text: 'Soligard, T., et al. (2008). Comprehensive warm-up programme to prevent injuries in young female footballers: cluster randomised controlled trial. BMJ, 337, a2469.', url: 'https://doi.org/10.1136/bmj.a2469' },
    { n: 47, text: 'Slauterbeck, J. R., et al. (2019). Implementation of the FIFA 11+ Injury Prevention Program by High School Athletic Teams Did Not Reduce Lower Extremity Injuries: A Cluster Randomized Controlled Trial. American Journal of Sports Medicine, 47(12), 2844-2852.', url: 'https://doi.org/10.1177/0363546519873270' },
  ],
  keywords: ['半月板', 'メニスカス', 'meniscus', '膝'],
}

const cartilage: DiseaseGuide = {
  key: 'knee_cartilage_injury',
  status: 'draft',
  updatedOn: '2026-11-20',
  quelle: ['research-0054'],
  lead: '膝の関節の表面を覆う軟骨の損傷。アスリートの膝では軟骨の全層の欠損が 36% に見つかり、症状の無い変化も多い。どの欠損が進み、どれが進まないかを前もって見分ける方法はまだ無い [1][2]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `関節軟骨は、骨の端を覆って関節を滑らかに動かす組織です。

アスリートの膝を調べた研究 11 本（931 人）の系統的レビューでは、軟骨が骨まで欠けている「全層の欠損」が 36% に見つかりました。研究によって 2.4% から 75% まで幅があり、対象の 40% は北米のプロ選手で、サッカー選手を中心にした数字ではありません [1]。場所は膝蓋大腿関節（37%）と大腿骨の顆部（35%）が多く、一緒に見つかる損傷では半月板の断裂（47%）と ACL 損傷（30%）が多くなっていました [1]。

**症状の無い変化が多い**：症状の無い男子プロサッカー選手 47 人の MRI では、97.9% の選手の両膝に軟骨の変化があり、骨まで達する変化（grade 4）は 12.7% の膝にありました。これらの変化は、競技への参加が減ることとは関係していませんでした [3]。別の 85 人の研究でも、構造的な軟骨の変化は 54% の膝に見られました [4]。怪我の後の MRI で軟骨の変化が見つかっても、それが今回の怪我によるものとは限りません。

**離脱の長さ**：UEFA のエリートクラブ傷害研究（男子）で、「膝の軟骨損傷」の離脱は中央値 22 日、平均 48.7 日で、10〜90 パーセンタイルは 4〜134 日と幅が広く、再受傷率は 36.3% でした [5]。軽い損傷から手術を要する欠損までを一つの診断名で数えた数字です。`,
    },
    {
      id: 'anatomy',
      title: '解剖と治り方',
      body: `- **作り**：関節軟骨は厚さ 2〜4 mm の硝子軟骨で、血管も神経もありません。軟骨細胞は体積の約 2% しかなく、増える力も限られているので、自分で治る力が弱いとされています [6]。
- **層**：表面の層はコラーゲン線維が関節面と平行に並んでずれる力から守り、深い層は線維が垂直に並んで圧縮に抵抗します。深い層は石灰化した層を介して下の骨（軟骨下骨）につながっています [6]。
- **軟骨だけか、骨までか**：軟骨の中にとどまる欠損は自然には治らないとされ、下の骨の骨髄まで達する欠損では、骨髄からの細胞で修復が起きます [7]。ウサギの実験では、修復された組織は 12〜20 週ごろから傷み始め、周りの軟骨ともつながりませんでした [8]。
- **手術でできる組織**：マイクロフラクチャーの 13 か月後に組織を取った研究では、深いところから表面まで硝子軟骨に近い組織になっていたのは 38 検体中 4 検体で、残りは線維軟骨や線維組織が混ざっていました [9]。
- **治療しない欠損**：健康な人を 2 年追った研究では、欠損は平均すると進みましたが、5% は小さくなっていました [10]。高齢者では大半が変わらず、良くなることはまれでした [11]。アスリートの外傷性の欠損が、治療しないとどれくらい進むかを前向きに調べた研究はありません。
- **離断性骨軟骨炎（OCD）との違い**：OCD は外傷による欠損とは別の病態として扱われます。6〜19 歳の膝の OCD は男性が女性の 3.8 倍で、12〜19 歳に多く、63.6% が大腿骨の内側にありました [12]。原因についての合意はありません [13]。`,
    },
    {
      id: 'mechanism',
      title: '受傷のしかたと危険因子',
      body: `サッカー選手で、軟骨の損傷そのものが起きた場面を記録した研究は見つかっていません。分かっているのは、他の怪我に伴う軟骨の損傷です。

- **ACL 損傷**：単独の ACL 損傷 42 膝を最長 11 年 MRI で追った研究では、受傷時に全員に軟骨の損傷がありました。軟骨が失われる危険は年を追うごとに高まり、7〜11 年目には外側の大腿骨で受傷時の 50 倍、膝蓋骨で 30 倍になりました [14]。
- **膝蓋骨の脱臼**：初めての脱臼 39 膝のうち 95% に膝蓋大腿関節の軟骨の損傷がありました [15]。
- **ACL 再建までの期間**：受傷から 3 か月を超えて再建すると軽い軟骨の損傷が増え（オッズ比 1.91）、12 か月を超えると重い損傷が増えました（3.06）[16]。後ろ向きの研究が多く含まれています。
- **半月板の切除**：ACL の再再建を受けた 134 人では、初回の再建で外側の半月板を 33% を超えて切除した人は、外側の軟骨の損傷が進むオッズが 16.9 倍でした [17]。

プロサッカー選手 47 人の研究では、蹴り脚と軸足で軟骨の変化に差はありませんでした [18]。アスリートで、限局性の欠損が新しくできることを前向きに予測する因子は示されていません。`,
    },
    {
      id: 'assessment',
      title: '評価',
      body: `軟骨の損傷に特有の症状や、診察の検査の精度を確かめた研究は見つかっていません。膝の前の痛みがある若い人 56 人では、関節鏡で見つかった膝蓋骨の軟骨の傷みの重さと、痛みの症状に関係がありませんでした [19]。

- **MRI**：43 研究のメタ分析で、MRI は正常な軟骨を見分けるのは得意ですが、損傷を見つける感度は十分ではありませんでした。感度は 3T で 0.79、1.5T で 0.67 で、撮り方によって変わります [20]。浅い損傷ほど見逃されやすく、grade I の感度は 13% でした [19]。
- **関節鏡**：MRI の精度は関節鏡を基準に測られますが、実際の手術中に 4 人の術者が同じ膝を見た研究では、術者どうしの一致はかなり低い結果でした（κ 0.02〜0.31）[21]。`,
    },
    {
      id: 'classification',
      title: '分類（ICRS）',
      body: `軟骨の損傷の深さは、国際軟骨修復学会（ICRS）の 0〜4 の段階で表されます [22]。

- **0**: 正常
- **1**: ほぼ正常。表面が柔らかい、浅い亀裂がある
- **2**: 異常。損傷が軟骨の厚さの 50% 未満
- **3**: 重度の異常。損傷が軟骨の厚さの 50% を超え、石灰化層まで達するが、その下の骨は貫いていない
- **4**: 重度の異常。損傷がその下の骨（軟骨下骨）まで貫いている

古くから使われる Outerbridge 分類もあります [23]。どちらも深さを段階で表すもので、大きさと場所は別に記録します。

ACL 再建を受けた 3,273 人を 10 年追った研究では、膝蓋大腿関節と内側の軟骨の損傷が、10 年後の成績の悪さを予測しました [24]。一方で、ACL 再建の時に見つかった深い損傷を治療せずに残した 51 人は、15 年後に対照と成績の差がありませんでした [2]。

軟骨の修復術の予後因子をまとめた 2026 年の系統的レビューでは、どの研究もバイアスの危険が中等度以上で、一貫した予後因子は無く、欠損の大きさで治療を分ける境界値を支持する証拠は無いと結論しています [25]。

このアプリの区分は、清水さんのプロトコルでは術式と結びついています（軽度はマイクロフラクチャー、中程度は OAT、重度は ACI/MACI）。ICRS の段階との対応は、ここでは決めていません。`,
    },
    {
      id: 'treatment',
      title: '手術の種類と比較',
      body: `- **マイクロフラクチャー（MFX）**：欠損した部分の骨に小さな穴をあけ、骨髄から出てくる細胞で欠損を埋めさせる方法 [26]。
- **骨軟骨柱移植（OAT）**：膝の中で荷重のかかりにくい場所から、軟骨と骨を円柱の形で取り、欠損に移す方法 [26]。
- **自家軟骨細胞移植（ACI、MACI）**：本人の軟骨細胞を取り出して培養し、欠損に戻す方法。MACI は細胞を膜に乗せて戻します [26]。

比べた試験の結果は次のとおりです。

- **ACI とマイクロフラクチャー**：80 人を 14〜15 年追った試験で、成績に差はありませんでした。失敗しなかった人の X 線の早期の関節症は 57% と 48% で、著者はどちらの手術も関節症を遅らせる効果には重大な疑問があると書いています [27]。
- **MACI とマイクロフラクチャー**：3 cm² 以上の欠損 144 人の試験で、5 年後の痛みと機能は MACI の方が良好でした [28]。
- **OAT とマイクロフラクチャー**：若いアスリート 60 人を約 10 年追った試験で、失敗は OAT 14%、マイクロフラクチャー 38% で、同じ活動レベルを保っていたのは 75% と 37% でした [29]。一つの施設の 60 人の試験です。
- **術後の荷重**：MACI の後に全て体重をかけるまでを 8 週と 11 週で比べた試験、6 週と 8 週で比べた試験では、成績に差がありませんでした [30][31]。マイクロフラクチャーや OAT の後の荷重の期間を比べた試験はありません。`,
    },
    {
      id: 'rehab',
      title: '復帰',
      body: `アスリートの軟骨の手術の研究 44 本のメタ分析では、何らかのレベルで競技に戻った割合は全体で 76% で、OAT 93%、他人の骨軟骨の移植（OCA）88%、ACI 82%、マイクロフラクチャー 58% でした。戻るまでの期間は OAT 5.2 か月、マイクロフラクチャー 9.1 か月、OCA 9.6 か月、ACI 11.8 か月でした [26]。年齢、欠損の大きさ、術前の活動レベルは、戻れるかどうかをはっきりとは左右していませんでした [26]。年齢や大きさが影響したとする前のレビューもあり、結論は分かれています [32]。

プロ選手に限ったメタ分析（476 人）では、復帰率は 84.3%、復帰まで平均 39.9 週でした。受傷前より低いレベルに戻る傾向があり、復帰の基準を示した研究は 2 本だけでした [33]。マイクロフラクチャーを受けた男子プロサッカー選手 21 人では、20 人が翌シーズンにプロに戻り、平均 5 年プレーを続けました [34]。

復帰後の再受傷を、軟骨の手術後のアスリートで前向きに調べた研究は見つかっていません。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
    {
      id: 'prevention',
      title: '長期の経過と予防',
      body: `限局性の軟骨の欠損がある人の生活の質のスコアは、人工膝関節の手術を予定している人と差がありませんでした（就労年齢の患者）[35]。

修復術の後の成績は、時間とともに下がる傾向があります。マイクロフラクチャーを 10 年以上追った研究のまとめでは、40〜48% に X 線の関節症の進行があり、競技を続けていたのは 17.2〜20% でした [36]。一方で、治療しなかった深い欠損が長い目で見て成績をほとんど悪くしなかったという報告も複数あります [2][37]。

軟骨の損傷そのものを減らすことを主な目的にした予防の試験は見つかっていません。FIFA 11+ は怪我全体を 39% 減らしましたが、軟骨の損傷を減らすかは調べられていません [38]。ACL 損傷の後に早く再建すれば軟骨が守られるかは、観察研究では関連が見られましたが [16]、無作為化試験（KANON）では 5 年後の関節症に差がありませんでした [39]。`,
    },
  ],
  sources: [
    { n: 1, text: 'Flanigan, D. C., Harris, J. D., Trinh, T. Q., Siston, R. A., & Brophy, R. H. (2010). Prevalence of chondral defects in athletes\' knees: a systematic review. Medicine & Science in Sports & Exercise, 42(10), 1795-1801.', url: 'https://doi.org/10.1249/MSS.0b013e3181d9eea0' },
    { n: 2, text: 'Widuchowski, W., Widuchowski, J., Koczy, B., & Szyluk, K. (2009). Untreated asymptomatic deep cartilage lesions associated with anterior cruciate ligament injury: results at 10- and 15-year follow-up. The American Journal of Sports Medicine, 37(4), 688-692.', url: 'https://doi.org/10.1177/0363546508328104' },
    { n: 3, text: 'Bezuglov, E. N., Lyubushkina, A. V., Khaitin, V. Y., Tokareva, A. V., Goncharov, E. N., Gorinov, A. V., et al. (2019). Prevalence of Asymptomatic Intra-articular Changes of the Knee in Adult Professional Soccer Players. Orthopaedic Journal of Sports Medicine, 7(11), 2325967119885370.', url: 'https://doi.org/10.1177/2325967119885370' },
    { n: 4, text: 'Welsch, G. H., Regier, M., Frosch, K. H., Pachowsky, M. L., Henes, F. O., Adam, G., et al. (2026). Whole-Organ Magnetic Resonance Imaging Score (WORMS) of the Knee in Professional Soccer Players. Cartilage, 17(3), 267-277.', url: 'https://doi.org/10.1177/19476035251329571' },
    { n: 5, text: 'Ekstrand, J., Krutsch, W., Spreco, A., van Zoest, W., Roberts, C., Meyer, T., et al. (2020). Time before return to play for the most common injuries in professional football: a 16-year follow-up of the UEFA Elite Club Injury Study. British Journal of Sports Medicine, 54(7), 421-426.', url: 'https://doi.org/10.1136/bjsports-2019-100666' },
    { n: 6, text: 'Sophia Fox, A. J., Bedi, A., & Rodeo, S. A. (2009). The basic science of articular cartilage: structure, composition, and function. Sports Health, 1(6), 461-468.', url: 'https://doi.org/10.1177/1941738109350438' },
    { n: 7, text: 'Hunziker, E. B. (1999). Articular cartilage repair: are the intrinsic biological constraints undermining this process insuperable?. Osteoarthritis and Cartilage, 7(1), 15-28.', url: 'https://doi.org/10.1053/joca.1998.0159' },
    { n: 8, text: 'Shapiro, F., Koide, S., & Glimcher, M. J. (1993). Cell origin and differentiation in the repair of full-thickness defects of articular cartilage. The Journal of Bone & Joint Surgery, 75(4), 532-553.', url: 'https://doi.org/10.2106/00004623-199304000-00009' },
    { n: 9, text: 'Hoemann, C. D., Tran-Khanh, N., Chevrier, A., Chen, G., Lascau-Coman, V., Mathieu, C., et al. (2015). Chondroinduction Is the Main Cartilage Repair Response to Microfracture and Microfracture With BST-CarGel: Results as Shown by ICRS-II Histological Scoring and a Novel Zonal Collagen Type Scoring Method of Human Clinical Biopsy Specimens. The American Journal of Sports Medicine, 43(10), 2469-2480.', url: 'https://doi.org/10.1177/0363546515593943' },
    { n: 10, text: 'Wang, Y., Ding, C., Wluka, A. E., Davis, S., Ebeling, P. R., Jones, G., et al. (2006). Factors affecting progression of knee cartilage defects in normal subjects over 2 years. Rheumatology, 45(1), 79-84.', url: 'https://doi.org/10.1093/rheumatology/kei108' },
    { n: 11, text: 'Carnes, J., Stannus, O., Cicuttini, F., Ding, C., & Jones, G. (2012). Knee cartilage defects in a sample of older adults: natural history, clinical significance and factors influencing change over 2.9 years. Osteoarthritis and Cartilage, 20(12), 1541-1547.', url: 'https://doi.org/10.1016/j.joca.2012.08.026' },
    { n: 12, text: 'Kessler, J. I., Nikizad, H., Shea, K. G., Jacobs, J. C., Bebchuk, J. D., & Weiss, J. M. (2014). The demographics and epidemiology of osteochondritis dissecans of the knee in children and adolescents. The American Journal of Sports Medicine, 42(2), 320-326.', url: 'https://doi.org/10.1177/0363546513510390' },
    { n: 13, text: 'Edmonds, E. W., & Polousky, J. (2013). A review of knowledge in osteochondritis dissecans: 123 years of minimal evolution from König to the ROCK study group. Clinical Orthopaedics & Related Research, 471(4), 1118-1126.', url: 'https://doi.org/10.1007/s11999-012-2290-y' },
    { n: 14, text: 'Potter, H. G., Jain, S. K., Ma, Y., Black, B. R., Fung, S., & Lyman, S. (2012). Cartilage injury after acute, isolated anterior cruciate ligament tear: immediate and longitudinal effect with clinical/MRI follow-up. The American Journal of Sports Medicine, 40(2), 276-285.', url: 'https://doi.org/10.1177/0363546511423380' },
    { n: 15, text: 'Nomura, E., Inoue, M., & Kurimura, M. (2003). Chondral and osteochondral injuries associated with acute patellar dislocation. Arthroscopy, 19(7), 717-721.', url: 'https://doi.org/10.1016/s0749-8063(03)00401-8' },
    { n: 16, text: 'Prodromidis, A. D., Drosatou, C., Mourikis, A., Sutton, P. M., & Charalambous, C. P. (2022). Relationship Between Timing of Anterior Cruciate Ligament Reconstruction and Chondral Injuries: A Systematic Review and Meta-analysis. The American Journal of Sports Medicine, 50(13), 3719-3731.', url: 'https://doi.org/10.1177/03635465211036141' },
    { n: 17, text: 'MARS Group, Magnussen, R. A., Borchers, J. R., Pedroza, A. D., Huston, L. J., Haas, A. K., et al. (2018). Risk Factors and Predictors of Significant Chondral Surface Change From Primary to Revision Anterior Cruciate Ligament Reconstruction: A MOON and MARS Cohort Study. The American Journal of Sports Medicine, 46(3), 557-564.', url: 'https://doi.org/10.1177/0363546517741484' },
    { n: 18, text: 'Bezuglov, E. N., Khaitin, V. Y., Lyubushkina, A. V., Lazarev, A. M., Gorinov, A. V., Sivakova, E. Y., et al. (2020). The Effect of Training Experience and Leg Dominance on the Prevalence of Asymptomatic Intraarticular Changes of the Knee Joints in Adult Professional Male Soccer Players. Sports Medicine - Open, 6(1), 19.', url: 'https://doi.org/10.1186/s40798-020-00248-9' },
    { n: 19, text: 'Pihlajamäki, H. K., Kuikka, P. I., Leppänen, V. V., Kiuru, M. J., & Mattila, V. M. (2010). Reliability of clinical findings and magnetic resonance imaging for the diagnosis of chondromalacia patellae. The Journal of Bone and Joint Surgery-American Volume, 92(4), 927-934.', url: 'https://doi.org/10.2106/JBJS.H.01527' },
    { n: 20, text: 'Chen, X., You, M., Liao, K., Zhang, M., Wang, L., Zhou, K., et al. (2024). Quantitative Magnetic Resonance Imaging Had Greater Sensitivity in Diagnosing Chondral Lesions of the Knee: A Systematic Review and Meta-analysis. Arthroscopy, 40(11), 2760-2773.e14.', url: 'https://doi.org/10.1016/j.arthro.2024.01.035' },
    { n: 21, text: 'Spahn, G., Klinger, H. M., Baums, M., Pinkepank, U., & Hofmann, G. O. (2011). Reliability in arthroscopic grading of cartilage lesions: results of a prospective blinded study for evaluation of inter-observer reliability. Archives of Orthopaedic and Trauma Surgery, 131(3), 377-381.', url: 'https://doi.org/10.1007/s00402-011-1259-8' },
    { n: 22, text: 'Brittberg, M., & Winalski, C. S. (2003). Evaluation of cartilage injuries and repair. The Journal of Bone and Joint Surgery-American Volume, 85-A(Suppl 2), 58-69.', url: 'https://doi.org/10.2106/00004623-200300002-00008' },
    { n: 23, text: 'Outerbridge, R. E. (1961). The etiology of chondromalacia patellae. The Journal of Bone and Joint Surgery. British Volume, 43-B(4), 752-757.', url: 'https://doi.org/10.1302/0301-620X.43B4.752' },
    { n: 24, text: 'Brophy, R. H., Huston, L. J., Briskin, I., MOON Knee Group, Amendola, A., Cox, C. L., et al. (2021). Articular Cartilage and Meniscus Predictors of Patient-Reported Outcomes 10 Years After Anterior Cruciate Ligament Reconstruction: A Multicenter Cohort Study. The American Journal of Sports Medicine, 49(11), 2878-2888.', url: 'https://doi.org/10.1177/03635465211028247' },
    { n: 25, text: 'Han, J. H., Jung, M., Chung, K., Moon, H. S., Jung, S. H., Baik, S. H., et al. (2026). Prognostic factors associated with outcomes after knee cartilage repair across different procedure types: a systematic review. Knee Surgery & Related Research, 38(1).', url: 'https://doi.org/10.1186/s43019-026-00350-4' },
    { n: 26, text: 'Krych, A. J., Pareek, A., King, A. H., Johnson, N. R., Stuart, M. J., & Williams, R. J. (2017). Return to sport after the surgical management of articular cartilage lesions in the knee: a meta-analysis. Knee Surgery, Sports Traumatology, Arthroscopy, 25(10), 3186-3196.', url: 'https://doi.org/10.1007/s00167-016-4262-3' },
    { n: 27, text: 'Knutsen, G., Drogset, J. O., Engebretsen, L., Grøntvedt, T., Ludvigsen, T. C., Løken, S., et al. (2016). A Randomized Multicenter Trial Comparing Autologous Chondrocyte Implantation with Microfracture: Long-Term Follow-up at 14 to 15 Years. The Journal of Bone and Joint Surgery. American Volume, 98(16), 1332-1339.', url: 'https://doi.org/10.2106/JBJS.15.01208' },
    { n: 28, text: 'Brittberg, M., Recker, D., Ilgenfritz, J., Saris, D. B. F., & SUMMIT Extension Study Group. (2018). Matrix-Applied Characterized Autologous Cultured Chondrocytes Versus Microfracture: Five-Year Follow-up of a Prospective Randomized Trial. The American Journal of Sports Medicine, 46(6), 1343-1351.', url: 'https://doi.org/10.1177/0363546518756976' },
    { n: 29, text: 'Gudas, R., Gudaite, A., Pocius, A., Gudiene, A., Cekanauskas, E., Monastyreckiene, E., et al. (2012). Ten-year follow-up of a prospective, randomized clinical study of mosaic osteochondral autologous transplantation versus microfracture for the treatment of osteochondral defects in the knee joint of athletes. The American Journal of Sports Medicine, 40(11), 2499-2508.', url: 'https://doi.org/10.1177/0363546512458763' },
    { n: 30, text: 'Ebert, J. R., Fallon, M., Zheng, M. H., Wood, D. J., & Ackland, T. R. (2012). A randomized trial comparing accelerated and traditional approaches to postoperative weightbearing rehabilitation after matrix-induced autologous chondrocyte implantation: findings at 5 years. The American Journal of Sports Medicine, 40(7), 1527-1537.', url: 'https://doi.org/10.1177/0363546512445167' },
    { n: 31, text: 'Ebert, J. R., Edwards, P. K., Fallon, M., Ackland, T. R., Janes, G. C., & Wood, D. J. (2017). Two-Year Outcomes of a Randomized Trial Investigating a 6-Week Return to Full Weightbearing After Matrix-Induced Autologous Chondrocyte Implantation. The American Journal of Sports Medicine, 45(4), 838-848.', url: 'https://doi.org/10.1177/0363546516673837' },
    { n: 32, text: 'Mithoefer, K., Hambly, K., Della Villa, S., Silvers, H., & Mandelbaum, B. R. (2009). Return to sports participation after articular cartilage repair in the knee: scientific evidence. The American Journal of Sports Medicine, 37(Suppl 1), 167S-176S.', url: 'https://doi.org/10.1177/0363546509351650' },
    { n: 33, text: 'Kunze, K. N., Uzzo, R. N., Thomas, Z. D., Hicks, J., Rodeo, S. A., & Williams, R. J. (2025). Return to Sport in Professional Athletes After Cartilage Restoration Surgery of the Knee: A Systematic Review and Meta-Analysis Demonstrates Gender Inequality and the Need for Improved Reporting. Cartilage, 16(4), 409-418.', url: 'https://doi.org/10.1177/19476035241292793' },
    { n: 34, text: 'Mithoefer, K., & Steadman, R. J. (2012). Microfracture in Football (Soccer) Players: A Case Series of Professional Athletes and Systematic Review. Cartilage, 3(1 Suppl), 18S-24S.', url: 'https://doi.org/10.1177/1947603511418960' },
    { n: 35, text: 'Heir, S., Nerhus, T. K., Røtterud, J. H., Løken, S., Ekeland, A., Engebretsen, L., et al. (2010). Focal cartilage defects in the knee impair quality of life as much as severe osteoarthritis: a comparison of knee injury and osteoarthritis outcome score in 4 patient categories scheduled for knee surgery. The American Journal of Sports Medicine, 38(2), 231-237.', url: 'https://doi.org/10.1177/0363546509352157' },
    { n: 36, text: 'Gopinatth, V., Jackson, G. R., Touhey, D. C., Chahla, J., Smith, M. V., Matava, M. J., et al. (2024). Microfracture for medium size to large knee chondral defects has limited long-term efficacy: A systematic review. Journal of Experimental Orthopaedics, 11(4), e70060.', url: 'https://doi.org/10.1002/jeo2.70060' },
    { n: 37, text: 'Shelbourne, K. D., Jari, S., & Gray, T. (2003). Outcome of untreated traumatic articular cartilage defects of the knee: a natural history study. The Journal of Bone and Joint Surgery-American Volume, 85-A(Suppl 2), 8-16.', url: 'https://doi.org/10.2106/00004623-200300002-00002' },
    { n: 38, text: 'Thorborg, K., Krommes, K. K., Esteve, E., Clausen, M. B., Bartels, E. M., & Rathleff, M. S. (2017). Effect of specific exercise-based football injury prevention programmes on the overall injury rate in football: a systematic review and meta-analysis of the FIFA 11 and 11+ programmes. British Journal of Sports Medicine, 51(7), 562-571.', url: 'https://doi.org/10.1136/bjsports-2016-097066' },
    { n: 39, text: 'Frobell, R. B., Roos, H. P., Roos, E. M., Roemer, F. W., Ranstam, J., & Lohmander, L. S. (2013). Treatment for acute anterior cruciate ligament tear: five year outcome of randomised trial. BMJ, 346, f232.', url: 'https://doi.org/10.1136/bmj.f232' },
  ],
  keywords: ['軟骨', 'cartilage', '膝', 'マイクロフラクチャー'],
}

const mcl: DiseaseGuide = {
  key: 'knee_mcl_injury',
  status: 'draft',
  updatedOn: '2026-11-20',
  lead: '膝の内側の側副靱帯（MCL）の損傷。男子プロサッカーで最も多い膝の怪我で、多くは手術なしで治る [1]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `ヨーロッパのプロ 27 チームを 11 シーズン追った研究では、346 件の MCL 損傷が記録されました。膝の怪我では最も多く、全ての怪我の 4% を占めていました [1]。

発生率は試合中が 1000 時間あたり 1.31 件で、練習中の 0.14 件の約 9 倍でした。約 70% が接触による損傷で、離脱日数の中央値は接触ありでも接触なしでも 16 日でした [1]。

このページは膝の内側の側副靱帯について書いています。外側の側副靱帯は含めていません。`,
    },
    {
      id: 'anatomy',
      title: '解剖',
      body: `膝の内側には、浅層の内側側副靱帯（sMCL）、深層の内側側副靱帯（dMCL）、後斜靱帯（POL）があります [2]。

浅層の MCL は、膝が内側に入る（外反）力を止める主な靱帯です。深層の MCL は関節包が厚くなったもので、半月板と大腿骨をつなぐ部分と、半月板とすねの骨をつなぐ部分に分かれます [2]。`,
    },
    {
      id: 'classification',
      title: '分類と重症度',
      body: `MCL の怪我には、見るものの違う分類がいくつかあります。

**AMA の分類**: 膝を 30 度曲げて外側から押したとき、内側の関節の隙間が開く量で分けます。3〜5mm を I 度、6〜10mm を II 度、10mm を超えると III 度とします。徒手の診察だけで決められます [4][5]。

**Fetto と Marshall の分類（1978）**: どの角度で開くかで分けます。I 度は押すと痛いが 0 度でも 30 度でもぐらつかない、II 度は 30 度ではぐらつくが伸ばしきると安定、III 度は両方でぐらつく、です [6]。伸ばしきっても開くのは、MCL 以外の構造も傷ついている印です。この論文では III 度の約 80% に他の靱帯の損傷がありました [6]。UEFA の研究もこの方法で段階を決めています [3]。

**ストレス X 線**: 屍体の膝で調べた研究では、膝を 20 度曲げて押したときの開きが反対側より 3.2mm を超えると浅層 MCL の完全断裂、9.8mm を超えると内側の支持組織全体の損傷を示しました [7]。

**MRI**: 次の三つの段階に分けられます [3]。

- **I 度**: むくみや出血はあるが、線維は切れていない
- **II 度**: 一部の線維が切れているが、残っている線維もある
- **III 度**: 完全に切れている、または付着部から剥がれている

UEFA の研究では、MRI の段階と診察での段階はほぼ完全に一致していました [3]。一方で、MRI の所見の現れ方にはばらつきがあり、MRI の段階分けは MCL の損傷の分類として正確でない可能性がある、とする研究もあります [8]。

**場所**: 太ももの骨側の付着部の損傷は治りやすく、すねの骨側の損傷は治りにくく、ゆるさが残りやすいとされます。切れた端が鵞足の腱の上にめくれ返ったもの（Stener 様の病変）は、手術しないと治りません [9]。

MCL だけの損傷は、段階を問わず手術しない治療の成績が良いとされます [4][5]。

${MAPPING_NOTE}`,
    },
    {
      id: 'rehab',
      title: '復帰までの目安',
      body: `UEFA の 3 シーズン・130 件の研究では、離脱の平均は 24 日でした [3]。II 度の損傷では、膝を固定する装具を使った選手の離脱が平均 42 日で、使わなかった選手の 32 日より長くなっていました [3]。

130 件のうち 11 件（8.5%）は、復帰から 2 か月以内に同じ膝の MCL を再び痛めた再受傷でした [3]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
  ],
  sources: [
    { n: 1, text: 'Lundblad M, et al. The UEFA injury study: 11-year data concerning 346 MCL injuries and time to return to play. Br J Sports Med. 2013;47(12):759–762.', url: 'https://bjsm.bmj.com/content/47/12/759.abstract' },
    { n: 2, text: 'LaPrade RF, et al. The anatomy of the medial part of the knee. J Bone Joint Surg Am. 2007;89(9):2000–2010.', url: 'https://typeset.io/pdf/the-anatomy-of-the-medial-part-of-the-knee-5bs1ku1dew.pdf' },
    { n: 4, text: 'Chen L, Kim PD, Ahmad CS, Levine WN. Medial collateral ligament injuries of the knee: current treatment concepts. Curr Rev Musculoskelet Med. 2008;1(2):108–113.', url: 'https://doi.org/10.1007/s12178-007-9016-x' },
    { n: 5, text: 'Encinas-Ullán CA, Rodríguez-Merchán EC. Isolated medial collateral ligament tears: an update on management. EFORT Open Rev. 2018;3(7):398–407.', url: 'https://doi.org/10.1302/2058-5241.3.170035' },
    { n: 6, text: 'Fetto JF, Marshall JL. Medial collateral ligament injuries of the knee: a rationale for treatment. Clin Orthop Relat Res. 1978;132:206–218.', url: 'https://doi.org/10.1097/00003086-197805000-00038' },
    { n: 7, text: 'LaPrade RF, et al. Correlation of valgus stress radiographs with medial knee ligament injuries: an in vitro biomechanical study. Am J Sports Med. 2010;38(2):330–338.', url: 'https://doi.org/10.1177/0363546509349347' },
    { n: 8, text: 'Schweitzer ME, et al. Medial collateral ligament injuries: evaluation of multiple signs, prevalence and location of associated bone bruises, and assessment with MR imaging. Radiology. 1995;194(3):825–829.', url: 'https://doi.org/10.1148/radiology.194.3.7862987' },
    { n: 9, text: 'Wijdicks CA, et al. Injuries to the medial collateral ligament and associated medial structures of the knee. J Bone Joint Surg Am. 2010;92(5):1266–1280.', url: 'https://doi.org/10.2106/JBJS.I.01229' },
    { n: 3, text: 'Lundblad M, et al. Medial collateral ligament injuries of the knee in male professional football players: a prospective three-season study of 130 cases from the UEFA Elite Club Injury Study. Knee Surg Sports Traumatol Arthrosc. 2019;27(11):3692–3698.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6800843/' },
  ],
  keywords: ['側副靱帯', '側副靭帯', 'MCL', '膝'],
  quelle: ['research-0042'],
}

/* 足首の二つ（前距腓靱帯・足関節側副靱帯）で共通の出典 */
const ANKLE_SOURCES = {
  doherty: { text: 'Doherty C, et al. The incidence and prevalence of ankle sprain injury: a systematic review and meta-analysis of prospective epidemiological studies. Sports Med. 2014;44(1):123–140.', url: 'https://link.springer.com/doi/10.1007/s40279-013-0102-5' },
  attarian: { text: 'Attarian DE, et al. Biomechanical characteristics of human ankle ligaments. Foot Ankle. 1985;6(2):54–58.', url: 'https://www.qxmd.com/r/4065775' },
  vanDijk: { text: 'van Dijk CN, et al. Physical examination is sufficient for the diagnosis of sprained ankles. J Bone Joint Surg Br. 1996;78(6):958–962.', url: 'https://pubmed.ncbi.nlm.nih.gov/8951015/' },
  dhooghe: { text: 'D’Hooghe P, Cruz F, Alkhelaifi K. Return to play after a lateral ligament ankle sprain. Curr Rev Musculoskelet Med. 2020;13(3):281–288.', url: 'https://link.springer.com/doi/10.1007/s12178-020-09631-1' },
  vuurberg: { text: 'Vuurberg G, et al. Diagnosis, treatment and prevention of ankle sprains: update of an evidence-based clinical guideline. Br J Sports Med. 2018;52(15):956.', url: 'https://pubmed.ncbi.nlm.nih.gov/29514819/' },
  lacerda: { text: 'Lacerda D, et al. Current concept review: state of acute lateral ankle injury classification systems. J Foot Ankle Surg. 2023;62(1):197–203.', url: 'https://doi.org/10.1053/j.jfas.2022.08.005' },
  malli06: { text: 'Malliaropoulos N, Papacostas E, Papalada A, Maffulli N. Acute lateral ankle sprains in track and field athletes: an expanded classification. Foot Ankle Clin. 2006;11(3):497–507.', url: 'https://doi.org/10.1016/j.fcl.2006.05.004' },
  malli09: { text: 'Malliaropoulos N, et al. Reinjury after acute lateral ankle sprains in elite track and field athletes. Am J Sports Med. 2009;37(9):1755–1761.', url: 'https://doi.org/10.1177/0363546509338107' },
  vanRijn: { text: 'van Rijn RM, et al. What is the clinical course of acute ankle sprains? A systematic literature review. Am J Med. 2008;121(4):324–331.e6.', url: 'https://doi.org/10.1016/j.amjmed.2007.11.018' },
  roast: { text: 'Delahunt E, et al. Clinical assessment of acute lateral ankle sprain injuries (ROAST): 2019 consensus statement and recommendations of the International Ankle Consortium. Br J Sports Med. 2018;52(20):1304–1310.', url: 'https://doi.org/10.1136/bjsports-2017-098885' },
  caiCriteria: { text: 'Gribble PA, et al. Selection criteria for patients with chronic ankle instability in controlled research: a position statement of the International Ankle Consortium. J Athl Train. 2014;49(1):121–127.', url: 'https://doi.org/10.4085/1062-6050-49.1.14' },
  gribble: { text: 'Gribble PA, et al. 2016 consensus statement of the International Ankle Consortium: prevalence, impact and long-term consequences of lateral ankle sprains. Br J Sports Med. 2016.', url: 'https://bjsm.bmj.com/content/early/2016/06/03/bjsports-2016-096189.full.pdf' },
}

const ANKLE_CARE = (n: { vanDijk: number; vuurberg: number; gribble: number; vanRijn: number; caiCriteria: number }) => ({
  assessment: `靱帯がどれだけ傷ついているかは、受傷の直後より数日たってからの方が正しく分かります。足首を捻った 160 人の研究では、受傷 5 日後の診察で、靱帯の断裂を見つける感度が 96%、特異度が 84% でした [${n.vanDijk}]。経験の少ない人でも、48 時間以内より 5 日後の診察の方が正確でした [${n.vanDijk}]。`,
  rehab: `2018 年の診療ガイドラインでは、外側の靱帯が切れた急性の捻挫には、ギプスなどで固定するよりテーピングか装具を使うことを勧めています [${n.vuurberg}]。治療は、受け身の物理療法より、指導のもとで行う運動のプログラムを中心にします。手術は、運動を中心にした治療を十分に行っても良くならない場合に限ります [${n.vuurberg}]。痛み止め（NSAIDs）は痛みと腫れを和らげますが、自然な治りを遅らせるおそれがあり、使い方に注意が要ります [${n.vuurberg}]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
  prevention: `足首の捻挫は再発が多く、捻挫した人の多くが慢性足関節不安定症（足首がぐらつく、何度も捻る状態）に移っていくと、国際足関節コンソーシアムの合意声明は述べています [${n.gribble}]。急性の捻挫の経過をまとめたレビューでは、痛みと腫れは最初の 2 週間で速く良くなる一方、1 年後も 5〜33% が痛みを訴え、3 年後までに 33% が再び捻挫していました [${n.vanRijn}]。

慢性足関節不安定症は、急性の怪我の段階とは別の状態として扱われます。研究の対象者を選ぶ基準では、最初の大きな捻挫から 12 か月以上たっていること、足首が抜ける感じや不安定感・捻挫の繰り返しがあること、質問票で機能の低下が確かめられること、を条件にしています [${n.caiCriteria}]。

再発の予防には、装具が有効な選択肢として挙げられています [${n.vuurberg}]。`,
})

const atfl: DiseaseGuide = {
  key: 'atfl_injury',
  status: 'draft',
  updatedOn: '2026-11-20',
  quelle: ['research-0052', 'research-0041'],
  lead: '足首の外側にある前距腓靱帯の損傷。足首の捻挫で最も多く傷つく靱帯で、離脱は短いことが多い一方、再発と慢性の不安定感が残りやすい [1][2]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `疫学の研究の多くは「前距腓靱帯の損傷」ではなく「足首の捻挫」や「外側の靱帯の損傷」として数えています。前距腓靱帯は外側の靱帯で最も傷つきやすいので、外側の捻挫の数字がおおよその目安になりますが、同じものではありません。

前向きの研究 181 本のメタ分析では、捻挫の発生率は女性が 1000 回の参加あたり 13.6 件で、男性の 6.94 件より高くなっていました [3]。男子プロサッカー（欧州の 27 チーム、11 シーズン）では、足首の怪我が全ての怪我の 13% を占め、その 51% が外側の靱帯の捻挫でした [4]。試合中の捻挫の 40% には、審判がファウルと判定した接触がありました [4]。

離脱の長さは、UEFA のエリートクラブ傷害研究（男子）で中央値 8 日、平均 14.9 日、再受傷率 13.7% でした [2]。女子のエリートクラブでは中央値 12.5 日、平均 21.4 日でした [5]。ドイツのプロクラブの研究では、アカデミー（U17〜U23）の選手はトップチームより離脱が長くなっていました（平均 33.0 日と 15.5 日）[6]。

MRI を撮ったアスリート 261 足の研究では、前距腓靱帯の完全な断裂が 39.5%、脛腓靱帯結合の損傷が 20.3%、距骨の軟骨の損傷が 7.7% にありました [7]。MRI が必要と判断された例なので、捻挫全体より重い方に偏っています。`,
    },
    {
      id: 'anatomy',
      title: '解剖と働き',
      body: `- **大きさと付着部**：屍体の研究 16 本をまとめると、前距腓靱帯の長さは 12〜24.8 mm、幅は 5〜11.1 mm と報告されています [8]。研究ごとに測り方が違い、決まった標準値はありません。
- **束の数**：81 肢の解剖では、1 束が 33%、2 束が 57%、3 束が 10% でした [9]。全ての標本で 2 束だったという研究もあり [10]、一致していません。
- **上の束と下の束**：上の束は関節包の中にあり、足首を下に向けると伸びます。下の束は踵腓靱帯とつながっていて、足首の角度で長さが変わりません [10]。関節の中にある上の束は切れた後に治りにくいのではないか、という仮説がありますが、確かめられてはいません [10]。
- **張る向き**：前距腓靱帯は、足首を下に向け（底屈）、内に返し、内にひねるほど引き伸ばされます [11]。小さな計測器を付けた屍体の研究では、底屈 20° あたりから張り始めました [12]。`,
    },
    {
      id: 'healing',
      title: '治り方',
      body: `人の前距腓靱帯が組織としてどう治っていくかを、直接調べた研究は見つかっていません。分かっているのは、緩さや不安定感といった間接的な目安です。

- 急性の捻挫の後、靱帯の緩さは受傷後 6 週から 1 年にかけて良くなりました。それでも 6 か月後に 3〜31% で前方引き出しテストが陽性で、1 年までに 7〜42% が不安定感を訴えていました [13]。
- 急性の捻挫 16 人と健康な 16 人を比べた研究では、捻挫した人の足首の緩さは、受傷 3 日後も 8 週後も健康な人より大きいままでした [14]。
- 超音波で距骨と腓骨のずれを測った研究では、健側と同じに戻るまでの推定日数は I 度で 14.5 日、II 度で 43.2 日、III 度で 45.6 日でした [15]。回帰式からの推定です。
- 超音波で見た靱帯の厚さは時間とともに元に戻っていきましたが、機能の回復とは関係がありませんでした [16]。画像の見た目は、治ったかどうかの目安としては確かめられていません。`,
    },
    {
      id: 'mechanism',
      title: '受傷のしかたと危険因子',
      body: `ノルウェーとアイスランドのトップリーグの試合映像の分析では、サッカーに多い形が二つ見つかりました。着地の直前か瞬間に相手が脚の内側に当たって、足首が内に返った形で着地するものと、シュートやクリアで相手の足を蹴って足首が強く下に曲げられるものです [17]。捻挫の瞬間の動きを測った報告 24 例をまとめると、共通していたのは強い内返しでした [18]。

危険因子については、研究によって結果が分かれています。

- **捻挫の既往**：アマチュアの男子サッカー選手 508 人では、過去の足首の怪我が 1 回増えるごとに危険が高くなりました（オッズ比 1.23）[19]。一方、スウェーデンのトップリーグでは、前のシーズンの足首の捻挫は次のシーズンの捻挫と関係がありませんでした [20]。
- **バランス**：高校のバスケットボール選手では、片脚立ちのふらつきが大きいほど捻挫が多くなりました [21]。ところが、上のサッカー選手の研究では、バランスのテストで危険の高い選手を見分けられませんでした [19]。

どのテストも、一人ひとりの選手の受傷を高い精度で予測できるとは示されていません。`,
    },
    {
      id: 'assessment',
      title: '評価',
      body: `- **受傷 5 日後の診察**：足首をひねった 160 人の研究で、受傷 5 日後の診察は靱帯の断裂を感度 96%、特異度 84% で見つけました。経験の少ない人では、48 時間以内より 5 日後の方が正確でした [22]。
- **一つひとつの検査**：診察の検査をまとめたメタ分析では、前距腓靱帯の圧痛は感度が高い（95〜100%）けれど特異度は低く（0〜32%）、前方引き出しテストは感度 54%、特異度 87% でした [23]。圧痛が無ければ損傷は考えにくく、前方引き出しテストが陽性なら損傷を疑う、という組み合わせで使います。前方引き出しテストが陰性でも、損傷は否定できません [23]。
- **画像**：MRI と超音波の精度はメタ分析どうしで結果が食い違っていて、どちらが優れているかは決まっていません [24][25]。
- **骨折を除く**：Ottawa ankle rules は骨折を除くための決まりで、陰性なら骨折の可能性はかなり低くなります [26]。靱帯の損傷の有無や重さは判定しません。
- **一緒に起きる損傷**：外側の靱帯が完全に切れた足首では、距骨の骨挫傷が 3.43 倍、三角靱帯の損傷が 4.04 倍多く見つかりました [7]。`,
    },
    {
      id: 'classification',
      title: '分類',
      body: `よく使われるのは I〜III 度の三段階で、伸びただけ（I 度）、部分断裂（II 度）、完全断裂（III 度）に分けます。何で判定するか（診察、超音波、MRI）は研究によって違います [6]。

ドイツのプロ選手とアカデミーの選手では、離脱は I 度で 14.7 日、II 度で 39.2 日、III 度で 50.5 日でした。I 度と II・III 度の間には差がありましたが、II 度と III 度の差ははっきりしませんでした [6]。上の超音波の研究でも同じ傾向でした [15]。部分断裂と完全断裂の区別は、回復の長さをあまり分けない可能性があります。

重さが再発や慢性の不安定感を予測するかは、研究によって結果が分かれ、分類そのものの妥当性にも疑問が示されています [27]。重さに応じて治療を変えることが良いと確かめた研究はありません。

${MAPPING_NOTE}足首の外側の靱帯全体については「足関節側副靭帯損傷」のページも見てください。`,
    },
    {
      id: 'treatment',
      title: '治療の選択',
      body: `- **固定と機能的な治療**：急性の外側の靱帯の断裂の試験 27 本のメタ分析（2000 年）では、6 週間のギプス固定より、動かしながら治す機能的な治療の方が、足首が抜ける感じ（相対リスク 0.69）と残る痛み（0.67）が少なくなりました。何も治療しない方針は、機能的な治療より症状が残りました [28]。
- **手術と手術をしない治療**：同じメタ分析は手術の方が良いとしましたが [28]、Cochrane のレビュー（20 試験、2,562 人）では、解析の方法を変えると手術の利点は保たれず、判断するには証拠が足りないと結論しました。手術の方が回復に時間がかかり、こわばりや合併症が多いという報告もあります [29]。
- **短い固定**：重い捻挫 584 人の無作為化試験では、10 日間の膝下のギプスは圧迫包帯だけより回復が早くなりました。9 か月後には差がありませんでした [30]。「固定は避けるべき」とは単純には言えません。
- **ガイドライン**：2018 年のオランダのガイドラインは、テーピングか装具と運動療法の組み合わせを勧め、手術は運動を中心にした治療で良くならない場合に限るとしています [31]。

サッカー選手やトップの選手に限って治療法を比べた無作為化試験はありません。`,
    },
    {
      id: 'rtp',
      title: '復帰と再発',
      body: `男子プロサッカーの研究 12 本をまとめた系統的レビューでは、外側の捻挫の離脱は平均 15 日、再発率は 17.1% でした [32]。ドイツのプロクラブとアカデミーの研究では、12 か月の追跡で再発率は 25.6% で、再発の半分以上は初回から 2〜12 か月後に起きていました [6]。再発した選手は初回の離脱が短かった、という観察もありますが、離脱を長くすれば再発が減るかは確かめられていません [6]。

慢性足関節不安定症に対して靱帯を修復・再建した手術の後は、受傷前のレベルに戻ったのが 83%、復帰まで平均 12.5 週でした（25 論文、1,384 人）[33]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
    {
      id: 'prevention',
      title: '長期の経過と予防',
      body: `急性の外側の捻挫の経過をまとめたレビューでは、痛みは最初の 2 週間で速く良くなる一方、1 年後も 5〜33% が痛みを訴え、再捻挫は 3〜34% でした [34]。何割が慢性になるかという一つの数字は決まっていません。初めて捻挫した 82 人の研究では、受傷 2 週の時点で片脚の着地と垂直跳びができないことが、12 か月後の慢性足関節不安定症を予測しました。ただし特異度は 55% で、慢性にならない人の多くも「危ない」と判定されます [35]。

末期の足関節症の人を過去にさかのぼった研究では、靱帯の怪我が原因と考えられる 30 人の 85% が外側の靱帯の損傷で、怪我から足関節症まで平均 34 年でした [36]。捻挫した人のうち何割が足関節症になるかは分かっていません。

再発の予防には、次の結果があります。

- **バランスのトレーニング**：捻挫したアスリート 522 人で、8 週間の自宅でのトレーニングを加えると、1 年間の再捻挫が 33% から 22% に減りました（相対リスク 0.63）[37]。
- **装具**：高校のバスケットボール選手 1,460 人で、紐で締める装具は足首の怪我を減らしました（ハザード比 0.32）。既往のある選手でも、無い選手でも減りましたが、怪我をしたときの重さは変わりませんでした [38]。捻挫したアスリートでは、装具の方がトレーニングより再捻挫が少なくなりました [39]。
- **効果が出なかった試験**：既往のある男子サッカー選手に、足首などに的を絞った運動を割り付けた試験では、怪我は減りませんでした。足首のプログラムを決められた量やったのは 27.5% だけでした [40]。

トップレベルのサッカー選手に限った予防の無作為化試験はありません。`,
    },
  ],
  sources: [
    { n: 1, text: 'Attarian DE, et al. Biomechanical characteristics of human ankle ligaments. Foot Ankle. 1985;6(2):54–58.', url: 'https://www.qxmd.com/r/4065775' },
    { n: 2, text: 'Ekstrand, J., Krutsch, W., Spreco, A., et al. (2020). Time before return to play for the most common injuries in professional football: a 16-year follow-up of the UEFA Elite Club Injury Study. British Journal of Sports Medicine, 54(7), 421-426.', url: 'https://doi.org/10.1136/bjsports-2019-100666' },
    { n: 3, text: 'Doherty, C., Delahunt, E., Caulfield, B., Hertel, J., Ryan, J., & Bleakley, C. (2014). The incidence and prevalence of ankle sprain injury: a systematic review and meta-analysis of prospective epidemiological studies. Sports Medicine, 44(1), 123-140.', url: 'https://doi.org/10.1007/s40279-013-0102-5' },
    { n: 4, text: 'Waldén, M., Hägglund, M., & Ekstrand, J. (2013). Time-trends and circumstances surrounding ankle injuries in men\'s professional football: an 11-year follow-up of the UEFA Champions League injury study. British Journal of Sports Medicine, 47(12), 748-753.', url: 'https://doi.org/10.1136/bjsports-2013-092223' },
    { n: 5, text: 'Ekstrand, J., Roos, V., Hallén, A., Okholm Kryger, K., & Bengtsson, H. (2025). Return to play time for the 30 most common injuries in the UEFA Women\'s Elite Club Injury Study. BMJ Open Sport & Exercise Medicine, 11(4), e002724.', url: 'https://doi.org/10.1136/bmjsem-2025-002724' },
    { n: 6, text: 'Flore, Z., Hambly, K., De Coninck, K., & Welsch, G. (2025). Time-loss and recurrence rate of lateral ankle sprains in male professional football players depending on the severity grade: do we trivialise LAS?. BMJ Open Sport & Exercise Medicine, 11(1), e002271.', url: 'https://doi.org/10.1136/bmjsem-2024-002271' },
    { n: 7, text: 'Roemer, F. W., Jomaah, N., Niu, J., Almusa, E., Roger, B., D\'Hooghe, P., et al. (2014). Ligamentous injuries and the risk of associated tissue damage in acute ankle sprains in athletes: a cross-sectional MRI study. American Journal of Sports Medicine, 42(7), 1549-1557.', url: 'https://doi.org/10.1177/0363546514529643' },
    { n: 8, text: 'Matsui, K., Takao, M., Tochigi, Y., Ozeki, S., & Glazebrook, M. (2017). Anatomy of anterior talofibular ligament and calcaneofibular ligament for minimally invasive surgery: a systematic review. Knee Surgery, Sports Traumatology, Arthroscopy, 25(6), 1892-1902.', url: 'https://doi.org/10.1007/s00167-016-4194-y' },
    { n: 9, text: 'Edama, M., Kageyama, I., Kikumoto, T., Nakamura, M., Ito, W., Nakamura, E., et al. (2018). Morphological features of the anterior talofibular ligament by the number of fiber bundles. Annals of Anatomy, 216, 69-74.', url: 'https://doi.org/10.1016/j.aanat.2017.11.001' },
    { n: 10, text: 'Vega, J., Malagelada, F., Manzanares Céspedes, M. C., & Dalmau-Pastor, M. (2020). The lateral fibulotalocalcaneal ligament complex: an ankle stabilizing isometric structure. Knee Surgery, Sports Traumatology, Arthroscopy, 28(1), 8-17.', url: 'https://doi.org/10.1007/s00167-018-5188-8' },
    { n: 11, text: 'Colville, M. R., Marder, R. A., Boyle, J. J., & Zarins, B. (1990). Strain measurement in lateral ankle ligaments. American Journal of Sports Medicine, 18(2), 196-200.', url: 'https://doi.org/10.1177/036354659001800214' },
    { n: 12, text: 'Takeuchi, Y., Inokuchi, R., Takao, M., Glazebrook, M., Martin Oliva, X., Yamazaki, T., et al. (2021). Three-dimensional analysis of anterior talofibular ligament strain patterns during cadaveric ankle motion using a miniaturized ligament performance probe. BMC Musculoskeletal Disorders, 22(1), 208.', url: 'https://doi.org/10.1186/s12891-021-04058-2' },
    { n: 13, text: 'Hubbard, T. J., & Hicks-Little, C. A. (2008). Ankle ligament healing after an acute ankle sprain: an evidence-based approach. Journal of Athletic Training, 43(5), 523-529.', url: 'https://doi.org/10.4085/1062-6050-43.5.523' },
    { n: 14, text: 'Hubbard, T. J., & Cordova, M. (2009). Mechanical instability after an acute lateral ankle sprain. Archives of Physical Medicine and Rehabilitation, 90(7), 1142-1146.', url: 'https://doi.org/10.1016/j.apmr.2009.01.020' },
    { n: 15, text: 'Uchida, Y., Kawabata, M., Kumazawa, Y., Takagi, K., Miyatake, K., Kobayashi, T., et al. (2025). Severity-dependent recovery time in acute lateral ankle sprains: an ultrasonographic assessment of talofibular displacement. Journal of Experimental Orthopaedics, 12(1), e70204.', url: 'https://doi.org/10.1002/jeo2.70204' },
    { n: 16, text: 'Wi, S. M., Kim, D. H., Kim, S. H., & Shin, S. J. (2026). Ultrasonographic anterior talofibular ligament thickness does not predict functional outcomes after acute lateral ankle sprain. Journal of Foot and Ankle Research, 19(3), e70187.', url: 'https://doi.org/10.1002/jfa2.70187' },
    { n: 17, text: 'Andersen, T. E., Floerenes, T. W., Arnason, A., & Bahr, R. (2004). Video analysis of the mechanisms for ankle injuries in football. American Journal of Sports Medicine, 32(1 Suppl), 69S-79S.', url: 'https://doi.org/10.1177/0363546503262023' },
    { n: 18, text: 'Lysdal, F. G., Wang, Y., Delahunt, E., Gehring, D., Kosik, K. B., Krosshaug, T., et al. (2022). What have we learnt from quantitative case reports of acute lateral ankle sprains injuries and episodes of \'giving-way\' of the ankle joint, and what shall we further investigate?. Sports Biomechanics, 21(4), 359-379.', url: 'https://doi.org/10.1080/14763141.2022.2035801' },
    { n: 19, text: 'Engebretsen, A. H., Myklebust, G., Holme, I., Engebretsen, L., & Bahr, R. (2010). Intrinsic risk factors for acute ankle injuries among male soccer players: a prospective cohort study. Scandinavian Journal of Medicine & Science in Sports, 20(3), 403-410.', url: 'https://doi.org/10.1111/j.1600-0838.2009.00971.x' },
    { n: 20, text: 'Hägglund, M., Waldén, M., & Ekstrand, J. (2006). Previous injury as a risk factor for injury in elite football: a prospective study over two consecutive seasons. British Journal of Sports Medicine, 40(9), 767-772.', url: 'https://doi.org/10.1136/bjsm.2006.026609' },
    { n: 21, text: 'McGuine, T. A., Greene, J. J., Best, T., & Leverson, G. (2000). Balance as a predictor of ankle injuries in high school basketball players. Clinical Journal of Sport Medicine, 10(4), 239-244.', url: 'https://doi.org/10.1097/00042752-200010000-00003' },
    { n: 22, text: 'van Dijk, C. N., Lim, L. S., Bossuyt, P. M., & Marti, R. K. (1996). Physical examination is sufficient for the diagnosis of sprained ankles. Journal of Bone and Joint Surgery. British Volume, 78(6), 958-962.', url: 'https://doi.org/10.1302/0301-620x78b6.1283' },
    { n: 23, text: 'Netterström-Wedin, F., Matthews, M., & Bleakley, C. (2022). Diagnostic accuracy of clinical tests assessing ligamentous injury of the talocrural and subtalar joints: a systematic review with meta-analysis. Sports Health, 14(3), 336-347.', url: 'https://doi.org/10.1177/19417381211029953' },
    { n: 24, text: 'Barini, M., Zagaria, D., Licandro, D., Pansini, S., Airoldi, C., Leigheb, M., & Carriero, A. (2021). Magnetic resonance accuracy in the diagnosis of anterior talo-fibular ligament acute injury: a systematic review and meta-analysis. Diagnostics, 11(10), 1782.', url: 'https://doi.org/10.3390/diagnostics11101782' },
    { n: 25, text: 'Colò, G., Bignotti, B., Costa, G., Signori, A., & Tagliafico, A. S. (2023). Ultrasound or MRI in the evaluation of anterior talofibular ligament (ATFL) injuries: systematic review and meta-analysis. Diagnostics, 13(14), 2324.', url: 'https://doi.org/10.3390/diagnostics13142324' },
    { n: 26, text: 'Bachmann, L. M., Kolb, E., Koller, M. T., Steurer, J., & ter Riet, G. (2003). Accuracy of Ottawa ankle rules to exclude fractures of the ankle and mid-foot: systematic review. BMJ, 326(7386), 417.', url: 'https://doi.org/10.1136/bmj.326.7386.417' },
    { n: 27, text: 'Pourkazemi, F., Hiller, C. E., Raymond, J., Nightingale, E. J., & Refshauge, K. M. (2014). Predictors of chronic ankle instability after an index lateral ankle sprain: a systematic review. Journal of Science and Medicine in Sport, 17(6), 568-573.', url: 'https://doi.org/10.1016/j.jsams.2014.01.005' },
    { n: 28, text: 'Pijnenburg, A. C., Van Dijk, C. N., Bossuyt, P. M., & Marti, R. K. (2000). Treatment of ruptures of the lateral ankle ligaments: a meta-analysis. The Journal of Bone and Joint Surgery-American Volume, 82(6), 761-773.', url: 'https://doi.org/10.2106/00004623-200006000-00002' },
    { n: 29, text: 'Kerkhoffs, G. M., Handoll, H. H., de Bie, R., Rowe, B. H., & Struijs, P. A. (2007). Surgical versus conservative treatment for acute injuries of the lateral ligament complex of the ankle in adults. Cochrane Database of Systematic Reviews, (2), CD000380.', url: 'https://doi.org/10.1002/14651858.CD000380.pub2' },
    { n: 30, text: 'Lamb, S. E., Marsh, J. L., Hutton, J. L., Nakash, R., Cooke, M. W., & Collaborative Ankle Support Trial (CAST Group). (2009). Mechanical supports for acute, severe ankle sprain: a pragmatic, multicentre, randomised controlled trial. Lancet, 373(9663), 575-581.', url: 'https://doi.org/10.1016/S0140-6736(09)60206-3' },
    { n: 31, text: 'Vuurberg, G., Hoorntje, A., Wink, L. M., van der Doelen, B. F. W., van den Bekerom, M. P., Dekker, R., et al. (2018). Diagnosis, treatment and prevention of ankle sprains: update of an evidence-based clinical guideline. British Journal of Sports Medicine, 52(15), 956.', url: 'https://doi.org/10.1136/bjsports-2017-098106' },
    { n: 32, text: 'Flore, Z., Hambly, K., De Coninck, K., & Welsch, G. (2022). Time-loss and recurrence of lateral ligament ankle sprains in male elite football: a systematic review and meta-analysis. Scandinavian Journal of Medicine & Science in Sports, 32(12), 1690-1709.', url: 'https://doi.org/10.1111/sms.14217' },
    { n: 33, text: 'Li, Y., Su, T., Hu, Y., Jiao, C., Guo, Q., Jiang, Y., & Jiang, D. (2024). Return to sport after anatomic lateral ankle stabilization surgery for chronic ankle instability: a systematic review and meta-analysis. American Journal of Sports Medicine, 52(2), 555-566.', url: 'https://doi.org/10.1177/03635465231170699' },
    { n: 34, text: 'van Rijn, R. M., van Os, A. G., Bernsen, R. M., Luijsterburg, P. A., Koes, B. W., & Bierma-Zeinstra, S. M. (2008). What is the clinical course of acute ankle sprains? A systematic literature review. American Journal of Medicine, 121(4), 324-331.e6.', url: 'https://doi.org/10.1016/j.amjmed.2007.11.018' },
    { n: 35, text: 'Doherty, C., Bleakley, C., Hertel, J., Caulfield, B., Ryan, J., & Delahunt, E. (2016). Recovery from a first-time lateral ankle sprain and the predictors of chronic ankle instability: a prospective cohort analysis. American Journal of Sports Medicine, 44(4), 995-1003.', url: 'https://doi.org/10.1177/0363546516628870' },
    { n: 36, text: 'Valderrabano, V., Hintermann, B., Horisberger, M., & Fung, T. S. (2006). Ligamentous posttraumatic ankle osteoarthritis. American Journal of Sports Medicine, 34(4), 612-620.', url: 'https://doi.org/10.1177/0363546505281813' },
    { n: 37, text: 'Hupperets, M. D., Verhagen, E. A., & van Mechelen, W. (2009). Effect of unsupervised home based proprioceptive training on recurrences of ankle sprain: randomised controlled trial. BMJ, 339, b2684.', url: 'https://doi.org/10.1136/bmj.b2684' },
    { n: 38, text: 'McGuine, T. A., Brooks, A., & Hetzel, S. (2011). The effect of lace-up ankle braces on injury rates in high school basketball players. American Journal of Sports Medicine, 39(9), 1840-1848.', url: 'https://doi.org/10.1177/0363546511406242' },
    { n: 39, text: 'Janssen, K. W., van Mechelen, W., & Verhagen, E. A. (2014). Bracing superior to neuromuscular training for the prevention of self-reported recurrent ankle sprains: a three-arm randomised controlled trial. British Journal of Sports Medicine, 48(16), 1235-1239.', url: 'https://doi.org/10.1136/bjsports-2013-092947' },
    { n: 40, text: 'Engebretsen, A. H., Myklebust, G., Holme, I., Engebretsen, L., & Bahr, R. (2008). Prevention of injuries among male soccer players: a prospective, randomized intervention study targeting players with previous injuries or reduced function. American Journal of Sports Medicine, 36(6), 1052-1060.', url: 'https://doi.org/10.1177/0363546508314432' },
  ],
  keywords: ['前距腓', '足関節', '足首', '捻挫', 'ATFL', 'ankle'],
}

const ankleLateral: DiseaseGuide = (() => {
  const care = ANKLE_CARE({ vanDijk: 3, vuurberg: 5, gribble: 6, vanRijn: 10, caiCriteria: 12 })
  return {
    key: 'ankle_lateral_ligament_injury',
    status: 'draft',
    updatedOn: '2026-11-20',
    lead: '足首の外側の靱帯（前距腓靱帯・踵腓靱帯・後距腓靱帯）の損傷。いわゆる足首の捻挫で、スポーツで最も多い怪我の一つ [1]。',
    sections: [
      {
        id: 'overview',
        title: 'どんな怪我か',
        body: `前向きの疫学研究 181 本をまとめたメタ分析では、足首の捻挫は外側の捻挫が最も多く、内側の捻挫や脛腓靱帯結合の捻挫（いわゆる高位の捻挫）よりはっきり多くなっていました [1]。発生率は女性が男性より、子どもが大人より高く、屋内やコートの競技で最も高くなっていました [1]。

エリートのサッカー選手では、足首の捻挫の 70〜91% が外側の靱帯の損傷です [4]。

このページは足首の外側の靱帯について書いています。内側の三角靱帯の損傷は含めていません。`,
      },
      {
        id: 'anatomy',
        title: '解剖',
        body: `足首の外側の靱帯は、前距腓靱帯（ATFL）、踵腓靱帯（CFL）、後距腓靱帯（PTFL）の三本です [2]。

三本の中で前距腓靱帯が最も弱く、最も多く傷つきます。内側の深い三角靱帯は最も強く、完全に切れることは最も少ない靱帯です [2]。`,
      },
      { id: 'assessment', title: '評価', body: care.assessment },
      {
        id: 'classification',
        title: '分類',
        body: `足首の捻挫の分類を調べたレビューでは、文献の中で 25 通りの分類が使われていました。多くは三段階で、損傷の解剖、診察所見、機能の低下、不安定性の有無で分けています。ただ、どの分類が治療の方針や予後と合っているかを確かめた研究は一つも見つからず、最も適切な分類は勧められない、と結論しています [7]。

- **慣例の I〜III 度**: 伸びただけ（I 度）、部分断裂（II 度）、完全断裂（III 度）[7]。
- **West Point の分類**: 診察だけで決めます。I 度は助けなしで体重をかけられる、II 度ははっきり足を引きずる、III 度は体重をかけられない、です。I 度で 7〜14 日、II 度で 2〜6 週、III 度で 4〜26 週の休みが目安とされますが、確かめられた予測値ではありません [7]。
- **Malliaropoulos の分類**: III 度をストレス X 線で IIIA と IIIB に分けた四段階です [8]。

ギリシャのエリート陸上選手 202 人を同じリハビリで 24 か月追った研究では、36 人（17.8%）が再び捻挫しました。再受傷は I 度で 14%、II 度で 29%、IIIA 度で 5.6% と、軽い捻挫の方が多くなりました [9]。軽いからといって短く済ませてよいとは限らないということです。

一本の靱帯だけの捻挫か、より複雑な足首の損傷かを見分けることが大切だとされています [4]。国際足関節コンソーシアムの評価の合意（ROAST）は、受傷のしかたを記録し、靱帯を一本ずつ調べるよう勧めています [11]。

${MAPPING_NOTE}このアプリでは「前距腓靭帯損傷」が別の項目になっています。二つの使い分けは清水さんのプロトコルの区分です。`,
      },
      { id: 'rehab', title: 'リハビリと復帰', body: `アスリートの足首の捻挫の多くは手術なしで治療され、受傷前のレベルに戻っています [4]。\n\n${care.rehab}` },
      { id: 'prevention', title: '再発と予防', body: care.prevention },
    ],
    sources: [
      { n: 1, ...ANKLE_SOURCES.doherty },
      { n: 2, ...ANKLE_SOURCES.attarian },
      { n: 3, ...ANKLE_SOURCES.vanDijk },
      { n: 4, ...ANKLE_SOURCES.dhooghe },
      { n: 5, ...ANKLE_SOURCES.vuurberg },
      { n: 6, ...ANKLE_SOURCES.gribble },
      { n: 7, ...ANKLE_SOURCES.lacerda },
      { n: 8, ...ANKLE_SOURCES.malli06 },
      { n: 9, ...ANKLE_SOURCES.malli09 },
      { n: 10, ...ANKLE_SOURCES.vanRijn },
      { n: 11, ...ANKLE_SOURCES.roast },
      { n: 12, ...ANKLE_SOURCES.caiCriteria },
    ],
    keywords: ['足関節', '足首', '捻挫', '側副靱帯', '側副靭帯', 'ankle'],
    quelle: ['research-0041'],
  }
})()

const hernia: DiseaseGuide = {
  key: 'inguinal_hernia',
  status: 'draft',
  updatedOn: '2026-11-20',
  quelle: ['research-0055'],
  lead: '鼠径部の腹壁の弱いところから、お腹の中のものが外に出てくる状態。筋肉や靱帯の怪我と違って自然には治らず、症状がある場合の治療の基本はメッシュを使った手術 [1]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな病気か',
      body: `鼠径ヘルニアは、お腹の中の腸や脂肪が、鼠径管や大腿管を通って外に出てくる状態です [1]。筋肉が切れる怪我ではありません。

国際ガイドライン（HerniaSurge）は、生涯の発生率を男性 27〜43%、女性 3〜6% としています。鼠径ヘルニアは男性に 9〜12 倍多く、約 3 分の 1 は症状がありません [1]。

**サッカー選手で分かっていないこと**：サッカー選手の本当の鼠径ヘルニアの発生率、離脱日数、手術後の復帰日数を前向きに数えた研究は見つかっていません。UEFA やカタールのプロリーグの傷害調査は、鼠径部の怪我を内転筋や腸腰筋などに分けて数えていて、ヘルニアを独立した診断として数えていません [2][3]。傷害調査の「鼠径部の怪我」の数字を、ヘルニアの数字として読むことはできません。

**スポーツヘルニアとの違い**：アスリートの鼠径部痛の中には、鼠径管のあたりが痛むのに、触って分かるヘルニアが無いものがあります。ドーハ合意はこれを「鼠径管に関連した鼠径部痛」と呼び、隠れたヘルニアは無いことで全員が一致しています。本当の鼠径ヘルニアは、これとは別の「その他の原因」に入ります [4]。痛みの原因がヘルニアなのか、内転筋など他の場所なのかで、治療の進め方は変わります（「グロウインペイン症候群」のページも見てください）。`,
    },
    {
      id: 'anatomy',
      title: '解剖と種類',
      body: `- **外鼠径ヘルニア（間接）**：内鼠径輪から出て鼠径管の中を進むもので、閉じきらなかった腹膜の袋（腹膜鞘状突起）を通ると考えられています。頻度はこちらが高く、子どものヘルニアはほぼ全てこの型です [5]。
- **内鼠径ヘルニア（直接）**：Hesselbach 三角の弱くなった横筋筋膜を通って出るものです。修復の後の再発はこちらの方が多くなります [5]。
- **大腿ヘルニア**：鼠径靱帯の下の大腿管を通るもので、修復術の約 2〜4% です [1]。

腹膜の袋が閉じきっていないことは、ヘルニアの無い大人にも珍しくなく、腹腔鏡の手術を受けた 599 人の 12% に見られました [6]。袋があってもヘルニアになるかは、他の要因で決まると考えられています [5]。

**嵌頓と絞扼**：中身が戻らなくなる（嵌頓）、血流が止まる（絞扼）危険があります。病院を受診した 476 例では、鼠径ヘルニアの絞扼の累積の確率は 3 か月で 2.8%、2 年で 4.5% でしたが、大腿ヘルニアでは 3 か月で 22% でした [7]。症状の軽い男性 720 人を追った試験では、急性の嵌頓は 1000 人年あたり 1.8 件とまれでした [8]。ガイドラインは、大腿ヘルニアは症状が無くても様子を見ることを勧めていません [1]。`,
    },
    {
      id: 'course',
      title: '自然の経過',
      body: `鼠径ヘルニアの欠損が自然に閉じることを示した研究は見つかっていません。ガイドラインは、根本的に治すには手術しかなく、症状の無い人の約 70% は 5 年以内に症状が出るとしています [1]。

症状の軽い男性を様子見に割り付けた試験の長期の追跡では、最長 11.5 年で 68% が手術に移りました。理由で最も多かったのは痛みでした [9]。55 歳以上の症状の無い男性の試験では、7.5 年で 72% が手術に移ると推定されました [10]。どちらも中高年の男性の研究で、若い競技者が同じ経過をたどるかは調べられていません。`,
    },
    {
      id: 'mechanism',
      title: '原因と危険因子',
      body: `**一回の強い力み**：重い物を持った瞬間などを原因に挙げる患者は多いですが、系統的レビューでは、事故の記録や直後の診断などの基準を満たしたのは 54 人中 2 人だけでした [11]。一回の強い力みが初めての鼠径ヘルニアのただ一つの原因だという考えは、支持されていません [12]。

**繰り返しの負荷**：デンマークの男性 17,967 人の研究では、1 日 6 時間以上立つ・歩く仕事で外鼠径ヘルニアの手術が増えましたが（ハザード比 1.45）、内鼠径ヘルニアは関係がなく、余暇の運動や喫煙も関係しませんでした [13]。

**示されている危険因子**：ガイドラインが証拠の水準が高いとしているのは、家族歴、男性であること、年齢、コラーゲンの代謝などです [1]。家族歴のある人はヘルニアになる確率が高くなりました（オッズ比 5.3）[14]。

**通説と逆の結果**：太っている人の方が少なく、スウェーデンの男性 7,483 人を最長 34 年追った研究では、BMI が 1 上がるごとに危険が 4% 下がりました。高い身体活動は関係がありませんでした [15]。

スポーツをすること自体が鼠径ヘルニアの危険因子だという前向きの証拠は見つかっていません。ただし、高い強度の競技を続けるサッカー選手を対象にした研究もありません。`,
    },
    {
      id: 'assessment',
      title: '評価',
      body: `ガイドラインは、明らかなヘルニアの診断には病歴と診察で足りるとしています。ある前向きの研究では、診察の感度は 0.745、特異度は 0.963 でした [1]。小さなヘルニアは診察で見逃されることがあります [1]。

- **画像**：診察で分からない隠れたヘルニアについて、超音波で「ある」と言われればその可能性は高い（陽性的中率 85.6%）一方、「無い」と言われても否定はできず、検査する人の技量に左右されるとされています [16]。
- **ヘルニアが痛みの原因とは限らない**：症状のあるアスリート 47 人と症状の無いアスリート 41 人を超音波で比べた研究では、症状の無いアスリートにも 8 人にヘルニアが見つかりました [17]。画像だけでヘルニアが見つかった内転筋の痛みの患者 47 人では、内転筋の痛みの治療だけで 90% が満足し、ヘルニアの手術を受けたのは 1 人でした [18]。
- **診察での見分け**：ドーハ合意の分類を 2 人の検者が別々に評価した研究では、ヘルニアが入る「その他の原因」の一致は κ 0.13 と低いものでした [19]。

欧州ヘルニア学会（EHS）の分類はありますが、その分類が治療の結果や再発を予測するかは確かめられていません [1][20]。

${MAPPING_NOTE}`,
    },
    {
      id: 'treatment',
      title: '治療',
      body: `- **様子を見るか手術か**：症状の無いか軽い男性 720 人の無作為化試験で、2 年後の活動を制限する痛みは様子見 5.1%、手術 2.2% で、はっきりした差はありませんでした。様子見の 23% は途中で手術に移りましたが、その後の合併症は最初から手術した人と同じくらいでした [8]。若い競技者で、競技を続けながら様子を見ることが安全かは確かめられていません。
- **メッシュ**：25 の無作為化試験のまとめで、メッシュを使う修復は使わない修復より再発が少なくなりました（リスク比 0.46）[21]。ガイドラインはメッシュを使う方法を強く勧めています [1]。
- **開くか腹腔鏡か**：米国の 2,164 人の試験では、2 年後の再発は腹腔鏡 10.1%、開く手術（リキテンシュタイン法）4.9% でした [22]。一方、12 試験のメタ分析では再発に差がなく、腹腔鏡の方が長引く痛みが少なくなりました（オッズ比 0.41）[23]。ガイドラインは、外科医がその術式に十分慣れていることを条件に、どちらも最も証拠のある選択肢としています [1]。

アスリートの本当の鼠径ヘルニアで術式を比べた試験はありません。`,
    },
    {
      id: 'rehab',
      title: '術後の復帰',
      body: `ガイドラインは、手術の後は楽になったら制限なく普段の活動に戻ることを勧め、早く戻ると再発や合併症が増えると示した研究は無いとしています [1]。1 日の安静だけを指示したデンマークの 1,059 人の研究では、最も激しい余暇の活動を再開するまでの中央値は 14 日で、再手術率は比較の群と差がありませんでした [24]。

外科医がスポーツの再開に指示する期間はばらつき、91 研究の指示をまとめると、中央値はリキテンシュタイン法の後で 7 日、腹腔鏡の後で 12 日でした [25]。ガイドラインには、スポーツの再開までの具体的な期間の推奨はありません [26]。

超音波でヘルニアと診断されたアスリート 42 人では、39 人（93%）が修復の手術で症状がなくなりました。良くならなかった 2 人は、後で内転筋の断裂と分かっています [17]。サッカー選手の修復後の復帰日数や、復帰後の再発を前向きに記録した研究は見つかっていません。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
    {
      id: 'prevention',
      title: '長期の経過と予防',
      body: `**術後の長引く痛み**：修復術の長い目で見た問題で最も大きいのは、術後の長引く痛みです。デンマークの全国の調査では、術後 1 年で 28.7% が鼠径部の痛みを訴え、11.0% は痛みで仕事や余暇の活動が妨げられていました [27]。痛みのある人の 75.8% は 6.5 年後には軽くなっていました [28]。ガイドラインは、若い年齢を長引く痛みの危険因子の一つに挙げています [1]。サッカー選手の多くは若いのでこの集団に入りますが、アスリートに限った頻度は分かっていません。

**再発**：初めてのヘルニアの再手術率は、デンマークの長期の研究でリキテンシュタイン法の後 2.4%、腹腔鏡の後 3.3% でした [1]。再発の危険因子は、女性、内鼠径ヘルニア、再発したヘルニアの手術、喫煙です [29]。

**予防**：運動などで鼠径ヘルニアの発生を減らせるかを確かめた無作為化試験は見つかっていません。スポーツの鼠径部の怪我の予防プログラム 7 試験のまとめでも、鼠径部の怪我ははっきりとは減りませんでした（リスク比 0.81）[30]。術後のリハビリや運動療法が再発や長引く痛みを減らすかを確かめた試験もありません。`,
    },
  ],
  sources: [
    { n: 1, text: 'HerniaSurge Group (2018). International guidelines for groin hernia management. Hernia, 22(1), 1-165.', url: 'https://doi.org/10.1007/s10029-017-1668-x' },
    { n: 2, text: 'Werner, J., Hägglund, M., Waldén, M., & Ekstrand, J. (2009). UEFA injury study: a prospective study of hip and groin injuries in professional football over seven consecutive seasons. British Journal of Sports Medicine, 43(13), 1036-1040.', url: 'https://doi.org/10.1136/bjsm.2009.066944' },
    { n: 3, text: 'Mosler, A. B., Weir, A., Eirale, C., et al. (2018). Epidemiology of time loss groin injuries in a men\'s professional football league: a 2-year prospective study of 17 clubs and 606 players. British Journal of Sports Medicine, 52(5), 292-297.', url: 'https://doi.org/10.1136/bjsports-2016-097277' },
    { n: 4, text: 'Weir, A., Brukner, P., Delahunt, E., et al. (2015). Doha agreement meeting on terminology and definitions in groin pain in athletes. British Journal of Sports Medicine, 49(12), 768-774.', url: 'https://doi.org/10.1136/bjsports-2015-094869' },
    { n: 5, text: 'Öberg, S., Andresen, K., & Rosenberg, J. (2017). Etiology of Inguinal Hernias: A Comprehensive Review. Frontiers in Surgery, 4, 52.', url: 'https://doi.org/10.3389/fsurg.2017.00052' },
    { n: 6, text: 'van Wessem, K. J., Simons, M. P., Plaisier, P. W., & Lange, J. F. (2003). The etiology of indirect inguinal hernias: congenital and/or acquired?. Hernia, 7(2), 76-79.', url: 'https://doi.org/10.1007/s10029-002-0108-7' },
    { n: 7, text: 'Gallegos, N. C., Dawson, J., Jarvis, M., & Hobsley, M. (1991). Risk of strangulation in groin hernias. Journal of British Surgery, 78(10), 1171-1173.', url: 'https://doi.org/10.1002/bjs.1800781007' },
    { n: 8, text: 'Fitzgibbons, R. J., Jr., Giobbie-Hurder, A., Gibbs, J. O., et al. (2006). Watchful waiting vs repair of inguinal hernia in minimally symptomatic men: a randomized clinical trial. JAMA, 295(3), 285-292.', url: 'https://doi.org/10.1001/jama.295.3.285' },
    { n: 9, text: 'Fitzgibbons, R. J., Jr., Ramanan, B., Arya, S., et al. (2013). Long-term results of a randomized controlled trial of a nonoperative strategy (watchful waiting) for men with minimally symptomatic inguinal hernias. Annals of Surgery, 258(3), 508-515.', url: 'https://doi.org/10.1097/SLA.0b013e3182a19725' },
    { n: 10, text: 'Chung, L., Norrie, J., & O\'Dwyer, P. J. (2011). Long-term follow-up of patients with a painless inguinal hernia from a randomized clinical trial. Journal of British Surgery, 98(4), 596-599.', url: 'https://doi.org/10.1002/bjs.7355' },
    { n: 11, text: 'Patterson, T., Currie, P., Spence, R., McNally, S., & Spence, G. (2018). A systematic review of the association between a single strenuous event and the development of an inguinal hernia: A medicolegal grey area. The Surgeon, 16(5), 309-314.', url: 'https://doi.org/10.1016/j.surge.2018.01.005' },
    { n: 12, text: 'Pilkington, J. J., Zahid, M. S., Fullwood, C., et al. (2020). Contemporaneous evaluation of inguinal hernia causation: a European perspective. Hernia, 24(3), 591-599.', url: 'https://doi.org/10.1007/s10029-019-02107-3' },
    { n: 13, text: 'Vad, M. V., Frost, P., Rosenberg, J., Andersen, J. H., & Svendsen, S. W. (2017). Inguinal hernia repair among men in relation to occupational mechanical exposures and lifestyle factors: a longitudinal study. Occupational and Environmental Medicine, 74(11), 769-775.', url: 'https://doi.org/10.1136/oemed-2016-104160' },
    { n: 14, text: 'Öberg, S., Sæter, A. H., & Rosenberg, J. (2022). The inheritance of groin hernias: an updated systematic review with meta-analyses. Hernia, 27(6), 1339-1350.', url: 'https://doi.org/10.1007/s10029-022-02718-3' },
    { n: 15, text: 'Rosemar, A., Angerås, U., & Rosengren, A. (2008). Body mass index and groin hernia: a 34-year follow-up study in Swedish men. Annals of Surgery, 247(6), 1064-1068.', url: 'https://doi.org/10.1097/SLA.0b013e31816b4399' },
    { n: 16, text: 'Kwee, R. M., & Kwee, T. C. (2018). Ultrasonography in diagnosing clinically occult groin hernia: systematic review and meta-analysis. European Radiology, 28(11), 4550-4560.', url: 'https://doi.org/10.1007/s00330-018-5489-9' },
    { n: 17, text: 'Vasileff, W. K., Nekhline, M., Kolowich, P. A., et al. (2017). Inguinal Hernia in Athletes: Role of Dynamic Ultrasound. Sports Health, 9(5), 414-421.', url: 'https://doi.org/10.1177/1941738117717009' },
    { n: 18, text: 'O\'Connor, D., Bhimani, N., Turner, A., et al. (2026). Long-Term Outcomes of Patients With Adductor-Related Groin Pain: Assessing the Clinical Relevance of Imaging-Only Hernias. ANZ Journal of Surgery.', url: 'https://doi.org/10.1111/ans.70966' },
    { n: 19, text: 'Heijboer, W. M. P., Weir, A., Vuckovic, Z., et al. (2023). Inter-examiner reliability of the Doha agreement meeting classification system of groin pain in male athletes. Scandinavian Journal of Medicine & Science in Sports, 33(2), 189-196.', url: 'https://doi.org/10.1111/sms.14248' },
    { n: 20, text: 'Miserez, M., Alexandre, J. H., Campanelli, G., et al. (2007). The European hernia society groin hernia classification: simple and easy to remember. Hernia, 11(2), 113-116.', url: 'https://doi.org/10.1007/s10029-007-0198-3' },
    { n: 21, text: 'Lockhart, K., Dunn, D., Teo, S., et al. (2018). Mesh versus non-mesh for inguinal and femoral hernia repair. Cochrane Database of Systematic Reviews, 9, CD011517.', url: 'https://doi.org/10.1002/14651858.CD011517.pub2' },
    { n: 22, text: 'Neumayer, L., Giobbie-Hurder, A., Jonasson, O., et al. (2004). Open mesh versus laparoscopic mesh repair of inguinal hernia. New England Journal of Medicine, 350(18), 1819-1827.', url: 'https://doi.org/10.1056/NEJMoa040093' },
    { n: 23, text: 'Bullen, N. L., Massey, L. H., Antoniou, S. A., et al. (2019). Open versus laparoscopic mesh repair of primary unilateral uncomplicated inguinal hernia: a systematic review with meta-analysis and trial sequential analysis. Hernia, 23(3), 461-472.', url: 'https://doi.org/10.1007/s10029-019-01989-7' },
    { n: 24, text: 'Bay-Nielsen, M., Thomsen, H., Andersen, F. H., et al. (2004). Convalescence after inguinal herniorrhaphy. British Journal of Surgery, 91(3), 362-367.', url: 'https://doi.org/10.1002/bjs.4437' },
    { n: 25, text: 'Harmankaya, S., Öberg, S., & Rosenberg, J. (2022). Varying convalescence recommendations after inguinal hernia repair: a systematic scoping review. Hernia, 26(4), 1009-1021.', url: 'https://doi.org/10.1007/s10029-022-02629-3' },
    { n: 26, text: 'Harmankaya, S., Öberg, S., & Rosenberg, J. (2023). Varying convalescence recommendations for sport and heavy lifting after groin hernia repair: a nationwide survey among leading hernia surgeons. Surgical Endoscopy, 37(6), 4443-4448.', url: 'https://doi.org/10.1007/s00464-023-09913-y' },
    { n: 27, text: 'Bay-Nielsen, M., Perkins, F. M., Kehlet, H., & Danish Hernia Database (2001). Pain and functional impairment 1 year after inguinal herniorrhaphy: a nationwide questionnaire study. Annals of Surgery, 233(1), 1-7.', url: 'https://doi.org/10.1097/00000658-200101000-00001' },
    { n: 28, text: 'Aasvang, E. K., Bay-Nielsen, M., & Kehlet, H. (2006). Pain and functional impairment 6 years after inguinal herniorrhaphy. Hernia, 10(4), 316-321.', url: 'https://doi.org/10.1007/s10029-006-0098-y' },
    { n: 29, text: 'Burcharth, J., Pommergaard, H. C., Bisgaard, T., & Rosenberg, J. (2015). Patient-related risk factors for recurrence after inguinal hernia repair: a systematic review and meta-analysis of observational studies. Surgical Innovation, 22(3), 303-317.', url: 'https://doi.org/10.1177/1553350614552731' },
    { n: 30, text: 'Esteve, E., Rathleff, M. S., Bagur-Calafat, C., Urrútia, G., & Thorborg, K. (2015). Prevention of groin injuries in sports: a systematic review with meta-analysis of randomised controlled trials. British Journal of Sports Medicine, 49(12), 785-791.', url: 'https://doi.org/10.1136/bjsports-2014-094162' },
  ],
  keywords: ['ヘルニア', '鼠径', 'hernia'],
}

export const MORE_GUIDES: DiseaseGuide[] = [groin, rectusFemoris, acl, meniscus, cartilage, mcl, atfl, ankleLateral, hernia]
