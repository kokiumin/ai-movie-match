import type { Metadata } from "next";
import { TermsClient } from "../terms/client";

export const metadata: Metadata = {
  title: "利用規約 (クリエイター向け)",
  description: "AIムービーマッチのクリエイター向け利用規約。手数料体系・報酬の受取・著作権譲渡について。",
  alternates: { canonical: "https://www.ai-movie-match.com/legal/terms-creator" },
};

export default function Page() {
  return <TermsClient tab="creator" />;
}
