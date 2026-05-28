import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xmbzpllpjjhaesinlknq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtYnpwbGxwampoYWVzaW5sa25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzQ2MDEsImV4cCI6MjA5MzE1MDYwMX0.WgM4Q0zqTqAmFG4uuXjz74IM5TlmNpBZ_-nZta34frc"
);

// 早慶上智MARCH・関関同立 以外のレコードを削除
const DELETE_EMAILS = [
  "sample31@senpailink.jp", // 東大理一
  "sample32@senpailink.jp", // 阪大工学部
  "sample33@senpailink.jp", // 名大医学部
  "sample34@senpailink.jp", // 東北大理学部
  "sample35@senpailink.jp", // 京大文学部
  "sample39@senpailink.jp", // 日本大医学部
  "sample40@senpailink.jp", // 東洋大経営
  "sample41@senpailink.jp", // 専修大法
  "sample42@senpailink.jp", // 津田塾大
  "sample43@senpailink.jp", // 東京学芸大
  "sample44@senpailink.jp", // 広島大法
  "sample45@senpailink.jp", // 新潟大経済
  "sample46@senpailink.jp", // 熊本大医学部
  "sample60@senpailink.jp", // 北大経済
  "sample61@senpailink.jp", // 九大法
  "sample79@senpailink.jp", // 東京理科大工学部
  "sample80@senpailink.jp", // 近畿大法
  "sample81@senpailink.jp", // 龍谷大経済
  "sample82@senpailink.jp", // 甲南大経営
  "sample83@senpailink.jp", // 大阪公立大経済
  "sample84@senpailink.jp", // 神戸大経営
  "sample85@senpailink.jp", // 横浜国大経済
  "sample86@senpailink.jp", // 千葉大法政経
  "sample87@senpailink.jp", // 東京理科大(早稲田落ち)
  "sample90@senpailink.jp", // 東農大農学部
  "sample91@senpailink.jp", // 日本女子大
  "sample92@senpailink.jp", // 明治学院大
  "sample93@senpailink.jp", // 東京都市大
  "sample94@senpailink.jp", // 同志社女子大
  "sample95@senpailink.jp", // 大阪公立大工学域
  "sample96@senpailink.jp", // 西南学院大
  "sample97@senpailink.jp", // APU
  "sample98@senpailink.jp", // 獨協大
  "sample99@senpailink.jp", // 武蔵野大
  "sample100@senpailink.jp", // 帝京大薬学
  "sample101@senpailink.jp", // 名大法
  "sample102@senpailink.jp", // 東京外大
  "sample108@senpailink.jp", // 学習院大
  "sample109@senpailink.jp", // 成蹊大
  "sample117@senpailink.jp", // 東大文三
  "sample119@senpailink.jp", // 一橋商
  "sample120@senpailink.jp", // 東工大
  "sample121@senpailink.jp", // ICU
  "sample123@senpailink.jp", // 近大医学部
  "sample125@senpailink.jp", // 大阪医科薬科大
  "sample126@senpailink.jp", // 福岡大
  "sample127@senpailink.jp", // 岡山大
  "sample128@senpailink.jp", // 金沢大
];

async function run() {
  const { error, count } = await supabase
    .from("experiences")
    .delete({ count: "exact" })
    .in("author_email", DELETE_EMAILS);

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log(`✓ Deleted ${count} records`);
  }

  const { count: remaining } = await supabase
    .from("experiences")
    .select("id", { count: "exact", head: true })
    .eq("tutor_verification_status", "sample");
  console.log(`Remaining sample records: ${remaining}`);
}

run();
