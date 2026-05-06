"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";

const BASE_PRICE = 2000;
const EXTENSION_PRICE = 1000;
const BASE_DURATION = 20 * 60;      // 1200秒
const EXTENSION_DURATION = 10 * 60; // 600秒
const WARN_BEFORE = 3 * 60;         // 残り3分で警告

type Request = {
  id: string;
  nickname: string | null;
  message: string;
  tutor_email: string | null;
};

function formatTime(seconds: number) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ChatClient({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const [request, setRequest] = useState<Request | null>(null);
  const [isTutor, setIsTutor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // 通話状態
  const [callStarted, setCallStarted] = useState(false);
  const callStartedAtRef = useRef<number | null>(null);

  // タイマー
  const [timeLeft, setTimeLeft] = useState(BASE_DURATION);
  const [extensions, setExtensions] = useState(0);
  const totalDurationRef = useRef(BASE_DURATION);
  const warnedAtRef = useRef(0); // 最後に警告を出したtotalDuration

  // UI状態
  const [showWarning, setShowWarning] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const roomName = `senpailink-${token.slice(0, 16)}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}`;

  useEffect(() => {
    const init = async () => {
      const { data: req } = await supabase
        .from("consultation_requests")
        .select("id, nickname, message, tutor_email")
        .eq("access_token", token)
        .single();

      if (!req) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setRequest(req);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === req.tutor_email) {
        setIsTutor(true);
      }
      setLoading(false);
    };
    init();
  }, [token]);

  // タイマーloop
  useEffect(() => {
    if (!callStarted || callEnded) return;

    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - callStartedAtRef.current!) / 1000);
      const remaining = totalDurationRef.current - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        setCallEnded(true);
        return;
      }

      setTimeLeft(remaining);

      // 残り3分警告（同じtotalDuration内で1回のみ）
      if (
        remaining <= WARN_BEFORE &&
        warnedAtRef.current !== totalDurationRef.current
      ) {
        warnedAtRef.current = totalDurationRef.current;
        setShowWarning(true);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [callStarted, callEnded]);

  const startCall = useCallback(() => {
    callStartedAtRef.current = Date.now();
    setCallStarted(true);
  }, []);

  const handleExtend = useCallback(() => {
    totalDurationRef.current += EXTENSION_DURATION;
    setExtensions((e) => e + 1);
    setShowWarning(false);
  }, []);

  const handleEndCall = useCallback(() => {
    setShowWarning(false);
    setCallEnded(true);
  }, []);

  const totalAmount = BASE_PRICE + extensions * EXTENSION_PRICE;
  const totalMinutes = 20 + extensions * 10;

  const handlePayment = async () => {
    setPaymentLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, extensions }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setPaymentLoading(false);
  };

  // タイマーカラー
  const isUrgent = timeLeft <= WARN_BEFORE;
  const timerColor = isUrgent ? "text-red-500" : timeLeft <= 5 * 60 ? "text-orange-500" : "text-gray-900";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl mb-3">🔍</p>
          <p className="text-gray-700 font-bold mb-2">相談ルームが見つかりません</p>
          <p className="text-sm text-gray-500 mb-4">URLが正しいか確認してください</p>
          <Link href="/" className="text-blue-600 text-sm underline">トップへ戻る</Link>
        </div>
      </div>
    );
  }

  // 支払い完了画面
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-sm w-full text-center">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-xl font-black text-gray-900 mb-2">お支払い完了！</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            ありがとうございました。<br />
            またいつでも先輩に相談できます。
          </p>
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    );
  }

  // 通話終了 → 支払い画面
  if (callEnded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <p className="text-4xl mb-3">📋</p>
            <h2 className="text-xl font-black text-gray-900 mb-1">通話が終了しました</h2>
            <p className="text-sm text-gray-500">お疲れさまでした。以下のお支払いにお進みください。</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">基本料金（20分）</span>
              <span className="font-bold text-gray-900">¥{BASE_PRICE.toLocaleString()}</span>
            </div>
            {extensions > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">延長（{extensions}回 × 10分）</span>
                <span className="font-bold text-gray-900">¥{(extensions * EXTENSION_PRICE).toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">合計（{totalMinutes}分）</span>
              <span className="text-xl font-black text-blue-600">¥{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {isTutor ? (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">
                受験生が支払いを完了すると、あなたの報酬が確定します。
              </p>
              <Link
                href="/tutor/dashboard"
                className="block w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                ダッシュボードに戻る
              </Link>
            </div>
          ) : (
            <>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-base mb-3"
              >
                {paymentLoading ? "処理中..." : `¥${totalAmount.toLocaleString()} を支払う →`}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Stripe のセキュアな決済画面に移動します
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <SenpaiLogo showText={false} />
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">
              {isTutor ? `${request?.nickname ?? "匿名さん"}との相談` : "先輩とのビデオ相談"}
            </p>
          </div>

          {/* タイマー（通話中のみ） */}
          {callStarted && (
            <div className={`flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-1.5 ${isUrgent ? "bg-red-50 border border-red-200" : ""}`}>
              <svg className={`w-3.5 h-3.5 ${isUrgent ? "text-red-500" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              <span className={`text-sm font-black tabular-nums ${timerColor}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-4">
        {/* 相談内容 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-1.5">相談内容</p>
          <p className="text-sm text-gray-700 leading-relaxed">{request?.message}</p>
          {request?.nickname && (
            <p className="text-xs text-gray-400 mt-2">— {request.nickname}</p>
          )}
        </div>

        {/* 料金案内（通話前・受験生のみ） */}
        {!callStarted && !isTutor && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
            <div className="text-2xl">💳</div>
            <div>
              <p className="text-sm font-bold text-gray-900">基本料金 ¥2,000（20分）</p>
              <p className="text-xs text-gray-500 mt-0.5">延長は10分ごとに +¥1,000。通話終了後に支払います。</p>
            </div>
          </div>
        )}

        {/* ビデオ通話エリア */}
        {callStarted ? (
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg" style={{ height: "65vh" }}>
            <iframe
              src={jitsiUrl}
              className="w-full h-full"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              style={{ border: "none" }}
            />
          </div>
        ) : (
          <div className="bg-white border-2 border-blue-100 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-5xl mb-4">🎥</p>
            <h2 className="text-lg font-black text-gray-900 mb-2">ビデオ通話で相談する</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {isTutor
                ? "受験生がつながってきたら通話を開始できます。\nカメラ・マイクの許可が必要です。"
                : "先輩と直接ビデオ通話で話せます。\nカメラ・マイクの許可が必要です。"}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-semibold text-gray-500 mb-2">通話前に確認</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>✓ 静かな場所に移動してください</li>
                <li>✓ カメラ・マイクはブラウザが許可を求めます</li>
                <li>✓ 相手が参加するまで少し待ってください</li>
                <li>✓ 個人情報（本名・学校名など）の共有は任意です</li>
              </ul>
            </div>

            <button
              onClick={startCall}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-base"
            >
              🎥 ビデオ通話を開始する
            </button>
            <p className="text-xs text-gray-400 mt-3">Jitsi Meetを使用。アカウント不要・無料</p>
          </div>
        )}

        {callStarted && (
          <button
            onClick={handleEndCall}
            className="w-full border border-gray-300 text-gray-600 text-sm py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            通話を終了する
          </button>
        )}
      </div>

      {/* 残り3分警告モーダル */}
      {showWarning && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
              <div className="text-center mb-5">
                <p className="text-4xl mb-3">⏰</p>
                <h2 className="text-lg font-black text-gray-900 mb-1">残り3分です</h2>
                <p className="text-sm text-gray-500">
                  {isTutor
                    ? "受験生に延長確認の通知が届いています。"
                    : "10分延長しますか？（+¥1,000）"}
                </p>
              </div>

              {!isTutor ? (
                <div className="space-y-3">
                  <button
                    onClick={handleExtend}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                  >
                    10分延長する（+¥1,000）
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  >
                    そのまま終了する
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowWarning(false)}
                  className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  閉じる
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
