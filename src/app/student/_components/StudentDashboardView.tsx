"use client";

import { useState } from "react";
import Link from "next/link";
import AddToHomeBanner from "@/components/AddToHomeBanner";
import UsageMeter from "@/components/UsageMeter";
import type { PlanType } from "@/lib/planLimits";
import { PLAN_LABELS, PLAN_LIMITS } from "@/lib/planLimits";

export type StudentServiceRequest = {
  id: string;
  service_type: "study_room" | "correction";
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
  tutor_display_name?: string | null;
};

type SenpaiVoice = {
  reason: string;
  attribution: string;
  badge: string;
};

function getSenpaiVoice(): SenpaiVoice {
  const m = new Date().getMonth() + 1;
  if (m <= 2) return {
    reason: "直前期に新しい参考書に手を出して崩れた先輩を何人も見てきました。今は持っているものを完成させる時期です。過去問の復習と体調管理を最優先にしてください。",
    attribution: "— 直前E判定から第一志望に合格した先輩より",
    badge: "直前2週間の分岐点",
  };
  if (m <= 4) return {
    reason: "4月のスタートダッシュで受験の差がつきます。学習リズムをここで固めた先輩が、夏以降に圧倒的な差をつけています。まず毎日の勉強時間を記録してみてください。",
    attribution: "— 偏差値40台から早稲田に合格した先輩より",
    badge: "今スタートで差がつく時期",
  };
  if (m <= 6) return {
    reason: "5〜6月はモチベーションが落ちやすく、成績が停滞しやすい時期です。ここで踏ん張った先輩が夏に大きく伸びています。焦らず、今の基礎を積み重ねてください。",
    attribution: "— 偏差値43→61で慶應に逆転合格した先輩より",
    badge: "今崩れやすい時期",
  };
  if (m <= 8) return {
    reason: "夏が受験の天王山。合格した先輩の多くは夏に1〜2科目を完成させています。量より深さを意識して、毎日同じ科目に触れてみてください。",
    attribution: "— 夏から逆転して東大に合格した先輩より",
    badge: "夏の分岐点",
  };
  if (m <= 10) return {
    reason: "夏明けはペースが落ちやすい時期です。秋に過去問を始めるタイミングが合否に直結します。現在地を確認して、次の一手を決めましょう。",
    attribution: "— 秋のペースを維持して一橋に合格した先輩より",
    badge: "秋の立て直し時期",
  };
  return {
    reason: "11〜12月は追い込みの時期。焦って新しい参考書に手を出した先輩は失敗しています。今持っているものを磨き上げることに集中してください。",
    attribution: "— 11月E判定から第一志望に合格した先輩より",
    badge: "直前期の分岐点",
  };
}

const STATUS_LABELS: Record<StudentServiceRequest["status"], string> = {
  new: "受付済み",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
};

const SERVICE_LABELS: Record<StudentServiceRequest["service_type"], string> = {
  study_room: "先輩に質問",
  correction: "添削",
};

export default function StudentDashboardView({
  requests,
  preview = false,
  profile,
  scoreHistory = [],
  eikenHistory = [],
  favorites = [],
  unreadReplyCount = 0,
  plan = "free",
  questionsUsedThisMonth = 0,
  correctionsUsedThisMonth = 0,
  extraQuestions = 0,
  extraCorrections = 0,
  latestBoardPost = null,
}: {
  requests: StudentServiceRequest[];
  preview?: boolean;
  profile?: StudentProfileSummary;
  scoreHistory?: ScorePoint[];
  eikenHistory?: EikenRecord[];
  favorites?: FavoriteSenpai[];
  unreadReplyCount?: number;
  plan?: PlanType;
  questionsUsedThisMonth?: number;
  correctionsUsedThisMonth?: number;
  extraQuestions?: number;
  extraCorrections?: number;
  latestBoardPost?: { id: string; title: string } | null;
}) {
  const [usageOpen, setUsageOpen] = useState(false);
  const senpaiVoice = getSenpaiVoice();

  const qLimit = PLAN_LIMITS[plan].questions;
  const qRemaining = qLimit === null ? null : Math.max(0, qLimit - questionsUsedThisMonth + extraQuestions);
  const qAtLimit = qRemaining === 0;

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
    <main className="mx-auto max-w-2xl space-y-3 px-4 pb-8 pt-16 lg:pt-6">
      <AddToHomeBanner />

      {preview && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
          プレビュー表示中。本番ログインやデータ保存は行われません。
        </div>
      )}

      {/* ── ヘッダー ── */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <p className="text-[9px] font-black tracking-[0.3em] text-slate-400">STUDENT DASHBOARD</p>
          <h1 className="mt-0.5 text-sm font-black text-slate-950">{displayName}さん</h1>
        </div>
        <Link
          href="/student/plan"
          className={`rounded-full px-3 py-1 text-[10px] font-black transition-opacity hover:opacity-70 ${
            plan === "pro"
              ? "bg-slate-950 text-white"
              : plan === "lite"
              ? "border border-slate-950 text-slate-950"
              : "border border-slate-200 text-slate-400 hover:border-slate-950 hover:text-slate-950"
          }`}
        >
          {PLAN_LABELS[plan]}{plan === "free" ? " · 登録する" : ""}
        </Link>
      </div>

      {/* ════ L1: 今週やるべきこと（主役） ════ */}
      <section className="rounded-2xl bg-slate-950 px-6 py-8 text-white shadow-xl">
        <div className="flex items-center gap-2">
          <p className="text-[9px] font-black tracking-[0.3em] text-slate-500">THIS WEEK</p>
          <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[9px] font-black text-cyan-400">
            {senpaiVoice.badge}
          </span>
        </div>
        <h2 className="mt-3 text-xl font-black leading-snug">今週やるべきこと</h2>
        <p className="mt-4 text-sm leading-8 text-slate-300">{senpaiVoice.reason}</p>
        <p className="mt-3 text-[10px] italic text-slate-500">{senpaiVoice.attribution}</p>
        <Link
          href={preview ? "/preview/check" : "/student/check"}
          className="mt-6 block w-full rounded-xl bg-cyan-500 px-5 py-4 text-center text-sm font-black text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-opacity hover:opacity-90"
        >
          現在地チェックをする →
        </Link>
        <p className="mt-2.5 text-center text-[10px] text-slate-500">所要時間 約1分</p>
      </section>

      {/* ── 質問上限アラート（上限時のみ） ── */}
      {!preview && qAtLimit && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <p className="text-xs font-black text-red-600">今月の質問上限に達しました</p>
          <Link href="/student/plan?upgrade=pro" className="mt-2 block w-full rounded-xl bg-red-600 px-4 py-2.5 text-center text-xs font-black text-white transition-opacity hover:opacity-90">
            上限を解除する →
          </Link>
        </div>
      )}

      {/* ════ L2: 近い先輩を見る ════ */}
      <section className="rounded-xl border-2 border-slate-950 bg-white px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] font-black tracking-[0.22em] text-slate-400">SENPAI MATCH</p>
            <h2 className="mt-0.5 text-sm font-black text-slate-950">今のあなたに近い先輩を見る</h2>
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
                <p className="mt-0.5 text-[9px] text-slate-500">
                  {senpai.university}{senpai.faculty ? ` ${senpai.faculty}` : ""}
                  <span className="text-slate-400"> · {senpai.tutor_display_name ?? "匿名"}</span>
                </p>
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
              <p className="text-xs font-black text-slate-950">同じ境遇の先輩を探す</p>
              <p className="mt-0.5 text-[10px] text-slate-400">偏差値・志望校・状況で近い先輩が見つかります</p>
            </div>
            <span className="text-xs font-black text-slate-400">→</span>
          </Link>
        )}
      </section>

      {/* ════ L3: 先輩に相談する ════ */}
      <section className="rounded-xl border border-slate-200 bg-white px-5 py-5">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <p className="text-[9px] font-black tracking-[0.22em] text-slate-400">SENPAI SUPPORT</p>
            <h2 className="mt-0.5 text-sm font-black text-slate-950">先輩に相談する</h2>
          </div>
          {!preview && qRemaining !== null && !qAtLimit && (
            <p className="shrink-0 text-[10px] text-slate-400">
              残り <span className="font-black text-slate-700">{qRemaining}問</span>
            </p>
          )}
        </div>

        {/* 先輩の声 — 人感強め */}
        <div className="mt-4 rounded-xl bg-slate-950 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-lg">
              👤
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black text-cyan-400">偏差値 45 → 63 · 早稲田合格</p>
              <p className="mt-1.5 text-[13px] font-black leading-6 text-white">
                「英語を毎日固定したら、<br />夏に急伸できました」
              </p>
              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                あなたに似た状況から逆転した先輩が、今すぐ答えてくれます。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <Link
            href={preview ? "/preview/study-room" : "/student/study-room"}
            className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3.5 transition-opacity hover:opacity-90"
          >
            <div>
              <p className="text-xs font-black text-white">同じ状況を抜けた先輩に聞く</p>
              <p className="mt-0.5 text-[10px] text-slate-400">文章・写真で質問できます</p>
            </div>
            <span className="text-xs font-black text-slate-400">→</span>
          </Link>
          <Link
            href={preview ? "/preview/consultation" : "/student/consultation"}
            className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-slate-950"
          >
            <div>
              <p className="text-xs font-black text-slate-950">進路・戦略を直接相談する</p>
              <p className="mt-0.5 text-[10px] text-slate-400">現役早慶の予備校講師とやりとりできます</p>
            </div>
            <span className="text-xs font-black text-slate-400">→</span>
          </Link>
        </div>
      </section>

      {/* ════ L4: 分岐点 · 添削 ════ */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={preview ? "/preview/branches" : "/student/branches"}
          className="rounded-xl bg-slate-50 px-4 py-4 transition-colors hover:bg-slate-100"
        >
          <p className="text-[9px] font-black tracking-[0.18em] text-slate-400">BRANCH DB</p>
          <p className="mt-1.5 text-xs font-black leading-snug text-slate-950">去年の先輩が崩れた時期を見る</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-400">合否の分かれ道</p>
        </Link>
        <Link
          href={preview ? "/preview/correction" : "/student/correction"}
          className="rounded-xl bg-slate-50 px-4 py-4 transition-colors hover:bg-slate-100"
        >
          <p className="text-[9px] font-black tracking-[0.18em] text-slate-400">CORRECTION</p>
          <p className="mt-1.5 text-xs font-black leading-snug text-slate-950">合格者の答案と比較する</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-400">小論文・英作文の添削</p>
        </Link>
      </div>

      {/* ── BOARD バナー ── */}
      {latestBoardPost && (
        <Link
          href="/board"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-950"
        >
          <span className="shrink-0 text-sm">📋</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-slate-400">新着 · 先輩の有益情報</p>
            <p className="truncate text-xs font-bold text-slate-950">{latestBoardPost.title}</p>
          </div>
          <span className="shrink-0 text-xs font-black text-slate-400">見る →</span>
        </Link>
      )}

      <Link
        href="/board"
        className="flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4 transition-colors hover:bg-slate-100"
      >
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[9px] font-black tracking-[0.2em] text-slate-400">SENPAI BOARD</p>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-black text-slate-500">
              この時期に伸びた先輩多数
            </span>
          </div>
          <p className="mt-1 text-xs font-black text-slate-950">先輩のノウハウを読む</p>
          <p className="mt-0.5 text-[10px] text-slate-400">合格先輩の戦略・体験 ¥300〜</p>
        </div>
        <span className="shrink-0 text-xs font-black text-slate-400">開く →</span>
      </Link>

      {plan === "pro" && (
        <Link
          href={preview ? "/preview/study-plans" : "/student/study-plans"}
          className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 transition-colors hover:bg-slate-100"
        >
          <div>
            <p className="text-[9px] font-black tracking-[0.18em] text-slate-400">PRO ONLY</p>
            <p className="mt-0.5 text-xs font-black text-slate-950">週次面談記録</p>
          </div>
          <span className="text-xs font-black text-slate-400">→</span>
        </Link>
      )}

      {/* ════ L5: 成績 ════ */}
      <section className="rounded-xl border border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-black tracking-[0.22em] text-slate-400">SCORE TREND</p>
          <Link href="/student/mock-scores" className="text-[10px] font-black text-slate-400 transition-opacity hover:opacity-60">
            {scoreHistory.length > 0 ? "更新 →" : "最初の模試を追加する →"}
          </Link>
        </div>
        {scoreHistory.length > 0 ? (
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {scoreHistory.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-0.5">
                <div className="flex h-14 w-full items-end rounded-lg bg-slate-100 px-1 pt-1">
                  <div
                    className="w-full rounded-t-md bg-slate-700"
                    style={{ height: `${Math.max(16, (point.score / maxScore) * 100)}%` }}
                  />
                </div>
                <p className="text-[9px] font-black text-slate-950">{point.score}</p>
                <p className="w-full truncate text-center text-[8px] text-slate-400">{point.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[10px] text-slate-400">まだ成績が登録されていません</p>
        )}
        {eikenHistory.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
            {eikenHistory.map((e) => (
              <span key={e.exam_date + e.level} className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-black text-slate-700">
                英検{e.level}
                {e.result && (
                  <span className={`rounded-full px-1 py-0.5 text-[8px] font-black ${
                    e.result === "合格" ? "bg-slate-100 text-slate-700"
                    : e.result === "不合格" ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-500"
                  }`}>{e.result}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ════ L6: プロフィール（圧縮） ════ */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <p className="text-[9px] font-black tracking-[0.24em] text-slate-400">PROFILE</p>
          {targetUniversities.map((u) => (
            <span key={u} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">{u}</span>
          ))}
          {profile?.currentDeviation && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">偏差値 {profile.currentDeviation}</span>
          )}
          {profile?.status && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">{profile.status}</span>
          )}
        </div>
        <Link href="/student/profile/edit" className="shrink-0 text-[10px] font-black text-slate-400 transition-opacity hover:opacity-60">
          更新 →
        </Link>
      </div>

      {/* ════ 対応履歴 ════ */}
      {(requests.length > 0 || unreadReplyCount > 0) && (
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
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-400">{requests.length}件</span>
          </div>
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
        </section>
      )}

      {/* ── 利用状況（最下部） ── */}
      {!preview && (
        <div className="rounded-xl border border-slate-100 bg-white">
          <button
            onClick={() => setUsageOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-[10px] font-black text-slate-400 transition-opacity hover:opacity-60"
          >
            <span>利用状況を確認する</span>
            <span className="text-[8px]">{usageOpen ? "▲" : "▼"}</span>
          </button>
          {usageOpen && (
            <div className="border-t border-slate-100 px-4 pb-4 pt-3">
              <UsageMeter
                plan={plan}
                questionsUsed={questionsUsedThisMonth}
                correctionsUsed={correctionsUsedThisMonth}
                extraQuestions={extraQuestions}
                extraCorrections={extraCorrections}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
