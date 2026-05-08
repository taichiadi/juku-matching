import Link from "next/link";

export type StudentServiceRequest = {
  id: string;
  service_type: "study_room" | "correction" | "focus_room";
  status: "new" | "in_progress" | "done" | "cancelled";
  field_values: Record<string, string> | null;
  message: string;
  admin_reply?: string | null;
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
  },
  {
    href: "/student/correction",
    label: "Service 02",
    title: "志望校特化・専門添削",
    body: "小論文・英作文・過去問を提出すると、志望校に受かった先輩が合格者の視点で添削します。",
  },
  {
    href: "/student/focus-room",
    label: "Service 03",
    title: "オンライン強制自習",
    body: "目標宣言、集中タイマー、離脱ログ、終了レポートで、自習を見える化します。",
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
  favorites = [],
}: {
  requests: StudentServiceRequest[];
  preview?: boolean;
  profile?: StudentProfileSummary;
  diagnostic?: DiagnosticSummary | null;
  scoreHistory?: ScorePoint[];
  favorites?: FavoriteSenpai[];
}) {
  const profileItems = [
    { label: "性別", value: profile?.gender || "未回答" },
    { label: "現在の偏差値", value: profile?.currentDeviation || "未設定" },
    { label: "受験状況", value: profile?.status || "未設定" },
    { label: "勉強スタイル", value: profile?.studyStyle || "未設定" },
    { label: "受験年度", value: profile?.examYear || "未設定" },
  ];
  const displayName = profile?.displayName || "生徒";
  const targetUniversities = profile?.targetUniversities.length ? profile.targetUniversities : ["志望校未設定"];
  const maxScore = Math.max(70, ...scoreHistory.map((point) => point.score));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {preview && (
        <div className="mb-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-800">
          プレビュー表示中。本番ログインやデータ保存は行われません。
        </div>
      )}

      <section className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-9">
        <p className="text-xs font-black tracking-[0.34em] text-lime-300">STUDENT DASHBOARD</p>
        <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
          {displayName}さんのマイページ
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
          診断結果、模試の推移、お気に入り先輩、相談・添削の履歴をひとつにまとめます。
          迷ったら、ここを見れば次にやることが分かる状態にしていきます。
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black tracking-[0.28em] text-cyan-700">PROFILE</p>
            <h2 className="mt-2 text-2xl font-black leading-tight md:text-3xl">{displayName}さんの受験プロフィール</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {targetUniversities.map((university) => (
                <span
                  key={university}
                  className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800"
                >
                  {university}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/diagnostic"
            className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition-colors hover:bg-cyan-700"
          >
            プロフィール更新 →
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          {profileItems.map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-black tracking-[0.16em] text-slate-400">{item.label}</p>
              <p className="mt-1 truncate text-base font-black text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.26em] text-cyan-700">DIAGNOSTIC RESULT</p>
              <h2 className="mt-2 text-2xl font-black">先輩診断結果</h2>
            </div>
            {diagnostic?.updatedAt && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                {diagnostic.updatedAt}
              </span>
            )}
          </div>

          {diagnostic ? (
            <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-xs font-black tracking-[0.2em] text-lime-300">TYPE</p>
                <p className="mt-3 text-3xl font-black leading-tight">{diagnostic.typeName}</p>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-300">{diagnostic.examStrategy}</p>
              </div>
              <div>
                <p className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-800">
                  推奨ルート: {diagnostic.recommendedMethod}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {diagnostic.strengths.map((strength) => (
                    <span
                      key={strength}
                      className="rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-black text-slate-700"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
                <Link
                  href="/diagnostic"
                  className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-cyan-700"
                >
                  診断を更新する →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <p className="font-black text-slate-700">まだ診断結果がありません</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                先輩診断を使うと、境遇が近い先輩や向いている受験戦略をここに保存できます。
              </p>
              <Link
                href="/diagnostic"
                className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white"
              >
                診断を始める →
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black tracking-[0.26em] text-cyan-700">MOCK EXAM TREND</p>
          <h2 className="mt-2 text-2xl font-black">模試の成績変動</h2>
          {scoreHistory.length > 0 ? (
            <>
              <div className="mt-5 flex h-36 items-end gap-3">
                {scoreHistory.map((point) => (
                  <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-24 w-full items-end rounded-2xl bg-slate-100 px-2 pt-2">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-cyan-700 via-cyan-400 to-lime-300"
                        style={{ height: `${Math.max(16, (point.score / maxScore) * 100)}%` }}
                      />
                    </div>
                    <p className="text-sm font-black text-slate-950">{point.score}</p>
                    <p className="text-[11px] font-bold text-slate-400">{point.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-2xl bg-lime-50 px-4 py-3 text-sm font-bold leading-7 text-slate-700">
                推移を見ながら、どの先輩の勉強ルートに近いかを比較できます。
              </p>
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <p className="font-black text-slate-700">模試結果を登録するとグラフ化されます</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                偏差値の変化と相談履歴を並べて、伸びた理由を見つけられるようにします。
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.26em] text-cyan-700">FAVORITE SENPAI</p>
            <h2 className="mt-2 text-2xl font-black">お気に入り先輩</h2>
          </div>
          <Link href="/#list" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">
            先輩を探す →
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {favorites.map((senpai) => (
              <Link
                key={senpai.id}
                href={preview ? "/#list" : `/experiences/${senpai.id}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50"
              >
                <p className="text-xs font-black tracking-[0.18em] text-cyan-700">SAVED SENPAI</p>
                <h3 className="mt-2 text-lg font-black">{senpai.title}</h3>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  {senpai.university}
                  {senpai.faculty ? ` ${senpai.faculty}` : ""}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-500">{senpai.reason}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-black text-slate-600">まだお気に入り先輩は保存されていません</p>
            <p className="mt-1 text-xs text-slate-400">
              気になる体験記を保存すると、あとから比較して見返せるようになります。
            </p>
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {SERVICES.map((service) => (
          <Link
            key={`${service.href}-${service.label}`}
            href={preview ? service.href.replace("/student", "/preview") : service.href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_18px_54px_rgba(15,23,42,0.12)]"
          >
            <p className="text-xs font-black tracking-[0.28em] text-cyan-600">{service.label}</p>
            <h2 className="mt-3 text-2xl font-black">{service.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{service.body}</p>
            <span className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition-colors group-hover:bg-cyan-700">
              開く →
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">対応履歴</h2>
            <p className="mt-1 text-sm text-slate-500">送信した相談・添削依頼の状況を確認できます。</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
            {requests.length}件
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <p className="text-sm font-bold text-slate-500">まだ受付履歴はありません</p>
            <p className="mt-1 text-xs text-slate-400">24h質問対応か専門添削を送信すると、ここに表示されます。</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                      {SERVICE_LABELS[request.service_type]}
                    </span>
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                      {STATUS_LABELS[request.status]}
                    </span>
                  </div>
                  <time className="text-xs font-bold text-slate-400">
                    {new Date(request.created_at).toLocaleString("ja-JP")}
                  </time>
                </div>
                {request.field_values && Object.keys(request.field_values).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(request.field_values).map(([key, value]) => (
                      <span key={key} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                        {key}: {value || "未入力"}
                      </span>
                    ))}
                  </div>
                )}
                {request.attachments && request.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {request.attachments.map((attachment) => (
                      <span
                        key={attachment.path}
                        className="rounded-full bg-lime-50 px-3 py-1 text-xs font-black text-lime-700"
                      >
                        添付: {attachment.name}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">{request.message}</p>
                {request.admin_reply && (
                  <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
                    <p className="text-xs font-black tracking-[0.18em] text-cyan-700">運営からの返信</p>
                    <p className="mt-2 whitespace-pre-line text-sm font-bold leading-7 text-slate-800">
                      {request.admin_reply}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
