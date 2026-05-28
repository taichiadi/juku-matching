import Link from "next/link";

type BranchRecord = {
  id: string;
  title: string;
  target_university: string;
  target_faculty: string | null;
  hardest_period: string;
  what_worked: string;
  what_failed: string;
  redo_advice: string;
};

const PREVIEW_RECORDS: BranchRecord[] = [
  {
    id: "preview-1",
    title: "夏休みに過去問を始めるタイミングを間違えた話",
    target_university: "早稲田大学",
    target_faculty: "法学部",
    hardest_period: "高3の8月。基礎が固まっていないのに過去問を解き始めて、点数が全く取れず自信を失った。",
    what_worked: "8月中旬に一度過去問をやめ、英単語・文法の総復習に戻した。2週間で基礎を固め直してから再挑戦。",
    what_failed: "「早めに過去問をやった方がいい」という情報を鵜呑みにして、自分の実力を確認しないまま始めた。",
    redo_advice: "過去問は「英単語2000語・文法一通り・現代文基礎」が揃ってから始める。夏前に1年分だけ傾向確認するのはOK。",
  },
  {
    id: "preview-2",
    title: "予備校選びで1ヶ月無駄にした浪人1年目の話",
    target_university: "慶應義塾大学",
    target_faculty: "経済学部",
    hardest_period: "浪人4月。体験授業を5校以上回り、比較に時間を使いすぎて4月を棒に振った。",
    what_worked: "5月に「どこでも大差ない」と割り切り、自分のペースで進められる映像授業に切り替えた。自習中心に変えてから成績が上がった。",
    what_failed: "予備校選びを完璧にしようとしすぎた。情報収集しているだけで勉強した気になっていた。",
    redo_advice: "予備校選びは1週間で終わらせる。どこに通うかより何をどう使うかの方が100倍大事。",
  },
  {
    id: "preview-3",
    title: "文理選択を直前まで迷って出遅れた高2の話",
    target_university: "東京大学",
    target_faculty: "文科二類",
    hardest_period: "高2の11月。文理を迷い続けた結果、どちらの科目も中途半端になり冬まで本腰を入れられなかった。",
    what_worked: "「どちらが好きか」ではなく「どちらの科目で戦えるか」を偏差値ベースで判断した。数学の伸びが止まっていたので文系に決めた。",
    what_failed: "好き・嫌いと得意・不得意を混同していた。感情で悩む時間が長すぎた。",
    redo_advice: "高2の9月には決める。迷ったら模試の偏差値だけで判断してよい。選択後は迷わないことの方が大事。",
  },
  {
    id: "preview-4",
    title: "高3の6月にMARCHから早慶に志望校を上げた話",
    target_university: "上智大学",
    target_faculty: "外国語学部",
    hardest_period: "高3の5〜6月。英語の偏差値が急上昇して「もっと上を狙えるかも」と思い始め、志望校を上げるか迷い続けた。",
    what_worked: "先輩に相談して「英語で早慶MARCHの差はそこまで大きくない」と聞き、国語と社会の対策を強化して上位校を狙う方針に切り替えた。",
    what_failed: "一科目だけ伸びたことで全体のバランスが見えなくなった。得意科目の偏差値だけで志望校を決めようとした。",
    redo_advice: "志望校の変更は全科目の偏差値が揃ってから判断する。一科目の急伸は罠になることがある。",
  },
  {
    id: "preview-5",
    title: "模試の判定を信じすぎて過去問が遅れた高3秋の話",
    target_university: "明治大学",
    target_faculty: "商学部",
    hardest_period: "高3の10月。模試でC判定が続いたため「まだ基礎が足りない」と思い込み、過去問に手をつけられなかった。",
    what_worked: "11月に「模試と入試は別物」と割り切り、10年分の過去問を一気に解いた。出題傾向を掴んでから得点が安定した。",
    what_failed: "模試の結果と入試の出題傾向を混同した。明治は記述が少ないのに、模試の記述対策ばかりしていた。",
    redo_advice: "過去問は10月には始める。傾向を掴むだけでいい。模試の判定は参考程度にして、志望校の形式に合わせた対策を優先する。",
  },
];

export default function BranchesPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-sm font-black text-slate-400 hover:text-slate-700">
            ← TOP
          </Link>
          <h1 className="text-lg font-black">分岐点DB</h1>
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-cyan-700">
            PREVIEW
          </span>
        </div>
      </header>

      <div className="bg-slate-950 px-4 py-2.5 text-center text-xs font-black text-white">
        これはプレビューです。実際に使うには
        <Link href="/student/login?next=/student/branches" className="ml-1 underline text-cyan-400 hover:text-cyan-300">
          ログイン
        </Link>
        してください。
      </div>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 rounded-3xl bg-slate-950 p-7 text-white">
          <p className="text-xs font-black tracking-[0.32em] text-amber-300">BRANCHING DB</p>
          <h1 className="mt-3 text-2xl font-black md:text-3xl">分岐点DB</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            合格した先輩がどこで何を変えたか。受験の転換点を記録したデータベースです。
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {["早稲田", "慶應", "東大", "MARCH", "浪人", "高3夏", "高3秋", "志望校変更"].map((tag) => (
            <button
              key={tag}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600"
              disabled
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {PREVIEW_RECORDS.map((rec) => (
            <Link
              key={rec.id}
              href="/experiences"
              className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                  {rec.target_university}
                </span>
                {rec.target_faculty && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                    {rec.target_faculty}
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-sm font-black leading-snug text-slate-950">{rec.title}</h2>
              <div className="mt-3 space-y-2">
                <div className="flex gap-2 text-xs">
                  <span className="shrink-0 font-black text-red-500">🔥 焦った時期</span>
                  <span className="line-clamp-2 text-slate-600">{rec.hardest_period}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="shrink-0 font-black text-emerald-600">✅ 変えたこと</span>
                  <span className="line-clamp-2 text-slate-600">{rec.what_worked}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="shrink-0 font-black text-amber-600">⚡ ズレたこと</span>
                  <span className="line-clamp-2 text-slate-600">{rec.what_failed}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="shrink-0 font-black text-cyan-600">🎯 今ならどうする</span>
                  <span className="line-clamp-2 text-slate-600">{rec.redo_advice}</span>
                </div>
              </div>
              <p className="mt-3 text-right text-xs font-black text-slate-400">詳細を見る →</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-slate-950 px-8 py-10 text-center text-white">
          <p className="text-xs font-black tracking-[0.32em] text-amber-300">LITE PLAN</p>
          <h2 className="mt-3 text-xl font-black">全件閲覧するにはLITEプランへ</h2>
          <p className="mt-2 text-sm text-slate-300">
            分岐点DBはLITEプラン（¥980/月）以上で利用できます。<br />
            先輩の転換点・失敗パターン・やり直し戦略を全件閲覧できます。
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/student/login?next=/student/branches"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              ログインして使う →
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              料金プランを見る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
