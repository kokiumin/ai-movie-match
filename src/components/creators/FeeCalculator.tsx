import { Calculator, Repeat } from "lucide-react";
import type { CreatorRank } from "@/types/database";
import { calculateFee, formatRate, getRankMeta } from "@/lib/rank";

interface FeeCalculatorProps {
  amount: number;
  rank: CreatorRank;
  isRepeat?: boolean;
  compact?: boolean;
}

export function FeeCalculator({
  amount,
  rank,
  isRepeat = false,
  compact = false,
}: FeeCalculatorProps) {
  const breakdown = calculateFee(amount, rank, isRepeat);
  const meta = getRankMeta(rank);

  if (compact) {
    return (
      <div className="text-xs text-gray-600">
        手数料 <span className="font-bold text-gray-900">{formatRate(breakdown.rate)}</span>
        {isRepeat && <span className="text-emerald-700 ml-1">(リピート割)</span>}
        {" / "}受取額{" "}
        <span className="font-bold text-gray-900">
          ¥{breakdown.creatorPayout.toLocaleString()}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Calculator size={16} className="text-gray-700" />
        <span className="text-sm font-bold text-gray-900">手数料計算</span>
        {isRepeat && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Repeat size={11} /> リピート -50%
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <Row label="案件金額" value={`¥${amount.toLocaleString()}`} />
        <Row
          label={`ランク ${meta.label} 手数料率`}
          value={
            isRepeat ? (
              <>
                <span className="text-gray-400 line-through mr-1">
                  {formatRate(breakdown.baseRate)}
                </span>
                <span className="text-emerald-700 font-bold">
                  {formatRate(breakdown.rate)}
                </span>
              </>
            ) : (
              formatRate(breakdown.rate)
            )
          }
        />
        <Row
          label="プラットフォーム手数料"
          value={`- ¥${breakdown.feeAmount.toLocaleString()}`}
          muted
        />
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">クリエイター受取額</span>
            <span className="text-xl font-black text-gray-900">
              ¥{breakdown.creatorPayout.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={muted ? "text-gray-500" : "text-gray-900 font-semibold"}>
        {value}
      </span>
    </div>
  );
}
