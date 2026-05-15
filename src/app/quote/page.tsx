import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building, Megaphone, Package, Wrench, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_CREATORS } from "@/lib/mock-creators";

const SITE_URL = "https://www.ai-movie-match.com";

const USE_CASES = [
  { id: "product_promo", label: "商品プロモーション", icon: Package },
  { id: "company_intro", label: "会社紹介", icon: Building },
  { id: "sns_ad", label: "SNS広告 (縦型)", icon: Megaphone },
  { id: "recruit", label: "採用動画", icon: Briefcase },
  { id: "service_explain", label: "サービス説明", icon: Wrench },
  { id: "other", label: "その他", icon: Sparkles },
];
const DURATIONS = [
  { id: "under_30s", label: "15〜30秒" },
  { id: "30s_1m", label: "30秒〜1分" },
  { id: "1m_2m", label: "1〜2分" },
  { id: "2m_3m", label: "2〜3分" },
  { id: "over_3m", label: "3分以上" },
];
const DEADLINES = [
  { id: "within_1week", label: "1週間以内" },
  { id: "within_2weeks", label: "2週間以内" },
  { id: "within_1month", label: "1ヶ月以内" },
  { id: "no_rush", label: "急がない" },
];

// 価格マトリクス (lib/price-estimation と同期予定。今はインライン)
const PRICE_MATRIX: Record<string, { min: number; max: number; standard: number; days: number }> = {
  "product_promo|30s_1m|within_2weeks": { min: 50000, max: 150000, standard: 80000, days: 10 },
  "company_intro|30s_1m|within_2weeks": { min: 80000, max: 180000, standard: 120000, days: 12 },
  "sns_ad|under_30s|within_1week": { min: 20000, max: 60000, standard: 30000, days: 5 },
  "sns_ad|30s_1m|within_2weeks": { min: 30000, max: 100000, standard: 50000, days: 10 },
  "recruit|1m_2m|within_2weeks": { min: 80000, max: 200000, standard: 120000, days: 14 },
};

function getPriceFor(use: string, duration: string, deadline: string) {
  const key = `${use}|${duration}|${deadline}`;
  if (PRICE_MATRIX[key]) return PRICE_MATRIX[key];
  // フォールバック: 中央値の概算
  return { min: 50000, max: 150000, standard: 80000, days: 14 };
}

const USE_CASE_TO_TAG: Record<string, string> = {
  product_promo: "商品PR",
  company_intro: "会社紹介",
  sns_ad: "SNS広告",
  recruit: "採用動画",
  service_explain: "研修・説明",
  other: "ブランド動画",
};

interface QuotePageProps {
  searchParams: Promise<{ use?: string; duration?: string; deadline?: string }>;
}

export async function generateMetadata({ searchParams }: QuotePageProps): Promise<Metadata> {
  const { use, duration } = await searchParams;
  const useLabel = USE_CASES.find((u) => u.id === use)?.label;
  const title = useLabel ? `${useLabel}の制作費相場 — AIムービーマッチ` : "AI動画の相場を3問で見積もる";
  return {
    title,
    description: "用途・長さ・納期を選ぶだけで、AI動画制作の相場とおすすめクリエイターが分かります。最短3日納品、¥20,000〜。",
    alternates: {
      canonical: use && duration ? `${SITE_URL}/quote?use=${use}&duration=${duration}` : `${SITE_URL}/quote`,
    },
  };
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const { use, duration, deadline } = await searchParams;
  const isComplete = use && duration && deadline;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-brand-50/30 to-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-gray-900 tracking-tight text-lg">
            <span className="text-brand-500">ai</span>-movie-match
            <span className="text-brand-500">.</span>
          </Link>
          <Link href="/app" className="text-sm font-bold text-brand-700 hover:underline">
            無料で始める
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={12} /> INSTANT QUOTE
          </div>
          <h1 className="font-black text-3xl md:text-4xl text-gray-900 tracking-tight mb-3">
            3問で相場がわかる
          </h1>
          <p className="text-sm text-gray-600">
            用途・長さ・納期を選ぶだけで、価格目安とおすすめクリエイターを表示します。
          </p>
        </div>

        {!use && <Step1 />}
        {use && !duration && <Step2 use={use} />}
        {use && duration && !deadline && <Step3 use={use} duration={duration} />}
        {isComplete && <Result use={use!} duration={duration!} deadline={deadline!} />}
      </div>
    </main>
  );
}

function StepHeader({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          className={`h-1.5 w-12 rounded-full ${s <= step ? "bg-gray-900" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function Step1() {
  return (
    <div>
      <StepHeader step={1} />
      <h2 className="font-bold text-xl text-center text-gray-900 mb-6">
        どんな動画ですか?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {USE_CASES.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/quote?use=${id}`}
            className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-brand-500 hover:shadow-md transition-all text-center"
          >
            <Icon size={26} className="mx-auto text-brand-600 mb-3" />
            <p className="font-bold text-sm text-gray-900">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Step2({ use }: { use: string }) {
  return (
    <div>
      <StepHeader step={2} />
      <h2 className="font-bold text-xl text-center text-gray-900 mb-6">動画の長さは?</h2>
      <div className="space-y-2 max-w-md mx-auto">
        {DURATIONS.map((d) => (
          <Link
            key={d.id}
            href={`/quote?use=${use}&duration=${d.id}`}
            className="block bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-brand-500 transition-all text-center font-bold text-gray-900"
          >
            {d.label}
          </Link>
        ))}
      </div>
      <p className="text-center mt-6">
        <Link href="/quote" className="text-xs text-gray-500 hover:underline">← 戻る</Link>
      </p>
    </div>
  );
}

function Step3({ use, duration }: { use: string; duration: string }) {
  return (
    <div>
      <StepHeader step={3} />
      <h2 className="font-bold text-xl text-center text-gray-900 mb-6">希望の納期は?</h2>
      <div className="space-y-2 max-w-md mx-auto">
        {DEADLINES.map((d) => (
          <Link
            key={d.id}
            href={`/quote?use=${use}&duration=${duration}&deadline=${d.id}`}
            className="block bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-brand-500 transition-all text-center font-bold text-gray-900"
          >
            {d.label}
          </Link>
        ))}
      </div>
      <p className="text-center mt-6">
        <Link href={`/quote?use=${use}`} className="text-xs text-gray-500 hover:underline">← 戻る</Link>
      </p>
    </div>
  );
}

function Result({ use, duration, deadline }: { use: string; duration: string; deadline: string }) {
  const price = getPriceFor(use, duration, deadline);
  const useLabel = USE_CASES.find((u) => u.id === use)?.label ?? use;
  const durationLabel = DURATIONS.find((d) => d.id === duration)?.label ?? duration;
  const deadlineLabel = DEADLINES.find((d) => d.id === deadline)?.label ?? deadline;
  const targetTag = USE_CASE_TO_TAG[use];
  const recommended = MOCK_CREATORS
    .filter((c) => c.tags?.some((t) => t === targetTag))
    .slice(0, 5);

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-700 mb-2">
          あなたの案件の相場
        </p>
        <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
          ¥{price.min.toLocaleString()}<span className="text-gray-400 mx-2">〜</span>¥{price.max.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          標準 ¥{price.standard.toLocaleString()} / 納期 約{price.days}日
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
          <span className="bg-gray-100 px-3 py-1 rounded-full">{useLabel}</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">{durationLabel}</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">{deadlineLabel}</span>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg text-gray-900 mb-4">
            おすすめクリエイター ({recommended.length}名)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {recommended.map((c) => (
              <Link
                key={c.id}
                href={`/creators/${c.id}`}
                className="bg-white border border-gray-200 rounded-xl p-3 hover:border-brand-500 transition-colors text-center"
              >
                <div
                  className={`w-12 h-12 rounded-full ${c.color ?? "bg-brand-500"} mx-auto mb-2 flex items-center justify-center text-white font-bold`}
                >
                  {c.display_name?.[0]}
                </div>
                <p className="font-bold text-xs text-gray-900 truncate">{c.display_name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">★ {c.rating?.toFixed(1)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Link
          href="/app"
          className="flex-1 bg-gray-900 text-white font-bold text-center py-4 rounded-md hover:bg-gray-800 inline-flex items-center justify-center gap-2"
        >
          この内容で案件を投稿する <ArrowRight size={14} />
        </Link>
        <Link
          href={`/creators?category=${encodeURIComponent(targetTag ?? "")}`}
          className="flex-1 border-2 border-gray-900 text-gray-900 font-bold text-center py-4 rounded-md hover:bg-gray-50"
        >
          このカテゴリのクリエイターを見る
        </Link>
      </div>

      <p className="text-center text-xs text-gray-500">
        このページのURLを保存しておけば、いつでも同じ見積もりが確認できます。
      </p>
      <p className="text-center mt-4">
        <Link href="/quote" className="text-xs text-brand-700 hover:underline">もう一度試す</Link>
      </p>
    </div>
  );
}
