import type { Metadata } from "next";
import { LegacyAppClient } from "./client";

export const metadata: Metadata = {
  title: "ダッシュボード",
  description: "AIムービーマッチのダッシュボード — クリエイター検索、案件投稿、メッセージ、マイページ",
  robots: { index: false, follow: true }, // ダッシュボードはインデックス不要
};

export default function Page() {
  return <LegacyAppClient />;
}
