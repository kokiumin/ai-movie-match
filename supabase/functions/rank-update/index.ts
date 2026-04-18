// Supabase Edge Function: クリエイターランク日次再判定バッチ
//
// 「成約」として計上する条件 (migration 003 / 005 で定義):
//   1. project.status = 'completed'
//   2. AND payout_status = 'paid'
//   3. AND (client_approved_at IS NOT NULL OR auto_approval_deadline <= now())
//   4. AND cancelled_at IS NULL AND refunded_at IS NULL
//
// 集計日キー: payout_completed_at (送金完了日) ― 30日/90日バケットは
//   この日付を唯一の基準とする (completed_at や approved_at ではない)。
// 上記を満たす案件の proposals.price を集計し、
// 各クリエイターのランクを再判定する。
// 変更があった場合のみ profiles を更新し、creator_rank_history に記録、
// notifications にランクアップ通知を挿入する。
//
// completed_orders は trigger 側でリアルタイム更新されるため、このバッチでは
// 売上集計と rank 判定のみを担当する。
//
// 実行方法: pg_cron から `select net.http_post(...)` で毎日呼び出す、
// あるいは Supabase Scheduled Triggers で日次実行。
// Service Role Key で呼ばれることを想定 (Authorization: Bearer <SERVICE_ROLE_KEY>)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// ===== ランク定義 (lib/rank.ts と同期) =====
type CreatorRank = "starter" | "regular" | "pro" | "elite";

const RANK_CONFIG: Record<
  CreatorRank,
  {
    feeRate: number;
    minCompletedOrders?: number;
    minEarnings30d?: number;
    minEarnings90d?: number;
    label: string;
  }
> = {
  starter: { feeRate: 0.2, label: "スターター" },
  regular: {
    feeRate: 0.15,
    minCompletedOrders: 3,
    minEarnings30d: 100_000,
    label: "レギュラー",
  },
  pro: { feeRate: 0.1, minEarnings90d: 900_000, label: "プロ" },
  elite: { feeRate: 0.07, minEarnings30d: 800_000, label: "エリート" },
};

function determineRank(stats: {
  total_earnings_30d: number;
  total_earnings_90d: number;
  completed_orders: number;
}): CreatorRank {
  if (stats.total_earnings_30d >= (RANK_CONFIG.elite.minEarnings30d ?? Infinity)) return "elite";
  if (stats.total_earnings_90d >= (RANK_CONFIG.pro.minEarnings90d ?? Infinity)) return "pro";
  if (
    stats.completed_orders >= (RANK_CONFIG.regular.minCompletedOrders ?? Infinity) ||
    stats.total_earnings_30d >= (RANK_CONFIG.regular.minEarnings30d ?? Infinity)
  ) {
    return "regular";
  }
  return "starter";
}

Deno.serve(async (req) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * 86400_000).toISOString();
  const d90 = new Date(now.getTime() - 90 * 86400_000).toISOString();

  // 全クリエイターを取得
  const { data: creators, error: cerr } = await supabase
    .from("profiles")
    .select("id, rank, completed_orders")
    .eq("role", "creator");

  if (cerr) {
    return new Response(JSON.stringify({ error: cerr.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const results: Array<{
    creator_id: string;
    previous: CreatorRank;
    next: CreatorRank;
    changed: boolean;
  }> = [];

  const nowIso = now.toISOString();

  for (const creator of creators ?? []) {
    // 採用された proposal + project 本体を取得
    // qualified 判定はクライアント側で行う (auto_approval_deadline の now() 比較を含むため)
    const { data: rows } = await supabase
      .from("proposals")
      .select(
        "price, projects!inner(status, payout_status, payout_completed_at, client_approved_at, auto_approval_deadline, cancelled_at, refunded_at)",
      )
      .eq("creator_id", creator.id)
      .eq("status", "accepted")
      .eq("projects.status", "completed")
      .eq("projects.payout_status", "paid")
      .not("projects.payout_completed_at", "is", null);

    // qualified 判定:
    //   project.status = 'completed'
    //   AND payout_status = 'paid'
    //   AND (client_approved_at OR auto_approval_deadline 経過)
    //   AND cancelled_at / refunded_at なし
    // 検収の time-based 判定 (auto_approval_deadline <= now()) があるため
    // クライアント側で最終フィルタ。
    const qualified = (rows ?? []).filter((r: any) => {
      const p = r.projects;
      if (!p) return false;
      if (p.cancelled_at || p.refunded_at) return false;
      if (!p.payout_completed_at) return false;
      const approved =
        p.client_approved_at != null ||
        (p.auto_approval_deadline != null && p.auto_approval_deadline <= nowIso);
      return approved;
    });

    // 集計日キーは payout_completed_at (送金完了日) を唯一の基準とする。
    // completed_at でも client_approved_at でもなく、payout 確定日で 30日/90日バケット。
    const e30 = qualified
      .filter((r: any) => r.projects.payout_completed_at >= d30)
      .reduce((s: number, r: any) => s + (r.price ?? 0), 0);

    const e90 = qualified
      .filter((r: any) => r.projects.payout_completed_at >= d90)
      .reduce((s: number, r: any) => s + (r.price ?? 0), 0);

    const stats = {
      total_earnings_30d: e30,
      total_earnings_90d: e90,
      completed_orders: creator.completed_orders ?? 0,
    };
    const prev = (creator.rank ?? "starter") as CreatorRank;
    const next = determineRank(stats);

    // 売上統計は常に更新
    await supabase
      .from("profiles")
      .update({
        total_earnings_30d: e30,
        total_earnings_90d: e90,
        rank: next,
        rank_updated_at: now.toISOString(),
      })
      .eq("id", creator.id);

    const changed = prev !== next;
    if (changed) {
      // 履歴挿入
      await supabase.from("creator_rank_history").insert({
        creator_id: creator.id,
        previous_rank: prev,
        new_rank: next,
        reason: "日次バッチによる自動再判定",
        earnings_30d: e30,
        earnings_90d: e90,
        completed_orders: stats.completed_orders,
      });

      // 通知 (ランクアップ / ダウン)
      const isUp =
        ["starter", "regular", "pro", "elite"].indexOf(next) >
        ["starter", "regular", "pro", "elite"].indexOf(prev);
      await supabase.from("notifications").insert({
        user_id: creator.id,
        type: "system",
        title: isUp ? "ランクアップ！" : "ランク更新のお知らせ",
        body: `あなたのランクが「${RANK_CONFIG[prev].label}」から「${RANK_CONFIG[next].label}」に変更されました。新しい手数料率: ${(RANK_CONFIG[next].feeRate * 100).toFixed(0)}%`,
      });
    }

    results.push({ creator_id: creator.id, previous: prev, next, changed });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      processed: results.length,
      changed: results.filter((r) => r.changed).length,
      results,
    }),
    { headers: { "content-type": "application/json" } },
  );
});
