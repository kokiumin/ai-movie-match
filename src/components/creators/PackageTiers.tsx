import { Check, Clock, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { Profile } from "@/types/database";

interface PackageTiersProps {
  creator: Profile;
  onOrder: (tier: "basic" | "standard" | "premium") => void;
  onContact: () => void;
  sent?: boolean;
}

export function PackageTiers({ creator, onOrder, onContact, sent }: PackageTiersProps) {
  const [tier, setTier] = useState<"basic" | "standard" | "premium">("standard");

  const basePrice = creator.min_price ?? 50000;
  const tiers = {
    basic: {
      label: "ベーシック",
      price: basePrice,
      desc: "最小限の構成で、コストを抑えた制作",
      delivery: "7日",
      revisions: "1回",
      features: ["基本的な構成", "HDクオリティ", "30秒〜1分", "納品ファイル1本"],
    },
    standard: {
      label: "スタンダード",
      price: Math.round(basePrice * 1.8),
      desc: "最もバランスの良い人気プラン",
      delivery: "5日",
      revisions: "3回",
      features: [
        "カスタム構成",
        "4Kクオリティ",
        "1〜3分",
        "納品ファイル2本",
        "BGM / ナレーション付き",
      ],
    },
    premium: {
      label: "プレミアム",
      price: Math.round(basePrice * 3),
      desc: "最上級の仕上がりを追求したいあなたへ",
      delivery: "10日",
      revisions: "無制限",
      features: [
        "フル構成",
        "4Kクオリティ",
        "長尺対応（〜5分）",
        "SNS向けアスペクト比変換",
        "BGM / ナレーション / テロップ",
        "素材買い切り",
      ],
    },
  };

  const current = tiers[tier];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-24 shadow-sm">
      {/* Tier tabs */}
      <div className="grid grid-cols-3 border-b border-gray-200">
        {(Object.keys(tiers) as Array<keyof typeof tiers>).map((key) => {
          const active = tier === key;
          return (
            <button
              key={key}
              onClick={() => setTier(key as any)}
              className={`text-xs md:text-sm font-bold py-3 transition-colors ${
                active
                  ? "text-gray-900 border-b-2 border-gray-900 bg-white -mb-px"
                  : "text-gray-500 bg-gray-50 hover:bg-white"
              }`}
            >
              {tiers[key].label}
            </button>
          );
        })}
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between mb-3">
          <div className="font-bold text-gray-900">{current.label}</div>
          <div className="text-2xl font-black text-gray-900">
            ¥{current.price.toLocaleString()}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{current.desc}</p>

        <div className="flex items-center gap-4 text-xs text-gray-700 font-semibold pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Clock size={13} /> {current.delivery}
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw size={13} /> 修正 {current.revisions}
          </div>
        </div>

        <ul className="space-y-2 py-4 text-sm">
          {current.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-gray-700">
              <Check size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-md px-4 py-3 text-sm text-emerald-700 flex items-center gap-2 font-semibold">
            <Check size={15} /> 依頼を送りました
          </div>
        ) : (
          <button
            onClick={() => onOrder(tier)}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-md hover:bg-gray-800 transition-colors text-sm"
          >
            ¥{current.price.toLocaleString()} で依頼する →
          </button>
        )}
        <button
          onClick={onContact}
          className="w-full mt-2 border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:border-gray-900 hover:text-gray-900 transition-colors text-sm"
        >
          メッセージで相談する
        </button>
      </div>
    </div>
  );
}
