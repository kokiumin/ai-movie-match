import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
  footerNote?: string;
}

/**
 * 規約・ポリシー系ページの共通レイアウト。
 * ヘッダー(戻る + タイトル) + main + フッター注記。
 */
export function LegalLayout({ title, subtitle, onBack, children, footerNote }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-blue-700 hover:underline flex items-center gap-1 text-sm font-medium"
          >
            <ChevronLeft size={16} /> 戻る
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="font-serif-jp text-base font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-10 pb-20">
        <h1 className="font-serif-jp text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-gray-500 mb-8">{subtitle}</p>}
        <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
        {footerNote && (
          <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-500">
            {footerNote}
          </div>
        )}
      </main>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-serif-jp text-base font-bold text-gray-900 mb-3 tracking-tight border-l-4 border-blue-700 pl-3">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return <ol className="list-decimal pl-6 space-y-1">{children}</ol>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 space-y-1">{children}</ul>;
}

export const COMPANY_FOOTER = `株式会社Ahare（代表取締役: 中越こうき）
〒三重県 / お問い合わせ: support@ai-movie-match.com
※ 本書面は AI による初稿のため、最終的な法的効力は弁護士レビューを経て確定します。`;
