import { TrendingUp } from "lucide-react";
import { useCreatorScore } from "@/hooks/useCreatorScore";
import { SCORE_MAX } from "@/lib/score";

interface ScoreChartProps {
  creatorId: string;
}

/**
 * スコア推移を表示する簡易折れ線グラフ (純 SVG, 依存なし)。
 */
export function ScoreChart({ creatorId }: ScoreChartProps) {
  const { history, loading } = useCreatorScore(creatorId);

  if (loading || history.length === 0) return null;

  const W = 560;
  const H = 120;
  const PAD_X = 8;
  const PAD_Y = 12;

  const n = history.length;
  const step = n > 1 ? (W - PAD_X * 2) / (n - 1) : 0;
  const yScale = (score: number) =>
    H - PAD_Y - (score / SCORE_MAX) * (H - PAD_Y * 2);

  const pts = history.map((h, i) => ({
    x: PAD_X + step * i,
    y: yScale(h.score),
    score: h.score,
    date: h.calculated_date,
  }));

  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const area = `${path} L ${pts[pts.length - 1].x.toFixed(1)} ${H - PAD_Y} L ${pts[0].x.toFixed(1)} ${H - PAD_Y} Z`;

  const latest = history[history.length - 1];
  const earliest = history[0];
  const delta = latest.score - earliest.score;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <h3 className="font-serif-jp text-base font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp size={15} className="text-gray-700" />
          スコア推移
        </h3>
        <div className="text-xs text-gray-500 flex items-center gap-3">
          <span>
            現在 <span className="font-bold text-gray-900">{latest.score}</span>
          </span>
          <span className={delta >= 0 ? "text-emerald-700" : "text-red-600"}>
            {delta >= 0 ? "+" : ""}
            {delta} pt
          </span>
        </div>
      </div>
      <div className="p-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
          {/* gridlines */}
          {[0, 250, 500, 750, 1000].map((v) => (
            <line
              key={v}
              x1={PAD_X}
              x2={W - PAD_X}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          {/* area fill */}
          <path d={area} fill="rgba(74, 143, 224, 0.12)" />
          {/* line */}
          <path d={path} fill="none" stroke="#4a8fe0" strokeWidth="2" strokeLinejoin="round" />
          {/* points */}
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#4a8fe0" />
          ))}
        </svg>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{earliest.calculated_date}</span>
          <span>{latest.calculated_date}</span>
        </div>
      </div>
    </div>
  );
}
