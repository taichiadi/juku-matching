"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Request = {
  id: string;
  nickname: string | null;
  message: string;
  tutor_email: string | null;
};

export default function ChatClient({ token }: { token: string }) {
  const [request, setRequest] = useState<Request | null>(null);
  const [isTutor, setIsTutor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

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
      if (session?.user?.email && session.user.email === req.tutor_email) {
        setIsTutor(true);
      }
      setLoading(false);
    };
    init();
  }, [token]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={isTutor ? "/tutor/dashboard" : "/"}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">
              {isTutor
                ? `${request?.nickname ?? "匿名さん"}との相談`
                : "先輩とのビデオ相談"}
            </p>
            <p className="text-xs text-gray-400">センパイ・リンク</p>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-4">
        {/* 相談内容 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 mb-1.5">相談内容</p>
          <p className="text-sm text-gray-700 leading-relaxed">{request?.message}</p>
          {request?.nickname && (
            <p className="text-xs text-gray-400 mt-2">— {request.nickname}</p>
          )}
        </div>

        {/* ビデオ通話エリア */}
        {callStarted ? (
          <div className="bg-black rounded-2xl overflow-hidden" style={{ height: "65vh" }}>
            <iframe
              src={jitsiUrl}
              className="w-full h-full"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              style={{ border: "none" }}
            />
          </div>
        ) : (
          <div className="bg-white border-2 border-blue-100 rounded-2xl p-8 text-center">
            <p className="text-5xl mb-4">🎥</p>
            <h2 className="text-lg font-black text-gray-900 mb-2">ビデオ通話で相談する</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {isTutor
                ? "受験生がつながってきたら通話を開始できます。\nカメラ・マイクの許可が必要です。"
                : "先輩と直接ビデオ通話で話せます。\nカメラ・マイクの許可が必要です。"}
            </p>

            {/* 注意事項 */}
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
              onClick={() => setCallStarted(true)}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors text-base"
            >
              🎥 ビデオ通話を開始する
            </button>

            <p className="text-xs text-gray-400 mt-3">
              Jitsi Meetを使用。アカウント不要・無料
            </p>
          </div>
        )}

        {callStarted && (
          <button
            onClick={() => setCallStarted(false)}
            className="w-full border border-gray-300 text-gray-600 text-sm py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            通話を終了する
          </button>
        )}
      </div>
    </div>
  );
}
