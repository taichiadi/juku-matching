import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xmbzpllpjjhaesinlknq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtYnpwbGxwampoYWVzaW5sa25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzQ2MDEsImV4cCI6MjA5MzE1MDYwMX0.WgM4Q0zqTqAmFG4uuXjz74IM5TlmNpBZ_-nZta34frc"
);

const PATCHES = [
  {
    email: "sample01@senpailink.jp",
    main_turning_point: "9月に英語を諦めて国語と日本史への全振りを決断したこと。合計点で逆算したら、英語を中程度に維持するより国語・日本史を完璧にした方が合格点を超えると気づいた。",
    current_advice: "引退後すぐ「今日から本気」と思ってもスイッチは急に切り替わらない。最初の2週間は環境を整えることに集中して、勉強は少量からでいい。",
    recommended_for: "部活引退後に始める人・英語が苦手な文系",
  },
  {
    email: "sample02@senpailink.jp",
    main_turning_point: "秋に過去問やりすぎで基礎が抜けていたと気づき、2週間だけ過去問を止めて英語の弱点を潰し直したこと。その後は過去問の正答率が一気に安定した。",
    current_advice: "独学は参考書選びで8割決まる。買いすぎず、1冊を3周することを最優先に。何冊もやろうとすると全部中途半端になる。",
    recommended_for: "独学・塾なしで難関を狙う人",
  },
  {
    email: "sample03@senpailink.jp",
    main_turning_point: "8月に日本史を8割の時間で勉強するという決断。英語は諦めず基礎問題のみに絞ったことで、10月以降に合計点が合格ラインを超えるようになった。",
    current_advice: "E判定は現時点の話。でも現時点で何が足りないかを正確に把握してないと改善できない。模試が返ってきたら分野別の正答率から弱点を特定して。",
    recommended_for: "夏からスタートする人・E判定からの逆転を目指す人",
  },
  {
    email: "sample04@senpailink.jp",
    main_turning_point: "9月から英語長文を毎日1題音読する習慣をつけたこと。10月末に速読スピードが体感で変わって、それ以降は長文が苦にならなくなった。音読の効果を舐めていた。",
    current_advice: "映像授業は見るだけで満足しがち。必ず手を動かしながら見て、見終わったら同じ問題を自力で解く。この2ステップを守るだけで定着率が全然違う。",
    recommended_for: "スタサプ・映像授業のみで勉強している人・英語を強化したい人",
  },
  {
    email: "sample05@senpailink.jp",
    main_turning_point: "浪人5月に塾の先生に「弱点だけ潰せ」と言われ、英文法1冊だけを完璧にすることに集中したこと。他を全部一時中断してでも1つを完成させる決断が分岐点だった。",
    current_advice: "浪人してメンタルが崩れやすい時期は4月・7月・11月。この時期に何もしない日を意図的に作っておくと崩れにくい。頑張ることと休むことを計画に入れておいて。",
    recommended_for: "浪人中の人・全落ちを経験した人",
  },
  {
    email: "sample06@senpailink.jp",
    main_turning_point: "10月に日本史の遅れを正直に認め、英語を過去問のみに絞って日本史に時間を移したこと。自分の誤算に気づいて即座に修正できたのが合格につながった判断だった。",
    current_advice: "秋以降に科目の配分を変えることを恐れないで。「今さら変えるのは怖い」という感覚で間違った配分を続けるのが一番もったいない。データを見て判断して。",
    recommended_for: "科目配分で迷っている人・部活と受験を両立している人",
  },
  {
    email: "sample07@senpailink.jp",
    main_turning_point: "高2の冬にYouTubeとKindle Unlimitedを活用して英語の全基礎を無料でやり直したこと。図書館の自習室を毎日の拠点にしたことで、環境と習慣が一気に整った。",
    current_advice: "塾に行けない状況でも、図書館＋YouTube＋無料アプリで今は十分戦える。ただし「自分で計画を立てる能力」だけは独学では身につきにくいので、そこだけは誰かに相談して。",
    recommended_for: "塾なし・経済的に制限がある人",
  },
  {
    email: "sample08@senpailink.jp",
    main_turning_point: "10月に日本史を完全に捨てて、英語と現代文の2科目に絞るという覚悟を決めたこと。法政の出題形式を詳細に分析して、この2科目で合格点に届くと確信できたから踏み切れた。",
    current_advice: "「捨て科目を作る」決断は早ければ早いほどいい。捨てると決めたら完全に忘れる。中途半端に続けるのが一番時間の無駄になる。",
    recommended_for: "秋・冬スタートの人・科目を絞ろうか迷っている人",
  },
  {
    email: "sample09@senpailink.jp",
    main_turning_point: "8月に現代文の解法を丸暗記型から型の理解に切り替えたこと。「この問題はなぜこの選択肢が正解なのか」を全問言語化する習慣をつけたら10月末に急に安定した。",
    current_advice: "現代文は才能じゃない。「正解の根拠を本文から必ず探す」ルールを守るだけで安定する。感覚で解こうとするのが一番の失敗。",
    recommended_for: "現代文が苦手な人・関関同立志望",
  },
  {
    email: "sample10@senpailink.jp",
    main_turning_point: "夏に塾長から「英語は捨てるな、でも日本史で点を稼げ」とアドバイスされた日。秋から日本史を完璧にする方針に変えて、英語は基礎問題のみに絞った判断が分岐点だった。",
    current_advice: "「先輩の話を聞く」のを恥ずかしがらないで。自分が気づかない視点を1つもらうだけで、2〜3ヶ月の回り道を防げることがある。",
    recommended_for: "部活引退後にスタートする人・夏から本気を出す人",
  },
  {
    email: "sample11@senpailink.jp",
    main_turning_point: "浪人の夏、日本史だけを1日4時間に増やす決断をしたこと。英語の点数は高いのに日本史が足を引っ張っていた構図を正確に把握して、弱点に時間を集中投下したのが転機だった。",
    current_advice: "浪人生は「現役と同じ勉強法では意味がない」と早めに気づくことが大事。去年なぜ落ちたか分析してから今年の戦略を立てて。同じ方法を繰り返さないこと。",
    recommended_for: "浪人中の人・早慶を目指している人",
  },
  {
    email: "sample12@senpailink.jp",
    main_turning_point: "10月に過去問を一時中断して英語の弱点を2週間で潰し直したこと。「過去問の進捗」を追うことより「基礎の完成度」を優先する判断ができたのが合格の分岐点だった。",
    current_advice: "計画通りに進まない週が絶対に来る。そのとき大事なのは「今週なぜ崩れたか」を記録すること。記録があれば翌週に修正できる。記録なしで闇雲に頑張り直すと同じことを繰り返す。",
    recommended_for: "コツコツ型・高2から始める人・慶應を狙う人",
  },
  {
    email: "sample13@senpailink.jp",
    main_turning_point: "11月に世界史を完全に捨てて英語と現代文に集中する決断をしたこと。関学の英語配点の高さをデータで確認してから踏み切ったので、後悔なく全力を注げた。",
    current_advice: "志望校の過去問は夏前に一度解いてみること。点数は気にしなくていい。「どの科目の配点が高いか」「どんな問題形式か」を把握するだけで戦略が180度変わる。",
    recommended_for: "関関同立志望・科目配分で迷っている人",
  },
  {
    email: "sample14@senpailink.jp",
    main_turning_point: "受験2週間前に過去問を捨てて、英語の頻出パターンだけを丸暗記する方針に切り替えたこと。残り時間で何が最も得点に直結するかを冷静に計算できたのが合格につながった。",
    current_advice: "直前期は新しいことをやらない。今まで解いた問題の解き直しと、頻出パターンの確認だけに絞ること。新教材に手を出すのが直前期最大の失敗パターン。",
    recommended_for: "直前期の人・部活が長く続いた人",
  },
  {
    email: "sample15@senpailink.jp",
    main_turning_point: "11月の早稲田過去問で合格点に届かないと確信したにもかかわらず、方向転換できずにいた自分への後悔。もっと早くMARCH重点シフトを決断すべきだったと今でも思う。",
    current_advice: "「データが示す現実」から目を逸らさないこと。過去問で合格点に届いていないのに「本番は大丈夫」は通用しない。10月時点で届いていなければ志望を見直す勇気を持って。",
    recommended_for: "併願戦略で悩んでいる人・早慶を目指している人",
  },
  {
    email: "sample16@senpailink.jp",
    main_turning_point: "1月から慶應文の日本史文化史だけに2時間/日を集中投下したこと。過去問分析で文化史の配点が高いと確信してから迷わず実行できた。傾向分析が先にあってこそ決断できた。",
    current_advice: "塾なし独学で慶應を狙うなら、過去問の傾向分析に誰より多くの時間を使うこと。市販の参考書は汎用的すぎるので、志望校特化の戦略は自分で作るしかない。",
    recommended_for: "独学で難関を目指す人・塾なし受験生",
  },
  {
    email: "sample17@senpailink.jp",
    main_turning_point: "8月中旬に親にスマホを1ヶ月間預けたこと。この決断だけで勉強時間が1日3時間から8時間に増えた。環境を物理的に変えることの効果を実感した転機だった。",
    current_advice: "「意志力でスマホを我慢する」は失敗する。物理的に手元からなくすか、使えないアプリにロックするか、どちらかの強制力を作ること。意志力に頼った時点で99%失敗する。",
    recommended_for: "スマホ依存を断ち切りたい人・夏から集中したい人",
  },
  {
    email: "sample18@senpailink.jp",
    main_turning_point: "担任の先生から「現代文と日本史で逃げ切れる大学を選べ」とアドバイスされた日。英語を改善しようとする努力をやめて、得意科目に全振りする発想の転換が合格を引き寄せた。",
    current_advice: "苦手科目を無理に克服しようとするより、得意科目を武器にできる大学を探す方が現実的なことが多い。「自分がどの大学に向いているか」の視点で志望校選びをして。",
    recommended_for: "英語が苦手な人・得意科目で勝負したい人",
  },
  {
    email: "sample19@senpailink.jp",
    main_turning_point: "11月から現代文の解法を固定して、早稲田社学特有の問題形式だけに特化した演習に切り替えたこと。汎用的な参考書より、志望校の過去問10年分を繰り返す方が圧倒的に効果があった。",
    current_advice: "早稲田社学の現代文は特殊。普通の現代文の勉強法では対応できないので、必ず社学の過去問で形式慣れすること。早めに過去問を分析してから参考書選びをして。",
    recommended_for: "早稲田を目指している人・現代文の対策を探している人",
  },
  {
    email: "sample20@senpailink.jp",
    main_turning_point: "10月に過去問を分析して英語が配点の50%超えと判明してから、日本史の時間を削って英語演習を倍にした判断。データ根拠があるから迷わず実行できた。",
    current_advice: "青学国際は英語命。まず過去問の配点表を確認してから科目配分を決めること。感覚で決めると必ず後悔する。",
    recommended_for: "MARCH対策の人・英語を武器にしたい人",
  },
  {
    email: "sample21@senpailink.jp",
    main_turning_point: "8月に世界史を地域ごとに分割して、1週間で1地域を完璧にする方法に切り替えたこと。全体を一気にやろうとしていた方法を捨てたら、9月末に全地域が完成した。",
    current_advice: "世界史は地域ごとに分割して覚えること。ランダムに暗記しようとすると頭の中で繋がらない。ヨーロッパ→中東→東アジアの順に「1地域完璧」を繰り返す方法が最速。",
    recommended_for: "世界史が苦手な人・同志社を目指す人",
  },
  {
    email: "sample22@senpailink.jp",
    main_turning_point: "YouTubeで現代文の解法動画を毎日1本見てノートにまとめるだけを2ヶ月続けたこと。コストゼロでも継続さえできれば必ず伸びると証明できた経験が自信になった。",
    current_advice: "無料の学習資源（YouTube・図書館・無料アプリ）を使い倒すことを恥ずかしがらないで。大事なのはコストじゃなくて継続の質。毎日少しずつ積み上げることが全て。",
    recommended_for: "塾なし・お金がない状況で受験する人",
  },
  {
    email: "sample23@senpailink.jp",
    main_turning_point: "引退後に現代文の解法を固定して毎日1問解き続けたこと。12月末に「解法通りに解けば必ず正解に辿り着ける」という確信が生まれて、年明けは自信を持って臨めた。",
    current_advice: "秋引退で受験まで3〜4ヶ月しかない場合、「教材の数を1科目1冊に絞る」ことが最重要。あれもこれも手を出すと全部中途半端になる。",
    recommended_for: "秋引退の部活生・短期集中で合格を目指す人",
  },
  {
    email: "sample24@senpailink.jp",
    main_turning_point: "浪人7月に1週間完全に勉強を止めて旅行したこと。リフレッシュして戻ったら集中力が回復して、8月から過去問中心に切り替えられた。休む勇気が逆転の起点だった。",
    current_advice: "メンタルが崩れたサインは「勉強しているのに何も頭に入らない感覚」。このサインが出たら1〜2日の完全休憩が正解。無理して続けると余計に崩れる。",
    recommended_for: "浪人中の人・メンタルが不安定な時期の人",
  },
  {
    email: "sample25@senpailink.jp",
    main_turning_point: "立命館の過去問を分析して、世界史が暗記より因果関係の理解問題が多いと発見したこと。丸暗記をやめて「なぜ起きたか」を理解する勉強に切り替えたら本番で初見問題にも対応できた。",
    current_advice: "スタサプは使い方次第。動画を見るだけで終わらせるのが最大の失敗。必ず問題演習とセットにすること。映像を見た直後に同範囲の問題を解くのが最速の定着法。",
    recommended_for: "スタサプ・映像授業のみで勉強する人・世界史が苦手な人",
  },
  {
    email: "sample26@senpailink.jp",
    main_turning_point: "秋に上智の配点を調べて英語と数学で80%を占めると判明した瞬間。現代文を諦める決断をデータに基づいてできたので迷いがなかった。配点分析が最強の武器だった。",
    current_advice: "文系でも数学で受験できる大学は複数ある。数学が得意なら「数学受験可能な文系学部」を積極的に調べて。現代文が苦手な人は特に有利になれる選択肢。",
    recommended_for: "数学が得意な文系・現代文が苦手な人",
  },
  {
    email: "sample27@senpailink.jp",
    main_turning_point: "夏に偏差値40以下の状態で、日本史を最高得点に仕上げてそこで稼ぐと決断したこと。英語は基礎問題のみに絞ることで、日本史への集中時間を最大化できた。",
    current_advice: "偏差値40台から始める場合、全科目を満遍なく伸ばそうとすると全部中途半端で終わる。まず1科目を得点源に育ててから、残りを最低限に上げる順番が正解。",
    recommended_for: "偏差値40台からスタートする人・夏から本気を出す人",
  },
  {
    email: "sample28@senpailink.jp",
    main_turning_point: "8月に早稲田教育の日本史と現代文だけで合格点を逆算して、英語を最低限に絞ることを決断したこと。日本史満点を目標に設定したことで、勉強の方向性が明確になった。",
    current_advice: "塾なしで難関を目指すなら、過去問の配点と形式を完全に把握することが最初のステップ。それをせずに勉強を始めると方向性がずれたまま時間を無駄にする。",
    recommended_for: "塾なしで難関大学を目指す人・英語が苦手な受験生",
  },
  {
    email: "sample29@senpailink.jp",
    main_turning_point: "11月に現代文を完全に諦めて英語と世界史だけに絞ったこと。関大の英語はマーク式という形式的な特徴を事前に把握していたから、時間配分の最適化に集中できた。",
    current_advice: "現代文が苦手な人は、現代文の配点が低い大学・現代文なしで受験できる大学を調べることから始めて。苦手を克服する努力と、苦手を回避する戦略の両方を考えること。",
    recommended_for: "現代文が苦手な人・関関同立志望",
  },
  {
    email: "sample30@senpailink.jp",
    main_turning_point: "小論文を毎日1本書いて先生に添削してもらうことを11月まで続けたこと。量をこなすことで急速に上達したという実感が得られて、SFCの特殊な試験形式への自信になった。",
    current_advice: "慶應SFCは英語と小論文だけ。他の大学とは全く異なる試験形式なので、SFCに決めたなら早めに小論文の練習を始めること。小論文は短期間では上達しない科目。",
    recommended_for: "慶應SFCを目指す人・小論文対策が必要な人",
  },
];

async function patch() {
  let success = 0;
  let errors = 0;
  for (const p of PATCHES) {
    const { error } = await supabase
      .from("experiences")
      .update({
        main_turning_point: p.main_turning_point,
        current_advice: p.current_advice,
        recommended_for: p.recommended_for,
      })
      .eq("author_email", p.email);
    if (error) {
      console.error(`✗ ${p.email}: ${error.message}`);
      errors++;
    } else {
      console.log(`✓ ${p.email}`);
      success++;
    }
  }
  console.log(`\nDone: ${success} updated, ${errors} errors`);
}

patch();
