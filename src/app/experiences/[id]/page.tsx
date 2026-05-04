import Link from "next/link";
import { notFound } from "next/navigation";

const DUMMY_EXPERIENCES = [
  {
    id: "1",
    university: "早稲田大学",
    faculty: "政治経済学部",
    result: "合格",
    studyPeriod: "1年間",
    studyStyle: "独学",
    tags: ["独学", "浪人", "文系"],
    summary: "模試でE判定から逆転合格。メンタル崩壊しかけた浪人生活のリアルを全部書きます。",
    author: "たいち",
    createdAt: "2025年3月",
    deviation: "入塾時48 → 合格時65",
    club: "なし（浪人中）",
    mentalNote: "2月に一度勉強を完全に辞めた。親に言えなかった。",
    body: `【浪人を決めた瞬間】
現役時代、センター試験で大失敗して志望校を全部落ちた。MARCHも全滅。
浪人を決めたのは発表の翌日。親に泣きながら電話した。

【最初の3ヶ月】
予備校には行かずに独学を選んだ。お金の問題もあったし、自分のペースでやりたかった。
でも最初の3ヶ月は本当に何もできなかった。1日2時間やれれば良い方だった。

【転機】
6月に模試を受けたらE判定。でもこれが逆に良かった。
「もうどうにでもなれ」と開き直って、毎日10時間勉強できるようになった。

【失敗したこと】
参考書を買いすぎた。英語だけで5冊買ったが、実際に使ったのは2冊だけ。
「新しい参考書を買う＝勉強した気になる」の罠にはまった。

【どう立て直したか】
参考書を全部売って、1冊だけに絞った。
とにかく同じ問題を繰り返した。完璧になるまで次に進まなかった。

【合格した日】
合格発表をひとりで見た。画面に「合格」の文字が出たとき、しばらく何も感じなかった。
じわじわと実感が来て、その夜初めて泣いた。`,
  },
  {
    id: "2",
    university: "東京大学",
    faculty: "理科一類",
    result: "不合格",
    studyPeriod: "2年間",
    studyStyle: "予備校",
    tags: ["理系", "二浪", "東大不合格"],
    summary: "2浪して東大に落ちた。何が足りなかったのか、今だから言える失敗の本質。",
    author: "けんた",
    createdAt: "2025年4月",
    deviation: "入塾時62 → 最終70",
    club: "なし",
    mentalNote: "二浪目の秋、受験をやめることを本気で考えた。",
    body: `【なぜ東大を目指したか】
正直に言うと、親の期待に応えたかっただけかもしれない。
自分が本当に行きたかったかは、今でもわからない。

【一浪目】
偏差値は上がった。でも東大には届かなかった。
「もう1年やれば絶対受かる」と思って二浪を決めた。

【二浪目の罠】
成績が上がらなかった。むしろ停滞した。
「やってるのになぜ伸びないのか」という焦りがメンタルをじわじわ削った。

【本番で起きたこと】
数学で詰まって30分を無駄にした。焦りで他の科目も崩れた。
実力は出せなかった。

【今思う失敗の本質】
勉強量は足りていた。足りなかったのは「本番の再現力」だった。
模試と本番で全く違うパフォーマンスが出る人間だった。それを2年間放置した。

【二浪して落ちた後】
今は別の大学に通っている。
あのとき東大に固執しなければ、もっと早く自分の人生を生きられたと思う。`,
  },
  {
    id: "3",
    university: "慶應義塾大学",
    faculty: "商学部",
    result: "合格",
    studyPeriod: "6ヶ月",
    studyStyle: "独学",
    tags: ["短期", "独学", "現役"],
    summary: "高3の10月から勉強開始。半年で慶應に受かるまでにやったこと全部。",
    author: "さやか",
    createdAt: "2025年2月",
    deviation: "入塾時55 → 合格時70",
    club: "演劇部（10月引退）",
    mentalNote: "周りが半年以上先に勉強していて最初は絶望した。",
    body: `【部活を引退したのは10月】
演劇部の発表会が終わったのが10月の第2週。そこから受験勉強を始めた。
周りはすでに半年以上勉強していた。絶望した。

【戦略を考えた】
時間がないので「捨てる科目」を決めた。
国語・英語・日本史の3科目に絞り、数学は最初から捨てた。

【1日のスケジュール】
朝6時起き → 学校 → 放課後図書館で5時間 → 帰宅後2時間
土日は12時間。これを6ヶ月続けた。

【英語で詰まった】
最初の1ヶ月は英語が全然伸びなかった。
単語を覚えても長文が読めない状態が続いた。

【転機は11月】
長文を毎日1本精読する習慣をつけたら、12月から急に読めるようになった。
「量より質」が自分には合っていた。

【本番当日】
緊張はしなかった。むしろ「やることはやった」という感覚があった。
合格発表を見たとき、演劇部の顧問の先生に一番最初に連絡した。`,
  },
  {
    id: "4",
    university: "大阪大学",
    faculty: "工学部",
    result: "合格",
    studyPeriod: "1年半",
    studyStyle: "予備校＋独学",
    tags: ["理系", "地方", "部活両立"],
    summary: "部活を引退したのは高3の7月。そこから阪大に合格するまでの450日。",
    author: "りく",
    createdAt: "2025年1月",
    deviation: "入塾時58 → 合格時68",
    club: "野球部（7月引退）",
    mentalNote: "夏休みに成績が伸びなくて一度諦めかけた。",
    body: `【野球部と勉強の両立】
高3の夏まで野球部だった。練習は毎日6時まで。
勉強できるのは夜の2時間だけだった。

【引退後の夏】
引退してから猛烈に勉強した。でも成績はすぐに伸びなかった。
周りが先に進んでいるのを見て焦った。

【地方という不利】
塾が少なくて、映像授業に頼るしかなかった。
質問できる環境がなかったのは正直きつかった。

【数学で勝負した】
理系なので数学を武器にしようと決めた。
数学だけは他の受験生に負けないレベルにした。

【センター（共通テスト）で失敗】
本番で数学2Bが思ったより取れなかった。
でも二次で挽回できると信じて切り替えた。

【合格したとき】
地元の友達は誰も阪大を受けていなかった。
合格したとき、誰とも喜びを共有できなくて不思議な感覚だった。`,
  },
  {
    id: "5",
    university: "MARCH",
    faculty: "全落ち",
    result: "不合格",
    studyPeriod: "1年間",
    studyStyle: "予備校",
    tags: ["全落ち", "浪人決定", "私立文系"],
    summary: "予備校に100万以上かけてMARCH全落ち。親に言えなかった3日間と、そこからの再起。",
    author: "ゆい",
    createdAt: "2025年4月",
    deviation: "入塾時52 → 最終58",
    club: "バドミントン部（3月引退）",
    mentalNote: "全落ちを親に言えず3日間ひとりで抱えた。",
    body: `【予備校に100万以上かけた】
両親が一生懸命働いたお金で、大手予備校に通わせてもらった。
そのプレッシャーが最後まで重かった。

【全落ちした日】
最後の合格発表を見たのは夜の11時。
画面に「不合格」と出たとき、頭が真っ白になった。

【3日間言えなかった】
親に言えなかった。「どうだった？」と毎日聞かれても「まだわからない」と嘘をついた。
3日目の夜、母親に泣きながら話した。

【親の反応】
怒ると思っていた。でも母親は「一緒に考えよう」と言ってくれた。
それが一番つらかった。怒ってくれた方が楽だったかもしれない。

【何が足りなかったか】
勉強量は足りていた。でも「何のために勉強するか」がわかっていなかった。
とにかく落ちたくないという恐怖だけで勉強していた。

【これからのこと】
浪人を決めた。次は自分のために受験する。`,
  },
  {
    id: "6",
    university: "京都大学",
    faculty: "法学部",
    result: "合格",
    studyPeriod: "3年間",
    studyStyle: "独学",
    tags: ["京大", "独学", "長期"],
    summary: "高1から京大を目指して3年。遠回りしたからこそわかった、最短ルートじゃなかったこと。",
    author: "あおい",
    createdAt: "2025年3月",
    deviation: "高1時点60 → 合格時75",
    club: "文化祭実行委員",
    mentalNote: "高2の冬に一度京大を諦めかけた。",
    body: `【高1から京大を目指した理由】
姉が京大に通っていた。単純に「かっこいい」と思ったのが最初だった。

【高1〜高2の失敗】
早く始めたのに、勉強の方向性が間違っていた。
難しい問題集に手を出しすぎて、基礎が全然できていなかった。

【高2の冬に気づいたこと】
模試の結果を見て愕然とした。2年間勉強してきたのに偏差値が伸びていなかった。
やり方を根本から変えた。

【基礎に戻った】
中学レベルの英文法からやり直した。プライドを捨てた。
これが一番効いた。3ヶ月で偏差値が10上がった。

【高3の1年間】
やることが明確になっていたので迷わなかった。
「基礎を完璧にしてから応用」というシンプルな原則だけ守った。

【合格して思うこと】
3年かかったのは遠回りではなかったかもしれない。
でも高1から正しいやり方をしていれば、もっと楽だったとも思う。`,
  },
];

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = DUMMY_EXPERIENCES.find((e) => e.id === id);
  if (!exp) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exp.university}</h1>
              <p className="text-gray-500">{exp.faculty}</p>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"}`}>
              {exp.result}
            </span>
          </div>

          <p className="text-gray-700 mb-5 leading-relaxed">{exp.summary}</p>

          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">勉強期間</p>
              <p className="font-medium text-gray-800">{exp.studyPeriod}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">勉強スタイル</p>
              <p className="font-medium text-gray-800">{exp.studyStyle}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">偏差値推移</p>
              <p className="font-medium text-gray-800">{exp.deviation}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">部活</p>
              <p className="font-medium text-gray-800">{exp.club}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
            <p className="text-xs text-yellow-600 font-medium mb-1">メンタルの本音</p>
            <p className="text-sm text-yellow-800">{exp.mentalNote}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {exp.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">体験記全文</h2>
          <div className="text-gray-700 text-sm leading-8 whitespace-pre-line">{exp.body}</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-sm text-blue-800 font-medium mb-1">
            {exp.author}さんに直接相談できます（準備中）
          </p>
          <p className="text-xs text-blue-600 mb-3">似た境遇の先輩に、単発で話を聞いてもらえます。</p>
          <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg opacity-50 cursor-not-allowed">
            相談を申し込む（近日公開）
          </button>
        </div>
      </main>
    </div>
  );
}
