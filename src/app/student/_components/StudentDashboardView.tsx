import Link from "next/link";
import AddToHomeBanner from "@/components/AddToHomeBanner";
import UsageMeter from "@/components/UsageMeter";
import type { PlanType } from "@/lib/planLimits";
import { PLAN_LABELS } from "@/lib/planLimits";

export type StudentServiceRequest = {
  id: string;
  service_type: "study_room" | "correction" | "focus_room";
  status: "new" | "in_progress" | "done" | "cancelled";
  field_values: Record<string, string> | null;
  message: string;
  admin_reply?: string | null;
  reply_read_at?: string | null;
  attachments?: {
    bucket: string;
    path: string;
    name: string;
    size: number;
    type: string;
  }[] | null;
  created_at: string;
};

export type StudentProfileSummary = {
  displayName?: string;
  gender?: string;
  targetUniversities: string[];
  currentDeviation?: string;
  status?: string;
  studyStyle?: string;
  examYear?: string;
};

export type DiagnosticSummary = {
  typeName: string;
  examStrategy: string;
  recommendedMethod: string;
  strengths: string[];
  updatedAt?: string;
};

export type ScorePoint = {
  label: string;
  score: number;
};

export type EikenRecord = {
  level: string;
  exam_date: string;
  result: string | null;
};

export type FavoriteSenpai = {
  id: string;
  university: string;
  faculty?: string | null;
  title: string;
  reason: string;
};

const SERVICES = [
  {
    href: "/student/study-room",
    label: "Service 01",
    title: "24h質問対応窓口",
    body: "深夜・早朝を問わず、勉強内容の質問やメンタルの不安を現役予備校講師・早慶生が即座に受け付けます。",
    comingSoon: false,
  },
  {
    href: "/student/correction",
    label: "Service 02",
    title: "志望校特化・専門添削",
    body: "小論文・英作文・過去問を提出すると、志望校に受かった先輩が合格者の視点で添削します。",
    comingSoon: false,
  },
  {
    href: "/student/focus-room",
    label: "Service 03",
    title: "オンライン強制自習",
    body: "目標宣言、集中タイマー、離脱ログ、終了レポートで、自習を見える化します。",
    comingSoon: true,
  },
];

const STATUS_LABELS: Record<StudentServiceRequest["status"], string> = {
  new: "受付済み",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
};

const SERVICE_LABELS: Record<StudentServiceRequest["service_type"], string> = {
  study_room: "24h質問対応",
  correction: "専門添削",
  focus_room: "オンライン強制自習",
};

export default function StudentDashboardView({
  requests,
  preview = false,
  profile,
  diagnostic,
  scoreHistory = [],
  eikenHistory = [],
  favorites = [],
  unreadReplyCount = 0,
  plan = "free",
  questionsUsedThisMonth = 0,
  correctionsUsedThisMonth = 0,
}: {
  requests: StudentServiceRequest[];
  preview?: boolean;
  profile?: StudentProfileSummary;
  diagnostic?: DiagnosticSummary | null;
  scoreHistory?: ScorePoint[];
  eikenHistory?: EikenRecord[];
  favorites?: FavoriteSenpai[];
  unreadReplyCount?: number;
  plan?: PlanType;
  questionsUsedThisMonth?: number;
  correctionsUsedThisMonth?: number;
}) {
  const profileItems = [
    { label: "性別", value: profile?.gender || "未回答" },
    { label: "偏差値", value: profile?.currentDeviation || "未設定" },
    { label: "受験状況", value: profile?.status || "未設定" },
    { label: "勉強スタイル", value: profile?.studyStyle || "未設定" },
    { label: "受験年度", value: profile?.examYear || "未設定" },
  ];
  const displayName = profile?.displayName || "生徒";
  const targetUniversities = profile?.targetUniversities.length ? profile.targetUniversities : ["志望校未設定"];
  const maxScore = Math.max(70, ...scoreHistory.map((point) => point.score));

  return (
    <main className="mx-auto max-w-5xl px-3 py-4 md:px-4 md:py-6">
      <AddToHomeBanner />
      {preview && (
        <div className="mb-3 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-800">
          プレビュー表示中。本番ログインやデータ保存は行われません。
        </div>
      )}

      {/* Hero */}
      <section className="rounded-2xl bg-slate-950 px-5 py-5 text-white shadow-[0_12px_40px_rgba(15,23,42,0.18)] md:px-7 md:py-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-black tracking-[0.34em] text-lime-300">STUDENT DASHBOARD</p>
          <Link
            href="/student/plan"
            className={`rounded-full px-3 py-1 text-[10px] font-black transition-colors ${
              plan === "pro"
                ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
                : plan === "standard"
                ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                : "border border-white/20 text-slate-400 hover:text-white"
            }`}
          >
            {PLAN_LABELS[plan]}プラン {plan === "free" ? "→ 登録" : ""}
          </Link>
        </div>
        <h1 className="mt-2 text-xl font-black leading-tight md:text-3xl">
          {displayName}さんのマイページ
        </h1>
        <p className="mt-2 hidden text-xs leading-6 text-slate-400 md:block">
          診断結果・模試の推移・お気に入り先輩・相談履歴をまとめています。
        </p>
      </section>

      {/* Profile */}
      <section className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-black tracking-[0.28em] text-cyan-700">PROFILE</p>
            <h2 className="mt-1 text-base font-black md:text-lg">{displayName}さんの受験プロフィール</h2>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {targetUniversities.map((university) => (
                <span
                  key={university}
                  className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-xs font-black text-cyan-800"
                >
                  {university}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/student/profile/edit"
            className="shrink-0 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white transition-colors hover:bg-cyan-700"
          >
            更新 →
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 md:grid-cols-5">
          {profileItems.map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-black tracking-wide text-slate-400">{item.label}</p>
              <p className="mt-0.5 truncate text-sm font-black text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Diagnostic + Mock scores */}
      <section className="mt-3 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black tracking-[0.26em] text-cyan-700">DIAGNOSTIC RESULT</p>
              <h2 className="mt-1 text-base font-black md:text-lg">先輩診断結果</h2>
            </div>
            {diagnostic?.updatedAt && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-500">
                {diagnostic.updatedAt}
              </span>
            )}
          </div>

          {diagnostic ? (
            <div className="mt-3 grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-xl bg-slate-950 p-4 text-white">
                <p className="text-[10px] font-black tracking-[0.2em] text-lime-300">TYPE</p>
                <p className="mt-2 text-xl font-black leading-tight">{diagnostic.typeName}</p>
                <p className="mt-2 text-xs font-bold leading-6 text-slate-300">{diagnostic.examStrategy}</p>
              </div>
              <div>
                <p className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-800">
                  推奨ルート: {diagnostic.recommendedMethod}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {diagnostic.strengths.map((strength) => (
                    <span
                      key={strength}
                      className="rounded-full border border-cyan-200 bg-white px-2.5 py-0.5 text-xs font-black text-slate-700"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
                <Link
                  href="/diagnostic"
                  className="mt-3 inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition-colors hover:bg-cyan-700"
                >
                  診断を更新する →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">まだ診断結果がありません</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                先輩診断を使うと、境遇が近い先輩や向いている受験戦略をここに保存できます。
              </p>
              <Link
                href="/diagnostic"
                className="mt-3 inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white"
              >
                診断を始める →
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black tracking-[0.26em] text-cyan-700">SCORE TREND</p>
              <h2 className="mt-1 text-base font-black md:text-lg">模試・英検の成績変動</h2>
            </div>
            <Link
              href="/student/mock-scores"
              className="shrink-0 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white transition-colors hover:bg-cyan-700"
            >
              成績を登録 →
            </Link>
          </div>
          {scoreHistory.length > 0 ? (
            <>
              <div className="mt-3 flex h-28 items-end gap-2">
                {scoreHistory.map((point) => (
                  <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-20 w-full items-end rounded-xl bg-slate-100 px-1.5 pt-1.5">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-cyan-700 via-cyan-400 to-lime-300"
                        style={{ height: `${Math.max(16, (point.score / maxScore) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs font-black text-slate-950">{point.score}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate w-full text-center">{point.label}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">模試結果を登録するとグラフ化されます</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                偏差値の変化と相談履歴を並べて、伸びた理由を見つけられるようにします。
              </p>
            </div>
          )}
          {eikenHistory.length > 0 && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-slate-400">英検</p>
              <div className="flex flex-wrap gap-2">
                {eikenHistory.map((e) => (
                  <span key={e.exam_date + e.level} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-700">
                    英検{e.level}
                    {e.result && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                        e.result === "合格" ? "bg-emerald-100 text-emerald-700"
                        : e.result === "不合格" ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                      }`}>
                        {e.result}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Favorites */}
      <section className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-black tracking-[0.26em] text-cyan-700">FAVORITE SENPAI</p>
            <h2 className="mt-1 text-base font-black md:text-lg">お気に入り先輩</h2>
          </div>
          <Link href="/#ranking" className="shrink-0 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white hover:bg-cyan-700 transition-colors">
            先輩を探す →
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {favorites.map((senpai) => (
              <Link
                key={senpai.id}
                href={preview ? "/#ranking" : `/experiences/${senpai.id}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50"
              >
                <p className="text-[10px] font-black tracking-[0.18em] text-cyan-700">SAVED SENPAI</p>
                <h3 className="mt-1 text-sm font-black">{senpai.title}</h3>
                <p className="mt-1 text-xs font-bold text-slate-600">
                  {senpai.university}{senpai.faculty ? ` ${senpai.faculty}` : ""}
                </p>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{senpai.reason}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
            <p className="text-xs font-black text-slate-600">まだお気に入り先輩は保存されていません</p>
            <p className="mt-1 text-xs text-slate-400">
              気になる体験記を保存すると、あとから比較して見返せます。
            </p>
          </div>
        )}
      </section>

      {/* Usage Meter */}
      {!preview && (
        <div className="mt-3">
          <UsageMeter
            plan={plan}
            questionsUsed={questionsUsedThisMonth}
            correctionsUsed={correctionsUsedThisMonth}
          />
        </div>
      )}

      {/* Services */}
      <section className="mt-3 grid gap-2 md:grid-cols-3">
        {SERVICES.map((service) =>
          service.comingSoon ? (
            <div
              key={`${service.href}-${service.label}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 opacity-60 shadow-sm md:flex-col md:items-start md:p-4"
            >
              <div className="min-w-0 flex-1 md:flex-none">
                <p className="text-[10px] font-black tracking-[0.28em] text-cyan-600">{service.label}</p>
                <h2 className="mt-0.5 text-sm font-black md:mt-1 md:text-base">{service.title}</h2>
                <p className="mt-0.5 hidden text-xs leading-5 text-slate-600 md:mt-1 md:block">{service.body}</p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-black text-slate-400">
                準備中
              </span>
            </div>
          ) : (
            <Link
              key={`${service.href}-${service.label}`}
              href={preview ? service.href.replace("/student", "/preview") : service.href}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md md:flex-col md:items-start md:p-4"
            >
              <div className="min-w-0 flex-1 md:flex-none">
                <p className="text-[10px] font-black tracking-[0.28em] text-cyan-600">{service.label}</p>
                <h2 className="mt-0.5 text-sm font-black md:mt-1 md:text-base">{service.title}</h2>
                <p className="mt-0.5 hidden text-xs leading-5 text-slate-600 md:mt-1 md:block">{service.body}</p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white transition-colors group-hover:bg-cyan-700">
                開く →
              </span>
            </Link>
          )
        )}
      </section>

      {/* Request history */}
      <section className={`mt-3 rounded-2xl border bg-white p-4 md:p-5 ${unreadReplyCount > 0 ? "border-cyan-300 ring-2 ring-cyan-100" : "border-slate-200"}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black md:text-base">対応履歴</h2>
              {unreadReplyCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-cyan-500 px-2.5 py-0.5 text-xs font-black text-white">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  新着返信 {unreadReplyCount}件
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">送信した相談・添削依頼の状況を確認できます。</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-500">
            {requests.length}件
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
            <p className="text-xs font-bold text-slate-500">まだ受付履歴はありません</p>
            <p className="mt-1 text-xs text-slate-400">24h質問対応か専門添削を送信すると、ここに表示されます。</p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {requests.map((request) => {
              const hasUnread = !!request.admin_reply && !request.reply_read_at;
              return (
              <article key={request.id} className={`rounded-xl border p-3 ${hasUnread ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-slate-950 px-2.5 py-0.5 text-xs font-black text-white">
                      {SERVICE_LABELS[request.service_type]}
                    </span>
                    <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-black text-cyan-700">
                      {STATUS_LABELS[request.status]}
                    </span>
                  </div>
                  <time className="text-xs font-bold text-slate-400">
                    {new Date(request.created_at).toLocaleString("ja-JP")}
                  </time>
                </div>
                {request.field_values && Object.keys(request.field_values).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(request.field_values).map(([key, value]) => (
                      <span key={key} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-slate-600">
                        {key}: {value || "未入力"}
                      </span>
                    ))}
                  </div>
                )}
                {request.attachments && request.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {request.attachments.map((attachment) => (
                      <span
                        key={attachment.path}
                        className="rounded-full bg-lime-50 px-2.5 py-0.5 text-xs font-black text-lime-700"
                      >
                        添付: {attachment.name}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{request.message}</p>
                {request.admin_reply && (
                  <div className={`mt-2 rounded-xl border px-3 py-2 ${hasUnread ? "border-cyan-400 bg-white" : "border-cyan-200 bg-cyan-50"}`}>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black tracking-[0.18em] text-cyan-700">運営からの返信</p>
                      {hasUnread && (
                        <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-black text-white">NEW</span>
                      )}
                    </div>
                    <p className="mt-1 whitespace-pre-line text-xs font-bold leading-5 text-slate-800">
                      {request.admin_reply}
                    </p>
                  </div>
                )}
              </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
