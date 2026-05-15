import type { Metadata } from "next";
import { PrivacyClient } from "./client";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "AIムービーマッチのプライバシーポリシー。個人情報の取得・利用目的・第三者提供・保管期間について。",
  alternates: { canonical: "https://www.ai-movie-match.com/legal/privacy" },
};

export default function Page() {
  return <PrivacyClient />;
}
