import Link from "next/link";
import type { Metadata } from "next";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Briefcase,
  Megaphone,
  Building,
  Package,
  Palette,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AIムービーマッチ — AI動画クリエイターと企業をつなぐ",
  description:
    "採用動画・SNS広告・商品PRをAIで高速・低コストに。完全公開ロジックのスコアリングで信頼できるクリエイターとマッチング。発注は ¥30,000〜、最短3日納品。",
  alternates: { canonical: "https://www.ai-movie-match.com/" },
};

const SITE_URL = "https://www.ai-movie-match.com";

const CATEGORIES = [
  { name: "採用動画", icon: Briefcase, desc: "新卒・中途採用向け会社紹介", price: "¥50,000〜" },
  { name: "SNS広告", icon: Megaphone, desc: "Instagram/TikTok 縦型ショート", price: "¥30,000〜" },
  { name: "会社紹介", icon: Building, desc: "コーポレートPR・採用兼用", price: "¥80,000〜" },
  { name: "商品PR", icon: Package, desc: "EC・ブランド・新商品ローンチ", price: "¥50,000〜" },
  { name: "ブランド動画", icon: Palette, desc: "ブランドイメージ・コンセプト", price: "¥100,000〜" },
  { name: "研修・説明", icon: GraduationCap, desc: "社内研修・サービス説明", price: "¥60,000〜" },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "完全公開のスコアリング",
    body: "クリエイター評価は0-1000点で完全自動算出。完了件数・評価・納期遵守率・リピート率で構成されたロジックを全公開。",
  },
  {
    icon: Zap,
    title: "AIヒアリング自動マッチング",
    body: "案件内容を入力すると、ClaudeがあなたのニーズにマッチしたクリエイターをAIで自動推薦。最短3日納品が可能。",
  },
  {
    icon: TrendingUp,
    title: "段階的手数料システム",
    body: "クリエイターのランクに応じた手数料 7%〜20%。リピートクライアントは50%割引。長く付き合うほどお得。",
  },
  {
    icon: Award,
    title: "10種類の自動バッジ",
    body: "Top Rated / Fast Delivery / 各ツールMaster など。条件を満たすと自動付与され、品質を一目で確認可能。",
  },
];

export default function HomePage() {
  // FAQ JSON-LD (Google検索結果のリッチカード対応)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "AIムービーマッチとはどんなサービスですか?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI動画制作スキルを持つクリエイターと、動画制作を発注したい企業・個人をマッチングするオンラインプラットフォームです。採用動画・SNS広告・商品PR・会社紹介など、用途に応じた最適なクリエイターをAIが推薦します。",
        },
      },
      {
        "@type": "Question",
        name: "発注価格の相場はいくらですか?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "案件の種別と長さによりますが、SNS広告動画なら¥30,000〜、採用動画なら¥50,000〜、ブランド動画なら¥100,000〜が目安です。仮払い・検収方式で安心して発注できます。",
        },
      },
      {
        "@type": "Question",
        name: "クリエイターの信頼性はどう判断できますか?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AIムービーマッチでは、0-1000点のスコア・ランク (starter/regular/pro/elite)・自動バッジ (Top Rated / Fast Delivery 等) で信頼性を可視化しています。スコア計算ロジックとバッジ獲得条件はすべて公開されており、運営の恣意性を排除しています。",
        },
      },
      {
        "@type": "Question",
        name: "支払いはどのように行いますか?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stripe決済による仮払い方式です。発注時に金額を仮払いし、納品後72時間以内に検収または修正依頼を行います。検収完了後、手数料を差し引いた金額がクリエイターに送金されます。",
        },
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "AI動画制作マッチングプラットフォーム",
    provider: {
      "@type": "Organization",
      name: "株式会社Ahare",
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Japan" },
    description: "AI動画制作を依頼したい企業と、AI動画制作スキルを持つクリエイターをマッチング",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "JPY",
      lowPrice: "30000",
      highPrice: "500000",
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-gray-900 tracking-tight text-lg">
            <span className="text-brand-500">ai</span>-movie-match<span className="text-brand-500">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
            <Link href="/how-scoring-works" className="hover:text-brand-700">スコアの仕組み</Link>
            <Link href="/badges" className="hover:text-brand-700">バッジ一覧</Link>
            <Link href="/app" className="hover:text-brand-700">サービスを使う</Link>
          </nav>
          <Link
            href="/app"
            className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            無料で始める
          </Link>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-white via-brand-50/30 to-white py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={12} /> AI動画専門マッチングプラットフォーム
          </div>
          <h1 className="font-black text-gray-900 text-4xl md:text-6xl tracking-tight leading-[1.1] mb-6">
            AI動画クリエイターと<br className="hidden md:block" />
            企業を、AIでつなぐ
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            採用動画・SNS広告・商品PRを、最短3日・¥30,000〜で。<br />
            完全公開ロジックのスコアリングで信頼できるクリエイターと出会えます。
          </p>

          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-4">
            <Link
              href="/app"
              className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-md hover:bg-gray-800 transition-colors text-sm md:text-base flex items-center justify-center gap-2"
            >
              <Search size={16} /> どんな動画を作りたい?
            </Link>
            <Link
              href="/creators"
              className="flex-1 border-2 border-gray-900 text-gray-900 font-bold py-4 rounded-md hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              クリエイターを見る
            </Link>
          </div>
          <p className="text-xs text-gray-400">登録無料・初回手数料0円・仮払いで安心</p>
        </div>
      </section>

      {/* カテゴリ */}
      <section className="py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-10">
            <div className="text-xs font-black uppercase tracking-widest text-brand-700 mb-2">
              CATEGORIES
            </div>
            <h2 className="font-black text-3xl md:text-4xl text-gray-900 tracking-tight">
              人気のカテゴリ
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {CATEGORIES.map(({ name, icon: Icon, desc, price }) => (
              <Link
                key={name}
                href={`/creators?category=${encodeURIComponent(name)}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-500 hover:shadow-md transition-all group"
              >
                <Icon size={22} className="text-brand-600 mb-3" />
                <h3 className="font-bold text-gray-900 text-sm mb-1">{name}</h3>
                <p className="text-xs text-gray-500 mb-2 leading-snug">{desc}</p>
                <p className="text-xs text-gray-700 font-bold">{price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <div className="text-xs font-black uppercase tracking-widest text-brand-700 mb-2">
              WHY AIMOVIEMATCH
            </div>
            <h2 className="font-black text-3xl md:text-4xl text-gray-900 tracking-tight mb-3">
              他にはない、4つの独自設計
            </h2>
            <p className="text-gray-600 text-sm">
              審査制ではなく、完全自動・公開ロジックで信頼を可視化。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl p-6">
                <Icon size={28} className="text-brand-600 mb-4" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="font-black text-3xl md:text-4xl tracking-tight mb-4">
            最短3日で、はじめてのAI動画を。
          </h2>
          <p className="text-brand-100 text-sm md:text-base mb-8 leading-relaxed">
            登録は無料・1分で完了。あなたの案件に最適なクリエイターをAIが推薦します。
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-white text-brand-800 font-bold px-8 py-4 rounded-md hover:bg-gray-100 transition-colors"
          >
            無料で始める <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="max-w-[1400px] mx-auto px-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500">
          <div className="font-black text-gray-700 text-base">
            <span className="text-brand-500">ai</span>-movie-match<span className="text-brand-500">.</span>
            <span className="ml-3 font-normal text-gray-400">© 2026 株式会社Ahare</span>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-medium">
            <Link href="/how-scoring-works" className="hover:text-gray-700">スコアの仕組み</Link>
            <Link href="/badges" className="hover:text-gray-700">バッジ一覧</Link>
            <Link href="/legal/terms" className="hover:text-gray-700">利用規約</Link>
            <Link href="/legal/privacy" className="hover:text-gray-700">プライバシーポリシー</Link>
            <Link href="/legal/tokushoho" className="hover:text-gray-700">特商法表記</Link>
            <Link href="/legal/ai-policy" className="hover:text-gray-700">AI生成物ポリシー</Link>
            <Link href="/legal/community" className="hover:text-gray-700">コミュニティ</Link>
            <a href="mailto:support@ai-movie-match.com" className="hover:text-gray-700">お問い合わせ</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
