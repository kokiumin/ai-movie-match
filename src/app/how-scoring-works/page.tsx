import type { Metadata } from "next";
import { ScoringPageClient } from "./client";

export const metadata: Metadata = {
  title: "スコアの仕組み — 完全公開のクリエイター評価ロジック",
  description:
    "AIムービーマッチのクリエイタースコア (0-1000点) は、完了件数・平均評価・納期遵守率・リピート率の4要素から完全自動で算出されます。運営の恣意性を排除した透明な評価システム。",
  alternates: { canonical: "https://www.ai-movie-match.com/how-scoring-works" },
};

export default function Page() {
  return <ScoringPageClient />;
}
