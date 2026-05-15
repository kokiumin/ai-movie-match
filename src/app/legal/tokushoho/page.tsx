import type { Metadata } from "next";
import { TokushohoClient } from "./client";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "AIムービーマッチの特定商取引法に基づく表記。事業者情報・販売価格・返金規定について。",
  alternates: { canonical: "https://www.ai-movie-match.com/legal/tokushoho" },
};

export default function Page() {
  return <TokushohoClient />;
}
