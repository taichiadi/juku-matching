import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

export default async function AdminServiceRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>;
}) {
  const params = await searchParams;
  const requestId = params.request;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-900">
            体験記管理へ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <section className="rounded-[2rem] bg-slate-950 p-7 text-white md:p-9">
          <p className="text-xs font-black tracking-[0.34em] text-cyan-300">SERVICE REQUESTS</p>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">相談・添削受付の確認</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            LINE通知から来た受付は、Supabaseの student_service_requests で確認します。返信は admin_reply に入力すると、生徒マイページに表示されます。
          </p>
        </section>

        {requestId && (
          <section className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
            <p className="text-xs font-black tracking-[0.24em] text-cyan-700">REQUEST ID</p>
            <p className="mt-2 break-all font-mono text-sm font-bold text-slate-900">{requestId}</p>
          </section>
        )}

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">1. 内容を見る</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Supabaseの Table Editor で student_service_requests を開きます。LINE通知にREQUEST IDがある場合は、id列で該当行を探してください。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">2. 添付を見る</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              添付ファイルは Storage の service-request-attachments に保存されます。attachments列のpathと同じ場所を開きます。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <h2 className="text-lg font-black">3. 生徒へ返信する</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              student_service_requests の admin_reply 列に返信文を入れ、status を in_progress または done に変更します。生徒がマイページを開くと返信が表示されます。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
