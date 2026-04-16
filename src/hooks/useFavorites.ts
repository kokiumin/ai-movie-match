import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export function useFavorites(userId?: string) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    supabase
      .from("favorites")
      .select("creator_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        setFavoriteIds(new Set((data ?? []).map(d => d.creator_id)));
        setLoading(false);
      });
  }, [userId]);

  const toggleFavorite = useCallback(async (creatorId: string) => {
    if (!isSupabaseConfigured()) {
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (next.has(creatorId)) next.delete(creatorId);
        else next.add(creatorId);
        return next;
      });
      return;
    }

    if (!userId) return;

    if (favoriteIds.has(creatorId)) {
      await supabase.from("favorites").delete().eq("user_id", userId).eq("creator_id", creatorId);
      setFavoriteIds(prev => { const next = new Set(prev); next.delete(creatorId); return next; });
    } else {
      await supabase.from("favorites").insert({ user_id: userId, creator_id: creatorId });
      setFavoriteIds(prev => new Set(prev).add(creatorId));
    }
  }, [userId, favoriteIds]);

  const isFavorite = useCallback((creatorId: string) => favoriteIds.has(creatorId), [favoriteIds]);

  return { favoriteIds, isFavorite, toggleFavorite, loading };
}
