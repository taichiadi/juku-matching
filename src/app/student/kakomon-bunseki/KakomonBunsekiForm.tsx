"use client";

import { useState } from "react";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";
import { CompassSpinner } from "@/components/CompassSpinner";

const MAX_FILES = 3;
const MAX_FILE_SIZE_MB = 10;

export default function KakomonBunsekiForm({ cancelled }: { cancelled: boolean }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, MAX_FILES));
  }
  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const oversized = files.find((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversized) {
      setError(`${oversized.name} が${MAX_FILE_SIZE_MB}MB を超えています。`);
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.set("university", String(fd.get("university") ?? ""));
    payload.set("faculty", String(fd.get("faculty") ?? ""));
    payload.set("subject", String(fd.get("subject") ?? ""));
    payload.set("selfScore", String(fd.get("selfScore") ?? ""));
    payload.set("troubleNote", String(fd.get("troubleNote") ?? ""));
    files.forEach((f) => payload.append("attachments", f));

    const res = await fetch("/api/kakomon-bunseki/checkout", { method: "POST", body: payload });
    const json = (await res.json()) as { url?: string; error?: string };

    if (!res.ok || !json.url) {
      setError(json.error ?? "申し込みに失敗しました。もう一度お試しください。");
      setSubmitting(false);
      return;
    }

    window.location.href = json.url;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-900">
            ← マイページ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-xs font-black tracking-[0.3em] text-cyan-600">PAST EXAM ANALYSIS</p>
        <h1 className="mt-2 text-2xl font-black">過去問分析を申し込む</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          現役早慶の予備校講師が分析レポート＋答案添削（任意）を返却。通常3日以内。返却後7日間・1往復の質問付き。
        </p>

        {cancelled && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
            決済がキャンセルされました。再度お試しください。
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">志望校</label>
            <input
              name="university"
              required
              placeholder="例：早稲田大学"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">志望学部</label>
            <input
              name="faculty"
              required
              placeholder="例：法学部"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">教科</label>
            <select
              name="subject"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="" disabled>教科を選択</option>
              <option value="英語">英語</option>
              <option value="国語">国語</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">
              直近の自己採点（任意）
            </label>
            <input
              name="selfScore"
              placeholder="例：40/100点"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-black text-slate-800">
              困り事・聞きたいこと（任意）
            </label>
            <textarea
              name="troubleNote"
              rows={4}
              placeholder="例：大問3の長文読解がいつも時間切れになります。何を改善すればよいですか？"
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-black text-slate-800">答案の写真・PDF（任意）</label>
              <span className="text-xs text-slate-400">最大{MAX_FILES}件 / 1件{MAX_FILE_SIZE_MB}MB</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm font-black text-cyan-800 hover:bg-cyan-100">
                カメラで撮影する
                <input type="file" accept="image/*" capture="environment" className="sr-only"
                  onChange={(e) => addFiles(e.currentTarget.files)} />
              </label>
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm font-black text-slate-800 hover:border-cyan-300">
                写真・PDFを選ぶ
                <input type="file" accept="image/*,.pdf" multiple className="sr-only"
                  onChange={(e) => addFiles(e.currentTarget.files)} />
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{f.name}</p>
                      <p className="text-xs text-slate-400">{(f.size / 1024 / 1024).toFixed(1)}MB</p>
                    </div>
                    <button type="button" onClick={() => removeFile(i)}
                      className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm hover:text-red-600">
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-slate-400">答案がなくても申し込めます（その場合は分析レポートのみ返却）。</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-sm font-black text-slate-700">¥1,000 / 1教科（税込）</p>
            <p className="mt-0.5 text-xs text-slate-400">
              分析レポート ＋ 答案添削（任意）＋ 返却後7日・1往復チャット込み。通常3日以内に返却。
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:opacity-60"
          >
            {submitting ? (
              <><CompassSpinner size={16} className="text-cyan-300" /><span>Stripe に移動中…</span></>
            ) : (
              "¥1,000 で申し込む（Stripe 決済へ）→"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
