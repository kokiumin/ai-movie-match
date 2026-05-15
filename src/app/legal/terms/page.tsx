import type { Metadata } from "next";
import { TermsClient } from "./client";

export const metadata: Metadata = {
  title: "利用規約",
  description: "AIムービーマッチの利用規約 (発注者向け・クリエイター向け)",
  alternates: { canonical: "https://www.ai-movie-match.com/legal/terms" },
};

export default function Page() {
  return <TermsClient tab="client" />;
}
