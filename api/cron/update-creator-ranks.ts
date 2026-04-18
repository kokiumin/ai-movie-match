// Vercel Cron エンドポイント: クリエイターランク日次再判定
//
// 実行スケジュール (vercel.json): 毎日 JST 02:00 (UTC 17:00)
// 認証: Vercel Cron は Authorization: Bearer <CRON_SECRET> ヘッダを付与
//
// 処理:
//   1. CRON_SECRET 検証
//   2. 同日 success ログがあれば skip (冪等性)
//   3. running ログを挿入 → Supabase Edge Function 'rank-update' を呼ぶ
//   4. 成功: success に更新、失敗: failed に更新 + Slack 通知

import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

const JOB_NAME = "rank-update";

// JST基準の今日日付 (YYYY-MM-DD)
function todayJst(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 3600_000);
  return jst.toISOString().slice(0, 10);
}

async function notifySlack(message: string, details?: unknown) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: `:rotating_light: *rank-update batch failed*\n${message}\n\`\`\`${JSON.stringify(details, null, 2).slice(0, 1500)}\`\`\``,
      }),
    });
  } catch {
    // Slack通知の失敗は無視 (バッチ本体のエラーを優先)
  }
}

export default async function handler(req: Request): Promise<Response> {
  // ===== 認証 =====
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${expectedSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const executionDate = todayJst();

  // ===== 冪等性チェック =====
  const { data: existing } = await admin
    .from("batch_execution_logs")
    .select("id, status")
    .eq("job_name", JOB_NAME)
    .eq("execution_date", executionDate)
    .eq("status", "success")
    .maybeSingle();

  if (existing) {
    return Response.json({
      ok: true,
      skipped: true,
      reason: "already succeeded today",
      execution_date: executionDate,
    });
  }

  // ===== 実行ログ挿入 (running) =====
  const startedAt = new Date();
  const { data: logRow, error: logErr } = await admin
    .from("batch_execution_logs")
    .insert({
      job_name: JOB_NAME,
      execution_date: executionDate,
      status: "running",
      started_at: startedAt.toISOString(),
      triggered_by: "vercel-cron",
    })
    .select("id")
    .single();

  if (logErr || !logRow) {
    await notifySlack("Failed to insert batch_execution_logs", logErr);
    return Response.json({ error: "Log insert failed", details: logErr }, { status: 500 });
  }

  // ===== Edge Function 呼び出し =====
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/rank-update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "content-type": "application/json",
      },
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok || body?.ok !== true) {
      throw new Error(
        `Edge Function returned ${res.status}: ${JSON.stringify(body).slice(0, 500)}`,
      );
    }

    const finishedAt = new Date();
    await admin
      .from("batch_execution_logs")
      .update({
        status: "success",
        finished_at: finishedAt.toISOString(),
        duration_ms: finishedAt.getTime() - startedAt.getTime(),
        processed: body.processed ?? null,
        changed: body.changed ?? null,
        payload: body,
      })
      .eq("id", logRow.id);

    return Response.json({
      ok: true,
      execution_date: executionDate,
      processed: body.processed,
      changed: body.changed,
    });
  } catch (e: any) {
    const finishedAt = new Date();
    const errorMessage = e?.message ?? String(e);

    await admin
      .from("batch_execution_logs")
      .update({
        status: "failed",
        finished_at: finishedAt.toISOString(),
        duration_ms: finishedAt.getTime() - startedAt.getTime(),
        error_message: errorMessage,
      })
      .eq("id", logRow.id);

    await notifySlack(`rank-update failed on ${executionDate}`, { error: errorMessage });

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
