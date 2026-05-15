import { TrendingUp } from "lucide-react";

/**
 * 売上推移の簡易チャート (SVG, 外部ライブラリ不要)。
 * 将来は recharts などに差し替え可能な契約で Props を受ける。
 */

interface EarningsChartProps {
  // [{ month: '2025/11', amount: 120000 }, ...]
  data?: Array<{ month: string; amount: number }>;
}

const DEFAULT_DATA = [
  { month: "2025/11", amount: 180_000 },
  { month: "2025/12", amount: 240_000 },
  { month: "2026/01", amount: 310_000 },
  { month: "2026/02", amount: 290_000 },
  { month: "2026/03", amount: 420_000 },
  { month: "2026/04", amount: 180_000 },
];

export function EarningsChart({ data = DEFAULT_DATA }: EarningsChartProps) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  const total = data.reduce((s, d) => s + d.amount, 0);
  const avg = Math.round(total / data.length);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <h3 className="font-serif-jp text-base font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp size={15} className="text-gray-700" />
          売上推移
        </h3>
        <div className="text-xs text-gray-500">
          月平均 <span className="font-bold text-gray-900">¥{avg.toLocaleString()}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-end gap-2 h-36">
          {data.map((d) => {
            const h = (d.amount / max) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-brand-500 hover:bg-brand-600 rounded-t transition-colors"
                    style={{ height: `${h}%` }}
                    title={`¥${d.amount.toLocaleString()}`}
                  />
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  {d.month.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
