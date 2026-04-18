import { useCreatorBadges } from "@/hooks/useCreatorBadges";
import type { BadgeType } from "@/lib/badges";
import { BadgeChip } from "./BadgeChip";

interface BadgeShowcaseProps {
  creatorId: string;
  max?: number;               // 最大表示件数 (GigCard等で省スペース化)
  size?: "sm" | "md";
  compact?: boolean;          // true = アイコンのみ (ラベル非表示)
  className?: string;
}

// 表示順: verified_creator → top_rated → fast_delivery → tool masters → rising_star → founding → launch_period
const DISPLAY_ORDER: BadgeType[] = [
  "verified_creator",
  "top_rated",
  "fast_delivery",
  "kling_master",
  "runway_master",
  "heygen_master",
  "seedance_master",
  "rising_star",
  "founding_creator",
  "launch_period_creator",
];

export function BadgeShowcase({
  creatorId,
  max,
  size = "sm",
  compact = false,
  className = "",
}: BadgeShowcaseProps) {
  const { badges, loading } = useCreatorBadges(creatorId);

  if (loading) return null;
  if (badges.length === 0) return null;

  const sorted = [...badges].sort(
    (a, b) =>
      DISPLAY_ORDER.indexOf(a.badge_type as BadgeType) -
      DISPLAY_ORDER.indexOf(b.badge_type as BadgeType),
  );
  const visible = max ? sorted.slice(0, max) : sorted;
  const hidden = max ? Math.max(0, sorted.length - max) : 0;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {visible.map((b) => (
        <BadgeChip
          key={b.badge_type}
          type={b.badge_type as BadgeType}
          awardedAt={b.awarded_at}
          size={size}
          showLabel={!compact}
        />
      ))}
      {hidden > 0 && (
        <span className="text-xs text-gray-500 font-semibold">+{hidden}</span>
      )}
    </div>
  );
}
