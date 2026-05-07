import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const FAQ_CATEGORIES = [
  {
    category: "勉強法・計画",
    icon: "📅",
    questions: [
      {
        q: "高3の夏から始めて早慶・MARCHに間に合いますか？",
        a: "MARCHであれば夏スタートでも合格者は多くいます。ただし英語の基礎（単語・文法）が固まっていることが前提です。早慶は夏時点での実力次第ですが、夏以降に逆転した体験記も多くあります。まず現在の偏差値を確認して、志望校との差を把握することが先決です。",
      },
      {
        q: "1日何時間勉強すればいいですか？",
        a: "時間より質が重要ですが、目安として平日5〜7時間・休日10〜12時間が合格者の平均です。ただし「机に座っている時間」ではなく「集中して取り組んだ時間」で計測してください。最初は3時間でも集中できれば十分です。",
      },
      {
        q: "勉強計画を立てても続きません。どうすればいいですか？",
        a: "計画を細かく立てすぎることが原因です。週単位で「この週に何を終わらせる」という大まかな目標にして、1日のスケジュールは前夜に決める方法が続きやすいです。また、サボった日の翌日にリカバリー枠を設けておくと崩れにくくなります。",
      },
      {
        q: "過去問はいつから始めればいいですか？",
        a: "志望校の過去問は高3の10月を目安に始めるのが一般的です。ただし基礎が固まっていない状態で解いても効果が薄いため、「英単語2000語・文法一通り・現代文基礎」が揃ったタイミングで始めてください。早めに1年分解いて傾向を把握するのは夏でもOKです。",
      },
    ],
  },
  {
    category: "英語",
    icon: "🇬🇧",
    questions: [
      {
        q: "英単語が全然覚えられません。どうすればいいですか？",
        a: "1回に完璧に覚えようとしないことが大切です。1日100語をさっと見て、7日で700語を一周→また最初に戻る、というサイクルが効果的です。忘れることを前提に何周もすることで定着します。ターゲット1900やシステム英単語を使っている場合、まず1〜1000番を固めてから先へ進んでください。",
      },
      {
        q: "英語長文が読めません。どこから手をつければいいですか？",
        a: "長文が読めない原因はほぼ「単語不足」か「文法・構文の理解不足」です。まず単語帳を1冊完璧にしてから、英文解釈（ポレポレや英文解釈の技術100）で構文把握の練習をしてください。長文問題集は構文が読めるようになってから取り組むと効果が出ます。",
      },
      {
        q: "ネクステやVintageをやるべきですか？",
        a: "文法問題が入試に出る大学（早稲田・MARCH等）を受けるなら必要です。ただし全問やる必要はなく、文法・語法・イディオムのパートを優先してください。熟語は単語帳の熟語セクションで代替できます。1冊を3周して定着させることが大事です。",
      },
    ],
  },
  {
    category: "国語・小論文",
    icon: "📝",
    questions: [
      {
        q: "現代文が伸びません。何をすればいいですか？",
        a: "現代文は「なんとなく読む」から「根拠を持って解く」への転換が必要です。「入試現代文へのアクセス」で解法の型を学び、答えの根拠を本文から必ず見つける練習をしてください。感覚で解いている限り成績は安定しません。",
      },
      {
        q: "小論文の添削をしてほしいです。",
        a: "こちらのチャット窓口に小論文を貼り付けてください。「構成・内容・表現」の3点でフィードバックします。志望校名と字数制限も一緒に教えていただけると、より具体的なアドバイスができます。",
      },
      {
        q: "古文が全くわかりません。どこから始めればいいですか？",
        a: "まず古文単語（マドンナ古文単語かゴロ565）を200語覚えてください。並行して古文文法（助動詞の意味・接続）を「マドンナ古文」で学びます。単語と文法の基礎が揃えば、文章の大意はつかめるようになります。",
      },
    ],
  },
  {
    category: "社会（日本史・世界史）",
    icon: "🌏",
    questions: [
      {
        q: "日本史と世界史、どちらを選べばいいですか？",
        a: "どちらでも合格者はいるので、得意・好きな方を選んでください。日本史は暗記量が世界史より少なく、漢字が読める分とっつきやすい人が多いです。世界史はカタカナが多いですが、流れをつかむと覚えやすくなります。高校で習っている科目をそのまま使うのが最も効率的です。",
      },
      {
        q: "社会が全然終わりません。どこを優先すればいいですか？",
        a: "まず通史（流れ）を一通り終わらせることを最優先にしてください。細かい文化史・史料問題は直前期（11月以降）でOKです。山川の教科書を1周読んでから一問一答に取り組むと効率よく進められます。",
      },
    ],
  },
  {
    category: "塾・参考書選び",
    icon: "📚",
    questions: [
      {
        q: "塾に行かなくても合格できますか？",
        a: "できます。体験記の中にも独学合格者は多くいます。ただし自分でスケジュール管理・教材選び・弱点分析ができる必要があります。参考書の選び方や勉強の進め方に迷う場合は、塾よりまずこちらの相談窓口を活用してください。",
      },
      {
        q: "スタディサプリだけで合格できますか？",
        a: "基礎〜標準レベルの講義はスタサプで十分カバーできます。合格者の中にもスタサプメインで合格した人はいます。ただし問題演習（参考書・過去問）は別途必要です。スタサプ講義→参考書で演習→過去問、という流れが効果的です。",
      },
      {
        q: "参考書を何冊もやるべきですか？",
        a: "多冊より1冊完璧の方が圧倒的に効果的です。合格者の多くは「英単語1冊・文法1冊・長文1冊」を繰り返し使っています。新しい参考書を買う前に、今持っている参考書を3周できているか確認してください。",
      },
    ],
  },
  {
    category: "メンタル・生活",
    icon: "💪",
    questions: [
      {
        q: "モチベーションが続きません。",
        a: "モチベーションに頼る勉強は長続きしません。「やる気があるときだけ勉強する」ではなく、「決まった時間に決まった場所で勉強する」というルーティンを作ることが大事です。まず毎日1時間だけ必ずやると決めて、それを習慣化することから始めてください。",
      },
      {
        q: "スマホをやめられません。",
        a: "意志力で制限しようとしても失敗します。物理的に手の届かない場所に置く・機能制限アプリ（Opal等）を入れる・スマホを別の部屋に置いて勉強するなど、環境を変えることが唯一の解決策です。体験記の中にも「スマホ中毒克服」タグで似た経験者の話があります。",
      },
      {
        q: "メンタルが辛くて勉強に集中できません。",
        a: "勉強の悩みはこちらで相談できますが、メンタル・家庭環境・人間関係の悩みは先輩チューターへの相談をおすすめします。同じ経験をした先輩が話を聞いてくれます。（チューター相談は近日公開予定です）",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <SenpaiLogo showText={false} />
          <h1 className="text-base font-bold text-gray-900">よくある相談・解決策</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">受験生がよく悩むこと</h2>
          <p className="text-gray-500 text-sm">解決できない場合は下のチャットから相談してください。</p>
        </div>

        <div className="space-y-8">
          {FAQ_CATEGORIES.map((cat) => (
            <section key={cat.category}>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                <span>{cat.icon}</span>
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.questions.map((item) => (
                  <details
                    key={item.q}
                    className="bg-white rounded-xl border border-gray-200 group"
                  >
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                      <span className="text-sm font-medium text-gray-900 pr-4">{item.q}</span>
                      <span className="text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform text-lg">
                        ↓
                      </span>
                    </summary>
                    <div className="px-5 pb-5">
                      <div className="h-px bg-gray-100 mb-4" />
                      <p className="text-sm text-gray-700 leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-blue-600 rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg mb-1">解決しなかった？直接相談しよう</p>
          <p className="text-blue-100 text-sm mb-4">勉強法・参考書・小論文添削など、何でも聞いてください。</p>
          <Link
            href="/student/login?service=study-room"
            className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-block text-sm"
          >
            相談する（無料・24時間）
          </Link>
        </div>
      </main>
    </div>
  );
}
