import Link from "next/link";

const CARDS = [
  {
    href: "/student/study-room",
    eyebrow: "STUDY Q&A",
    title: "勉強の疑問を24時間いつでも質問",
    cta: "質問する →",
    ui: (
      <div className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-cyan-500 px-3 py-2">
            <p className="text-[11px] font-black text-white">関係代名詞のwhichとthatの使い分けは？</p>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs">👤</div>
          <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2">
            <p className="text-[11px] font-black leading-5 text-slate-950">先行詞が人かどうかが基本の分け方で……</p>
          </div>
        </div>
        <p className="pt-0.5 text-center text-[9px] text-slate-400">英語・国語・数学・社会など対応</p>
      </div>
    ),
  },
  {
    href: "/student/study-plans",
    eyebrow: "FORCED STUDY",
    title: "強制自習サービス",
    cta: "自習を始める →",
    ui: (
      <div className="rounded-xl border border-slate-200 bg-white p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black tracking-widest text-slate-400">今日のノルマ</p>
          <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[8px] font-black text-cyan-600">進行中</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { label: "英語単語 100問",   done: true },
            { label: "現代文 1題",       done: true },
            { label: "英文法 50問",      done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${item.done ? "bg-cyan-500 text-white" : "border border-slate-200 text-transparent"}`}>
                ✓
              </span>
              <p className={`text-[11px] font-black ${item.done ? "text-slate-950" : "text-slate-300"}`}>{item.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[9px] text-slate-400">完了報告でサボり防止</p>
      </div>
    ),
  },
  {
    href: "/student/correction",
    eyebrow: "CORRECTION",
    title: "現役早慶予備校講師が英作文・小論文添削",
    cta: "添削を依頼する →",
    ui: (
      <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3.5">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <p className="text-[8px] font-black text-cyan-600">添削コメント</p>
          <p className="mt-1 text-[11px] font-black leading-5 text-slate-950">
            「この構成だと問いへの答えが後回しになっています。結論を先に。」
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
          <p className="text-[8px] font-black text-slate-400">＋ 合格者の答案と比較もできる</p>
          <p className="mt-0.5 text-[10px] leading-5 text-slate-500">
            「問いに直接答える構成 → 根拠 → まとめ」が慶應SFCでは基本。
          </p>
        </div>
      </div>
    ),
  },
  {
    href: "/student/check",
    eyebrow: "CURRENT CHECK",
    title: "現在地チェックで先輩と比較",
    cta: "先輩と比較する →",
    ui: (
      <div className="rounded-xl border border-slate-200 bg-white p-3.5">
        <p className="text-[9px] font-black text-slate-400">合格した先輩の同時期と比べると</p>
        <div className="mt-3 space-y-2.5">
          {[
            { label: "英単語の進捗", mine: 60, senpai: 80 },
            { label: "過去問着手",   mine: 0,  senpai: 30 },
          ].map((item) => (
            <div key={item.label}>
              <p className="mb-1 text-[9px] font-black text-slate-500">{item.label}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-8 shrink-0 text-[8px] text-slate-400">自分</span>
                <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full bg-cyan-500" style={{ width: `${item.mine}%` }} />
                </div>
                <span className="w-6 text-right text-[8px] font-black text-slate-950">{item.mine}%</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-8 shrink-0 text-[8px] text-slate-400">先輩</span>
                <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full bg-slate-400" style={{ width: `${item.senpai}%` }} />
                </div>
                <span className="w-6 text-right text-[8px] font-black text-slate-400">{item.senpai}%</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[9px] text-slate-400">約1分で現在地が分かります</p>
      </div>
    ),
  },
  {
    href: "/student/correction",
    eyebrow: "PAST EXAM",
    title: "過去問採点・点数フィードバック",
    cta: "過去問を提出する →",
    ui: (
      <div className="rounded-xl border border-slate-200 bg-white p-3.5">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[8px] font-black text-amber-600">慶應SFC 2024</span>
          <span className="text-[8px] text-slate-400">小論文</span>
        </div>
        <div className="space-y-2.5">
          {[
            { label: "論理構成", score: 18, max: 20 },
            { label: "内容・知識", score: 14, max: 20 },
            { label: "表現・語彙", score: 16, max: 20 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <p className="w-20 shrink-0 text-[10px] font-black text-slate-500">{item.label}</p>
              <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-1.5 rounded-full bg-cyan-500"
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
              <p className="w-8 text-right text-[10px] font-black text-slate-950">{item.score}/{item.max}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[9px] text-slate-400">科目・配点に合わせてフィードバック</p>
      </div>
    ),
  },
];

export default function UseScenesSection() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-[10px] font-black tracking-[0.28em] text-slate-400">SERVICES</p>
          <p className="mt-2 inline-block text-lg font-black text-slate-950 underline decoration-cyan-500 decoration-[3px] underline-offset-[6px] md:text-xl">
            その他のサービス
          </p>
          <p className="mt-2 text-xs text-slate-400">
            先輩相談以外にも、受験で使えるサービスを揃えています。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {CARDS.map((card, i) => (
            <Link
              key={card.href + card.title}
              href={card.href}
              className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-cyan-300 hover:shadow-md${
                i === CARDS.length - 1 && CARDS.length % 2 !== 0 ? " md:col-span-2" : ""
              }`}
            >
              <p className="text-[9px] font-black tracking-[0.22em] text-slate-400">{card.eyebrow}</p>
              <h3 className="mt-1.5 text-base font-black text-slate-950">{card.title}</h3>
              <div className="mt-5 flex-1">{card.ui}</div>
              <p className="mt-5 text-xs font-black text-slate-400 transition-colors group-hover:text-cyan-600">
                {card.cta}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
