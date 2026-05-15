import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://www.ai-movie-match.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIムービーマッチ — AI動画クリエイターと企業をつなぐ",
    template: "%s | AIムービーマッチ",
  },
  description:
    "採用動画・SNS広告・商品PRをAIで高速・低コストに。完全公開ロジックのスコアリングで信頼できるクリエイターと出会えます。",
  keywords: [
    "AI動画",
    "AI動画制作",
    "AIクリエイター",
    "Sora",
    "Runway",
    "Kling",
    "HeyGen",
    "採用動画",
    "SNS広告",
    "動画マッチング",
  ],
  authors: [{ name: "株式会社Ahare" }],
  creator: "株式会社Ahare",
  publisher: "株式会社Ahare",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "AIムービーマッチ",
    title: "AIムービーマッチ — AI動画クリエイターと企業をつなぐ",
    description:
      "完全公開のスコアリングロジックで信頼できるAI動画クリエイターと出会えるマッチングプラットフォーム。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIムービーマッチ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIムービーマッチ",
    description: "AI動画クリエイターと企業をつなぐマッチングプラットフォーム",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Organization JSON-LD (全ページ共通)
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "株式会社Ahare",
    alternateName: "AI Movie Match",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    foundingDate: "2026",
    founders: [{ "@type": "Person", name: "中越こうき" }],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@ai-movie-match.com",
      contactType: "customer support",
      availableLanguage: ["ja"],
    },
    sameAs: [],
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="bg-white">{children}</body>
    </html>
  );
}
