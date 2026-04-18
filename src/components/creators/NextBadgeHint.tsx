import { Target } from "lucide-react";
import { useCreatorBadges } from "@/hooks/useCreatorBadges";
import { getNextBadgeHint } from "@/lib/badges";

interface NextBadgeHintProps {
  creatorId: string;
  stats: {
    completed_orders: number;
    avg_rating: number;
    on_time_delivery_rate: number;
  };
}

export function NextBadgeHint({ creatorId, stats }: NextBadgeHintProps) {
  const { earnedSet, loading } = useCreatorBadges(creatorId);

  if (loading) return null;
  const hint = getNextBadgeHint(earnedSet, stats);
  if (!hint) return null;

  const pct = Math.min(100, (hint.current / hint.target) * 100);

  return (
    <div className={`rounded-xl border p-4 ${hint.badge.bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        <Target size={14} className={hint.badge.color} />
        <span className="text-sm font-bold text-gray-900">次のバッジまで</span>
      </div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className={`font-bold ${hint.badge.color}`}>{hint.badge.label}</span>
        <span className="text-gray-700 font-semibold">
          {hint.current} / {hint.target}
          {hint.unit === "count" ? " 件" : ""}
        </span>
      </div>
      <div className="h-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900/80 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-2">{hint.message}</p>
    </div>
  );
}
