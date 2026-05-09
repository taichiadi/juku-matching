"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type TutorRow = {
  tutorEmail: string;
  completions: number;
  consultationReward: number;
  views: number;
  viewBonus: number;
  totalReward: number;
  unpaidCompletionIds: string[];
};

function monthRange(ym: string): { start: string; end: string } {
  const [y, m] = ym.split("-").map(Number);
  const start = new Date(y, m - 1, 1).toISOString();
  const end = new Date(y, m, 1).toISOString();
  return { start, end };
}

export default function AdminRewardsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const now = new Date();
  const defaultYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultYm);
  const [rows, setRows] = useState<TutorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [paidSet, setPaidSet] = useState<Set<string>>(new Set());

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
      void fetchData(selectedMonth);
    } else {
      setError("パスワードが違います");
    }
  };

  const fetchData = async (ym: string) => {
    setLoading(true);
    const { start, end } = monthRange(ym);

    const [{ data: completions }, { data: viewLogs }] = await Promise.all([
      supabase
        .from("consultation_completions")
        .select("id, tutor_email, reward_amount, reward_paid, resolved_at")
        .gte("resolved_at", start)
        .lt("resolved_at", end),
      supabase
        .from("experience_view_logs")
        .select("experience_id, viewed_at, experiences(author_email)")
        .gte("viewed_at", start)
        .lt("viewed_at", end),
    ]);

    // チューターごとに集計
    const map = new Map<string, TutorRow>();

    const getRow = (email: string): TutorRow => {
      if (!map.has(email)) {
        map.set(email, {
          tutorEmail: email,
          completions: 0,
          consultationReward: 0,
          views: 0,
          viewBonus: 0,
          totalReward: 0,
          unpaidCompletionIds: [],
        });
      }
      return map.get(email)!;
    };

    for (const c of completions ?? []) {
      if (!c.tutor_email) continue;
      const row = getRow(c.tutor_email);
      row.completions += 1;
      row.consultationReward += c.reward_amount ?? 300;
      if (!c.reward_paid) row.unpaidCompletionIds.push(c.id);
    }

    for (const v of viewLogs ?? []) {
      const exp = v.experiences as unknown as { author_email: string | null } | null;
      const email = exp?.author_email;
      if (!email) continue;
      const row = getRow(email);
      row.views += 1;
    }

    // ビューボーナス計算・合計
    const result: TutorRow[] = [];
    for (const row of map.values()) {
      row.viewBonus = Math.floor(row.views / 100) * 50;
      row.totalReward = row.consultationReward + row.viewBonus;
      result.push(row);
    }
    result.sort((a, b) => b.totalReward - a.totalReward);

    setRows(result);
    setLoading(false);
  };

  const handleMonthChange = (ym: string) => {
    setSelectedMonth(ym);
    if (authed) void fetchData(ym);
  };

  const handleMarkPaid = async (row: TutorRow) => {
    if (row.unpaidCompletionIds.length === 0) return;
    await supabase
      .from("consultation_completions")
      .update({ reward_paid: true })
      .in("id", row.unpaidCompletionIds);
    setPaidSet((prev) => {
      const next = new Set(prev);
      next.add(row.tutorEmail);
      return next;
    });
    setRows((prev) =>
      prev.map((r) =>
        r.tutorEmail === row.tutorEmail
          ? { ...r, unpaidCompletionIds: [] }
          : r
      )
    );
  };

  const totalReward = rows.reduce((s, r) => s + r.totalReward, 0);
  const totalUnpaid = rows.reduce(
    (s, r) => s + (r.unpaidCompletionIds.length > 0 ? r.totalReward : 0),
    0
  );

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs font-black tracking-widest text-cyan-400 mb-4">ADMIN</p>
          <h1 className="text-lg font-black text-white mb-6">チューター報酬管理</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="管理者パスワード"
            className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 mb-3"
          />
          {error && <p className="text-xs text-rose-400 mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full rounded-xl bg-cyan-500 py-3 text-sm font-black text-white hover:bg-cyan-400"
          >
            ログイン
          </button>
          <div className="mt-4 text-center">
            <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300">
              ← 管理トップへ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-950 border-b border-white/10">
        <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black tracking-widest text-cyan-400">ADMIN</p>
            <h1 className="text-lg font-black text-white">チューター報酬ダッシュボード</h1>
          </div>
          <Link href="/admin" className="text-xs text-slate-400 hover:text-white">
            ← 管理トップ
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6 space-y-6">
        {/* 月選択 */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-slate-700">対象月</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={() => fetchData(selectedMonth)}
            disabled={loading}
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-black text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "読込中..." : "更新"}
          </button>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400">対象チューター数</p>
            <p className="mt-1 text-3xl font-black text-slate-900">{rows.length}<span className="text-sm font-bold text-slate-400 ml-1">人</span></p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400">今月の報酬総額</p>
            <p className="mt-1 text-3xl font-black text-slate-900">¥{totalReward.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-rose-500">未払い合計</p>
            <p className="mt-1 text-3xl font-black text-rose-600">¥{totalUnpaid.toLocaleString()}</p>
          </div>
        </div>

        {/* 報酬テーブル */}
        {rows.length === 0 && !loading ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center text-sm text-slate-400">
            {selectedMonth} の完結・閲覧データはありません
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-black text-slate-500">チューター</th>
                    <th className="px-4 py-3 text-right text-xs font-black text-slate-500">完結件数</th>
                    <th className="px-4 py-3 text-right text-xs font-black text-slate-500">相談報酬</th>
                    <th className="px-4 py-3 text-right text-xs font-black text-slate-500">閲覧数</th>
                    <th className="px-4 py-3 text-right text-xs font-black text-slate-500">閲覧ボーナス</th>
                    <th className="px-4 py-3 text-right text-xs font-black text-slate-500">合計</th>
                    <th className="px-4 py-3 text-center text-xs font-black text-slate-500">支払い</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => {
                    const isPaid = paidSet.has(row.tutorEmail) || row.unpaidCompletionIds.length === 0;
                    return (
                      <tr key={row.tutorEmail} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-800 font-medium max-w-[200px] truncate">
                          {row.tutorEmail}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          {row.completions}<span className="text-slate-400 ml-0.5">件</span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800">
                          ¥{row.consultationReward.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          {row.views.toLocaleString()}<span className="text-slate-400 ml-0.5">PV</span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                          {row.viewBonus > 0 ? `¥${row.viewBonus.toLocaleString()}` : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right text-base font-black text-slate-900">
                          ¥{row.totalReward.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isPaid ? (
                            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                              支払済
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkPaid(row)}
                              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 hover:bg-rose-200 transition-colors"
                            >
                              未払い → 支払う
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 凡例 */}
            <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 flex gap-6 text-xs text-slate-400">
              <span>相談報酬: 完結1件 × 300円</span>
              <span>閲覧ボーナス: 100PVごとに +50円</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
