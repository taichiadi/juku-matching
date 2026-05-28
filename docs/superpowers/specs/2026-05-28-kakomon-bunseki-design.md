# 過去問分析サービス 設計ドキュメント

**作成日**: 2026-05-28  
**担当**: CEO（ジョブズ）／技術担当  
**ステータス**: 承認済み・実装待ち

---

## 概要

既存の「過去問添削（¥1,500/教科）」を廃止し、**「過去問分析セット（¥1,000/1教科）」**に完全置き換える。

「敵を知る」型フレーミング：合格者本人にしか語れない「捨て問判断・解いた順序・本番の感触」を核に、AI下書き＋先輩レビューのハイブリッドで量産可能にする。

---

## § 1. 商品の中身

### 販売単位
- **1セット = 1志望校 × 1教科 × 答案1枚（答案は任意）**
- 価格：**¥1,000/セット**（都度払い・Stripe）
- 初期対応教科：**英語・国語のみ**（大学・学部は問わず）

### 返却物（PDF または Web画面・A4 1〜2枚相当）

1. **配点・出題マップ** — 直近3年の大問構成・配点比率・推定時間配分
2. **頻出論点 TOP3 ＆ 捨て論点** — どの分野が出やすく、どこは深追い不要か
3. **合格者はこう解いた**（★差別化の核）— 先輩本人の体験コメント（解いた順序・時間配分・稼いだ大問・捨てた大問・本番の感触）
4. **次の一手（パーソナライズ）** — 提出された答案と現状から「今◯点→合格点まで◯点不足→何を◯月までにやるか」を3項目
5. **答案添削** — 提出された答案1枚へのコメント（答案がない場合は省略・価格変わらず）

### 付帯サービス
- 返却後 **7日以内・往復1回**の専用フォローアップチャット
- 「書き直した答案を見てほしい」もこの1往復枠で受ける
- 往復1回超過 → 送信ブロック＋添削専用チャット窓口へ誘導（`/student/kakomon-bunseki/[id]/chat`）
- 7日経過 → 自動クローズ

### 約束
- **通常3日以内**に返却

---

## § 2. 生成フロー

```
[生徒] 提出フォーム入力（志望校・学部・教科・答案画像/テキスト・自己採点・困り事）
  → 決済完了（¥1,000・Stripe）
       ↓
[システム] student_service_requests レコード作成（type='kakomon_bunseki'）
           + admin 通知（既存 LINE/メール通知パイプライン流用）
       ↓
[AI下書きジョブ] /api/kakomon-bunseki/draft-generate（admin 認証必須）
  - 入力: request_id
  - テンプレ + 合格体験記DBの該当校レコード + 受付内容 を context に分析下書き生成
  - 出力: draft_markdown を service_request に保存
  - キック: admin 画面の「下書き生成」ボタン（初期）→ 後で Supabase Trigger 自動化も可
       ↓
[先輩レビュー] /admin/service-requests から対象 request を開き 3点だけ手を入れる
  ① 体験コメント追加（§1 の「合格者はこう解いた」）
  ② 「次の一手」を志望校カラーで調整
  ③ 答案添削（既存 UI 流用）
  → 実作業目安: 30〜60分/セット
       ↓
[システム] final_markdown を確定 → Web画面を解放 + LINE/メール通知
       ↓
[7日タイマー] フォローアップチャット枠を開放、期限後は自動クローズ
```

### 運営制約（3人体制）
- 受付キャップ: 週10件目安（admin 画面でトグル制御）
- 教科テンプレ: リポジトリ内 Markdown ファイルで管理（`templates/kakomon-bunseki/{university}-{subject}.md`）、後でテーブル化可

---

## § 3. データフロー & 実装

### 流用する既存資産

| 既存 | 用途 |
|---|---|
| `student_service_requests` テーブル | 受付レコード（type 列に `kakomon_bunseki` 追加） |
| `/admin/service-requests` | 先輩レビュー・添削ワークベンチ（下書き表示を追加） |
| `/student/correction` | 参考にして兄弟ページ `/student/kakomon-bunseki` を新設 |
| Stripe `/api/stripe/*` | 既存の単発決済フロー流用（¥1,000・都度払い） |
| OTP 認証フロー | **触らない**（CLAUDE.md 禁止） |
| LINE/メール通知 | 既存通知パイプライン流用（**LINE webhook 本体は触らない**） |

### 新規追加

#### DB（Supabase）

**`student_service_requests` に列追加**:
```sql
draft_markdown      text,          -- AI 下書き
final_markdown      text,          -- 完成版
target_university   text,
target_faculty      text,
subject             text,          -- 'english' | 'japanese'
answer_image_urls   text[],        -- 答案画像（既存列あれば再利用）
self_score          int,           -- 自己採点（任意）
trouble_note        text           -- 困り事メモ（任意）
```

**新規テーブル `kakomon_followup_chats`**:
```sql
id           uuid primary key default gen_random_uuid(),
request_id   uuid references student_service_requests(id),
sender       text,               -- 'student' | 'senpai'
body         text,
created_at   timestamptz default now(),
expires_at   timestamptz,        -- request 返却後 + 7日
round_count  int default 0       -- 生徒発言回数（上限 1）
```

**RLS**:
- 既存の RLS ポリシーは**変更しない**
- 新規テーブル・新規列に対する**追加ポリシーのみ**設ける
  - `kakomon_followup_chats`: 生徒は `auth.uid() = (select student_id from student_service_requests ...)` の件のみ SELECT / INSERT 可
  - admin は全件操作可（service_role または role='admin' チェック）

#### API エンドポイント

`POST /api/kakomon-bunseki/draft-generate`
- 認証: `getAdminUser`（既存ヘルパー）
- 入力: `{ requestId: string }`
- 処理: Anthropic API 呼び出し → `draft_markdown` を Supabase に保存
- エラー: 失敗時は `draft_markdown = null` のまま admin 画面に「未生成」バッジ

#### Web 画面

`/student/kakomon-bunseki/[id]`（ログイン必須）
- `final_markdown` を整形表示
- PDF ダウンロードボタン
- フォローアップチャット欄（往復カウント・期限表示）

`/admin/service-requests` 拡張
- type='kakomon_bunseki' のカードに「下書き生成」ボタンと `draft_markdown` 編集エリアを追加

### 触らないファイル（CLAUDE.md 明示）
- `/api/crisp-webhook/`、`/api/line-webhook/`、`/api/line-test/`
- 既存の Stripe webhook 処理
- 既存の OTP 認証フロー
- 既存の RLS ポリシー本体

---

## § 4. 失敗ケースと運用

| ケース | 対処 |
|---|---|
| AI 下書き生成失敗 | `draft_markdown = null` のまま保存、admin に「未生成」バッジ。先輩がフルマニュアルで書くか「再生成」ボタンで再実行 |
| 3日以内に返却できない | admin 進捗ステータス（受付中/作業中/返却済）で管理。遅延しそうな件は先輩への通知。LP に「繁忙期は遅延可能性あり」と明示 |
| 対応外教科の申し込み | フォームで英語・国語のみ選択可（他は「準備中」表示）。滑り込み時は Stripe から手動返金 |
| 答案なしで申し込み | 答案は任意入力。空欄の場合は§1 の「答案添削」パートを省いた分析レポートのみ返却（価格¥1,000 変わらず）。フォームに明示 |
| 追加質問の往復1回超過 | システムが送信ブロック。「さらに聞きたい場合はこちらの添削専用チャットへ」と `/student/kakomon-bunseki/[id]/chat` へ誘導 |
| 返却後7日超過 | タイムアウト表示。同様に専用チャット窓口へ誘導 |
| クレーム（内容が浅い等） | admin 画面で `final_markdown` を上書き → 再通知。返金は Stripe 手動払い戻し |

---

## § 5. LP / 訴求

**URL**: 既存 `/kakomon-tensaku` を維持（SEO 資産引き継ぎ）

### ヒーローコピー
- **キャッチ**: 「合格者の頭の中で、過去問を読む」
- **サブ**: 現役早慶の予備校講師が、志望校の配点・頻出論点・捨て問判断を分析。あなたの答案1枚の添削つき。¥1,000 / 1教科

### LP セクション構成
1. Hero + CTA（「過去問を分析してもらう（¥1,000）→」）
2. なぜこのサービスか（塾・AI との差別化3点）
3. 返ってくるもの（5項目リスト、「合格者はこう解いた」を最も大きく）
4. 流れ（01 提出 → 02 分析・添削 → 03 返却）
5. 料金表（¥1,000/1教科・英語または国語）
6. FAQ（JSON-LD 対応）
7. 他サービス相互リンク
8. 最終 CTA

### 料金表注記
```
過去問分析セット（英語 or 国語）: ¥1,000 / 1教科
※ 分析レポート＋答案添削（任意）＋返却後1往復チャット込み
※ 答案がない場合も同額（分析レポートのみ返却）
```

### FAQ（JSON-LD）
- Q: 誰が分析・添削しますか？ / A: 現役早慶の予備校講師（合格した先輩）が対応します。β版のため…
- Q: 対応教科は？ / A: 現在は英語・国語のみ。大学・学部は問いません。
- Q: 答案がない場合は？ / A: 答案がなくても申し込めます。その場合は分析レポートのみ返却します（価格は同じ¥1,000）。
- Q: 追加で質問できますか？ / A: 返却後7日以内・1往復の専用チャット付きです。

### 他LP 更新
- `shoronbun-tensaku`・`eisakubun-tensaku` の「他のサービスも見る」カード内「過去問添削¥1,500」→「過去問分析¥1,000（分析＋添削セット）」に差し替え
- `sitemap.ts`・`robots.ts` は `/kakomon-tensaku` URL 変更なしのため更新不要

---

## § 6. 検証方法

### 北極星指標
過去問分析セットの**週次購入件数**

### 計測（追加実装なし・即日確認可）
- Supabase: `SELECT count(*) FROM student_service_requests WHERE type='kakomon_bunseki'` を週次確認
- Stripe ダッシュボード: ¥1,000 決済履歴

### 品質確認（定性）
- 返却後7日間の追加質問使用率
- 先輩のレビュー所要時間が 30〜60 分に収まっているか

### 3ヶ月後の Go/No-go
| 判断 | 対処 |
|---|---|
| 月10件以上が安定 | 対応教科を数学・現代文等に拡張 |
| 月10件未満が続く | LP コピーの A/B テスト or 「答案なし無料お試し」を期間限定で試す |
| 先輩1人の作業が週5時間超 | 受付キャップを下げるか AI 下書き精度を先に上げる |

---

## スコープ外（今回やらない）

- 数学・理科・社会への教科拡張（3ヶ月後に判断）
- NPS / 満足度アンケート（中期課題）
- 動画解説 / 1on1 面談（別商品として温存）
- 合格率との相関追跡（中期課題）
