"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";

function formatPhone(raw: string): string {
  const digits = raw.replace(/[-\s\(\)]/g, "");
  if (digits.startsWith("0")) return "+81" + digits.slice(1);
  if (digits.startsWith("+81")) return digits;
  return "+81" + digits;
}

function VerifyPhoneInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/student/dashboard";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    const formatted = formatPhone(phone);
    const { error } = await supabase.auth.updateUser({ phone: formatted });
    if (error) {
      setError("SMS送信に失敗しました: " + error.message);
    } else {
      setStep("otp");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) return;
    setLoading(true);
    setError("");
    const formatted = formatPhone(phone);
    const { error } = await supabase.auth.verifyOtp({
      phone: formatted,
      token: otp,
      type: "phone_change",
    });
    if (error) {
      setError("認証コードが正しくありません。もう一度確認してください。");
    } else {
      await supabase.auth.updateUser({
        data: {
          phone_verified: true,
          trial_started_at: new Date().toISOString(),
        },
      });
      router.replace(next);
    }
    setLoading(false);
  };

  const handleSkip = () => {
    router.replace(next);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <SenpaiLogo dark />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-white">
          <p className="text-[10px] font-black tracking-[0.32em] text-cyan-400">SMS VERIFICATION</p>
          <h1 className="mt-2 text-xl font-black">電話番号を認証する</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            1つの電話番号につき1アカウント限定。<br />
            認証後、2週間の無料トライアルが始まります。
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black text-slate-400">
                  携帯電話番号
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="090-1234-5678"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                />
                <p className="mt-1.5 text-xs text-slate-500">ハイフンあり・なしどちらでもOK</p>
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading || !phone.trim()}
                className="w-full rounded-xl bg-cyan-500 py-3.5 text-sm font-black text-white transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "送信中..." : "SMSで認証コードを送る"}
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
                {phone} に6桁のコードを送信しました
              </div>
              <div>
                <label className="mb-2 block text-xs font-black text-slate-400">
                  認証コード（6桁）
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-center text-2xl font-black tracking-[0.4em] text-white placeholder-slate-600 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="------"
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                />
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full rounded-xl bg-cyan-500 py-3.5 text-sm font-black text-white transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "確認中..." : "認証して無料トライアルを始める"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                className="w-full text-xs text-slate-500 hover:text-slate-300"
              >
                ← 電話番号を変更する
              </button>
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-5">
            <button
              onClick={handleSkip}
              className="w-full text-xs text-slate-600 hover:text-slate-400"
            >
              後で認証する（一部機能が制限されます）
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <VerifyPhoneInner />
    </Suspense>
  );
}
