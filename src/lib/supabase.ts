// Browser / Client Component 向け Supabase クライアント。
// Server Component は @/lib/supabase/server から取得する。
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn("Supabase credentials not set. Running in demo mode with mock data.");
  }
}

export const supabase = createBrowserClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
);

export const isSupabaseConfigured = () =>
  !!supabaseUrl && supabaseUrl !== "https://YOUR_PROJECT.supabase.co";
