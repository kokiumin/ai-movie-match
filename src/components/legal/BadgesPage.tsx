import { ChevronLeft } from "lucide-react";
import { BADGE_DEFINITIONS, type BadgeType } from "@/lib/badges";
import { BadgeChip } from "@/components/creators/BadgeChip";

interface BadgesPageProps {
  onBack?: () => void;
}

const BADGE_ORDER: BadgeType[] = [
  "verified_creator",
  "top_rated",
  "fast_delivery",
  "kling_master",
  "runway_master",
  "heygen_master",
  "seedance_master",
  "founding_creator",
  "rising_star",
  "launch_period_creator",
];

export function BadgesPage({ onBack }: BadgesPageProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-blue-700 hover:underline mb-5 flex items-center gap-1 font-medium"
        >
          <ChevronLeft size={14} /> 戻る
        </button>
      )}

      <h1 className="font-serif-jp text-3xl font-black text-gray-900 mb-2">
        バッジ一覧
      </h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-8">
        バッジはすべて<strong>自動判定で付与されます</strong>。
        運営が審査して選ぶ仕組みではなく、公開ルールに従って毎日バッチで判定され、
        条件を満たさなくなれば自動的に剥奪されます。
      </p>

      <div className="space-y-3">
        {BADGE_ORDER.map((type) => {
          const def = BADGE_DEFINITIONS[type];
          return (
            <div
              key={type}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4"
            >
              <div className="flex-shrink-0 pt-1">
                <BadgeChip type={type} size="md" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 mb-1">{def.label}</h2>
                <p className="text-sm text-gray-600 mb-3">{def.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                      獲得条件
                    </div>
                    <div className="text-gray-700">{def.condition}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                      有効期限
                    </div>
                    <div className="text-gray-700">{def.expiry}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
