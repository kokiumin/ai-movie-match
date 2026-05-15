import type { Metadata } from "next";
import { BadgesPageClient } from "./client";

export const metadata: Metadata = {
  title: "バッジ一覧 — 自動付与される10種類のバッジ",
  description:
    "Verified Creator / Top Rated / Fast Delivery / 各ツールMaster など、すべて自動判定で付与される10種類のバッジ。獲得条件は完全公開。",
  alternates: { canonical: "https://www.ai-movie-match.com/badges" },
};

export default function Page() {
  return <BadgesPageClient />;
}
