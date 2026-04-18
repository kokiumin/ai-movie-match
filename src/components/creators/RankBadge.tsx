import { Award } from "lucide-react";
import type { CreatorRank } from "@/types/database";
import { getRankMeta } from "@/lib/rank";

interface RankBadgeProps {
  rank: CreatorRank;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function RankBadge({ rank, size = "sm", showIcon = true }: RankBadgeProps) {
  const meta = getRankMeta(rank);
  const sizeCls = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${meta.color} ${meta.bgColor} ${sizeCls}`}
    >
      {showIcon && <Award size={size === "sm" ? 12 : 14} />}
      {meta.label}
    </span>
  );
}
