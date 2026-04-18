import { SCORE_MAX, getScoreGrade, isNewCreator } from "@/lib/score";

interface ScoreCircleProps {
  score: number;
  completedOrders: number;
  size?: "sm" | "md" | "lg";
  showGrade?: boolean;
}

/**
 * 円形プログレスバーでスコアを表示。
 * 完了件数 < 5 の場合は「新規クリエイター」表示に切り替え (スコア非表示)。
 */
export function ScoreCircle({
  score,
  completedOrders,
  size = "md",
  showGrade = true,
}: ScoreCircleProps) {
  const diameter = size === "sm" ? 64 : size === "md" ? 96 : 128;
  const stroke = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, score / SCORE_MAX));
  const dash = circumference * pct;

  const isNew = isNewCreator(completedOrders);
  const grade = getScoreGrade(score);
  const textSizeMain = size === "sm" ? "text-base" : size === "md" ? "text-2xl" : "text-3xl";
  const textSizeSub = size === "sm" ? "text-[8px]" : "text-[10px]";

  // カラー: スコア帯で変える
  const strokeColor =
    score >= 800 ? "#10b981" : score >= 600 ? "#4a8fe0" : score >= 400 ? "#f59e0b" : "#9ca3af";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: diameter, height: diameter }}>
        <svg width={diameter} height={diameter} className="-rotate-90">
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={stroke}
            fill="none"
          />
          {!isNew && (
            <circle
              cx={diameter / 2}
              cy={diameter / 2}
              r={radius}
              stroke={strokeColor}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-[stroke-dasharray] duration-500"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isNew ? (
            <>
              <span className={`${textSizeSub} text-gray-500 font-bold`}>NEW</span>
              <span className={`${textSizeSub} text-gray-400`}>creator</span>
            </>
          ) : (
            <>
              <span className={`${textSizeMain} font-black text-gray-900 leading-none`}>
                {score}
              </span>
              <span className={`${textSizeSub} text-gray-500 font-semibold`}>
                / {SCORE_MAX}
              </span>
            </>
          )}
        </div>
      </div>
      {showGrade && !isNew && (
        <span className={`text-xs font-bold ${grade.color}`}>{grade.label}</span>
      )}
    </div>
  );
}
