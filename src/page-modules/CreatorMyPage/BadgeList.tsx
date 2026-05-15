import { Award, Lock } from "lucide-react";

/**
 * バッジ実績コレクション (将来機能のプレースホルダ)。
 *
 * 将来実装: profiles.badges や専用テーブルから獲得バッジを取得して表示。
 * 現状は UI骨組みだけ用意し、「開発中」扱いにしておく。
 */

interface BadgeItem {
  id: string;
  label: string;
  description: string;
  earned: boolean;
}

// TODO: 実データ化する際は /hooks/useCreatorBadges.ts を追加
const PLACEHOLDER_BADGES: BadgeItem[] = [
  { id: "first_delivery", label: "初納品", description: "初めての案件を完納", earned: true },
  { id: "ten_deliveries", label: "10件納品", description: "累計10件の案件を完納", earned: false },
  { id: "repeat_client", label: "リピーター獲得", description: "同一クライアントからの2回目の受注", earned: false },
  { id: "five_star", label: "★5レビュー", description: "★5レビューを獲得", earned: true },
  { id: "fast_delivery", label: "スピード納品", description: "納期より3日以上早く納品", earned: false },
];

export function BadgeList() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <h3 className="font-serif-jp text-base font-semibold text-gray-900">バッジ</h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          準備中
        </span>
      </div>
      <div className="p-5 grid grid-cols-3 sm:grid-cols-5 gap-3">
        {PLACEHOLDER_BADGES.map((b) => (
          <div
            key={b.id}
            className={`flex flex-col items-center text-center p-3 rounded-lg border ${
              b.earned
                ? "bg-amber-50 border-amber-200"
                : "bg-gray-50 border-gray-100 opacity-60"
            }`}
            title={b.description}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                b.earned ? "bg-amber-500 text-white" : "bg-gray-300 text-gray-500"
              }`}
            >
              {b.earned ? <Award size={18} /> : <Lock size={14} />}
            </div>
            <p className="text-[11px] font-bold text-gray-800 leading-tight">{b.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
