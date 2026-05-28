# 過去問分析サービス 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 既存の「過去問添削」を「過去問分析セット（分析レポート＋答案添削＋7日フォローアップチャット）¥1,000/教科」に置き換える。

**Architecture:** 提出フォーム→Stripe決済→admin AI下書き生成＋先輩レビュー→生徒への結果画面＋チャット。既存 `student_service_requests` テーブルを拡張し、新テーブル `kakomon_followup_chats` を追加。既存 Stripe webhook には一切触れない。

**Tech Stack:** Next.js 16 App Router, Supabase (Postgres + Storage + RLS), Stripe Checkout, Anthropic SDK (`claude-sonnet-4-20250514`), Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-05-28-kakomon-bunseki-design.md`

---

## ファイルマップ

### 新規作成
| ファイル | 役割 |
|---|---|
| `templates/kakomon-bunseki/english.md` | AI下書き用テンプレ（英語） |
| `templates/kakomon-bunseki/japanese.md` | AI下書き用テンプレ（国語） |
| `src/app/api/kakomon-bunseki/checkout/route.ts` | Stripe checkout セッション作成 |
| `src/app/api/kakomon-bunseki/verify-payment/route.ts` | 支払い確認→request を "new" に更新 |
| `src/app/api/kakomon-bunseki/draft-generate/route.ts` | AI下書き生成（admin 専用） |
| `src/app/api/kakomon-bunseki/followup-chat/route.ts` | フォローアップチャット送信（生徒/admin） |
| `src/app/student/kakomon-bunseki/page.tsx` | 提出フォーム（server guard） |
| `src/app/student/kakomon-bunseki/KakomonBunsekiForm.tsx` | 提出フォーム client |
| `src/app/student/kakomon-bunseki/complete/page.tsx` | 決済後の確認画面 |
| `src/app/student/kakomon-bunseki/[id]/page.tsx` | 分析結果ページ（server guard） |
| `src/app/student/kakomon-bunseki/[id]/KakomonResultView.tsx` | 分析結果 client |

### 変更
| ファイル | 変更内容 |
|---|---|
| `src/app/admin/service-requests/ServiceRequestsClient.tsx` | `kakomon_bunseki` 対応 + 下書き生成ボタン + final_markdown 編集 |
| `src/app/kakomon-tensaku/page.tsx` | LP 全面刷新（敵を知る型） |
| `src/app/shoronbun-tensaku/page.tsx` | 相互リンクの価格更新 |
| `src/app/eisakubun-tensaku/page.tsx` | 相互リンクの価格更新 |

---

## Task 1: DB Migration

**Files:**
- Supabase SQL Editor で実行（ローカルファイルなし）

- [ ] **Step 1-1: Supabase ダッシュボードの SQL Editor を開く**

  https://supabase.com/dashboard/project/xmbzpllpjjhaesinlknq/sql/new

- [ ] **Step 1-2: 以下の SQL を実行する**

```sql
-- student_service_requests に列追加
ALTER TABLE student_service_requests
  ADD COLUMN IF NOT EXISTS draft_markdown text,
  ADD COLUMN IF NOT EXISTS final_markdown text,
  ADD COLUMN IF NOT EXISTS followup_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS followup_round_count int DEFAULT 0;

-- フォローアップチャットテーブル
CREATE TABLE IF NOT EXISTS kakomon_followup_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES student_service_requests(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL CHECK (sender IN ('student', 'senpai')),
  body text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS 有効化
ALTER TABLE kakomon_followup_chats ENABLE ROW LEVEL SECURITY;

-- 生徒は自分のリクエストに紐づくチャットのみ参照・投稿
CREATE POLICY "students_read_own_chats" ON kakomon_followup_chats
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM student_service_requests WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "students_insert_own_chats" ON kakomon_followup_chats
  FOR INSERT WITH CHECK (
    sender = 'student'
    AND request_id IN (
      SELECT id FROM student_service_requests WHERE user_id = auth.uid()
    )
  );
```

- [ ] **Step 1-3: 実行結果を確認する**

  "Success. No rows returned" が出れば OK。  
  エラーの場合は `IF NOT EXISTS` が付いているので重複実行は安全。

- [ ] **Step 1-4: Stripe ダッシュボードで新規商品を作成する**

  https://dashboard.stripe.com/products/create
  - 商品名: `過去問分析セット`
  - 価格: ¥1,000（一括払い）
  - 通貨: JPY
  → 作成後、価格 ID（`price_xxx`）をメモする

- [ ] **Step 1-5: Vercel 環境変数に追加する**

  https://vercel.com/taichiadi/juku-matching/settings/environment-variables
  - Key: `STRIPE_KAKOMON_PRICE_ID`
  - Value: Step 1-4 でメモした `price_xxx`
  - 対象: Production / Preview / Development すべてにチェック

  ローカルの `.env.local` にも追記:
  ```
  STRIPE_KAKOMON_PRICE_ID=price_xxx
  ```

- [ ] **Step 1-6: Commit**

```bash
git commit --allow-empty -m "chore: DB migration + Stripe product setup for kakomon-bunseki"
```

---

## Task 2: AI 下書きテンプレート

**Files:**
- Create: `templates/kakomon-bunseki/english.md`
- Create: `templates/kakomon-bunseki/japanese.md`

- [ ] **Step 2-1: ディレクトリを作成する**

```bash
mkdir -p templates/kakomon-bunseki
```

- [ ] **Step 2-2: 英語テンプレートを作成する**

`templates/kakomon-bunseki/english.md` を作成:

```markdown
# {{university}} {{faculty}} 英語 — 過去問分析レポート

## 1. 配点・出題マップ（直近3年）

| 大問 | 内容 | 配点目安 | 推奨時間 |
|---|---|---|---|
| 大問1 | （例: 長文読解） | （例: 40点） | （例: 25分） |
| 大問2 | | | |
| 大問3 | | | |
| 合計 | | 100点 | 90分 |

※ 配点は公開情報 + 合格者の経験則に基づく推定値。

## 2. 頻出論点 TOP3 と「捨て論点」

### よく出る（ここを押さえろ）
1. **（例: 英文和訳）** — （例: 毎年1題、200〜300字の下線部訳。直訳より文意を掴む訓練を）
2. **（例: 自由英作文）** — （例: 100〜150語、意見表明型。構成: 主張→根拠2点→まとめ）
3. **（例: 語彙・文法）** — （例: 文脈依存の語彙選択。単語帳より「文中での使われ方」を意識）

### 深追い不要（時間対効果が低い）
- （例: 細かい文法知識問題 — 出題が少なく差がつかない）

## 3. 合格者はこう解いた

**（先輩の体験コメントをここに記入）**

> 私が受験したときは…（解いた順序・時間配分・稼いだ大問・捨てた大問・本番の感触）

## 4. あなたへの次の一手

現在の状況: {{self_score}} / {{trouble_note}}

1. （パーソナライズされた具体的な行動項目1）
2. （パーソナライズされた具体的な行動項目2）
3. （パーソナライズされた具体的な行動項目3）

## 5. 答案添削

（admin が答案を見てコメントを入力）
```

- [ ] **Step 2-3: 国語テンプレートを作成する**

`templates/kakomon-bunseki/japanese.md` を作成:

```markdown
# {{university}} {{faculty}} 国語 — 過去問分析レポート

## 1. 配点・出題マップ（直近3年）

| 大問 | 内容 | 配点目安 | 推奨時間 |
|---|---|---|---|
| 大問1 | （例: 現代文・評論） | （例: 50点） | （例: 35分） |
| 大問2 | （例: 古文） | （例: 30点） | （例: 25分） |
| 大問3 | （例: 漢文） | （例: 20点） | （例: 20分） |
| 合計 | | 100点 | 80分 |

## 2. 頻出論点 TOP3 と「捨て論点」

### よく出る（ここを押さえろ）
1. **（例: 評論の記述問題）** — （例: 字数制限30〜60字。傍線部の言い換えが基本。接続詞を手がかりに構造を掴む）
2. **（例: 古文の口語訳）** — （例: 助動詞の識別が鍵。「き/けり」「む/べし」は毎年出る）
3. **（例: 漢文の書き下し）** — （例: 返り点とレ点の基本を固めれば半分は取れる）

### 深追い不要（時間対効果が低い）
- （例: 漢詩の細かい解釈 — 出題頻度低、時間をかけすぎない）

## 3. 合格者はこう解いた

**（先輩の体験コメントをここに記入）**

> 私が受験したときは…（解いた順序・時間配分・稼いだ大問・捨てた大問・本番の感触）

## 4. あなたへの次の一手

現在の状況: {{self_score}} / {{trouble_note}}

1. （パーソナライズされた具体的な行動項目1）
2. （パーソナライズされた具体的な行動項目2）
3. （パーソナライズされた具体的な行動項目3）

## 5. 答案添削

（admin が答案を見てコメントを入力）
```

- [ ] **Step 2-4: Commit**

```bash
git add templates/
git commit -m "feat: AI draft templates for kakomon-bunseki"
```

---

## Task 3: バックエンド API 4本

**Files:**
- Create: `src/app/api/kakomon-bunseki/checkout/route.ts`
- Create: `src/app/api/kakomon-bunseki/verify-payment/route.ts`
- Create: `src/app/api/kakomon-bunseki/draft-generate/route.ts`
- Create: `src/app/api/kakomon-bunseki/followup-chat/route.ts`

- [ ] **Step 3-1: checkout API を作成する**

`src/app/api/kakomon-bunseki/checkout/route.ts`:

```typescript
export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

const ATTACHMENT_BUCKET = "service-request-attachments";
const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp",
  "image/heic", "image/heif", "application/pdf",
]);
const VALID_SUBJECTS = new Set(["英語", "国語"]);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app";

function safeFileName(name: string) {
  const ext = name.includes(".") ? `.${name.split(".").pop()}` : "";
  return `${crypto.randomUUID()}${ext.toLowerCase().replace(/[^a-z0-9.]/g, "")}`;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_KAKOMON_PRICE_ID;
  if (!stripeKey || !priceId) {
    return NextResponse.json({ error: "Stripe が設定されていません。" }, { status: 500 });
  }

  const formData = await request.formData();
  const university = String(formData.get("university") ?? "").trim();
  const faculty = String(formData.get("faculty") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const selfScore = String(formData.get("selfScore") ?? "").trim();
  const troubleNote = String(formData.get("troubleNote") ?? "").trim();
  const files = formData.getAll("attachments").filter(
    (f): f is File => f instanceof File && f.size > 0
  );

  if (!university) return NextResponse.json({ error: "志望校を入力してください。" }, { status: 400 });
  if (!faculty) return NextResponse.json({ error: "志望学部を入力してください。" }, { status: 400 });
  if (!VALID_SUBJECTS.has(subject)) {
    return NextResponse.json({ error: "教科は英語または国語を選んでください。" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `添付は最大${MAX_FILES}件です。` }, { status: 400 });
  }
  const invalidFile = files.find(f => !ALLOWED_FILE_TYPES.has(f.type) || f.size > MAX_FILE_SIZE);
  if (invalidFile) {
    return NextResponse.json({ error: "10MB 以内の画像または PDF のみ添付できます。" }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const uploadedAttachments: { bucket: string; path: string; name: string; size: number; type: string }[] = [];

  for (const file of files) {
    const path = `${user.id}/${requestId}/${safeFileName(file.name)}`;
    const { error: uploadErr } = await supabase.storage
      .from(ATTACHMENT_BUCKET)
      .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (uploadErr) {
      return NextResponse.json({ error: "添付ファイルの保存に失敗しました。" }, { status: 500 });
    }
    uploadedAttachments.push({ bucket: ATTACHMENT_BUCKET, path, name: file.name, size: file.size, type: file.type });
  }

  const { error: dbErr } = await supabase.from("student_service_requests").insert({
    id: requestId,
    user_id: user.id,
    student_email: user.email,
    service_type: "kakomon_bunseki",
    status: "pending_payment",
    field_values: { 志望校: university, 志望学部: faculty, 教科: subject, 自己採点: selfScore },
    message: troubleNote || "（困り事の記入なし）",
    attachments: uploadedAttachments,
    priority_score: 0,
  });

  if (dbErr) {
    if (uploadedAttachments.length > 0) {
      await supabase.storage.from(ATTACHMENT_BUCKET).remove(uploadedAttachments.map(a => a.path));
    }
    return NextResponse.json({ error: "受付の保存に失敗しました。" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${SITE_URL}/student/kakomon-bunseki/complete?request_id=${requestId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/student/kakomon-bunseki?cancelled=1`,
    metadata: { user_id: user.id, request_id: requestId, service: "kakomon_bunseki" },
  });

  return NextResponse.json({ url: session.url });
}
```

- [ ] **Step 3-2: verify-payment API を作成する**

`src/app/api/kakomon-bunseki/verify-payment/route.ts`:

```typescript
export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { sendLineNotify } from "@/lib/line-notify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const { sessionId, requestId } = (await request.json()) as { sessionId?: string; requestId?: string };
  if (!sessionId || !requestId) {
    return NextResponse.json({ error: "パラメータが不正です。" }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe が設定されていません。" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "支払いが完了していません。" }, { status: 402 });
  }

  if (session.metadata?.request_id !== requestId || session.metadata?.user_id !== user.id) {
    return NextResponse.json({ error: "リクエストが一致しません。" }, { status: 403 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: req, error: fetchErr } = await adminClient
    .from("student_service_requests")
    .select("id, status, field_values, message, student_email")
    .eq("id", requestId)
    .eq("user_id", user.id)
    .single();

  if (fetchErr || !req) {
    return NextResponse.json({ error: "リクエストが見つかりません。" }, { status: 404 });
  }

  if (req.status !== "pending_payment") {
    // Already verified — idempotent
    return NextResponse.json({ ok: true });
  }

  const { error: updateErr } = await adminClient
    .from("student_service_requests")
    .update({ status: "new" })
    .eq("id", requestId);

  if (updateErr) {
    return NextResponse.json({ error: "ステータス更新に失敗しました。" }, { status: 500 });
  }

  const fv = (req.field_values ?? {}) as Record<string, string>;
  await sendLineNotify(
    [
      "📩 SENPAI LINK 過去問分析 新着",
      "",
      `志望校: ${fv["志望校"] ?? "不明"} ${fv["志望学部"] ?? ""}`,
      `教科: ${fv["教科"] ?? "不明"}`,
      `自己採点: ${fv["自己採点"] ?? "なし"}`,
      `困り事: ${req.message}`,
      "",
      `管理画面: ${SITE_URL}/admin/service-requests`,
    ].join("\n")
  );

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3-3: draft-generate API を作成する**

`src/app/api/kakomon-bunseki/draft-generate/route.ts`:

```typescript
export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/requireAdmin";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(request: Request) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { requestId } = (await request.json()) as { requestId?: string };
  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: req, error } = await supabaseAdmin
    .from("student_service_requests")
    .select("id, field_values, message")
    .eq("id", requestId)
    .eq("service_type", "kakomon_bunseki")
    .single();

  if (error || !req) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const fv = (req.field_values ?? {}) as Record<string, string>;
  const subject = fv["教科"] ?? "英語";
  const templateFile = subject === "国語" ? "japanese.md" : "english.md";

  let template = "";
  try {
    template = readFileSync(
      join(process.cwd(), "templates", "kakomon-bunseki", templateFile),
      "utf-8"
    );
  } catch {
    return NextResponse.json({ error: "Template file not found" }, { status: 500 });
  }

  const filledTemplate = template
    .replace(/\{\{university\}\}/g, fv["志望校"] ?? "（志望校）")
    .replace(/\{\{faculty\}\}/g, fv["志望学部"] ?? "（志望学部）")
    .replace(/\{\{self_score\}\}/g, fv["自己採点"] ?? "未入力")
    .replace(/\{\{trouble_note\}\}/g, req.message ?? "未入力");

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `以下は過去問分析レポートのテンプレートです。
（）内の例示をもとに、実際の内容で埋めてください。
「合格者はこう解いた」セクションは空欄のまま残してください（先輩が直接入力します）。
「答案添削」セクションも空欄のまま残してください。
Markdown 形式で出力してください。

テンプレート:
${filledTemplate}`,
      },
    ],
  });

  const draft = message.content[0].type === "text" ? message.content[0].text.trim() : null;
  if (!draft) {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }

  const { error: updateErr } = await supabaseAdmin
    .from("student_service_requests")
    .update({ draft_markdown: draft })
    .eq("id", requestId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ draft });
}
```

- [ ] **Step 3-4: followup-chat API を作成する**

`src/app/api/kakomon-bunseki/followup-chat/route.ts`:

```typescript
export const preferredRegion = "nrt1";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const { requestId, body, sender } = (await request.json()) as {
    requestId?: string;
    body?: string;
    sender?: "student" | "senpai";
  };

  if (!requestId || !body?.trim() || !sender) {
    return NextResponse.json({ error: "パラメータが不正です。" }, { status: 400 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: req, error: fetchErr } = await adminClient
    .from("student_service_requests")
    .select("id, user_id, status, followup_expires_at, followup_round_count")
    .eq("id", requestId)
    .single();

  if (fetchErr || !req) {
    return NextResponse.json({ error: "リクエストが見つかりません。" }, { status: 404 });
  }

  if (sender === "student") {
    // 生徒は本人チェック
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== req.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // 期限チェック
    if (!req.followup_expires_at || new Date(req.followup_expires_at) < new Date()) {
      return NextResponse.json({ error: "フォローアップ期限（7日間）が過ぎています。" }, { status: 403 });
    }
    // 往復回数チェック（生徒の発言回数上限: 1）
    const round = typeof req.followup_round_count === "number" ? req.followup_round_count : 0;
    if (round >= 1) {
      return NextResponse.json({ error: "追加質問は1回までです。" }, { status: 403 });
    }
    // 往復カウントをインクリメント
    await adminClient
      .from("student_service_requests")
      .update({ followup_round_count: round + 1 })
      .eq("id", requestId);
  } else {
    // admin チェック
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  const { error: insertErr } = await adminClient
    .from("kakomon_followup_chats")
    .insert({ request_id: requestId, sender, body: body.trim() });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3-5: 型チェックを走らせる**

```bash
cd "C:\Users\taich\OneDrive\Desktop\claude code 経営\dev\juku-matching"
npx tsc --noEmit
```

  TypeScript エラーがなければ OK。`Cannot find module` や `Property does not exist` が出た場合は修正する。

- [ ] **Step 3-6: Commit**

```bash
git add src/app/api/kakomon-bunseki/
git commit -m "feat: kakomon-bunseki backend APIs (checkout, verify-payment, draft-generate, followup-chat)"
```

---

## Task 4: 提出フォーム `/student/kakomon-bunseki`

**Files:**
- Create: `src/app/student/kakomon-bunseki/page.tsx`
- Create: `src/app/student/kakomon-bunseki/KakomonBunsekiForm.tsx`
- Create: `src/app/student/kakomon-bunseki/complete/page.tsx`

- [ ] **Step 4-1: サーバーページ（認証ガード）を作成する**

`src/app/student/kakomon-bunseki/page.tsx`:

```typescript
export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import KakomonBunsekiForm from "./KakomonBunsekiForm";

export default async function KakomonBunsekiPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/student/login?next=/student/kakomon-bunseki");
  }

  const params = await searchParams;
  const cancelled = params.cancelled === "1";

  return <KakomonBunsekiForm cancelled={cancelled} />;
}
```

- [ ] **Step 4-2: フォーム client component を作成する**

`src/app/student/kakomon-bunseki/KakomonBunsekiForm.tsx`:

```typescript
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
```

- [ ] **Step 4-3: 決済完了ページを作成する**

`src/app/student/kakomon-bunseki/complete/page.tsx`:

```typescript
export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import SenpaiLogo from "@/components/SenpaiLogo";

export default async function KakomonCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; request_id?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login");

  const params = await searchParams;
  const sessionId = params.session_id;
  const requestId = params.request_id;

  if (!sessionId || !requestId) redirect("/student/dashboard");

  // Verify payment server-side
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app"}/api/kakomon-bunseki/verify-payment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: "" }, // uses createSupabaseServer auth
      body: JSON.stringify({ sessionId, requestId }),
      cache: "no-store",
    }
  );

  // If verification fails, show error but don't crash
  const ok = res.ok;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center px-5 py-4">
          <SenpaiLogo />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        {ok ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12">
            <p className="text-4xl">✅</p>
            <h1 className="mt-4 text-xl font-black">申し込みが完了しました</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              現役早慶の予備校講師が分析を開始します。<br />
              通常3日以内にマイページへ返却されます。
            </p>
            <Link
              href="/student/dashboard"
              className="mt-8 inline-block rounded-xl bg-slate-950 px-8 py-4 text-sm font-black text-white hover:bg-cyan-700"
            >
              マイページへ →
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-red-200 bg-white px-8 py-12">
            <p className="text-4xl">⚠️</p>
            <h1 className="mt-4 text-xl font-black">支払い確認に失敗しました</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              お手数ですが、support@senpailink.vercel.app までご連絡ください。
            </p>
            <Link href="/student/dashboard" className="mt-6 inline-block text-sm text-slate-500 underline">
              マイページへ
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
```

**注意:** complete ページからの `fetch` は server component 内なので、Supabase の session cookie が伝わらない。verify-payment は `createSupabaseServer` を使ってセッションを読むが、server-to-server の fetch では cookie が伝わらない。
→ **修正:** `verify-payment` API を、session チェックではなく Stripe の `metadata.user_id` と URL パラメータ比較のみで検証するように変更する。または、complete ページで直接 Supabase admin client を使って検証する。

以下の alternative complete page を代わりに使う（直接 Stripe + Supabase を呼ぶ）:

```typescript
export const preferredRegion = "nrt1";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import SenpaiLogo from "@/components/SenpaiLogo";
import { sendLineNotify } from "@/lib/line-notify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senpailink.vercel.app";

export default async function KakomonCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; request_id?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login");

  const params = await searchParams;
  const sessionId = params.session_id;
  const requestId = params.request_id;
  if (!sessionId || !requestId) redirect("/student/dashboard");

  let verified = false;

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY!;
    const stripe = new Stripe(stripeKey);
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      stripeSession.payment_status === "paid" &&
      stripeSession.metadata?.request_id === requestId &&
      stripeSession.metadata?.user_id === session.user.id
    ) {
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: req } = await adminClient
        .from("student_service_requests")
        .select("id, status, field_values, message")
        .eq("id", requestId)
        .eq("user_id", session.user.id)
        .single();

      if (req && req.status === "pending_payment") {
        await adminClient
          .from("student_service_requests")
          .update({ status: "new" })
          .eq("id", requestId);

        const fv = (req.field_values ?? {}) as Record<string, string>;
        await sendLineNotify(
          [
            "📩 SENPAI LINK 過去問分析 新着",
            `志望校: ${fv["志望校"] ?? ""} ${fv["志望学部"] ?? ""}`,
            `教科: ${fv["教科"] ?? ""}`,
            `管理画面: ${SITE_URL}/admin/service-requests`,
          ].join("\n")
        );
      }

      verified = true;
    }
  } catch {
    verified = false;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center px-5 py-4">
          <SenpaiLogo />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        {verified ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12">
            <p className="text-4xl">✅</p>
            <h1 className="mt-4 text-xl font-black">申し込みが完了しました</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              現役早慶の予備校講師が分析を開始します。<br />
              通常3日以内にマイページへ返却されます。
            </p>
            <Link
              href="/student/dashboard"
              className="mt-8 inline-block rounded-xl bg-slate-950 px-8 py-4 text-sm font-black text-white hover:bg-cyan-700"
            >
              マイページへ →
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-red-200 bg-white px-8 py-12">
            <p className="text-4xl">⚠️</p>
            <h1 className="mt-4 text-xl font-black">支払い確認ができませんでした</h1>
            <p className="mt-3 text-sm text-slate-500">
              決済が完了している場合、数分後にマイページに反映されます。<br />
              問題が続く場合は運営にご連絡ください。
            </p>
            <Link href="/student/dashboard" className="mt-6 inline-block text-sm text-slate-500 underline">
              マイページへ
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
```

（`verify-payment/route.ts` は削除して OK — complete ページ内で直接処理する）

- [ ] **Step 4-4: verify-payment/route.ts を削除する（上記の代替実装を採用するため）**

```bash
rm "src/app/api/kakomon-bunseki/verify-payment/route.ts"
rmdir "src/app/api/kakomon-bunseki/verify-payment"
```

- [ ] **Step 4-5: 型チェック**

```bash
npx tsc --noEmit
```

  エラーなし → OK

- [ ] **Step 4-6: Commit**

```bash
git add src/app/student/kakomon-bunseki/ src/app/api/kakomon-bunseki/
git commit -m "feat: kakomon-bunseki submission form + Stripe checkout + complete page"
```

---

## Task 5: Admin UI 拡張

**Files:**
- Modify: `src/app/admin/service-requests/ServiceRequestsClient.tsx`

- [ ] **Step 5-1: ServiceRequest 型を拡張する**

`ServiceRequestsClient.tsx` の `ServiceRequest` 型を以下に変更:

```typescript
type ServiceRequest = {
  id: string;
  service_type: "study_room" | "correction" | "kakomon_bunseki";
  status: "pending_payment" | "new" | "in_progress" | "done" | "cancelled";
  field_values: Record<string, string> | null;
  message: string;
  admin_reply: string | null;
  draft_markdown: string | null;
  final_markdown: string | null;
  attachments: { name: string; path: string }[] | null;
  student_email: string | null;
  priority_score: number;
  followup_expires_at: string | null;
  followup_round_count: number;
  created_at: string;
};
```

- [ ] **Step 5-2: SERVICE_LABELS と STATUS_LABELS に追加する**

```typescript
const SERVICE_LABELS: Record<string, string> = {
  study_room: "24h質問対応",
  correction: "専門添削",
  kakomon_bunseki: "過去問分析",
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "決済待ち",
  new: "未対応",
  in_progress: "対応中",
  done: "完了",
  cancelled: "キャンセル",
};

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-slate-100 text-slate-400",
  new: "bg-orange-100 text-orange-700",
  in_progress: "bg-cyan-100 text-cyan-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-500",
};
```

- [ ] **Step 5-3: fetchAll のクエリに新列を追加する**

`fetchAll` 内の `.select(...)` を以下に変更:

```typescript
.select("id, service_type, status, field_values, message, admin_reply, draft_markdown, final_markdown, attachments, student_email, priority_score, followup_expires_at, followup_round_count, created_at")
```

- [ ] **Step 5-4: kakomon_bunseki 専用の詳細UI を追加する**

`selected` が `kakomon_bunseki` のとき、返信エリアの代わりに以下を表示するよう `ServiceRequestsClient.tsx` の詳細パネルを修正する。

既存の `handleSaveReply` の直後に以下の state と handler を追加:

```typescript
const [draftGenerating, setDraftGenerating] = useState(false);
const [finalText, setFinalText] = useState("");
const [showDraft, setShowDraft] = useState(false);

// selected が切り替わったとき finalText をリセット
// handleSelectRequest 内に追加:
const handleSelectRequest = (id: string) => {
  setSelectedId(id);
  const req = requests.find((r) => r.id === id);
  setReplyText(req?.admin_reply ?? "");
  setFinalText(req?.final_markdown ?? "");
  setShowDraft(false);
  setSavedId(null);
};

const handleGenerateDraft = async () => {
  if (!selectedId) return;
  setDraftGenerating(true);
  const res = await fetch("/api/kakomon-bunseki/draft-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId: selectedId }),
  });
  const json = (await res.json()) as { draft?: string; error?: string };
  if (json.draft) {
    setRequests((prev) =>
      prev.map((r) => r.id === selectedId ? { ...r, draft_markdown: json.draft! } : r)
    );
    setFinalText(json.draft);
    setShowDraft(true);
  }
  setDraftGenerating(false);
};

const handleSaveFinal = async () => {
  if (!selectedId) return;
  setSaving(true);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from("student_service_requests")
    .update({
      final_markdown: finalText,
      admin_reply: finalText, // 互換性のため admin_reply にも保存
      status: "done",
      followup_expires_at: expiresAt,
      reply_read_at: null,
    })
    .eq("id", selectedId);

  // メール通知（既存パターン流用）
  const target = requests.find((r) => r.id === selectedId);
  if (target?.student_email) {
    void fetch("/api/admin/notify-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: target.student_email,
        replyText: "過去問分析レポートが返却されました。マイページよりご確認ください。",
        serviceType: "kakomon_bunseki",
        status: "done",
      }),
    });
  }

  setRequests((prev) =>
    prev.map((r) =>
      r.id === selectedId
        ? { ...r, final_markdown: finalText, admin_reply: finalText, status: "done", followup_expires_at: expiresAt }
        : r
    )
  );
  setSavedId(selectedId);
  setSaving(false);
};
```

詳細パネルの返信エリア（`selected.service_type === "kakomon_bunseki"` の場合）:

```typescript
{selected.service_type === "kakomon_bunseki" ? (
  <div className="space-y-4">
    {/* AI 下書き生成 */}
    <div>
      <button
        type="button"
        disabled={draftGenerating}
        onClick={handleGenerateDraft}
        className="w-full rounded-xl border border-cyan-300 bg-cyan-50 py-3 text-xs font-black text-cyan-800 hover:bg-cyan-100 disabled:opacity-50"
      >
        {draftGenerating ? "AI 下書き生成中…" : "🤖 AI で下書きを生成する"}
      </button>
      {selected.draft_markdown && (
        <button
          type="button"
          onClick={() => { setFinalText(selected.draft_markdown!); setShowDraft((v) => !v); }}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-black text-slate-600 hover:bg-slate-100"
        >
          {showDraft ? "下書きを閉じる" : "下書きを表示して編集する"}
        </button>
      )}
    </div>

    {/* final_markdown 編集エリア */}
    <div>
      <label className="text-xs font-black tracking-[0.18em] text-slate-500">
        完成版レポート（Markdown）
      </label>
      <textarea
        value={finalText}
        onChange={(e) => setFinalText(e.target.value)}
        placeholder="① AI 下書きを生成 → ② 体験コメント・答案添削を追記 → ③ 下の「返却・完了にする」ボタンで送信"
        rows={12}
        className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs outline-none focus:border-cyan-400"
      />
    </div>

    {savedId === selected.id && (
      <p className="text-center text-xs font-black text-lime-600">保存・返却しました ✅</p>
    )}

    <button
      type="button"
      disabled={saving || !finalText.trim()}
      onClick={handleSaveFinal}
      className="w-full rounded-xl bg-slate-950 py-3 text-xs font-black text-white hover:bg-lime-600 disabled:opacity-50"
    >
      レポートを返却・完了にする
    </button>
  </div>
) : (
  /* 既存の study_room / correction 向け返信 UI をそのまま維持 */
  <div>
    {/* 既存の textarea + 2ボタン をそのまま */}
  </div>
)}
```

- [ ] **Step 5-5: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 5-6: Commit**

```bash
git add src/app/admin/service-requests/
git commit -m "feat: admin service-requests extended for kakomon_bunseki (draft generation + final_markdown)"
```

---

## Task 6: 分析結果ページ `/student/kakomon-bunseki/[id]`

**Files:**
- Create: `src/app/student/kakomon-bunseki/[id]/page.tsx`
- Create: `src/app/student/kakomon-bunseki/[id]/KakomonResultView.tsx`

- [ ] **Step 6-1: サーバーページを作成する**

`src/app/student/kakomon-bunseki/[id]/page.tsx`:

```typescript
export const preferredRegion = "nrt1";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import KakomonResultView from "./KakomonResultView";

export default async function KakomonResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/student/login");

  const { id } = await params;

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: req, error } = await adminClient
    .from("student_service_requests")
    .select("id, service_type, status, field_values, message, final_markdown, followup_expires_at, followup_round_count, created_at")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .eq("service_type", "kakomon_bunseki")
    .single();

  if (error || !req) notFound();

  const { data: chats } = await adminClient
    .from("kakomon_followup_chats")
    .select("id, sender, body, created_at")
    .eq("request_id", id)
    .order("created_at", { ascending: true });

  return (
    <KakomonResultView
      request={req}
      chats={chats ?? []}
    />
  );
}
```

- [ ] **Step 6-2: 結果 client component を作成する**

`src/app/student/kakomon-bunseki/[id]/KakomonResultView.tsx`:

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

type Request = {
  id: string;
  field_values: Record<string, string> | null;
  message: string;
  final_markdown: string | null;
  status: string;
  followup_expires_at: string | null;
  followup_round_count: number;
};

type Chat = { id: string; sender: string; body: string; created_at: string };

export default function KakomonResultView({
  request,
  chats,
}: {
  request: Request;
  chats: Chat[];
}) {
  const [chatBody, setChatBody] = useState("");
  const [sending, setSending] = useState(false);
  const [localChats, setLocalChats] = useState<Chat[]>(chats);
  const [chatError, setChatError] = useState("");
  const [chatSent, setChatSent] = useState(false);

  const fv = request.field_values ?? {};
  const isDone = request.status === "done";
  const expiresAt = request.followup_expires_at ? new Date(request.followup_expires_at) : null;
  const chatExpired = expiresAt ? expiresAt < new Date() : true;
  const roundCount = request.followup_round_count ?? 0;
  const canSendChat = isDone && !chatExpired && roundCount < 1 && !chatSent;

  async function sendChat() {
    if (!chatBody.trim()) return;
    setSending(true);
    setChatError("");
    const res = await fetch("/api/kakomon-bunseki/followup-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: request.id, body: chatBody, sender: "student" }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    setSending(false);
    if (!res.ok) {
      setChatError(json.error ?? "送信に失敗しました。");
      return;
    }
    setLocalChats((prev) => [...prev, {
      id: crypto.randomUUID(),
      sender: "student",
      body: chatBody,
      created_at: new Date().toISOString(),
    }]);
    setChatBody("");
    setChatSent(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-900">
            ← マイページ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        {/* 申し込み内容 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-black tracking-[0.28em] text-cyan-700">PAST EXAM ANALYSIS</p>
          <h1 className="mt-1 text-xl font-black">
            {fv["志望校"] ?? ""} {fv["志望学部"] ?? ""} — {fv["教科"] ?? ""}
          </h1>
          <p className="mt-2 text-xs text-slate-400">自己採点: {fv["自己採点"] || "未入力"}</p>
          <p className="mt-1 text-sm text-slate-600">{request.message}</p>
          <div className="mt-3">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-black ${
              isDone ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
            }`}>
              {isDone ? "返却済み" : "分析中（通常3日以内）"}
            </span>
          </div>
        </div>

        {/* 分析レポート */}
        {isDone && request.final_markdown ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-black tracking-[0.28em] text-slate-500">ANALYSIS REPORT</p>
            <div
              className="prose prose-sm mt-4 max-w-none leading-7 text-slate-800"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(request.final_markdown) }}
            />
          </div>
        ) : !isDone ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
            <p className="text-slate-400 text-sm">現役早慶の予備校講師が分析中です。<br />通常3日以内に返却されます。</p>
          </div>
        ) : null}

        {/* フォローアップチャット */}
        {isDone && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-black tracking-[0.28em] text-slate-500">FOLLOW-UP CHAT</p>
            <p className="mt-1 text-xs text-slate-400">
              返却後7日以内・1往復まで追加質問できます。
              {expiresAt && !chatExpired && ` 期限: ${expiresAt.toLocaleDateString("ja-JP")}`}
            </p>

            <div className="mt-4 space-y-3">
              {localChats.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl px-4 py-3 text-sm leading-7 ${
                    c.sender === "student"
                      ? "ml-auto max-w-lg bg-cyan-50 text-cyan-900"
                      : "mr-auto max-w-lg bg-slate-100 text-slate-800"
                  }`}
                >
                  <p className="text-xs font-black mb-1 opacity-50">
                    {c.sender === "student" ? "あなた" : "先輩"}
                  </p>
                  {c.body}
                </div>
              ))}
            </div>

            {canSendChat && (
              <div className="mt-4">
                <textarea
                  value={chatBody}
                  onChange={(e) => setChatBody(e.target.value)}
                  rows={4}
                  placeholder="レポートについて質問する（1回まで）"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
                {chatError && (
                  <p className="mt-2 text-xs font-bold text-red-600">{chatError}</p>
                )}
                <button
                  type="button"
                  disabled={sending || !chatBody.trim()}
                  onClick={sendChat}
                  className="mt-3 w-full rounded-xl bg-slate-950 py-3 text-xs font-black text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  {sending ? "送信中…" : "質問を送る"}
                </button>
              </div>
            )}

            {chatExpired && (
              <p className="mt-4 text-xs text-slate-400">フォローアップ期限が過ぎました。</p>
            )}
            {!canSendChat && !chatExpired && roundCount >= 1 && !chatSent && (
              <p className="mt-4 text-xs text-slate-400">追加質問は1回まで（送信済み）。</p>
            )}
            {chatSent && (
              <p className="mt-4 text-xs font-black text-lime-600">質問を送りました。先輩が返答します。</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// 最小限の Markdown → HTML 変換（h1〜h3, bold, table, hr, br）
function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---$/gm, "<hr>")
    .replace(/\n/g, "<br>");
}
```

- [ ] **Step 6-3: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 6-4: Commit**

```bash
git add src/app/student/kakomon-bunseki/
git commit -m "feat: kakomon-bunseki result page + follow-up chat UI"
```

---

## Task 7: LP 更新

**Files:**
- Modify: `src/app/kakomon-tensaku/page.tsx`
- Modify: `src/app/shoronbun-tensaku/page.tsx`
- Modify: `src/app/eisakubun-tensaku/page.tsx`

- [ ] **Step 7-1: `/kakomon-tensaku/page.tsx` を全面刷新する**

既存ファイルを読み込み、以下の内容で完全に置き換える。

`src/app/kakomon-tensaku/page.tsx` の全文:

```typescript
import type { Metadata } from "next";
import Link from "next/link";
import SenpaiLogo from "@/components/SenpaiLogo";

export const metadata: Metadata = {
  title: "過去問分析オンライン｜合格者の視点で配点・頻出論点・捨て問を分析 ¥1,000",
  description:
    "志望校の過去問を現役早慶の予備校講師が分析。配点・頻出論点・捨て問判断と答案1枚の添削つき。¥1,000/1教科（英語・国語）。通常3日以内に返却。",
  keywords: [
    "過去問分析",
    "過去問 分析 オンライン",
    "過去問 傾向 分析",
    "早慶 過去問 対策",
    "MARCH 過去問 分析",
    "受験 過去問 分析",
  ],
  alternates: { canonical: "/kakomon-tensaku" },
  openGraph: {
    type: "website",
    title: "過去問分析オンライン｜合格者の視点で分析 - SENPAI LINK",
    description:
      "現役早慶の予備校講師が配点・頻出論点・捨て問を分析＋答案添削。¥1,000/1教科（英語・国語）。",
    url: "/kakomon-tensaku",
    siteName: "SENPAI LINK",
  },
};

const STEPS = [
  { n: "01", t: "提出する", d: "志望校・学部・教科と答案（任意）を提出。困り事も自由記入。" },
  { n: "02", t: "先輩が分析", d: "配点・傾向をAIで下書き→先輩が「自分はこう解いた」体験コメントと答案添削を追記。" },
  { n: "03", t: "返却・質問OK", d: "分析レポートで返却。返却後7日・1往復の追加質問チャット付き。" },
];

const FAQ: [string, string][] = [
  ["誰が分析・添削しますか？", "現役早慶の予備校講師（合格した先輩）が対応します。β版のため、体験記を書いた先輩本人とのマッチングは順次拡大予定です。"],
  ["対応教科は？", "現在は英語・国語の2教科のみです。大学・学部は問いません。"],
  ["答案がない場合は？", "答案がなくても申し込めます。その場合は分析レポートのみ返却します（価格は同じ¥1,000）。"],
  ["追加で質問できますか？", "返却後7日以内・1往復の専用チャットが付いています。"],
  ["どれくらいで返ってきますか？", "通常3日以内に返却します。"],
];

export default function KakomonTensakuPage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "過去問分析（オンライン）",
    serviceType: "過去問分析",
    provider: { "@type": "Organization", name: "SENPAI LINK", url: "https://senpailink.vercel.app" },
    areaServed: "JP",
    description: "現役早慶の予備校講師による志望校過去問の傾向分析＋答案添削サービス。",
    offers: { "@type": "Offer", price: "1000", priceCurrency: "JPY" },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <SenpaiLogo />
          <Link href="/student/kakomon-bunseki" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800">
            過去問分析を申し込む
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-white px-5 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-black tracking-[0.36em] text-cyan-600">PAST EXAM ANALYSIS</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              合格者の頭の中で、<br />
              <span className="text-cyan-600">過去問を読む</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-slate-600">
              現役早慶の予備校講師が、志望校の配点・頻出論点・捨て問判断を分析。<br />
              あなたの答案1枚の添削つき。英語・国語 ¥1,000 / 1教科
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/student/kakomon-bunseki"
                className="rounded-xl bg-slate-950 px-8 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                過去問分析を申し込む（¥1,000）→
              </Link>
              <a href="#faq" className="rounded-xl border border-slate-300 px-8 py-4 text-sm font-black text-slate-700 transition-all hover:bg-slate-50">
                よくある質問
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-400">英語・国語 ¥1,000 · 通常3日以内に返却 · 返却後1往復チャット付き</p>
          </div>
        </section>

        {/* 差別化3点 */}
        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">SENPAI LINKの過去問分析が選ばれる理由</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { icon: "🎯", t: "合格者にしか語れない情報", d: "「どこを捨てたか」「どの大問で稼いだか」「本番の感触」は赤本には載っていない。受かった先輩だけが持つ情報。" },
                { icon: "📊", t: "配点・傾向を可視化", d: "直近3年の大問構成・配点比率・頻出論点TOP3・捨て論点を整理。何を優先するかが明確になる。" },
                { icon: "✍️", t: "答案添削＋次の一手", d: "提出した答案に直接コメント。「今◯点→合格点まであと◯点→何を◯月までにやるか」の3項目で返却。" },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="text-3xl">{c.icon}</span>
                  <h3 className="mt-3 text-base font-black leading-snug text-slate-900">{c.t}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 返ってくるもの */}
        <section className="border-y border-slate-200 bg-slate-50 px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">返ってくるもの（5項目）</h2>
            <div className="mt-8 space-y-3">
              {[
                { n: "01", t: "配点・出題マップ", d: "直近3年の大問構成・配点比率・推定時間配分" },
                { n: "02", t: "頻出論点 TOP3 ＆ 捨て論点", d: "どの分野が出やすく、どこは深追い不要か" },
                { n: "03", t: "★ 合格者はこう解いた", d: "解いた順序・稼いだ大問・捨てた大問・本番の感触（先輩の体験コメント＝ここが差別化の核）" },
                { n: "04", t: "次の一手（パーソナライズ）", d: "今◯点→合格点まで◯点不足→何を◯月までにやるかを3項目で" },
                { n: "05", t: "答案添削", d: "提出した答案1枚へのコメント（答案がない場合は省略）" },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <p className={`shrink-0 text-2xl font-black ${s.n === "03" ? "text-cyan-400" : "text-slate-200"}`}>{s.n}</p>
                  <div>
                    <h3 className={`font-black ${s.n === "03" ? "text-cyan-700" : "text-slate-900"}`}>{s.t}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 流れ */}
        <section className="px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">申し込みの流れ</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="text-3xl font-black text-cyan-200">{s.n}</p>
                  <h3 className="mt-2 text-base font-black text-slate-900">{s.t}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金 */}
        <section className="border-y border-slate-200 bg-slate-50 px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-slate-900">料金</h2>
            <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {[
                ["過去問分析（英語）", "¥1,000 / 1教科"],
                ["過去問分析（国語）", "¥1,000 / 1教科"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-slate-100 px-6 py-4 last:border-b-0">
                  <span className="text-sm font-black text-slate-800">{k}</span>
                  <span className="text-base font-black text-cyan-700">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">
              分析レポート ＋ 答案添削（任意）＋ 返却後7日・1往復チャット込み。答案がない場合も同額（分析のみ返却）。
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 py-14">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-black text-slate-900">よくある質問</h2>
            <div className="mt-8 space-y-5">
              {FAQ.map(([q, a]) => (
                <div key={q} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="font-black text-slate-900">{q}</p>
                  <p className="mt-1.5 text-sm leading-7 text-slate-600">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 相互リンク */}
        <section className="border-t border-slate-200 bg-slate-50 px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-black tracking-[0.3em] text-cyan-600">SENPAI LINK</p>
            <h2 className="mt-2 text-center text-2xl font-black text-slate-900">他のサービスも見る</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link href="/shoronbun-tensaku" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">✍️ 小論文添削</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">現役早慶の予備校講師が小論文を¥500で添削。</p>
              </Link>
              <Link href="/eisakubun-tensaku" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">✏️ 英作文添削</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">英作文・自由英作文を¥500で添削。</p>
              </Link>
              <Link href="/experiences" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">📖 合格体験記を読む</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">早慶・MARCHの先輩の「分岐点」を無料で。</p>
              </Link>
              <Link href="/match" className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                <h3 className="text-base font-black text-slate-900">💬 先輩に相談する</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">現役早慶の予備校講師にチャットで相談。1テーマ無料。</p>
              </Link>
            </div>
          </div>
        </section>

        {/* 最終CTA */}
        <section className="px-5 pb-20">
          <div className="mx-auto max-w-2xl rounded-3xl bg-slate-950 px-8 py-12 text-center text-white">
            <h2 className="text-2xl font-black">まず1教科、出してみる</h2>
            <p className="mt-2 text-sm text-slate-300">現役早慶の予備校講師が、あなたの過去問を分析します。</p>
            <Link
              href="/student/kakomon-bunseki"
              className="mt-6 inline-block rounded-xl bg-white px-10 py-4 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              過去問分析を申し込む（¥1,000）→
            </Link>
            <p className="mt-3 text-xs text-slate-500">登録無料 · 通常3日以内に返却 · 答案なしでも可</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row">
          <SenpaiLogo />
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900">トップ</Link>
            <Link href="/experiences" className="hover:text-slate-900">合格体験記</Link>
            <Link href="/pricing" className="hover:text-slate-900">料金</Link>
            <Link href="/faq" className="hover:text-slate-900">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 7-2: 他 LP の相互リンクを更新する（小論文）**

`src/app/shoronbun-tensaku/page.tsx` の「他のサービスも見る」カードの過去問部分を更新:

```typescript
// 変更前
<Link href="/kakomon-tensaku" ...>
  <h3 ...>📄 過去問添削</h3>
  <p ...>志望校の過去問答案を1教科¥1,500で添削。</p>
</Link>

// 変更後
<Link href="/kakomon-tensaku" ...>
  <h3 ...>📄 過去問分析</h3>
  <p ...>配点・頻出論点・捨て問判断＋答案添削。¥1,000（英語・国語）。</p>
</Link>
```

- [ ] **Step 7-3: 他 LP の相互リンクを更新する（英作文）**

`src/app/eisakubun-tensaku/page.tsx` の「他のサービスも見る」の過去問カードを同様に更新。

- [ ] **Step 7-4: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 7-5: Commit**

```bash
git add src/app/kakomon-tensaku/ src/app/shoronbun-tensaku/ src/app/eisakubun-tensaku/
git commit -m "feat: kakomon-tensaku LP overhaul (过去問分析) + cross-link updates"
```

---

## Task 8: ビルド・手動確認・本番デプロイ

**Files:**
- なし（確認のみ）

- [ ] **Step 8-1: フルビルドを実行する**

```bash
cd "C:\Users\taich\OneDrive\Desktop\claude code 経営\dev\juku-matching"
npm run build
```

  期待する出力: `✓ Compiled successfully`  
  失敗した場合: エラーメッセージを確認し、該当ファイルを修正してから再実行。

- [ ] **Step 8-2: 手動確認チェックリスト（ローカルサーバーで確認）**

```bash
PORT=3100 npm run start
```

| URL | 確認内容 |
|---|---|
| `http://localhost:3100/kakomon-tensaku` | LP が「合格者の頭の中で…」ヒーローで表示される |
| `http://localhost:3100/student/kakomon-bunseki`（未ログイン） | `/student/login` にリダイレクトされる |
| `http://localhost:3100/student/kakomon-bunseki`（ログイン後） | フォームが表示される、教科選択に「英語・国語」のみある |
| フォーム入力→送信 | Stripe checkout にリダイレクトされる |
| `http://localhost:3100/admin/service-requests`（admin ログイン後） | `kakomon_bunseki` のバッジが表示される |

- [ ] **Step 8-3: 本番デプロイ**

```bash
npx vercel --prod
```

  デプロイ後、本番 URL（https://senpailink.vercel.app/kakomon-tensaku）にアクセスして LP が表示されることを確認。

- [ ] **Step 8-4: 最終 Commit**

```bash
git add -A
git commit -m "chore: post-deploy verification"
```

---

## 残課題（スコープ外）

- 数学・理科・社会への教科拡張（3ヶ月後に判断）
- `ServiceRequestsClient` にフォローアップチャットの admin 返信 UI（`sender='senpai'` の投稿）— 現在は `final_markdown` 内に含める想定
- `/student/dashboard` の「対応履歴」カードに `kakomon_bunseki` の表示対応
- PDF ダウンロード機能（現在は Web 画面表示のみ）
- NPS アンケート（返却後メールに1問追加）
