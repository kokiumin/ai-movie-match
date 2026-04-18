import { Briefcase, Megaphone, Building, Package, Palette, GraduationCap, TrendingUp, Calendar } from "lucide-react";

interface PopularCategoriesProps {
  onCategoryClick: (category: string) => void;
}

const CATEGORIES = [
  { name: "採用動画", icon: Briefcase, gradient: "from-blue-500 to-blue-700", count: 120 },
  { name: "SNS広告", icon: Megaphone, gradient: "from-pink-500 to-rose-700", count: 230 },
  { name: "会社紹介", icon: Building, gradient: "from-violet-500 to-violet-700", count: 89 },
  { name: "商品PR", icon: Package, gradient: "from-amber-500 to-orange-700", count: 156 },
  { name: "ブランド動画", icon: Palette, gradient: "from-emerald-500 to-emerald-700", count: 67 },
  { name: "研修・教育", icon: GraduationCap, gradient: "from-cyan-500 to-teal-700", count: 42 },
  { name: "IR・株主向け", icon: TrendingUp, gradient: "from-slate-500 to-slate-700", count: 18 },
  { name: "イベント", icon: Calendar, gradient: "from-fuchsia-500 to-purple-700", count: 54 },
];

export function PopularCategories({ onCategoryClick }: PopularCategoriesProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">人気のカテゴリ</h2>
            <p className="text-gray-500 mt-2">業種・目的別に動画クリエイターを探せます</p>
          </div>
          <button className="hidden md:block text-sm font-semibold text-brand-600 hover:text-brand-700">
            すべて見る →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(({ name, icon: Icon, gradient, count }) => (
            <button
              key={name}
              onClick={() => onCategoryClick(name)}
              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-900 transition-all text-left"
            >
              <div className={`h-24 md:h-32 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                <Icon size={36} className="text-white opacity-90 group-hover:scale-110 transition-transform" />
                <div className="absolute top-2 right-2 text-[10px] text-white/80 font-bold uppercase tracking-wider">
                  {count}件
                </div>
              </div>
              <div className="p-4">
                <div className="font-bold text-gray-900 mb-1">{name}</div>
                <div className="text-xs text-gray-500">
                  最低 ¥{count < 100 ? "30,000" : "20,000"}〜
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
