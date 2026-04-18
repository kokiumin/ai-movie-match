import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { ClientCreatorRelation } from "@/types/database";

/**
 * クライアント×クリエイターのリピート関係を取得
 * transaction_count >= 1 ならリピート対象 (次回取引で割引)
 */
export function useClientCreatorRelation(clientId?: string, creatorId?: string) {
  const [relation, setRelation] = useState<ClientCreatorRelation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId || !creatorId) {
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured()) {
      setRelation(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    supabase
      .from("client_creator_relations")
      .select("*")
      .eq("client_id", clientId)
      .eq("creator_id", creatorId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setRelation((data as ClientCreatorRelation | null) ?? null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, creatorId]);

  const isRepeat = (relation?.transaction_count ?? 0) >= 1;
  return { relation, isRepeat, loading };
}
