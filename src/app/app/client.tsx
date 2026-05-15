"use client";
import { AuthProvider } from "@/contexts/AuthContext";
import App from "@/App";

/**
 * Vite時代の App.tsx をそのまま Client Component として動かす。
 * フェーズ2以降で個別ページに分解する予定だが、今回は SEO 重要なページの
 * SSG 化を優先するため、ダッシュボード系は丸ごとこの catchall に置く。
 */
export function LegacyAppClient() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
