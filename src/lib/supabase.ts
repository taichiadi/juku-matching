import { createBrowserClient } from "@supabase/ssr";

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>;
let _client: SupabaseBrowserClient | null = null;

// flowType: "implicit" にすることで iOS Mail → Safari のクロスブラウザ問題を回避。
// PKCE だとコードベリファイアが元ブラウザにのみ保存され、別ブラウザで開くと失敗する。
function getSupabaseClient(): SupabaseBrowserClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _client = createBrowserClient(url, key, { auth: { flowType: "implicit" } });
  }
  return _client;
}

export const supabase = new Proxy({} as SupabaseBrowserClient, {
  get(_target, prop) {
    return (getSupabaseClient() as never)[prop];
  },
});
