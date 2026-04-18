import { Briefcase, Megaphone, Building, Package, Palette, GraduationCap, Calendar, TrendingUp } from "lucide-react";

interface CategoryNavProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CATEGORIES = [
  { name: "すべて", icon: null },
  { name: "採用動画", icon: Briefcase },
  { name: "会社紹介", icon: Building },
  { name: "SNS広告", icon: Megaphone },
  { name: "商品PR", icon: Package },
  { name: "ブランド動画", icon: Palette },
  { name: "研修・説明", icon: GraduationCap },
  { name: "イベント", icon: Calendar },
  { name: "IR・株主向け", icon: TrendingUp },
];

export function CategoryNav({ selected, onSelect }: CategoryNavProps) {
  return (
    <div className="overflow-x-auto -mx-5 px-5 scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max py-2">
        {CATEGORIES.map(({ name, icon: Icon }) => {
          const active = selected === name;
          return (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900"
              }`}
            >
              {Icon && <Icon size={14} />}
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
