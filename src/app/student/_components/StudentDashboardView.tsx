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
  { href: "/student/check",       label: "📍", title: "現在地チェック", proOnly: false },
  { href: "/student/study-room",  label: "01",  title: "ルート相談",    proOnly: false },
  { href: "/student/correction",  label: "02",  title: "専門添削",      proOnly: false },
  { href: "/student/focus-room",  label: "03",  title: "集中ルーム",    proOnly: false },
  { href: "/student/ai-problems", label: "PRO", title: "苦手対策演習",  proOnly: true  },
];

const STATUS_LABELS: Record<StudentServiceRequest["status"], string> = {
  new: "受付済み",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
};

const SERVICE_LABELS: Record<StudentServiceRequest["service_type"], string> = {
  study_room: "24h質問",
  correction: "添削",
  focus_room: "集中ルーム",
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
  extraQuestions = 0,
  extraConsultations = 0,
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
  extraQuestions?: number;
  extraConsultations?: number;
}) {
  const profileItems = [
    { label: "性別",     value: profile?.gender           || "未回答" },
    { label: "偏差値",   value: profile?.currentDeviation || "未設定" },
    { label: "受験状況", value: profile?.status           || "未設定" },
    { label: "スタイル", value: profile?.studyStyle       || "未設定" },
    { label: "受験年度", value: profile?.examYear         || "未設定" },
  ];
  const displayName        = profile?.displayName || "生徒";
  const targetUniversities = profile?.targetUniversities.length
    ? profile.targetUniversities
    : ["志望校未設定"];
  const maxScore = Math.max(70, ...scoreHistory.map((p) => p.score));

  return (
    <main className="mx-auto max-w-2xl px-2.5 py-3">
      <AddToHomeBanner />

      {preview && (
        <div className="mb-2 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-bold text-cyan-800">
          プレビュー表示中。本番ログインやデータ保存は行われません。
        </div>
      )}

      {/* ── Hero ── */}
      <section className="rounded-xl bg-slate-950 px-4 py-2.5 text-white">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-black tracking-[0.3em] text-lime-300">STUDENT DASHBOARD</p>
          <Link
            href="/student/plan"
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black transition-colors ${
              plan === "pro"
                ? "bg-amber-400 text-slate-950"
                : plan === "standard"
                ? "bg-cyan-400 text-slate-950"
                : "border border-white/20 text-slate-400 hover:text-white"
            }`}
          >
            {PLAN_LABELS[plan]} {plan === "free" ? "→ 登録" : ""}
          </Link>
        </div>
        <h1 className="mt-1 text-sm font-black">{displayName}さんのマイページ</h1>
      </section>

      {/* ── Profile ── */}
      <section className="mt-2 rounded-xl border border-slate-200 bg-white p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <p className="text-[9px] font-black tracking-[0.24em] text-cyan-700">PROFILE</p>
            {targetUniversities.map((u) => (
              <span key={u} className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black text-cyan-800">
                {u}
              </span>
            ))}
          </div>
          <Link href="/student/profile/edit" className="shrink-0 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black text-white hover:bg-cyan-700">
            更新 →
          </Link>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1">
          {profileItems.map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-50 px-2 py-1.5">
              <p className="text-[9px] font-black text-slate-400">{item.label}</p>
              <p className="mt-0.5 truncate text-[10px] font-black text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="mt-2 grid grid-cols-4 gap-1.5">
        {SERVICES.map((svc) => (
          <Link
            key={svc.href}
            href={preview ? svc.href.replace("/student", "/preview") : svc.href}
            className={`group flex flex-col items-center rounded-xl border px-2 py-2.5 transition-all hover:-translate-y-0.5 ${
              svc.proOnly
                ? "border-amber-200 bg-amber-50 hover:border-amber-400"
                : "border-slate-200 bg-white hover:border-cyan-300"
            }`}
          >
            <p className={`text-[9px] font-black tracking-[0.18em] ${svc.proOnly ? "text-amber-600" : "text-cyan-600"}`}>{svc.label}</p>
            <p className="mt-1 text-center text-[11px] font-black leading-tight text-slate-700">{svc.title}</p>
            <span className={`mt-1.5 rounded-full px-2 py-0.5 text-[9px] font-black text-white ${
              svc.proOnly ? "bg-amber-500" : "bg-slate-950 group-hover:bg-cyan-700"
            }`}>
              開く
            </span>
          </Link>
        ))}
      </section>

      {/* ── Diagnostic + Scores ── */}
      <section className="mt-2 grid gap-2 lg:grid-cols-2">
        {/* Diagnostic */}
        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black tracking-[0.22em] text-cyan-700">DIAGNOSTIC</p>
              <h2 className="mt-0.5 text-[11px] font-black">先輩診断結果</h2>
            </div>
            {diagnostic?.updatedAt && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500">{diagnostic.updatedAt}</span>
            )}
          </div>

          {diagnostic ? (
            <div className="mt-2 grid gap-1.5 md:grid-cols-2">
              <div className="rounded-lg bg-slate-950 p-2.5 text-white">
                <p className="text-[9px] font-black tracking-[0.18em] text-lime-300">TYPE</p>
                <p className="mt-1 text-sm font-black leading-tight">{diagnostic.typeName}</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-300">{diagnostic.examStrategy}</p>
              </div>
              <div>
                <p className="rounded-lg bg-cyan-50 px-2.5 py-1.5 text-[10px] font-black text-cyan-800">
                  推奨: {diagnostic.recommendedMethod}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {diagnostic.strengths.map((s) => (
                    <span key={s} className="rounded-full border border-cyan-200 bg-white px-2 py-0.5 text-[9px] font-black text-slate-700">{s}</span>
                  ))}
                </div>
                <Link href="/diagnostic" className="mt-1.5 inline-flex rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black text-white hover:bg-cyan-700">
                  更新 →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2.5">
              <p className="text-[10px] font-black text-slate-700">まだ診断結果がありません</p>
              <Link href="/diagnostic" className="mt-1.5 inline-flex rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black text-white">
                診断を始める →
              </Link>
            </div>
          )}
        </div>

        {/* Scores */}
        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black tracking-[0.22em] text-cyan-700">SCORE TREND</p>
              <h2 className="mt-0.5 text-[11px] font-black">模試・英検成績</h2>
            </div>
            <Link href="/student/mock-scores" className="shrink-0 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black text-white hover:bg-cyan-700">
              登録 →
            </Link>
          </div>

          {scoreHistory.length > 0 ? (
            <div className="mt-2 flex h-20 items-end gap-1.5">
              {scoreHistory.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-0.5">
                  <div className="flex h-14 w-full items-end rounded-lg bg-slate-100 px-1 pt-1">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-cyan-700 via-cyan-400 to-lime-300"
                      style={{ height: `${Math.max(16, (point.score / maxScore) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] font-black text-slate-950">{point.score}</p>
                  <p className="w-full truncate text-center text-[8px] text-slate-400">{point.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2.5">
              <p className="text-[10px] font-black text-slate-700">模試結果を登録するとグラフ化されます</p>
            </div>
          )}

          {eikenHistory.length > 0 && (
            <div className="mt-2 border-t border-slate-100 pt-2">
              <p className="mb-1 text-[9px] font-black tracking-[0.18em] text-slate-400">英検</p>
              <div className="flex flex-wrap gap-1">
                {eikenHistory.map((e) => (
                  <span key={e.exam_date + e.level} className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-black text-slate-700">
                    英検{e.level}
                    {e.result && (
                      <span className={`rounded-full px-1 py-0.5 text-[8px] font-black ${
                        e.result === "合格" ? "bg-emerald-100 text-emerald-700"
                        : e.result === "不合格" ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                      }`}>{e.result}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Favorites ── */}
      <section className="mt-2 rounded-xl border border-slate-200 bg-white p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] font-black tracking-[0.22em] text-cyan-700">FAVORITE SENPAI</p>
            <h2 className="mt-0.5 text-[11px] font-black">お気に入り先輩</h2>
          </div>
          <Link href="/#ranking" className="shrink-0 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black text-white hover:bg-cyan-700">
            探す →
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="mt-2 grid gap-1.5 md:grid-cols-3">
            {favorites.map((senpai) => (
              <Link
                key={senpai.id}
                href={preview ? "/#ranking" : `/experiences/${senpai.id}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50"
              >
                <h3 className="text-[10px] font-black leading-tight">{senpai.title}</h3>
                <p className="mt-0.5 text-[9px] text-slate-600">{senpai.university}{senpai.faculty ? ` ${senpai.faculty}` : ""}</p>
                <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-slate-500">{senpai.reason}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2.5 text-center">
            <p className="text-[10px] font-black text-slate-600">まだお気に入り先輩は保存されていません</p>
            <p className="mt-0.5 text-[9px] text-slate-400">気になる体験記を保存すると、あとから比較できます。</p>
          </div>
        )}
      </section>

      {/* ── Usage ── */}
      {!preview && (
        <div className="mt-2">
          <UsageMeter
            plan={plan}
            questionsUsed={questionsUsedThisMonth}
            correctionsUsed={correctionsUsedThisMonth}
            extraQuestions={extraQuestions}
            extraConsultations={extraConsultations}
          />
        </div>
      )}

      {/* ── Request history ── */}
      <section className={`mt-2 rounded-xl border bg-white p-2.5 ${unreadReplyCount > 0 ? "border-cyan-300 ring-2 ring-cyan-100" : "border-slate-200"}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[11px] font-black">対応履歴</h2>
            {unreadReplyCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-cyan-500 px-2 py-0.5 text-[9px] font-black text-white">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                新着 {unreadReplyCount}件
              </span>
            )}
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500">{requests.length}件</span>
        </div>

        {requests.length === 0 ? (
          <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center">
            <p className="text-[10px] text-slate-500">まだ受付履歴はありません</p>
          </div>
        ) : (
          <div className="mt-2 space-y-1.5">
            {requests.map((request) => {
              const hasUnread = !!request.admin_reply && !request.reply_read_at;
              return (
                <article key={request.id} className={`rounded-lg border p-2 ${hasUnread ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[9px] font-black text-white">{SERVICE_LABELS[request.service_type]}</span>
                      <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[9px] font-black text-cyan-700">{STATUS_LABELS[request.status]}</span>
                    </div>
                    <time className="text-[9px] text-slate-400">{new Date(request.created_at).toLocaleString("ja-JP")}</time>
                  </div>

                  {request.field_values && Object.keys(request.field_values).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {Object.entries(request.field_values).map(([key, value]) => (
                        <span key={key} className="rounded-full bg-white px-2 py-0.5 text-[9px] text-slate-600">
                          {key}: {value || "未入力"}
                        </span>
                      ))}
                    </div>
                  )}

                  {request.attachments && request.attachments.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {request.attachments.map((a) => (
                        <span key={a.path} className="rounded-full bg-lime-50 px-2 py-0.5 text-[9px] font-black text-lime-700">
                          添付: {a.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-600">{request.message}</p>

                  {request.admin_reply && (
                    <div className={`mt-1.5 rounded-lg border px-2.5 py-1.5 ${hasUnread ? "border-cyan-400 bg-white" : "border-cyan-200 bg-cyan-50"}`}>
                      <div className="flex items-center gap-1">
                        <p className="text-[9px] font-black tracking-[0.14em] text-cyan-700">運営からの返信</p>
                        {hasUnread && <span className="rounded-full bg-cyan-500 px-1.5 py-0.5 text-[8px] font-black text-white">NEW</span>}
                      </div>
                      <p className="mt-0.5 whitespace-pre-line text-[10px] leading-4 text-slate-800">{request.admin_reply}</p>
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
