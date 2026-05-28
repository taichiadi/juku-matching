import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xmbzpllpjjhaesinlknq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtYnpwbGxwampoYWVzaW5sa25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzQ2MDEsImV4cCI6MjA5MzE1MDYwMX0.WgM4Q0zqTqAmFG4uuXjz74IM5TlmNpBZ_-nZta34frc"
);

// 大学ごとの受験セット（合格した大学 / 不合格だった大学）
// キー: target_university の名前
const EXAM_MAP = {
  "早稲田大学": {
    passed: ["早稲田大学 社会科学部", "明治大学 政治経済学部"],
    failed: ["慶應義塾大学 経済学部", "上智大学 法学部"],
  },
  "慶應義塾大学": {
    passed: ["慶應義塾大学 商学部", "早稲田大学 商学部"],
    failed: ["慶應義塾大学 法学部", "東京大学 文科二類"],
  },
  "上智大学": {
    passed: ["上智大学 法学部", "明治大学 法学部"],
    failed: ["早稲田大学 法学部", "慶應義塾大学 法学部"],
  },
  "明治大学": {
    passed: ["明治大学 経営学部", "法政大学 法学部"],
    failed: ["早稲田大学 商学部", "立教大学 経営学部"],
  },
  "青山学院大学": {
    passed: ["青山学院大学 法学部", "立教大学 法学部"],
    failed: ["早稲田大学 社会科学部", "上智大学 経済学部"],
  },
  "立教大学": {
    passed: ["立教大学 経済学部", "中央大学 法学部"],
    failed: ["早稲田大学 教育学部", "明治大学 商学部"],
  },
  "中央大学": {
    passed: ["中央大学 経済学部", "法政大学 法学部"],
    failed: ["早稲田大学 法学部", "明治大学 法学部"],
  },
  "法政大学": {
    passed: ["法政大学 経済学部", "日本大学 法学部"],
    failed: ["明治大学 経営学部", "立教大学 法学部"],
  },
  "同志社大学": {
    passed: ["同志社大学 法学部", "立命館大学 法学部"],
    failed: ["早稲田大学 法学部", "関西学院大学 法学部"],
  },
  "立命館大学": {
    passed: ["立命館大学 経営学部", "関西大学 法学部"],
    failed: ["同志社大学 法学部", "関西学院大学 経済学部"],
  },
  "関西学院大学": {
    passed: ["関西学院大学 法学部", "同志社大学 商学部"],
    failed: ["早稲田大学 商学部", "慶應義塾大学 商学部"],
  },
  "関西大学": {
    passed: ["関西大学 法学部", "立命館大学 産業社会学部"],
    failed: ["同志社大学 経済学部", "関西学院大学 経済学部"],
  },
};

async function run() {
  // サンプルレコードを全件取得
  const { data, error } = await supabase
    .from("experiences")
    .select("id, target_university, target_faculty, result")
    .eq("tutor_verification_status", "sample");

  if (error || !data) {
    console.error("取得エラー:", error?.message);
    return;
  }

  console.log(`対象レコード: ${data.length}件`);

  let updated = 0;
  let skipped = 0;

  for (const rec of data) {
    const map = EXAM_MAP[rec.target_university];
    if (!map) { skipped++; continue; }

    const targetLabel = `${rec.target_university} ${rec.target_faculty ?? ""}`.trim();
    const isPassed = rec.result === "合格";

    // 合格した大学: 主志望校(合格時) + 同時合格した他校
    const passedSchools = isPassed
      ? [targetLabel, ...map.passed]
      : [...map.passed];

    // 不合格だった大学: 主志望校(不合格時) + その他失敗校
    const failedSchools = isPassed
      ? [...map.failed]
      : [targetLabel, ...map.failed];

    const { error: updateError } = await supabase
      .from("experiences")
      .update({
        ronin_passed: passedSchools.join(", "),
        concurrent_strategy: failedSchools.join(", "),
      })
      .eq("id", rec.id);

    if (updateError) {
      console.error(`ID ${rec.id} 更新エラー:`, updateError.message);
    } else {
      updated++;
    }
  }

  console.log(`✓ 更新: ${updated}件 / スキップ: ${skipped}件`);
}

run();
