import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PortfolioItem } from "@/types/database";

const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: "pf1", creator_id: "1", title: "IT企業 新卒採用動画", category: "採用動画", description: null, video_url: null, thumbnail_url: null, view_count: 1200, display_order: 0, created_at: "" },
  { id: "pf2", creator_id: "2", title: "飲食チェーン Instagram CM", category: "SNS広告", description: null, video_url: null, thumbnail_url: null, view_count: 3400, display_order: 0, created_at: "" },
  { id: "pf3", creator_id: "3", title: "SaaS製品 プロモーション", category: "商品PR", description: null, video_url: null, thumbnail_url: null, view_count: 890, display_order: 0, created_at: "" },
  { id: "pf4", creator_id: "4", title: "建設会社 会社紹介ムービー", category: "会社紹介", description: null, video_url: null, thumbnail_url: null, view_count: 2100, display_order: 0, created_at: "" },
  { id: "pf5", creator_id: "5", title: "クリニック SNS広告", category: "SNS広告", description: null, video_url: null, thumbnail_url: null, view_count: 5600, display_order: 0, created_at: "" },
  { id: "pf6", creator_id: "6", title: "アパレルブランド PV", category: "ブランド動画", description: null, video_url: null, thumbnail_url: null, view_count: 4200, display_order: 0, created_at: "" },
];

export function usePortfolio(creatorId?: string) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = useCallback(async () => {
    if (!creatorId) { setItems([]); setLoading(false); return; }

    if (!isSupabaseConfigured()) {
      setItems(MOCK_PORTFOLIO.filter(p => p.creator_id === creatorId));
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("creator_id", creatorId)
      .order("display_order", { ascending: true });

    setItems(data ?? []);
    setLoading(false);
  }, [creatorId]);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  const addItem = useCallback(async (item: Omit<PortfolioItem, "id" | "created_at">) => {
    if (!isSupabaseConfigured()) {
      setItems(prev => [...prev, { ...item, id: `pf-${Date.now()}`, created_at: new Date().toISOString() }]);
      return { error: null };
    }
    const { error } = await supabase.from("portfolio_items").insert(item);
    if (!error) fetchPortfolio();
    return { error: error?.message ?? null };
  }, [fetchPortfolio]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!isSupabaseConfigured()) {
      setItems(prev => prev.filter(i => i.id !== itemId));
      return { error: null };
    }
    const { error } = await supabase.from("portfolio_items").delete().eq("id", itemId);
    if (!error) fetchPortfolio();
    return { error: error?.message ?? null };
  }, [fetchPortfolio]);

  return { items, loading, addItem, removeItem, refetch: fetchPortfolio };
}

// Get all portfolio items (for landing page or browse)
export function useAllPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setItems(MOCK_PORTFOLIO);
      setLoading(false);
      return;
    }

    supabase
      .from("portfolio_items")
      .select("*")
      .order("view_count", { ascending: false })
      .limit(20)
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  return { items, loading };
}
