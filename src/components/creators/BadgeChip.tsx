import {
  ShieldCheck,
  Star,
  Zap,
  Sparkles,
  Crown,
  TrendingUp,
  Rocket,
  Award,
} from "lucide-react";
import { BADGE_DEFINITIONS, type BadgeType } from "@/lib/badges";

const ICON_MAP: Record<string, typeof Award> = {
  ShieldCheck,
  Star,
  Zap,
  Sparkles,
  Crown,
  TrendingUp,
  Rocket,
};

interface BadgeChipProps {
  type: BadgeType;
  awardedAt?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function BadgeChip({ type, awardedAt, size = "sm", showLabel = true }: BadgeChipProps) {
  const def = BADGE_DEFINITIONS[type];
  const Icon = ICON_MAP[def.icon] ?? Award;
  const sizeCls = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  const tooltip = `${def.description}\n条件: ${def.condition}\n有効期限: ${def.expiry}${
    awardedAt ? `\n獲得日: ${new Date(awardedAt).toLocaleDateString("ja-JP")}` : ""
  }`;

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${def.color} ${def.bgColor} ${sizeCls}`}
      title={tooltip}
    >
      <Icon size={size === "sm" ? 11 : 13} />
      {showLabel && def.label}
    </span>
  );
}
