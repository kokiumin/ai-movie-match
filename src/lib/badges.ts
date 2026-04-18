// ============================================================
// バッジ定義 + 自動付与ロジック
// ============================================================
// Edge Function (score-update) が毎日このロジックで付与/剥奪判定する。
// UI と Edge Function が同じ定義を参照するため、条件を1箇所で管理。

import { LAUNCH_DATE, LAUNCH_PERIOD_END } from "./score";

export type BadgeType =
  | "verified_creator"
  | "top_rated"
  | "fast_delivery"
  | "kling_master"
  | "runway_master"
  | "heygen_master"
  | "seedance_master"
  | "founding_creator"
  | "rising_star"
  | "launch_period_creator";

export interface BadgeDefinition {
  type: BadgeType;
  label: string;
  description: string;
  condition: string;    // 取得条件の人間可読説明
  expiry: string;       // 有効期限の人間可読説明
  color: string;        // Tailwind text color
  bgColor: string;      // Tailwind bg + border
  icon: string;         // lucide icon name
}

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
  verified_creator: {
    type: "verified_creator",
    label: "Verified Creator",
    description: "スコア上位20%に入るクリエイター",
    condition: "スコア上位20%",
    expiry: "毎月再判定",
    color: "text-brand-700",
    bgColor: "bg-brand-50 border-brand-200",
    icon: "ShieldCheck",
  },
  top_rated: {
    type: "top_rated",
    label: "Top Rated",
    description: "高評価を維持しているクリエイター",
    condition: "平均評価 4.8 以上 & 完了 20 件以上",
    expiry: "条件を満たす間、無期限",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    icon: "Star",
  },
  fast_delivery: {
    type: "fast_delivery",
    label: "Fast Delivery",
    description: "納期を高確率で守るクリエイター",
    condition: "納期遵守率 95% 以上 & 完了 10 件以上",
    expiry: "条件を満たす間、無期限",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
    icon: "Zap",
  },
  kling_master: {
    type: "kling_master",
    label: "Kling Master",
    description: "Kling を主力ツールとして活用",
    condition: "Kling 使用案件が全体の 70% 以上 & Kling 案件 10 件以上",
    expiry: "条件を満たす間、無期限",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
    icon: "Sparkles",
  },
  runway_master: {
    type: "runway_master",
    label: "Runway Master",
    description: "Runway を主力ツールとして活用",
    condition: "Runway 使用案件が全体の 70% 以上 & Runway 案件 10 件以上",
    expiry: "条件を満たす間、無期限",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
    icon: "Sparkles",
  },
  heygen_master: {
    type: "heygen_master",
    label: "HeyGen Master",
    description: "HeyGen を主力ツールとして活用",
    condition: "HeyGen 使用案件が全体の 70% 以上 & HeyGen 案件 10 件以上",
    expiry: "条件を満たす間、無期限",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
    icon: "Sparkles",
  },
  seedance_master: {
    type: "seedance_master",
    label: "Seedance Master",
    description: "Seedance を主力ツールとして活用",
    condition: "Seedance 使用案件が全体の 70% 以上 & Seedance 案件 10 件以上",
    expiry: "条件を満たす間、無期限",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
    icon: "Sparkles",
  },
  founding_creator: {
    type: "founding_creator",
    label: "Founding Creator",
    description: "ローンチ前から支えてくれた創業メンバー",
    condition: `${LAUNCH_DATE.toISOString().slice(0, 10)} までに登録`,
    expiry: "永久",
    color: "text-rose-700",
    bgColor: "bg-rose-50 border-rose-200",
    icon: "Crown",
  },
  rising_star: {
    type: "rising_star",
    label: "Rising Star",
    description: "登録直後から成果を出した新人",
    condition: "登録 3ヶ月以内 & 完了 5 件以上 & 平均評価 4.5 以上",
    expiry: "登録から 3ヶ月間",
    color: "text-pink-700",
    bgColor: "bg-pink-50 border-pink-200",
    icon: "TrendingUp",
  },
  launch_period_creator: {
    type: "launch_period_creator",
    label: "Launch Period Creator",
    description: "ローンチ期間中に参加したクリエイター",
    condition: "ローンチ開始から 3ヶ月以内に登録",
    expiry: `${LAUNCH_PERIOD_END.toISOString().slice(0, 10)} まで`,
    color: "text-cyan-700",
    bgColor: "bg-cyan-50 border-cyan-200",
    icon: "Rocket",
  },
};

// ===================
// 評価コンテキスト
// ===================
export interface BadgeEvalContext {
  creatorId: string;
  createdAt: Date;
  score: number;
  avgRating: number;
  completedOrders: number;
  onTimeDeliveryRate: number;
  toolUsageCounts: Record<string, number>; // { Kling: 12, Runway: 3, ... }
  totalCompletedWithTool: number;          // tools_used を持つ completed 案件の総数
  verifiedThreshold: number;               // 上位20%のスコア閾値
  now: Date;
}

export interface BadgeEvalResult {
  type: BadgeType;
  earned: boolean;
  expiresAt: Date | null;
}

const TOOL_MASTER_MIN_COUNT = 10;
const TOOL_MASTER_MIN_RATIO = 0.7;

function toolMaster(type: BadgeType, toolName: string) {
  return (ctx: BadgeEvalContext): BadgeEvalResult => {
    const count = ctx.toolUsageCounts[toolName] ?? 0;
    const ratio = ctx.totalCompletedWithTool > 0
      ? count / ctx.totalCompletedWithTool
      : 0;
    return {
      type,
      earned: count >= TOOL_MASTER_MIN_COUNT && ratio >= TOOL_MASTER_MIN_RATIO,
      expiresAt: null,
    };
  };
}

/**
 * すべてのバッジを評価して earned/expiresAt を返す。
 */
export function evaluateBadges(ctx: BadgeEvalContext): BadgeEvalResult[] {
  const threeMonthsFromCreated = new Date(
    ctx.createdAt.getTime() + 90 * 24 * 3600 * 1000,
  );

  return [
    // Verified Creator: スコア上位20% → 毎月再判定 → expires = 今月末
    {
      type: "verified_creator",
      earned: ctx.score >= ctx.verifiedThreshold && ctx.score > 0,
      expiresAt: endOfCurrentMonth(ctx.now),
    },
    // Top Rated: 平均評価4.8以上 & 完了20件以上
    {
      type: "top_rated",
      earned: ctx.avgRating >= 4.8 && ctx.completedOrders >= 20,
      expiresAt: null,
    },
    // Fast Delivery: 納期遵守率95%以上 & 完了10件以上
    {
      type: "fast_delivery",
      earned: ctx.onTimeDeliveryRate >= 0.95 && ctx.completedOrders >= 10,
      expiresAt: null,
    },
    // Tool master 4種
    toolMaster("kling_master", "Kling")(ctx),
    toolMaster("runway_master", "Runway")(ctx),
    toolMaster("heygen_master", "HeyGen")(ctx),
    toolMaster("seedance_master", "Seedance")(ctx),
    // Founding Creator: ローンチ前登録 → 永久
    {
      type: "founding_creator",
      earned: ctx.createdAt <= LAUNCH_DATE,
      expiresAt: null,
    },
    // Rising Star: 登録3ヶ月以内 & 完了5件以上 & 平均評価4.5以上
    {
      type: "rising_star",
      earned:
        ctx.now <= threeMonthsFromCreated &&
        ctx.completedOrders >= 5 &&
        ctx.avgRating >= 4.5,
      expiresAt: threeMonthsFromCreated,
    },
    // Launch Period Creator: ローンチ期間中の全員に付与
    {
      type: "launch_period_creator",
      earned: ctx.now < LAUNCH_PERIOD_END,
      expiresAt: LAUNCH_PERIOD_END,
    },
  ];
}

function endOfCurrentMonth(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

// ===================
// UI用: 「次のバッジまで」ヒント
// ===================
export interface NextBadgeHint {
  badge: BadgeDefinition;
  current: number;
  target: number;
  unit: "count" | "rating" | "rate";
  message: string;
}

/**
 * 保有していないバッジの中で、最も近いもの1件をヒントとして返す。
 */
export function getNextBadgeHint(
  earned: Set<BadgeType>,
  stats: {
    completed_orders: number;
    avg_rating: number;
    on_time_delivery_rate: number;
  },
): NextBadgeHint | null {
  const candidates: NextBadgeHint[] = [];

  if (!earned.has("top_rated") && stats.avg_rating >= 4.5) {
    candidates.push({
      badge: BADGE_DEFINITIONS.top_rated,
      current: stats.completed_orders,
      target: 20,
      unit: "count",
      message: `あと ${Math.max(0, 20 - stats.completed_orders)} 件完了で Top Rated`,
    });
  }
  if (!earned.has("fast_delivery") && stats.on_time_delivery_rate >= 0.95) {
    candidates.push({
      badge: BADGE_DEFINITIONS.fast_delivery,
      current: stats.completed_orders,
      target: 10,
      unit: "count",
      message: `あと ${Math.max(0, 10 - stats.completed_orders)} 件完了で Fast Delivery`,
    });
  }
  if (!earned.has("rising_star")) {
    candidates.push({
      badge: BADGE_DEFINITIONS.rising_star,
      current: stats.completed_orders,
      target: 5,
      unit: "count",
      message: `あと ${Math.max(0, 5 - stats.completed_orders)} 件完了で Rising Star`,
    });
  }

  // target まで最も近い (current/target が大きい) 候補を返す
  candidates.sort((a, b) => b.current / b.target - a.current / a.target);
  return candidates[0] ?? null;
}
