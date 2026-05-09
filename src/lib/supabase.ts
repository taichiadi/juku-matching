import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// flowType: "implicit" にすることで iOS Mail → Safari のクロスブラウザ問題を回避。
// PKCE だとコードベリファイアが元ブラウザにのみ保存され、別ブラウザで開くと失敗する。
export const supabase = createBrowserClient(url, key, {
  auth: { flowType: "implicit" },
});
