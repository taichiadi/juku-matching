@AGENTS.md

<!-- BEGIN:senpai-link-strategy -->
# SENPAI LINK 戦略指針（追記）

## 既存実装の確認が最優先

コードを書く前に、以下の既存ファイルを必ず読むこと:
- /consult/[token]/ → 相談機能の現状
- /api/stripe/ 配下 → 決済・サブスク実装の現状
- /student/correction/ → 添削機能の現状
- /parents/page.tsx → 保護者ページの現状
- /diagnostic/ → 診断機能の現状
- /match/page.tsx → コーチ検索の現状

## サービスの進化方向

「単発相談 → 伴走移行」がコアフロー。
現状の /consult/ と /api/stripe/ を活かして以下を追加する:

1. 単発相談(4,000円)終了後の相性スコア入力画面
2. 両者高評価時の伴走プラン提案画面(BASIC/STANDARD/PREMIUM)
3. 分岐点ログの構造化入力フォーム(面談中に記録)

## 絶対に触らないファイル(確認なしに変更禁止)

- /api/crisp-webhook/ (外部サービス連携)
- /api/line-webhook/ (LINE連携)
- /api/line-test/
- 既存のStripe webhook処理
- 既存のOTP認証フロー
- 既存のRLSポリシー

## Next.js 16 対応

node_modules/next/dist/docs/ を必ず参照。
既存コードのパターンを最優先で踏襲する。
新機能を実装する際は既存ページの書き方をまず読んでから書く。

## 優先実装順(P0から着手)

P0: 相性スコア入力 + 伴走プラン提案画面
P1: 分岐点ログ入力フォーム
P2: 保護者ダッシュボード強化
P3: AI相談の分岐点DB参照化

<!-- END:senpai-link-strategy -->
