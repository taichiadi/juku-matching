import Link from "next/link";

const DUMMY_EXPERIENCES = [
  {
    id: "1",
    university: "早稲田大学",
    faculty: "政治経済学部",
    result: "合格",
    studyPeriod: "1年間",
    studyStyle: "独学",
    tags: ["早稲田", "独学", "浪人", "文系"],
    summary: "模試でE判定から逆転合格。メンタル崩壊しかけた浪人生活のリアルを全部書きます。",
    author: "たいち",
    createdAt: "2025年3月",
  },
  {
    id: "2",
    university: "慶應義塾大学",
    faculty: "経済学部",
    result: "不合格",
    studyPeriod: "1年間",
    studyStyle: "予備校",
    tags: ["慶應", "不合格", "浪人"],
    summary: "偏差値70超えて慶應に落ちた。模試と本番でなぜこんなに違うのか、原因を分析した。",
    author: "けんた",
    createdAt: "2025年4月",
  },
  {
    id: "3",
    university: "慶應義塾大学",
    faculty: "商学部",
    result: "合格",
    studyPeriod: "6ヶ月",
    studyStyle: "独学",
    tags: ["慶應", "短期", "独学", "現役"],
    summary: "高3の10月から勉強開始。半年で慶應に受かるまでにやったこと全部。",
    author: "さやか",
    createdAt: "2025年2月",
  },
  {
    id: "4",
    university: "明治大学",
    faculty: "商学部",
    result: "合格",
    studyPeriod: "1年半",
    studyStyle: "予備校＋独学",
    tags: ["MARCH", "明治", "部活両立", "現役"],
    summary: "部活を7月に引退してから明治に合格するまでの記録。時間がない中でどう優先順位をつけたか。",
    author: "りく",
    createdAt: "2025年1月",
  },
  {
    id: "5",
    university: "早慶MARCH",
    faculty: "全落ち",
    result: "不合格",
    studyPeriod: "1年間",
    studyStyle: "予備校",
    tags: ["全落ち", "浪人決定", "私立文系"],
    summary: "予備校に100万以上かけて早慶MARCH全落ち。親に言えなかった3日間と、そこからの再起。",
    author: "ゆい",
    createdAt: "2025年4月",
  },
  {
    id: "6",
    university: "法政大学",
    faculty: "法学部",
    result: "合格",
    studyPeriod: "8ヶ月",
    studyStyle: "独学",
    tags: ["MARCH", "法政", "独学", "現役"],
    summary: "早慶は落ちたけど法政に合格。悔しさを抱えながら入学して気づいたこと。",
    author: "あおい",
    createdAt: "2025年3月",
  },
];

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-green-100 text-green-700",
  不合格: "bg-red-100 text-red-700",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">リアル受験体験記</h1>
            <p className="text-xs text-gray-500">早慶MARCH｜合格も失敗も、全部さらす。</p>
          </div>
          <Link
            href="/submit"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            体験記を投稿する
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">みんなのリアルな受験体験</h2>
          <p className="text-gray-500 text-sm">成功も失敗も、そのままの体験を共有しています。</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["すべて", "早稲田", "慶應", "MARCH", "合格", "不合格・浪人", "独学", "部活両立"].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 rounded-full text-sm border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DUMMY_EXPERIENCES.map((exp) => (
            <Link key={exp.id} href={`/experiences/${exp.id}`}>
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{exp.university}</p>
                    <p className="text-sm text-gray-500">{exp.faculty}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${RESULT_COLORS[exp.result] ?? "bg-gray-100 text-gray-600"}`}>
                    {exp.result}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{exp.summary}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{exp.studyPeriod}・{exp.studyStyle}</span>
                  <span>{exp.author}・{exp.createdAt}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
