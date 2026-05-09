import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xmbzpllpjjhaesinlknq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtYnpwbGxwampoYWVzaW5sa25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzQ2MDEsImV4cCI6MjA5MzE1MDYwMX0.WgM4Q0zqTqAmFG4uuXjz74IM5TlmNpBZ_-nZta34frc"
);

// author_email → { ronin_passed（受かった大学）, concurrent_strategy（落ちた大学）}
const UPDATES = [
  { email: "sample01@senpailink.jp", ronin_passed: "早稲田大学", concurrent_strategy: "慶應義塾大学" },
  { email: "sample02@senpailink.jp", ronin_passed: "慶應義塾大学、早稲田大学", concurrent_strategy: "上智大学" },
  { email: "sample03@senpailink.jp", ronin_passed: "明治大学、法政大学", concurrent_strategy: "早稲田大学、慶應義塾大学、上智大学" },
  { email: "sample04@senpailink.jp", ronin_passed: "上智大学、明治大学", concurrent_strategy: "早稲田大学、慶應義塾大学" },
  { email: "sample05@senpailink.jp", ronin_passed: "立教大学、明治大学、法政大学", concurrent_strategy: "早稲田大学、慶應義塾大学、上智大学" },
  { email: "sample06@senpailink.jp", ronin_passed: "青山学院大学、立教大学", concurrent_strategy: "早稲田大学、慶應義塾大学" },
  { email: "sample07@senpailink.jp", ronin_passed: "中央大学、法政大学", concurrent_strategy: "早稲田大学、明治大学、立教大学" },
  { email: "sample08@senpailink.jp", ronin_passed: "法政大学", concurrent_strategy: "明治大学、青山学院大学、立教大学" },
  { email: "sample09@senpailink.jp", ronin_passed: "同志社大学、立命館大学", concurrent_strategy: "早稲田大学、慶應義塾大学" },
  { email: "sample10@senpailink.jp", ronin_passed: "立命館大学、関西学院大学", concurrent_strategy: "同志社大学、早稲田大学" },
  { email: "sample11@senpailink.jp", ronin_passed: "早稲田大学", concurrent_strategy: "慶應義塾大学" },
  { email: "sample12@senpailink.jp", ronin_passed: "慶應義塾大学、早稲田大学", concurrent_strategy: "上智大学" },
  { email: "sample13@senpailink.jp", ronin_passed: "関西学院大学、立命館大学", concurrent_strategy: "同志社大学、早稲田大学" },
  { email: "sample14@senpailink.jp", ronin_passed: "関西大学", concurrent_strategy: "同志社大学、立命館大学、関西学院大学" },
  { email: "sample15@senpailink.jp", ronin_passed: "明治大学、法政大学", concurrent_strategy: "早稲田大学、慶應義塾大学、上智大学、立教大学" },
  { email: "sample16@senpailink.jp", ronin_passed: "慶應義塾大学", concurrent_strategy: "早稲田大学" },
  { email: "sample17@senpailink.jp", ronin_passed: "明治大学、法政大学", concurrent_strategy: "早稲田大学、慶應義塾大学、立教大学" },
  { email: "sample18@senpailink.jp", ronin_passed: "立教大学、法政大学", concurrent_strategy: "早稲田大学、明治大学、青山学院大学" },
  { email: "sample19@senpailink.jp", ronin_passed: "早稲田大学", concurrent_strategy: "慶應義塾大学" },
  { email: "sample20@senpailink.jp", ronin_passed: "青山学院大学、明治大学", concurrent_strategy: "早稲田大学、慶應義塾大学、上智大学" },
  { email: "sample21@senpailink.jp", ronin_passed: "同志社大学", concurrent_strategy: "早稲田大学、慶應義塾大学" },
  { email: "sample22@senpailink.jp", ronin_passed: "明治大学、法政大学", concurrent_strategy: "早稲田大学、立教大学、青山学院大学" },
  { email: "sample23@senpailink.jp", ronin_passed: "法政大学、中央大学", concurrent_strategy: "明治大学、立教大学、青山学院大学" },
  { email: "sample24@senpailink.jp", ronin_passed: "関西学院大学、関西大学", concurrent_strategy: "同志社大学、立命館大学" },
  { email: "sample25@senpailink.jp", ronin_passed: "立命館大学、関西大学", concurrent_strategy: "同志社大学、関西学院大学" },
  { email: "sample26@senpailink.jp", ronin_passed: "上智大学", concurrent_strategy: "慶應義塾大学、早稲田大学" },
  { email: "sample27@senpailink.jp", ronin_passed: "中央大学、法政大学", concurrent_strategy: "早稲田大学、明治大学、立教大学" },
  { email: "sample28@senpailink.jp", ronin_passed: "早稲田大学", concurrent_strategy: "慶應義塾大学、上智大学" },
  { email: "sample29@senpailink.jp", ronin_passed: "関西大学、立命館大学", concurrent_strategy: "同志社大学、関西学院大学" },
  { email: "sample30@senpailink.jp", ronin_passed: "慶應義塾大学", concurrent_strategy: "早稲田大学" },
];

async function update() {
  let success = 0;
  for (const u of UPDATES) {
    const { error } = await supabase
      .from("experiences")
      .update({ ronin_passed: u.ronin_passed, concurrent_strategy: u.concurrent_strategy })
      .eq("author_email", u.email);
    if (error) {
      console.error(`✗ ${u.email}:`, error.message);
    } else {
      success++;
    }
  }
  console.log(`✓ ${success}/${UPDATES.length} 件更新完了`);
}

update();
