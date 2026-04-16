import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Review } from "@/types/database";

const MOCK_REVIEWS: Review[] = [
  { id: "r1", creator_id: "1", author_id: "c1", project_id: null, rating: 5, text: "採用動画を依頼しました。こちらの要望を丁寧にヒアリングしてくださり、期待以上の仕上がりでした。納期も予定より早く助かりました。", created_at: "2026-03-20" },
  { id: "r2", creator_id: "1", author_id: "c2", project_id: null, rating: 4, text: "会社紹介動画の制作をお願いしました。AIを活用した映像表現が斬新で、社内でも好評です。修正対応も迅速でした。", created_at: "2026-03-10" },
  { id: "r3", creator_id: "1", author_id: "c3", project_id: null, rating: 5, text: "Instagram広告動画を作っていただきました。ターゲットに刺さるクリエイティブで、問い合わせが1.5倍に増えました。", created_at: "2026-02-28" },
  { id: "r4", creator_id: "1", author_id: "c4", project_id: null, rating: 5, text: "新卒採用動画を依頼。若手社員の魅力を引き出す構成が素晴らしかったです。応募者数が前年比120%に。", created_at: "2026-02-15" },
];

export type ReviewWithAuthor = Review & { author_name?: string };

export function useReviews(creatorId?: string) {
  const [reviews, setReviews] = useState<ReviewWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!creatorId) { setReviews([]); setLoading(false); return; }

    if (!isSupabaseConfigured()) {
      const authorNames: Record<string, string> = {
        c1: "株式会社グリーンテック",
        c2: "ミライ不動産",
        c3: "佐藤歯科クリニック",
        c4: "丸山電機株式会社",
      };
      setReviews(
        MOCK_REVIEWS.filter(r => r.creator_id === creatorId)
          .map(r => ({ ...r, author_name: authorNames[r.author_id] ?? "匿名" }))
      );
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("reviews")
      .select("*, author:profiles!reviews_author_id_fkey(display_name, company_name)")
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false });

    setReviews(
      (data ?? []).map((r: any) => ({
        ...r,
        author_name: r.author?.company_name ?? r.author?.display_name ?? "匿名",
      }))
    );
    setLoading(false);
  }, [creatorId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const addReview = useCallback(async (review: { creator_id: string; author_id: string; project_id?: string; rating: number; text: string }) => {
    if (!isSupabaseConfigured()) {
      setReviews(prev => [{ ...review, id: `r-${Date.now()}`, project_id: review.project_id ?? null, created_at: new Date().toISOString(), author_name: "あなた" }, ...prev]);
      return { error: null };
    }
    const { error } = await supabase.from("reviews").insert(review);
    if (!error) fetchReviews();
    return { error: error?.message ?? null };
  }, [fetchReviews]);

  return { reviews, loading, addReview, refetch: fetchReviews };
}
