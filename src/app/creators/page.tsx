import type { Metadata } from "next";
import Link from "next/link";
import { Star, Award, Shield, ArrowRight } from "lucide-react";
import { MOCK_CREATORS } from "@/lib/mock-creators";

const SITE_URL = "https://www.ai-movie-match.com";

export const metadata: Metadata = {
  title: "AI動画クリエイター一覧 — スコア・ランクで信頼できるプロを探す",
  description:
    "採用動画・SNS広告・商品PR・会社紹介・ブランド動画に対応するAI動画クリエイター一覧。Sora、Kling、Runway、HeyGen等のツールに精通したプロフェッショナルから選べます。完全公開のスコアリングロジックで信頼性を可視化。",
  alternates: { canonical: `${SITE_URL}/creators` },
};

// ISR: 1時間ごとに再生成 (将来 Supabase 接続時に効果)
export const revalidate = 3600;

interface CreatorsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CreatorsPage({ searchParams }: CreatorsPageProps) {
  const { category } = await searchParams;
  const filtered = category
    ? MOCK_CREATORS.filter((c) =>
        c.tags?.some((t) => t === category) ||
        c.specialty?.some((s) => s === category),
      )
    : MOCK_CREATORS;

  // ItemList JSON-LD (検索エンジン理解促進)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category ? `${category} クリエイター一覧` : "AI動画クリエイター一覧",
    itemListElement: filtered.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: c.display_name,
        url: `${SITE_URL}/creators/${c.id}`,
        description: c.bio ?? "",
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-gray-900 tracking-tight text-lg">
            <span className="text-brand-500">ai</span>-movie-match
            <span className="text-brand-500">.</span>
          </Link>
          <Link
            href="/app"
            className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-gray-800"
          >
            無料で始める
          </Link>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-5 py-10">
        <nav aria-label="breadcrumb" className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-brand-700">ホーム</Link>
          <span className="mx-2">/</span>
          <span>クリエイター</span>
          {category && (
            <>
              <span className="mx-2">/</span>
              <span>{category}</span>
            </>
          )}
        </nav>

        <h1 className="font-black text-3xl md:text-4xl text-gray-900 tracking-tight mb-2">
          {category ? `${category} クリエイター` : "AI動画クリエイター"}
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          {filtered.length}名のプロフェッショナルが登録中・最短3日納品
        </p>

        {/* カテゴリフィルタ */}
        <div className="flex flex-wrap gap-2 mb-8">
          <FilterChip href="/creators" label="すべて" active={!category} />
          {["採用動画", "SNS広告", "会社紹介", "商品PR", "ブランド動画", "研修・説明"].map((c) => (
            <FilterChip
              key={c}
              href={`/creators?category=${encodeURIComponent(c)}`}
              label={c}
              active={category === c}
            />
          ))}
        </div>

        {/* クリエイターグリッド */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>このカテゴリのクリエイターは現在登録されていません。</p>
            <Link href="/creators" className="text-brand-700 hover:underline mt-3 inline-block">
              すべてのクリエイターを見る →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((c) => (
              <Link
                key={c.id}
                href={`/creators/${c.id}`}
                className="group"
              >
                {/* サムネ */}
                <div
                  className={`relative aspect-[4/3] ${c.color ?? "bg-brand-500"} rounded-xl overflow-hidden mb-3`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-transparent to-black/40" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {c.badge === "TOP" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded">
                        <Award size={10} /> TOP
                      </span>
                    )}
                    {c.badge === "認定" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-brand-500 text-white px-2 py-0.5 rounded">
                        <Shield size={10} /> PRO
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 text-white text-xs font-bold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
                    {c.tags?.[0]}
                  </div>
                </div>

                {/* セラー情報 */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full ${c.color ?? "bg-brand-500"} text-white text-[10px] font-bold flex items-center justify-center`}
                  >
                    {c.display_name?.[0]}
                  </div>
                  <span className="font-bold text-sm text-gray-900 truncate">
                    {c.display_name}
                  </span>
                </div>

                <p className="text-sm text-gray-900 font-medium leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
                  {c.bio?.split("。")[0]}
                </p>

                <div className="flex items-center gap-1 mb-3">
                  <Star size={13} className="fill-gray-900 text-gray-900" />
                  <span className="font-bold text-sm text-gray-900">
                    {c.rating?.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">({c.review_count})</span>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-end justify-between">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    最低
                  </div>
                  <div className="text-base font-black text-gray-900">
                    ¥{Math.round((c.min_price ?? 0) / 10000)}万〜
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 p-8 bg-brand-50 border border-brand-100 rounded-xl">
          <h2 className="font-bold text-xl text-gray-900 mb-2">
            ぴったりのクリエイターが見つかりませんか?
          </h2>
          <p className="text-sm text-gray-600 mb-5">
            AIヒアリングが案件内容から最適な5名を自動推薦します
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-md hover:bg-gray-800"
          >
            AIマッチングを試す <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* フッター */}
      <footer className="border-t border-gray-200 bg-white py-10 mt-10">
        <div className="max-w-[1400px] mx-auto px-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500">
          <div className="font-black text-gray-700">© 2026 株式会社Ahare</div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-medium">
            <Link href="/how-scoring-works" className="hover:text-gray-700">スコアの仕組み</Link>
            <Link href="/badges" className="hover:text-gray-700">バッジ一覧</Link>
            <Link href="/legal/terms" className="hover:text-gray-700">利用規約</Link>
            <Link href="/legal/privacy" className="hover:text-gray-700">プライバシー</Link>
            <Link href="/legal/tokushoho" className="hover:text-gray-700">特商法表記</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900"
      }`}
    >
      {label}
    </Link>
  );
}
