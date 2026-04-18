import { ArrowRight } from "lucide-react";

interface CtaBannerProps {
  onStart: () => void;
}

export function CtaBanner({ onStart }: CtaBannerProps) {
  return (
    <section className="relative bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-900 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-5 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          今すぐ、あなたの動画制作を始めよう。
        </h2>
        <p className="text-white/90 text-base md:text-lg mb-8 max-w-xl mx-auto">
          登録無料・最短1分で案件投稿完了。AIが最適なクリエイターを提案します。
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold text-base md:text-lg h-12 md:h-14 px-8 md:px-10 rounded-lg hover:bg-gray-50 transition-colors shadow-xl"
        >
          無料で始める <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
