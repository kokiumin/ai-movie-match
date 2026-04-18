import { Search } from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onCategoryClick: (category: string) => void;
}

const POPULAR_TAGS = ["採用動画", "SNS広告", "会社紹介", "商品PR", "ブランド動画"];

export function HeroSection({ onSearch, onCategoryClick }: HeroSectionProps) {
  const [query, setQuery] = useState("");

  return (
    <section className="relative bg-gradient-to-br from-brand-50 via-white to-brand-50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-40 -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-60 translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-[1400px] mx-auto px-5 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
            <span className="text-brand-500">あなたのビジネス</span>に<br />
            見合う素敵な<br />
            動画クリエイター。
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 font-medium">
            AI映像制作に特化した数百名のクリエイターと、最短3日でつながる。
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => { e.preventDefault(); onSearch(query); }}
            className="flex items-stretch bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-w-2xl"
          >
            <div className="flex-1 flex items-center pl-5">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="どんな動画を作りたいですか？"
                className="w-full px-3 py-4 text-base focus:outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 md:px-8 transition-colors flex items-center justify-center"
            >
              <Search size={18} className="md:hidden" />
              <span className="hidden md:inline">検索</span>
            </button>
          </form>

          {/* Popular tags */}
          <div className="flex items-center gap-2 mt-6 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">人気:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => onCategoryClick(tag)}
                className="text-xs font-medium text-gray-700 border border-gray-300 rounded-full px-3 py-1 hover:bg-white hover:border-gray-900 hover:text-gray-900 transition-colors bg-white/60"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-14 flex items-center gap-4 flex-wrap">
            <div className="flex -space-x-2">
              {["blue-500", "emerald-500", "violet-500", "amber-500", "rose-500"].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-${c} border-2 border-white`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">500+</span> のクリエイターが登録済み
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
