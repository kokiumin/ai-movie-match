// Supabase Edge Function: クリエイタースコア日次再計算 + バッジ自動付与
//
// 処理:
//   1. 全クリエイターの stats を proposals / projects / reviews から集計
//   2. スコアを再計算 → profiles と creator_score_history に反映
//   3. 上位20%の閾値を計算
//   4. 全バッジを再判定 → creator_badges を upsert / expired除外
//
// 冪等性: 同日2回実行しても結果は同じ (score_history の unique index,
//         badges は (creator_id, badge_type) の PK で upsert, 差分が無ければ no-op)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// ===== Scoring (lib/score.ts と同期) =====
const SCORE_WEIGHTS = {
  COMPLETED_MAX_COUNT: 10,
  COMPLETED_PER_ORDER: 30,
  RATING_MULTIPLIER: 60,
  ON_TIME_MULTIPLIER: 200,
  REPEAT_MULTIPLIER: 200,
};

function calculateScore(stats: {
  completed_orders: number;
  avg_rating: number;
  on_time_delivery_rate: number;
  repeat_client_rate: number;
}): number {
  const completedPoints = Math.min(
    stats.completed_orders * SCORE_WEIGHTS.COMPLETED_PER_ORDER,
    SCORE_WEIGHTS.COMPLETED_MAX_COUNT * SCORE_WEIGHTS.COMPLETED_PER_ORDER,
  );
  const ratingPoints = Math.max(0, Math.min(stats.avg_rating * SCORE_WEIGHTS.RATING_MULTIPLIER, 300));
  const onTimePoints = Math.max(0, Math.min(stats.on_time_delivery_rate * SCORE_WEIGHTS.ON_TIME_MULTIPLIER, 200));
  const repeatPoints = Math.max(0, Math.min(stats.repeat_client_rate * SCORE_WEIGHTS.REPEAT_MULTIPLIER, 200));
  return Math.round(completedPoints + ratingPoints + onTimePoints + repeatPoints);
}

// ===== Badge definitions (lib/badges.ts と同期) =====
const LAUNCH_DATE = new Date("2026-04-18T00:00:00+09:00");
const LAUNCH_PERIOD_END = new Date(LAUNCH_DATE.getTime() + 90 * 24 * 3600 * 1000);
const TOOL_MASTER_MIN_COUNT = 10;
const TOOL_MASTER_MIN_RATIO = 0.7;

type BadgeType =
  | "verified_creator" | "top_rated" | "fast_delivery"
  | "kling_master" | "runway_master" | "heygen_master" | "seedance_master"
  | "founding_creator" | "rising_star" | "launch_period_creator";

interface BadgeEvalResult {
  type: BadgeType;
  earned: boolean;
  expiresAt: Date | null;
  reason: Record<string, unknown>;
}

interface Ctx {
  creatorId: string;
  createdAt: Date;
  score: number;
  avgRating: number;
  completedOrders: number;
  onTimeDeliveryRate: number;
  toolCounts: Record<string, number>;
  totalCompletedWithTool: number;
  verifiedThreshold: number;
  now: Date;
}

function endOfMonth(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

function evaluateBadges(ctx: Ctx): BadgeEvalResult[] {
  const threeMonthsFromCreated = new Date(ctx.createdAt.getTime() + 90 * 24 * 3600 * 1000);
  const tm = (type: BadgeType, tool: string): BadgeEvalResult => {
    const count = ctx.toolCounts[tool] ?? 0;
    const ratio = ctx.totalCompletedWithTool > 0 ? count / ctx.totalCompletedWithTool : 0;
    return {
      type,
      earned: count >= TOOL_MASTER_MIN_COUNT && ratio >= TOOL_MASTER_MIN_RATIO,
      expiresAt: null,
      reason: { count, ratio: +ratio.toFixed(3) },
    };
  };

  return [
    {
      type: "verified_creator",
      earned: ctx.score > 0 && ctx.score >= ctx.verifiedThreshold,
      expiresAt: endOfMonth(ctx.now),
      reason: { score: ctx.score, threshold: ctx.verifiedThreshold },
    },
    {
      type: "top_rated",
      earned: ctx.avgRating >= 4.8 && ctx.completedOrders >= 20,
      expiresAt: null,
      reason: { avgRating: ctx.avgRating, completedOrders: ctx.completedOrders },
    },
    {
      type: "fast_delivery",
      earned: ctx.onTimeDeliveryRate >= 0.95 && ctx.completedOrders >= 10,
      expiresAt: null,
      reason: { onTimeDeliveryRate: ctx.onTimeDeliveryRate, completedOrders: ctx.completedOrders },
    },
    tm("kling_master", "Kling"),
    tm("runway_master", "Runway"),
    tm("heygen_master", "HeyGen"),
    tm("seedance_master", "Seedance"),
    {
      type: "founding_creator",
      earned: ctx.createdAt <= LAUNCH_DATE,
      expiresAt: null,
      reason: { createdAt: ctx.createdAt.toISOString() },
    },
    {
      type: "rising_star",
      earned: ctx.now <= threeMonthsFromCreated && ctx.completedOrders >= 5 && ctx.avgRating >= 4.5,
      expiresAt: threeMonthsFromCreated,
      reason: { completedOrders: ctx.completedOrders, avgRating: ctx.avgRating },
    },
    {
      type: "launch_period_creator",
      earned: ctx.now < LAUNCH_PERIOD_END,
      expiresAt: LAUNCH_PERIOD_END,
      reason: {},
    },
  ];
}

Deno.serve(async (req) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const now = new Date();

  // ===== クリエイター一覧 =====
  const { data: creators, error: cerr } = await supabase
    .from("profiles")
    .select("id, created_at")
    .eq("role", "creator");

  if (cerr) {
    return new Response(JSON.stringify({ error: cerr.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  // ===== 各クリエイターの stats を集計 =====
  const creatorStats: Array<{
    creator_id: string;
    createdAt: Date;
    completed_orders: number;
    avg_rating: number;
    on_time_delivery_rate: number;
    repeat_client_rate: number;
    toolCounts: Record<string, number>;
    totalCompletedWithTool: number;
  }> = [];

  for (const c of creators ?? []) {
    // 採用された proposal + qualified project を取得
    const { data: rows } = await supabase
      .from("proposals")
      .select(
        "price, delivery_days, tools_used, project_id, projects!inner(client_id, status, payout_status, payout_completed_at, client_approved_at, auto_approval_deadline, cancelled_at, refunded_at, deadline, completed_at)",
      )
      .eq("creator_id", c.id)
      .eq("status", "accepted")
      .eq("projects.status", "completed")
      .eq("projects.payout_status", "paid")
      .not("projects.payout_completed_at", "is", null);

    const qualified = (rows ?? []).filter((r: any) => {
      const p = r.projects;
      if (!p) return false;
      if (p.cancelled_at || p.refunded_at) return false;
      const approved =
        p.client_approved_at != null ||
        (p.auto_approval_deadline != null && p.auto_approval_deadline <= now.toISOString());
      return approved;
    });

    const completedOrders = qualified.length;

    // 平均評価 (reviews from qualified projects の creator_id 宛)
    let avgRating = 0;
    if (completedOrders > 0) {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("creator_id", c.id);
      const ratings = (reviews ?? []).map((r: any) => r.rating).filter((n: any) => typeof n === "number");
      if (ratings.length > 0) {
        avgRating = ratings.reduce((s: number, n: number) => s + n, 0) / ratings.length;
      }
    }

    // 納期遵守率: completed_at <= deadline (deadline は文字列で曖昧なので、ここでは payout_completed_at で近似)
    // MVP: deadline が存在し、completed_at <= deadline (string compare) なら遵守。
    // 厳密な日付比較が難しい場合は完納扱いとする。
    let onTimeCount = 0;
    for (const r of qualified as any[]) {
      const p = r.projects;
      if (p.completed_at && p.deadline) {
        // deadline は "2026-05-01" などの ISO 形式を想定。文字列比較でOK。
        if (p.completed_at.slice(0, 10) <= p.deadline) onTimeCount++;
      } else {
        onTimeCount++; // deadline 情報が無い場合は遵守扱い
      }
    }
    const onTimeDeliveryRate = completedOrders > 0 ? onTimeCount / completedOrders : 0;

    // リピート率: qualified な案件の client_id を集計
    const clientSet = new Set<string>();
    const clientCount: Record<string, number> = {};
    for (const r of qualified as any[]) {
      const cid = r.projects.client_id;
      if (!cid) continue;
      clientSet.add(cid);
      clientCount[cid] = (clientCount[cid] ?? 0) + 1;
    }
    const repeatClients = Object.values(clientCount).filter((n) => n >= 2).length;
    const repeatClientRate = clientSet.size > 0 ? repeatClients / clientSet.size : 0;

    // ツール使用回数
    const toolCounts: Record<string, number> = {};
    let totalCompletedWithTool = 0;
    for (const r of qualified as any[]) {
      const tools = (r.tools_used ?? []) as string[];
      if (tools.length > 0) {
        totalCompletedWithTool++;
        for (const t of tools) toolCounts[t] = (toolCounts[t] ?? 0) + 1;
      }
    }

    creatorStats.push({
      creator_id: c.id,
      createdAt: new Date(c.created_at),
      completed_orders: completedOrders,
      avg_rating: +avgRating.toFixed(2),
      on_time_delivery_rate: +onTimeDeliveryRate.toFixed(3),
      repeat_client_rate: +repeatClientRate.toFixed(3),
      toolCounts,
      totalCompletedWithTool,
    });
  }

  // ===== スコア計算 =====
  const scores = creatorStats.map((s) => calculateScore(s));
  const withScores = creatorStats.map((s, i) => ({ ...s, score: scores[i] }));

  // ===== 上位20%の閾値 =====
  const scoreValues = withScores.map((s) => s.score).filter((n) => n > 0).sort((a, b) => b - a);
  const top20Index = Math.max(0, Math.floor(scoreValues.length * 0.2) - 1);
  const verifiedThreshold = scoreValues.length > 0 ? scoreValues[top20Index] : Infinity;

  // ===== profiles 更新 + score_history 挿入 + バッジ判定 =====
  let badgesGranted = 0;
  let badgesRevoked = 0;

  for (const s of withScores) {
    // profiles 更新
    await supabase
      .from("profiles")
      .update({
        score: s.score,
        avg_rating: s.avg_rating,
        on_time_delivery_rate: s.on_time_delivery_rate,
        repeat_client_rate: s.repeat_client_rate,
        score_updated_at: now.toISOString(),
      })
      .eq("id", s.creator_id);

    // score_history (unique index (creator_id, calculated_date) で冪等)
    await supabase
      .from("creator_score_history")
      .upsert(
        {
          creator_id: s.creator_id,
          score: s.score,
          avg_rating: s.avg_rating,
          on_time_delivery_rate: s.on_time_delivery_rate,
          repeat_client_rate: s.repeat_client_rate,
          completed_orders: s.completed_orders,
          calculated_at: now.toISOString(),
        },
        { onConflict: "creator_id,calculated_date", ignoreDuplicates: false },
      );

    // バッジ判定
    const results = evaluateBadges({
      creatorId: s.creator_id,
      createdAt: s.createdAt,
      score: s.score,
      avgRating: s.avg_rating,
      completedOrders: s.completed_orders,
      onTimeDeliveryRate: s.on_time_delivery_rate,
      toolCounts: s.toolCounts,
      totalCompletedWithTool: s.totalCompletedWithTool,
      verifiedThreshold,
      now,
    });

    // earned なバッジを upsert, earned=false は delete
    for (const r of results) {
      if (r.earned) {
        const { error: upErr } = await supabase
          .from("creator_badges")
          .upsert({
            creator_id: s.creator_id,
            badge_type: r.type,
            awarded_at: now.toISOString(),
            expires_at: r.expiresAt?.toISOString() ?? null,
            reason: r.reason,
          }, { onConflict: "creator_id,badge_type", ignoreDuplicates: false });
        if (!upErr) badgesGranted++;
      } else {
        const { error: delErr, count } = await supabase
          .from("creator_badges")
          .delete({ count: "exact" })
          .eq("creator_id", s.creator_id)
          .eq("badge_type", r.type);
        if (!delErr && (count ?? 0) > 0) badgesRevoked++;
      }
    }
  }

  // 期限切れバッジの一括削除
  await supabase
    .from("creator_badges")
    .delete()
    .not("expires_at", "is", null)
    .lt("expires_at", now.toISOString());

  return new Response(
    JSON.stringify({
      ok: true,
      processed: withScores.length,
      verified_threshold: verifiedThreshold === Infinity ? null : verifiedThreshold,
      badges_granted: badgesGranted,
      badges_revoked: badgesRevoked,
    }),
    { headers: { "content-type": "application/json" } },
  );
});
