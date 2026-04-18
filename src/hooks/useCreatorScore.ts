import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { CreatorScoreHistory } from "@/types/database";

export interface CreatorScoreInfo {
  score: number;
  avg_rating: number;
  on_time_delivery_rate: number;
  repeat_client_rate: number;
  completed_orders: number;
  score_updated_at: string | null;
  created_at: string;
}

const MOCK_SCORE_INFO: CreatorScoreInfo = {
  score: 720,
  avg_rating: 4.8,
  on_time_delivery_rate: 0.96,
  repeat_client_rate: 0.4,
  completed_orders: 8,
  score_updated_at: new Date().toISOString(),
  created_at: new Date(Date.now() - 45 * 86400_000).toISOString(),
};

const MOCK_HISTORY: CreatorScoreHistory[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(Date.now() - (13 - i) * 86400_000);
  const base = 620 + Math.round(Math.sin(i / 3) * 60) + i * 5;
  return {
    id: `h-${i}`,
    creator_id: "demo-creator",
    score: Math.min(1000, Math.max(0, base)),
    avg_rating: 4.8,
    on_time_delivery_rate: 0.96,
    repeat_client_rate: 0.4,
    completed_orders: 8,
    calculated_at: d.toISOString(),
    calculated_date: d.toISOString().slice(0, 10),
  };
});

export function useCreatorScore(creatorId?: string) {
  const [info, setInfo] = useState<CreatorScoreInfo | null>(null);
  const [history, setHistory] = useState<CreatorScoreHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!creatorId) {
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured()) {
      setInfo(MOCK_SCORE_INFO);
      setHistory(MOCK_HISTORY);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const [{ data: profile }, { data: hist }] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "score, avg_rating, on_time_delivery_rate, repeat_client_rate, completed_orders, score_updated_at, created_at",
          )
          .eq("id", creatorId)
          .maybeSingle(),
        supabase
          .from("creator_score_history")
          .select("*")
          .eq("creator_id", creatorId)
          .order("calculated_at", { ascending: true })
          .limit(30),
      ]);

      if (cancelled) return;
      if (profile) {
        setInfo({
          score: profile.score ?? 0,
          avg_rating: Number(profile.avg_rating ?? 0),
          on_time_delivery_rate: Number(profile.on_time_delivery_rate ?? 0),
          repeat_client_rate: Number(profile.repeat_client_rate ?? 0),
          completed_orders: profile.completed_orders ?? 0,
          score_updated_at: profile.score_updated_at,
          created_at: profile.created_at,
        });
      }
      setHistory((hist ?? []) as CreatorScoreHistory[]);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [creatorId]);

  return { info, history, loading };
}
