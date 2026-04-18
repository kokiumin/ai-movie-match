// ============================================================
// クリエイタースコアリング
// ============================================================
// 0〜1000点満点。バッチ (Edge Function score-update) が毎日再計算。
// UIは score / avg_rating / *_rate を profiles から読むだけ。

export interface CreatorStatsForScore {
  completed_orders: number;      // 完了件数
  avg_rating: number;            // 平均評価 (1.0-5.0)
  on_time_delivery_rate: number; // 納期遵守率 (0-1)
  repeat_client_rate: number;    // リピート率 (0-1)
}

export interface ScoreBreakdown {
  total: number;                 // 0-1000
  completedPoints: number;       // 0-300
  ratingPoints: number;          // 0-300
  onTimePoints: number;          // 0-200
  repeatPoints: number;          // 0-200
}

// 重み付け (指示書の表どおり)
export const SCORE_WEIGHTS = {
  COMPLETED_MAX_COUNT: 10,       // 10件で満点
  COMPLETED_PER_ORDER: 30,       // 1件 = 30点
  RATING_MULTIPLIER: 60,         // 5.0 × 60 = 300
  ON_TIME_MULTIPLIER: 200,       // 1.0 × 200 = 200
  REPEAT_MULTIPLIER: 200,        // 1.0 × 200 = 200
} as const;

export const SCORE_MAX = 1000;

/**
 * スコア計算 (冪等な純関数)。
 */
export function calculateScore(stats: CreatorStatsForScore): ScoreBreakdown {
  const completedPoints = Math.min(
    stats.completed_orders * SCORE_WEIGHTS.COMPLETED_PER_ORDER,
    SCORE_WEIGHTS.COMPLETED_MAX_COUNT * SCORE_WEIGHTS.COMPLETED_PER_ORDER,
  );
  const ratingPoints = Math.max(
    0,
    Math.min(stats.avg_rating * SCORE_WEIGHTS.RATING_MULTIPLIER, 300),
  );
  const onTimePoints = Math.max(
    0,
    Math.min(stats.on_time_delivery_rate * SCORE_WEIGHTS.ON_TIME_MULTIPLIER, 200),
  );
  const repeatPoints = Math.max(
    0,
    Math.min(stats.repeat_client_rate * SCORE_WEIGHTS.REPEAT_MULTIPLIER, 200),
  );

  return {
    total: Math.round(completedPoints + ratingPoints + onTimePoints + repeatPoints),
    completedPoints: Math.round(completedPoints),
    ratingPoints: Math.round(ratingPoints),
    onTimePoints: Math.round(onTimePoints),
    repeatPoints: Math.round(repeatPoints),
  };
}

// ===================
// ローンチ期間
// ===================
// ローンチ前登録者に Founding Creator バッジを永久付与するため、
// サービス開始日を固定する。
export const LAUNCH_DATE = new Date("2026-04-18T00:00:00+09:00");
export const LAUNCH_PERIOD_MS = 90 * 24 * 3600 * 1000; // 3ヶ月
export const LAUNCH_PERIOD_END = new Date(LAUNCH_DATE.getTime() + LAUNCH_PERIOD_MS);

export function isInLaunchPeriod(now: Date = new Date()): boolean {
  return now < LAUNCH_PERIOD_END;
}

// 新規クリエイター扱い (完了件数 < NEW_CREATOR_THRESHOLD) はスコア非表示
export const NEW_CREATOR_THRESHOLD = 5;

export function isNewCreator(completedOrders: number): boolean {
  return completedOrders < NEW_CREATOR_THRESHOLD;
}

// ===================
// UI用: スコア表示のヘルパー
// ===================
export function getScoreGrade(score: number): { label: string; color: string } {
  if (score >= 800) return { label: "Excellent", color: "text-emerald-700" };
  if (score >= 600) return { label: "Good", color: "text-brand-700" };
  if (score >= 400) return { label: "Fair", color: "text-amber-700" };
  return { label: "Starter", color: "text-gray-500" };
}
