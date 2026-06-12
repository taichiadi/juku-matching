"use client";

import Link from "next/link";
import AddToHomeBanner from "@/components/AddToHomeBanner";
import TutorAvatar from "@/components/TutorAvatar";

export type StudentServiceRequest = {
  id: string;
  service_type: "study_room" | "correction" | "kakomon_bunseki";
  status: "new" | "in_progress" | "done" | "cancelled" | "pending_payment";
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

export type FavoriteSenpai = {
  id: string;
  university: string;
  faculty?: string | null;
  title: string;
  reason: string;
  tutor_display_name?: string | null;
  tutor_avatar_url?: string | null;
};

const STATUS_LABELS: Record<StudentServiceRequest["status"], string> = {
  new: "受付済み",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
  pending_payment: "支払い待ち",
};

const SERVICE_LABELS: Record<StudentServiceRequest["service_type"], string> = {
  study_room: "先輩に質問",
  correction: "添削",
  kakomon_bunseki: "過去問分析",
};

function getDaysUntilExam(examYear?: string): number | null {
  if (!examYear) return null;
  const year = parseInt(examYear, 10);
  if (isNaN(year)) return null;
  const examDate = new Date(year, 0, 15); // 1月15日を共通テスト基準日として設定
  const today = new Date();
  const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

export default function StudentDashboardView({
  requests,
  preview = false,
  profile,
  favorites = [],
  unreadReplyCount = 0,
}: {
  requests: StudentServiceRequest[];
  preview?: boolean;
  profile?: StudentProfileSummary;
  favorites?: FavoriteSenpai[];
  unreadReplyCount?: number;
}) {
  const displayName = profile?.displayName || "生徒";
  const targetUniversities = profile?.targetUniversities.length
    ? profile.targetUniversities
    : ["志望校未設定"];
  const deviation = profile?.currentDeviation ? parseInt(profile.currentDeviation, 10) : null;
  const daysLeft = getDaysUntilExam(profile?.examYear);

  // 偏差値カラー
  const deviationColor =
    deviation == null ? "text-white" :
    deviation >= 70 ? "text-emerald-400" :
    deviation >= 60 ? "text-cyan-400" :
    deviation >= 50 ? "text-yellow-400" :
    "text-orange-400";

  return (
    <main className="mx-auto max-w-2xl space-y-3 px-4 pb-8 pt-16 lg:pt-6">
      <AddToHomeBanner />

      {preview && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
          プレビュー表示中。本番ログインやデータ保存は行われません。
        </div>
      )}

      {/* ════ ヒーローカード ════ */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 px-5 py-5 text-white">
        {/* 背景グラデーション装飾 */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 -left-4 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative">
          <p className="text-[9px] font-black tracking-[0.3em] text-slate-400">STUDY DASHBOARD</p>
          <div className="mt-1 flex items-center justify-between">
            <h1 className="text-sm font-black">{displayName}さん</h1>
            <Link
              href="/student/profile/edit"
              className="text-[10px] font-black text-slate-400 transition-opacity hover:opacity-60"
            >
              編集 →
            </Link>
          </div>

          {/* 志望校タグ */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {targetUniversities.map((u) => (
              <span key={u} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold">
                {u}
              </span>
            ))}
          </div>

          {/* 3統計カード */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {/* 偏差値 */}
            <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-3 text-center">
              <p className="text-[8px] font-bold text-slate-400">現在の偏差値</p>
              <p className={`mt-1 text-2xl font-black tabular-nums ${deviationColor}`}>
                {deviation ?? "--"}
              </p>
            </div>
            {/* 残り日数 */}
            <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-3 text-center">
              <p className="text-[8px] font-bold text-slate-400">試験まで</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-white">
                {daysLeft != null ? daysLeft : "--"}
              </p>
              {daysLeft != null && <p className="text-[8px] text-slate-400">日</p>}
            </div>
            {/* お気に入り先輩 */}
            <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-3 text-center">
              <p className="text-[8px] font-bold text-slate-400">お気に入り</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-white">{favorites.length}</p>
              <p className="text-[8px] text-slate-400">人</p>
            </div>
          </div>

          {profile?.status && (
            <p className="mt-3 text-[10px] text-slate-400">{profile.status}</p>
          )}
        </div>
      </div>

      {/* ── 未読返信バナー ── */}
      {unreadReplyCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border-2 border-cyan-500 bg-cyan-50 px-4 py-3">
          <span className="text-lg">📬</span>
          <div>
            <p className="text-xs font-black text-cyan-700">返信が {unreadReplyCount}件 届いています</p>
            <p className="text-[10px] text-cyan-600">↓ 対応履歴でご確認ください</p>
          </div>
        </div>
      )}

      {/* ════ お気に入り先輩 ════ */}
      <section className="rounded-xl border border-slate-200 bg-white px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] font-black tracking-[0.22em] text-slate-400">SENPAI MATCH</p>
            <h2 className="mt-0.5 text-sm font-black text-slate-950">お気に入りの先輩</h2>
          </div>
          <Link href="/experiences" className="shrink-0 rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-black text-white transition-opacity hover:opacity-80">
            探す →
          </Link>
        </div>
        {favorites.length > 0 ? (
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {favorites.map((senpai) => (
              <Link
                key={senpai.id}
                href={preview ? "/experiences" : `/experiences/${senpai.id}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 transition-colors hover:border-slate-950"
              >
                <h3 className="text-[10px] font-black leading-tight">{senpai.title}</h3>
                <div className="mt-0.5 flex items-center gap-1">
                  <TutorAvatar src={senpai.tutor_avatar_url} size={16} />
                  <p className="text-[9px] text-slate-500">
                    {senpai.university}{senpai.faculty ? ` ${senpai.faculty}` : ""}
                    <span className="text-slate-400"> · {senpai.tutor_display_name ? `${senpai.tutor_display_name}センパイ` : "先輩"}</span>
                  </p>
                </div>
                <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-slate-500">{senpai.reason}</p>
              </Link>
            ))}
          </div>
        ) : (
          <Link
            href="/experiences"
            className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5 transition-colors hover:bg-slate-100"
          >
            <div>
              <p className="text-xs font-black text-slate-950">先輩をお気に入り登録する</p>
              <p className="mt-0.5 text-[10px] text-slate-400">体験記一覧から気になる先輩をブックマークできます</p>
            </div>
            <span className="text-xs font-black text-slate-400">→</span>
          </Link>
        )}
      </section>

      {/* ════ 対応履歴 ════ */}
      <section className={`rounded-xl border bg-white px-4 py-4 ${unreadReplyCount > 0 ? "border-slate-950" : "border-slate-200"}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-black text-slate-950">対応履歴</h2>
            {unreadReplyCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-cyan-500 px-2 py-0.5 text-[9px] font-black text-white">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                新着 {unreadReplyCount}件
              </span>
            )}
          </div>
          {requests.length > 0 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-400">{requests.length}件</span>
          )}
        </div>
        {requests.length === 0 ? (
          <p className="mt-3 text-[10px] text-slate-400">まだリクエストがありません。サイドメニューからサービスをご利用ください。</p>
        ) : (
          <div className="mt-3 space-y-2">
            {requests.map((request) => {
              const hasUnread = !!request.admin_reply && !request.reply_read_at;
              return (
                <article key={request.id} className={`rounded-lg border p-2.5 ${hasUnread ? "border-slate-950 bg-white" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[9px] font-black text-white">{SERVICE_LABELS[request.service_type]}</span>
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-black text-slate-500">{STATUS_LABELS[request.status]}</span>
                    </div>
                    <time className="text-[9px] text-slate-400">{new Date(request.created_at).toLocaleString("ja-JP")}</time>
                  </div>
                  {request.field_values && Object.keys(request.field_values).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {Object.entries(request.field_values).map(([key, value]) => (
                        <span key={key} className="rounded-full bg-white px-2 py-0.5 text-[9px] text-slate-400">{key}: {value || "未入力"}</span>
                      ))}
                    </div>
                  )}
                  {request.attachments && request.attachments.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {request.attachments.map((a) => (
                        <span key={a.path} className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-black text-slate-500">添付: {a.name}</span>
                      ))}
                    </div>
                  )}
                  <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-slate-600">{request.message}</p>
                  {request.admin_reply && (
                    <div className={`mt-2 rounded-lg border px-2.5 py-2 ${hasUnread ? "border-slate-950 bg-white" : "border-slate-200 bg-slate-50"}`}>
                      <div className="flex items-center gap-1">
                        <p className="text-[9px] font-black tracking-[0.14em] text-slate-600">先輩からの返信</p>
                        {hasUnread && <span className="rounded-full bg-cyan-500 px-1.5 py-0.5 text-[8px] font-black text-white">NEW</span>}
                      </div>
                      <p className="mt-0.5 whitespace-pre-line text-[10px] leading-4 text-slate-700">{request.admin_reply}</p>
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
