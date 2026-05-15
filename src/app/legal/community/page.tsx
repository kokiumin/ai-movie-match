import type { Metadata } from "next";
import { CommunityClient } from "./client";

export const metadata: Metadata = {
  title: "コミュニティガイドライン",
  description: "AIムービーマッチのコミュニティガイドライン。相手への敬意・透明性・誠実さを基本に、健全な取引コミュニティを目指します。",
  alternates: { canonical: "https://www.ai-movie-match.com/legal/community" },
};

export default function Page() {
  return <CommunityClient />;
}
