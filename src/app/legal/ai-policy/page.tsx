import type { Metadata } from "next";
import { AIPolicyClient } from "./client";

export const metadata: Metadata = {
  title: "AI生成物ポリシー",
  description: "AIムービーマッチにおけるAI生成物の取扱い。ディープフェイク禁止、コンペ未採用著作権の保護等。",
  alternates: { canonical: "https://www.ai-movie-match.com/legal/ai-policy" },
};

export default function Page() {
  return <AIPolicyClient />;
}
