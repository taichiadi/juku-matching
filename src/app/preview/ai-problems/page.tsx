import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

const SAMPLE_PROBLEMS = [
  {
    question: `次の英文を読み、下線部「the paradox of choice」が意味する内容を80字以内の日本語で説明しなさい。\n\n"When people are given more options, they often feel less satisfied with their final decision. This phenomenon, known as the paradox of choice, suggests that an abundance of alternatives can lead to greater anxiety and regret."`,
    hint: "「逆説」という言葉と、「選択肢が多いほど満足度が下がる」という逆説的な構造に着目してください。",
    answer: "選択肢が多いほど人々の満足度が低下し、不安や後悔が増大するという逆説的な現象のこと。豊富な選択肢が必ずしも幸福につながらないというパラドックスを指している。",
  },
  {
    question: "「情報化社会における個人の主体性」というテーマで、あなたの意見を200字程度で述べなさい。",
    hint: "SNS・AIの普及と個人の判断力の関係を論じると論点が明確になります。賛否どちらかに立場を明確にしてから書き始めましょう。",
    answer: "【模範解答例】情報化社会では膨大な情報が個人に流れ込み、主体的な判断が困難になるリスクがある。アルゴリズムによるフィルタリングは個人の思考を画一化し、批判的思考力を弱める恐れがある。しかし、情報リテラシーを身につけた個人は逆に多様な視点を取得できる。よって重要なのはツールを使いこなす能力であり、教育によってその能力を育てることが求められる。",
  },
  {
    question: "次の日本語を英語に訳しなさい。\n\n「成功するためには、才能よりも努力と継続性が重要であるという考え方は、現代社会においてますます支持されている。」",
    hint: "「ますます支持されている」は `is increasingly supported` または `is gaining more support` が自然です。「才能よりも」は `more than talent` か `over talent` で表現できます。",
    answer: "The idea that effort and consistency are more important than talent for achieving success is increasingly supported in modern society.\n\n※ `consistency`（継続性・一貫性）は頻出単語。`gaining increasing support` も可。",
  },
];

export default function AiProblemsPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/preview/student-dashboard" className="text-sm font-black text-slate-400 hover:text-slate-700">
            ← 戻る
          </Link>
          <SenpaiLogo />
          <span className="ml-auto rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-cyan-700">
            PREVIEW
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 rounded-3xl bg-slate-950 p-7 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.32em] text-amber-400">AI PREDICTION</p>
              <h1 className="mt-3 text-2xl font-black md:text-3xl">AI的中予測問題</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                志望校・科目を選ぶと、Gemini AIが入試に的中しそうな練習問題を3問生成します。ヒントと模範解答付き。
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-amber-400 px-3 py-1 text-xs font-black text-amber-400">
              PRO限定
            </span>
          </div>
        </div>

        {/* 設定フォーム（プレビュー表示） */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-black tracking-[0.28em] text-amber-600">GENERATE</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-black text-slate-600">志望校</label>
              <input
                type="text"
                defaultValue="早稲田大学 法学部"
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-black text-slate-600">科目</label>
              <select disabled className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none">
                <option>英語</option>
              </select>
            </div>
          </div>
          <div className="mt-4 w-full rounded-xl bg-slate-950 py-4 text-center text-sm font-black text-white">
            的中予測問題を生成する
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">※ プレビューのため操作できません。以下はサンプル出力です。</p>
        </div>

        {/* サンプル問題 */}
        <div className="mt-4 space-y-3">
          <p className="text-xs font-black text-slate-400">早稲田大学 法学部 / 英語 の予測問題（サンプル）</p>
          {SAMPLE_PROBLEMS.map((p, i) => (
            <details key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <summary className="cursor-pointer px-5 py-4 list-none">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-bold leading-7 text-slate-900 whitespace-pre-line">{p.question}</p>
                  <span className="mt-1 shrink-0 text-slate-400">↓</span>
                </div>
              </summary>
              <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <p className="text-xs font-black text-amber-700 mb-1">ヒント</p>
                  <p className="text-sm leading-7 text-amber-900">{p.hint}</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <p className="text-xs font-black text-slate-500 mb-1">模範解答・解説</p>
                  <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">{p.answer}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
}
