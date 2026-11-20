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
  lead: '太ももの前にある大腿直筋の肉離れ。蹴る動作とスプリントの多い競技で起きやすい [1]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `大腿直筋は、太ももの前の大腿四頭筋の一つです。大腿四頭筋の肉離れは、蹴る動作とスプリントを繰り返す競技でよく起きます [1]。

UEFA のプロクラブの研究では、脚の主な四つの筋肉の怪我 2,123 件のうち、ハムストリングスが 900 件、内転筋が 523 件、大腿四頭筋が 394 件、ふくらはぎが 306 件でした [2]。大腿四頭筋の怪我は、ハムストリングスや鼠径部の筋肉の怪我より試合を休む数が多く、再発も 17% と多いと報告されています [1]。`,
    },
    {
      id: 'anatomy',
      title: '解剖',
      body: `大腿直筋は骨盤から始まる二本の腱を持っています。直頭は下前腸骨棘から、反転頭は寛骨臼の上外側の縁と股関節の関節包から始まり、少し下で一つになります [3]。

反転頭の線維は筋肉の深いところに入り込み、筋肉の中を縦に走る「中央の腱（central septum）」を作ります。直頭の線維は筋肉の前の面の腱膜になります [3]。筋肉の中に腱がもう一本あるような作りで、ここが傷つくかどうかが回復の見通しに関わります（下の「分類と重症度」）。`,
    },
    {
      id: 'mechanism',
      title: '受傷のしかた',
      body: `走るときと蹴るとき、大腿直筋は引き伸ばされながら強く力を出す（遠心性収縮）ことを求められ、大きな負担がかかります [1]。

脚による違いも報告されています。UEFA の研究では、筋肉の怪我を増やす選手側の要因として、過去の怪我、年齢、蹴り脚が挙がりました [2]。`,
    },
    {
      id: 'classification',
      title: '分類と重症度',
      body: `筋肉の怪我の分類には、ミュンヘン・コンセンサス（2013）がよく使われます。筋線維の目に見える断裂が無い「機能的な障害」と、断裂がある「構造的な損傷」（部分断裂、完全断裂・腱の剥離）に分けます [4]。

大腿直筋で回復の見通しに強く関わるのは、損傷の大きさと、筋肉の中央の腱にかかっているかどうかです。オーストラリアン・フットボールのプロ選手の研究では、MRI での損傷が大きく長いほど練習への完全復帰までが長く、大腿直筋の中央の部分に及ぶ損傷で見通しが悪くなりました [5]。この研究は対照の無い症例の集まりで、数は大腿直筋の 15 件です [5]。

${MAPPING_NOTE}`,
    },
    {
      id: 'rehab',
      title: 'リハビリと再発',
      body: `大腿直筋の断裂のいちばん大きな危険因子は、過去の怪我だと報告されています [1]。復帰した後も、同じ場所の再発に気をつける必要があります。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
  ],
  sources: [
    { n: 1, text: 'Mendiguchia J, Alentorn-Geli E, Idoate F, Myer GD. Rectus femoris muscle injuries in football: a clinically relevant review of mechanisms of injury, risk factors and preventive strategies. Br J Sports Med. 2013;47(6):359–366.', url: 'https://bjsm.bmj.com/content/47/6/359.short' },
    { n: 2, text: 'Hägglund M, Waldén M, Ekstrand J. Risk factors for lower extremity muscle injury in professional soccer: the UEFA Injury Study. Am J Sports Med. 2013;41(2):327–335.', url: 'https://journals.sagepub.com/doi/abs/10.1177/0363546512470634' },
    { n: 3, text: 'Rectus femoris. Aspetar Sports Medicine Journal, Volume 14 (Targeted topic: Imaging in sports medicine).', url: 'https://journal.aspetar.com/en/journals/volume-14-targeted-topic-imaging-in-sports-medicine/rectus-femoris' },
    { n: 4, text: 'Mueller-Wohlfahrt HW, et al. Terminology and classification of muscle injuries in sport: the Munich consensus statement. Br J Sports Med. 2013;47(6):342–350.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3607100' },
    { n: 5, text: 'Cross TM, Gibbs N, Houang MT, Cameron M. Acute quadriceps muscle strains: magnetic resonance imaging features and prognosis. Am J Sports Med. 2004;32(3):710–719.', url: 'https://pubmed.ncbi.nlm.nih.gov/15090389/' },
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
  lead: '膝の中で骨と骨の間にある半月板の損傷。切除するか縫合するかで、復帰までの時間が大きく変わる [3]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `半月板は、膝の太ももの骨とすねの骨の間に内側と外側に一つずつある、三日月の形をした軟骨の組織です。膝にかかる荷重を受け止めて分散する役割を持っています [1]。

半月板の手術には、傷ついた部分を取り除く「切除術」と、縫い合わせて治す「縫合術」があります。どちらを選ぶかで、復帰までの時間と長い目で見た膝の状態が変わります [2][3]。`,
    },
    {
      id: 'classification',
      title: '分類',
      body: `断裂の程度（部分断裂か完全断裂か）、場所（内側か外側か）、治療（手術なし・切除術・縫合術）で分けて考えます [3]。

${MAPPING_NOTE}`,
    },
    {
      id: 'rehab',
      title: '復帰までの目安',
      body: `**切除術**: エリートのサッカー選手 90 人の研究では、部分切除の後に競技へ戻るまでの中央値は、外側の半月板で 7 週、内側で 5 週でした。外側の切除では 69% に痛みや腫れが出たのに対し、内側では 8% でした [2]。外側の半月板の切除は、長い目で見ても膝への影響が大きいことが知られています [2]。

**縫合術と切除術の比較**: エリートのアスリートの研究 10 本（725 人）をまとめた系統的レビューでは、競技に戻るまでが縫合術で 7.6 か月、部分切除で 4.3 か月でした。受傷前のレベルに戻った割合は縫合術 86.5%、部分切除 80.4% で、はっきりした差はありませんでした [3]。このレビューは、外側の損傷は治りやすいので縫合を勧め、内側で早い復帰が必要なときは切除する範囲をできるだけ小さくすることを勧めています [3]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
  ],
  sources: [
    { n: 1, text: 'Fox AJS, Bedi A, Rodeo SA. The basic science of human knee menisci: structure, composition, and function. Sports Health. 2012;4(4):340–351.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3435920' },
    { n: 2, text: 'Nawabi DH, et al. Return to play after lateral meniscectomy compared with medial meniscectomy in elite professional soccer players. Am J Sports Med. 2014.', url: 'https://www.pubmed.gov/25035175/' },
    { n: 3, text: 'D’Ambrosi R, et al. In elite athletes with meniscal injuries, always repair the lateral, think about the medial! A systematic review. Knee Surg Sports Traumatol Arthrosc. 2023.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10183423' },
  ],
  keywords: ['半月板', 'メニスカス', 'meniscus', '膝'],
}

const cartilage: DiseaseGuide = {
  key: 'knee_cartilage_injury',
  status: 'draft',
  updatedOn: '2026-11-20',
  lead: '膝の関節の表面を覆う軟骨の損傷。アスリートの膝では、軟骨の全層の欠損が 36% に見つかっている [1]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな怪我か',
      body: `関節軟骨は、骨の端を覆って関節を滑らかに動かす組織です。

アスリートの膝を調べた研究 11 本（931 人）をまとめた系統的レビューでは、軟骨が骨まで欠けている「全層の欠損」が 36% に見つかりました。そのうち 14% は、見つかった時点で症状がありませんでした [1]。場所は大腿骨の内側が外側より多く（68% と 32%）、膝蓋骨が滑車溝より多く（64% と 36%）、一緒に見つかる損傷では半月板の断裂が最も多く 47% でした [1]。`,
    },
    {
      id: 'classification',
      title: '分類（ICRS）',
      body: `軟骨の損傷の深さは、国際軟骨修復学会（ICRS）の 0〜4 の段階で表されます [2]。

- **0**: 正常
- **1**: ほぼ正常。表面が柔らかい、浅い亀裂がある
- **2**: 異常。損傷が軟骨の厚さの 50% 未満
- **3**: 重度の異常。損傷が軟骨の厚さの 50% を超え、石灰化層まで達するが、その下の骨は貫いていない
- **4**: 重度の異常。損傷がその下の骨（軟骨下骨）まで貫いている

このアプリの区分は、清水さんのプロトコルでは術式と結びついています（軽度はマイクロフラクチャー、中程度は OAT、重度は ACI/MACI）。ICRS の段階との対応は、ここでは決めていません。`,
    },
    {
      id: 'treatment',
      title: '手術の種類',
      body: `軟骨の手術にはいくつかの方法があります [3]。

- **マイクロフラクチャー（MFX）**: 欠損した部分の骨に小さな穴をあけ、骨の中から出てくる細胞で欠損を埋めさせる方法。
- **骨軟骨柱移植（OAT）**: 膝の中で荷重のかかりにくい場所から、軟骨と骨を円柱の形で取り、欠損に移す方法。
- **自家軟骨細胞移植（ACI、MACI）**: 本人の軟骨細胞を取り出して培養し、欠損に戻す方法。MACI は細胞を膜（マトリックス）に乗せて戻す方法です。`,
    },
    {
      id: 'rehab',
      title: '復帰までの目安',
      body: `術後 2 年以上の経過を報告した研究 44 本をまとめたメタ分析では、何らかのレベルで競技に戻った割合は全体で 76% でした。術式ごとには、OAT が 93%、他人の骨軟骨の移植（OCA）が 88%、ACI が 82%、マイクロフラクチャーが 58% でした [3]。

競技に戻るまでの期間は、OAT が 5.2 か月と最も短く、マイクロフラクチャーが 9.1 か月、OCA が 9.6 か月、ACI が 11.8 か月でした [3]。手術前の年齢、欠損の大きさ、活動レベルは、競技に戻れるかどうかをはっきりとは左右していませんでした [3]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
  ],
  sources: [
    { n: 1, text: 'Flanigan DC, et al. Prevalence of chondral defects in athletes’ knees: a systematic review. Med Sci Sports Exerc. 2010;42(10):1795–1801.', url: 'https://vivo.weill.cornell.edu/display/pubid20216470' },
    { n: 2, text: 'Brittberg M, Winalski CS. Evaluation of cartilage injuries and repair. J Bone Joint Surg Am. 2003;85-A Suppl 2:58–69.', url: 'https://doi.org/10.2106/00004623-200300002-00008' },
    { n: 3, text: 'Krych AJ, et al. Return to sport after the surgical management of articular cartilage lesions in the knee: a meta-analysis. Knee Surg Sports Traumatol Arthrosc. 2017;25(10):3186–3196.', url: 'https://link.springer.com/doi/10.1007/s00167-016-4262-3' },
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

const atfl: DiseaseGuide = (() => {
  const care = ANKLE_CARE({ vanDijk: 3, vuurberg: 5, gribble: 6, vanRijn: 10, caiCriteria: 12 })
  return {
    key: 'atfl_injury',
    status: 'draft',
    updatedOn: '2026-11-20',
    lead: '足首の外側にある前距腓靱帯の損傷。足首の捻挫で最も多く傷つく靱帯で、外側の靱帯の中で最も弱い [2]。',
    sections: [
      {
        id: 'overview',
        title: 'どんな怪我か',
        body: `足首の捻挫は、スポーツで最も多い怪我の一つです。前向きの疫学研究 181 本をまとめたメタ分析では、捻挫の種類は外側の捻挫が最も多く、発生率は女性が 1000 回の参加あたり 13.6 件で男性の 6.94 件より高く、屋内やコートの競技で最も高くなっていました [1]。

エリートのサッカー選手では、足首の捻挫の 70〜91% が外側の靱帯の損傷です [4]。`,
      },
      {
        id: 'anatomy',
        title: '解剖',
        body: `足首の外側には、前距腓靱帯（ATFL）、踵腓靱帯（CFL）、後距腓靱帯（PTFL）の三本の靱帯があります [2]。

前距腓靱帯は、最も多く傷つく靱帯です。足首の靱帯を引っ張って調べた研究では、前距腓靱帯が切れるまでに耐えた力は最も小さく、内側の深い三角靱帯が最も大きくなっていました [2]。前距腓靱帯は伸びる量が大きく、足首を下に向けて内にひねる動きを許す働きを持っています [2]。`,
      },
      { id: 'assessment', title: '評価', body: care.assessment },
      {
        id: 'classification',
        title: '分類',
        body: `前距腓靱帯だけの損傷か、他の靱帯や関節も傷ついた複雑な損傷かを分けることが大切だとされています [4]。足首の外側の靱帯は、前距腓靱帯だけ、前距腓靱帯と踵腓靱帯、三本全て、の順に重くなると考えられています。国際足関節コンソーシアムの評価の合意（ROAST）は、受傷のしかたを記録し、一本ずつ靱帯を触って調べる検査をするよう勧めています [11]。前距腓靱帯は前方引き出しテスト、踵腓靱帯は距骨傾斜テストで調べますが、受傷直後は痛みと筋肉の緊張で分かりにくく、数日後の診察が勧められます [5]。

足首の捻挫の分類は 25 通りも使われていて、どれが予後を予測するかを確かめた研究は一つも見つかっていない、とするレビューがあります [7]。

重さと再受傷の関係は単純ではありません。III 度をストレス X 線で二つに分けた四段階の分類 [8] を使い、エリート陸上選手 202 人を 24 か月追った研究では、再受傷は I 度で 14%、II 度で 29%、IIIA 度で 5.6% で、軽い捻挫の方が多くなりました [9]。

${MAPPING_NOTE}足首の外側の靱帯全体については「足関節側副靭帯損傷」のページも見てください。`,
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
    keywords: ['前距腓', '足関節', '足首', '捻挫', 'ATFL', 'ankle'],
    quelle: ['research-0041'],
  }
})()

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
  lead: '鼠径部の腹壁から、お腹の中のものが外に出てくる状態。症状がある場合の治療の基本は、メッシュを使った手術 [1]。',
  sections: [
    {
      id: 'overview',
      title: 'どんな病気か',
      body: `鼠径ヘルニアは、鼠径部の腹壁の弱いところから、お腹の中のものが外に出てくる状態です [1]。

アスリートの鼠径部痛の中には、鼠径管のあたりが痛むのに、触って分かるヘルニアが無いものがあります。ドーハ合意はこれを「鼠径管に関連した鼠径部痛」と呼び、鼠径ヘルニアとは分けています [2]。痛みの原因がヘルニアなのか、内転筋など他の場所なのかで、治療の進め方は変わります（「グロウインペイン症候群」のページも見てください）。`,
    },
    {
      id: 'treatment',
      title: '治療',
      body: `2018 年の国際ガイドライン（HerniaSurge）は、鼠径ヘルニアの手術にメッシュを使う方法を強く勧めています [1]。勧められている術式は、開いて行うリキテンシュタイン法と、腹腔鏡で行う TEP 法・TAPP 法です。どれを選ぶかは外科医の経験や患者・ヘルニアの状態で決めます [1]。

症状が無いか軽い男性では、すぐに手術せず様子を見る（watchful waiting）こともできます。ヘルニアによる緊急の事態の危険が低いためです。ただし、多くの人はいずれ手術が必要になります [1]。症状の無いか軽い男性 720 人の無作為化試験では、様子を見たグループと手術したグループで、痛みで活動が制限される程度や生活の質に差はありませんでした。様子を見たグループの 23% は、途中で手術に移っています [3]。`,
    },
    {
      id: 'rehab',
      title: '術後の復帰',
      body: `ガイドラインは、手術の後は楽になったら制限なく普段の活動に戻ることを勧めています [1]。

手術の後に最も多い問題は、再発と長く続く痛みです [1]。

清水さんのプロトコルの時期とメニューは、このページの下の「プロトコル」で見られます。`,
    },
  ],
  sources: [
    { n: 1, text: 'HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1–165.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582' },
    { n: 2, text: 'Weir A, et al. Doha agreement meeting on terminology and definitions in groin pain in athletes. Br J Sports Med. 2015;49(12):768–774.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4484366' },
    { n: 3, text: 'Fitzgibbons RJ Jr, et al. Watchful waiting vs repair of inguinal hernia in minimally symptomatic men: a randomized clinical trial. JAMA. 2006;295(3):285–292.', url: 'https://clinicaltrials.gov/study/NCT00263250' },
  ],
  keywords: ['ヘルニア', '鼠径', 'hernia'],
}

export const MORE_GUIDES: DiseaseGuide[] = [groin, rectusFemoris, acl, meniscus, cartilage, mcl, atfl, ankleLateral, hernia]
