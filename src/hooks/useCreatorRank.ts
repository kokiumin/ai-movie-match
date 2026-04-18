import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { CreatorRank, CreatorRankHistory } from "@/types/database";

export interface CreatorRankInfo {
  rank: CreatorRank;
  total_earnings_30d: number;
  total_earnings_90d: number;
  completed_orders: number;
  rank_updated_at: string | null;
}

const MOCK_RANK_INFO: CreatorRankInfo = {
  rank: "regular",
  total_earnings_30d: 180_000,
  total_earnings_90d: 520_000,
  completed_orders: 5,
  rank_updated_at: new Date().toISOString(),
};

export function useCreatorRank(creatorId?: string) {
  const [info, setInfo] = useState<CreatorRankInfo | null>(null);
  const [history, setHistory] = useState<CreatorRankHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!creatorId) {
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured()) {
      setInfo(MOCK_RANK_INFO);
      setHistory([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const [{ data: profile }, { data: hist }] = await Promise.all([
        supabase
          .from("profiles")
          .select("rank, total_earnings_30d, total_earnings_90d, completed_orders, rank_updated_at")
          .eq("id", creatorId)
          .maybeSingle(),
        supabase
          .from("creator_rank_history")
          .select("*")
          .eq("creator_id", creatorId)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (cancelled) return;
      if (profile) {
        setInfo({
          rank: (profile.rank ?? "starter") as CreatorRank,
          total_earnings_30d: profile.total_earnings_30d ?? 0,
          total_earnings_90d: profile.total_earnings_90d ?? 0,
          completed_orders: profile.completed_orders ?? 0,
          rank_updated_at: profile.rank_updated_at,
        });
      }
      setHistory((hist ?? []) as CreatorRankHistory[]);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [creatorId]);

  return { info, history, loading };
}
