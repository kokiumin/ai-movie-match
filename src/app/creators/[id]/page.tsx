import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Award, Shield, ChevronLeft, Clock, MessageCircle } from "lucide-react";
import { MOCK_CREATORS } from "@/lib/mock-creators";
import { VerificationBadges } from "@/components/creators/VerificationBadges";

const SITE_URL = "https://www.ai-movie-match.com";

interface PageProps {
  params: Promise<{ id: string }>;
}

// SSG: 全クリエイターを事前ビルド
export async function generateStaticParams() {
  return MOCK_CREATORS.map((c) => ({ id: c.id }));
}

// ISR: 5分ごとに再生成 (Supabase接続時の更新反映)
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const creator = MOCK_CREATORS.find((c) => c.id === id);
  if (!creator) return { title: "クリエイターが見つかりません" };
  const title = `${creator.display_name} — ${creator.tags?.[0] ?? "AI動画"}クリエイター`;
  const description = `${creator.bio} | 評価 ${creator.rating?.toFixed(1)} (${creator.review_count}件) | ¥${(creator.min_price ?? 0).toLocaleString()}〜`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/creators/${id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/creators/${id}`,
      type: "profile",
    },
  };
}

export default async function CreatorPage({ params }: PageProps) {
  const { id } = await params;
  const creator = MOCK_CREATORS.find((c) => c.id === id);
  if (!creator) notFound();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: creator.display_name,
    description: creator.bio,
    url: `${SITE_URL}/creators/${id}`,
    knowsAbout: [...(creator.tags ?? []), ...(creator.tools ?? [])],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: creator.rating,
      reviewCount: creator.review_count,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "JPY",
      lowPrice: creator.min_price,
      highPrice: creator.max_price,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "クリエイター", item: `${SITE_URL}/creators` },
      { "@type": "ListItem", position: 3, name: creator.display_name },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
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

      <div className="max-w-[1100px] mx-auto px-5 py-8">
        <Link
          href="/creators"
          className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline mb-6"
        >
          <ChevronLeft size={14} /> クリエイター一覧に戻る
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <div
              className={`relative aspect-video ${creator.color ?? "bg-brand-500"} rounded-xl overflow-hidden mb-6`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-transparent to-black/40" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {creator.badge === "TOP" && (
                  <span className="inline-flex items-center gap-1 text-xs font-black bg-amber-500 text-white px-2.5 py-1 rounded">
                    <Award size={12} /> TOP CREATOR
                  </span>
                )}
                {creator.badge === "認定" && (
                  <span className="inline-flex items-center gap-1 text-xs font-black bg-brand-500 text-white px-2.5 py-1 rounded">
                    <Shield size={12} /> PRO CREATOR
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full ${creator.color ?? "bg-brand-500"} text-white font-bold flex items-center justify-center`}
              >
                {creator.display_name?.[0]}
              </div>
              <div>
                <h1 className="font-black text-2xl text-gray-900">{creator.display_name}</h1>
                <p className="text-sm text-gray-500">{creator.handle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-amber-500 text-amber-500" />
                <span className="font-bold text-gray-900">{creator.rating?.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({creator.review_count}件)</span>
              </div>
              <span className="text-sm text-gray-700">
                納品実績 <strong>{creator.delivery_count}件</strong>
              </span>
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <Clock size={13} /> {creator.turnaround}
              </span>
            </div>

            <h2 className="font-bold text-lg text-gray-900 mb-3">プロフィール</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">{creator.bio}</p>

            <h2 className="font-bold text-lg text-gray-900 mb-3">対応カテゴリ</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {creator.tags?.map((t) => (
                <Link
                  key={t}
                  href={`/creators?category=${encodeURIComponent(t)}`}
                  className="text-sm bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full hover:border-brand-500 hover:text-brand-700"
                >
                  {t}
                </Link>
              ))}
            </div>

            <h2 className="font-bold text-lg text-gray-900 mb-3">使用AIツール</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {creator.tools?.map((t) => (
                <span
                  key={t}
                  className="text-sm bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  最低価格
                </span>
                <span className="text-3xl font-black text-gray-900">
                  ¥{(creator.min_price ?? 0).toLocaleString()}〜
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                納期 {creator.turnaround} / 修正 2回まで
              </p>

              <Link
                href="/app"
                className="block w-full text-center bg-gray-900 text-white font-bold py-3 rounded-md hover:bg-gray-800 mb-2"
              >
                {creator.display_name} に依頼する →
              </Link>
              <Link
                href="/app"
                className="block w-full text-center border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:border-gray-900 inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={14} /> メッセージで相談
              </Link>

              <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                <p>✓ 仮払い・検収で安心</p>
                <p>✓ 規定の検収期間内なら全額返金</p>
                <p>✓ 著作権譲渡標準対応</p>
              </div>
            </div>

            {/* 本人確認バッジ (Phase 5) */}
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                本人確認状況
              </h3>
              <VerificationBadges
                emailVerified={true}
                phoneVerified={true}
                identityVerified={creator.badge === "認定" || creator.badge === "TOP"}
                bankAccountVerified={creator.badge === "認定" || creator.badge === "TOP"}
              />
            </div>
          </aside>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white py-10 mt-10">
        <div className="max-w-[1400px] mx-auto px-5 text-xs text-gray-500 text-center">
          © 2026 株式会社Ahare
        </div>
      </footer>
    </main>
  );
}
