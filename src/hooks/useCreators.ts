import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Profile } from "@/types/database";

// Mock data fallback (same as original App.tsx)
const MOCK_CREATORS: Profile[] = [
  { id: "1", role: "creator", display_name: "田中 蒼", handle: "@aosora_gen", avatar_url: null, company_name: null, industry: null, bio: "生成AI専門クリエイター。中小企業の採用・PR動画を低コストで高速制作します。", specialty: ["採用動画", "会社紹介"], tools: ["Runway", "Sora", "CapCut"], tags: ["採用動画", "会社紹介"], badge: "認定", turnaround: "5〜7日", min_price: 50000, max_price: 150000, rating: 4.9, review_count: 38, delivery_count: 52, monthly_revenue: 420000, active_projects: 3, stripe_account_id: null, stripe_connected: false, color: "bg-blue-600", created_at: "", updated_at: "" },
  { id: "2", role: "creator", display_name: "鈴木 凛", handle: "@rin_aicinema", avatar_url: null, company_name: null, industry: null, bio: "SNS向けショート動画が得意。ターゲットに刺さるAI映像を高速納品。", specialty: ["SNS広告", "商品PR"], tools: ["Kling", "HeyGen", "Premiere"], tags: ["SNS広告", "商品PR"], badge: "", turnaround: "3〜5日", min_price: 30000, max_price: 100000, rating: 4.7, review_count: 24, delivery_count: 31, monthly_revenue: 180000, active_projects: 2, stripe_account_id: null, stripe_connected: false, color: "bg-emerald-600", created_at: "", updated_at: "" },
  { id: "3", role: "creator", display_name: "山本 剛", handle: "@gocreate_ai", avatar_url: null, company_name: null, industry: null, bio: "元映像ディレクター。AIで単価を下げながら品質を維持。採用動画の実績多数。", specialty: ["採用動画", "研修コンテンツ"], tools: ["Sora", "D-ID", "After Effects"], tags: ["採用動画", "研修・説明"], badge: "認定", turnaround: "7〜10日", min_price: 80000, max_price: 200000, rating: 4.8, review_count: 41, delivery_count: 67, monthly_revenue: 610000, active_projects: 4, stripe_account_id: null, stripe_connected: false, color: "bg-violet-600", created_at: "", updated_at: "" },
  { id: "4", role: "creator", display_name: "伊藤 美咲", handle: "@misaki_aifilm", avatar_url: null, company_name: null, industry: null, bio: "アート系ビジュアルが強み。ブランドイメージを高める映像表現を得意とする。", specialty: ["ブランド動画", "会社紹介"], tools: ["Runway", "Midjourney", "Resolve"], tags: ["ブランド動画", "会社紹介"], badge: "", turnaround: "5〜8日", min_price: 100000, max_price: 250000, rating: 4.6, review_count: 17, delivery_count: 23, monthly_revenue: 320000, active_projects: 2, stripe_account_id: null, stripe_connected: false, color: "bg-amber-600", created_at: "", updated_at: "" },
  { id: "5", role: "creator", display_name: "中村 健", handle: "@ken_aigiga", avatar_url: null, company_name: null, industry: null, bio: "業界最多実績。どんな業種でも対応できる汎用力と圧倒的スピードが強み。", specialty: ["採用動画", "SNS広告", "会社紹介"], tools: ["Kling", "Sora", "Runway"], tags: ["採用動画", "SNS広告", "会社紹介"], badge: "TOP", turnaround: "4〜6日", min_price: 50000, max_price: 180000, rating: 4.9, review_count: 56, delivery_count: 89, monthly_revenue: 780000, active_projects: 5, stripe_account_id: null, stripe_connected: false, color: "bg-rose-600", created_at: "", updated_at: "" },
  { id: "6", role: "creator", display_name: "林 奈津子", handle: "@natsu_aiworks", avatar_url: null, company_name: null, industry: null, bio: "食品・コスメ・アパレルのSNS広告専門。短納期・低価格が強み。", specialty: ["商品PR", "SNS広告"], tools: ["Kling", "CapCut", "HeyGen"], tags: ["商品PR", "SNS広告"], badge: "", turnaround: "2〜4日", min_price: 20000, max_price: 80000, rating: 4.5, review_count: 12, delivery_count: 18, monthly_revenue: 140000, active_projects: 1, stripe_account_id: null, stripe_connected: false, color: "bg-pink-600", created_at: "", updated_at: "" },
];

interface UseCreatorsOptions {
  category?: string;
  query?: string;
  tools?: string[];
  priceRange?: string;
  sortBy?: string;
}

export function useCreators(options: UseCreatorsOptions = {}) {
  const [creators, setCreators] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreators = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Filter mock data locally
      let result = [...MOCK_CREATORS];
      const { category, query, tools, priceRange, sortBy } = options;

      if (category && category !== "all" && category !== "すべて") {
        result = result.filter(c => c.tags?.some(t => t === category));
      }
      if (query) {
        const q = query.toLowerCase();
        result = result.filter(c =>
          c.display_name.toLowerCase().includes(q) ||
          c.bio?.toLowerCase().includes(q) ||
          c.tags?.some(t => t.toLowerCase().includes(q)) ||
          c.tools?.some(t => t.toLowerCase().includes(q))
        );
      }
      if (tools && tools.length > 0) {
        result = result.filter(c => tools.some(t => c.tools?.includes(t)));
      }
      if (priceRange && priceRange !== "すべて") {
        result = result.filter(c => {
          const min = c.min_price ?? 0;
          if (priceRange === "〜5万円") return min < 50000;
          if (priceRange === "5〜10万円") return min >= 50000 && min <= 100000;
          if (priceRange === "10〜20万円") return min >= 100000 && min <= 200000;
          if (priceRange === "20万円以上") return min >= 200000;
          return true;
        });
      }
      if (sortBy === "評価が高い") result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      else if (sortBy === "価格が安い") result.sort((a, b) => (a.min_price ?? 0) - (b.min_price ?? 0));
      else if (sortBy === "実績が多い") result.sort((a, b) => (b.delivery_count ?? 0) - (a.delivery_count ?? 0));

      setCreators(result);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let q = supabase.from("profiles").select("*").eq("role", "creator");

      if (options.category && options.category !== "all" && options.category !== "すべて") {
        q = q.contains("tags", [options.category]);
      }
      if (options.query) {
        q = q.or(`display_name.ilike.%${options.query}%,bio.ilike.%${options.query}%`);
      }

      const { data, error: err } = await q;
      if (err) throw err;

      let result = (data ?? []) as Profile[];

      // Client-side filtering for tools and price (could be DB-side with more complex queries)
      if (options.tools && options.tools.length > 0) {
        result = result.filter(c => options.tools!.some(t => c.tools?.includes(t)));
      }
      if (options.priceRange && options.priceRange !== "すべて") {
        result = result.filter(c => {
          const min = c.min_price ?? 0;
          if (options.priceRange === "〜5万円") return min < 50000;
          if (options.priceRange === "5〜10万円") return min >= 50000 && min <= 100000;
          if (options.priceRange === "10〜20万円") return min >= 100000 && min <= 200000;
          if (options.priceRange === "20万円以上") return min >= 200000;
          return true;
        });
      }
      if (options.sortBy === "評価が高い") result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      else if (options.sortBy === "価格が安い") result.sort((a, b) => (a.min_price ?? 0) - (b.min_price ?? 0));
      else if (options.sortBy === "実績が多い") result.sort((a, b) => (b.delivery_count ?? 0) - (a.delivery_count ?? 0));

      setCreators(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [options.category, options.query, options.tools?.join(","), options.priceRange, options.sortBy]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  return { creators, loading, error, refetch: fetchCreators };
}

export function useCreatorById(id: string | null) {
  const [creator, setCreator] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) { setCreator(null); return; }

    if (!isSupabaseConfigured()) {
      setCreator(MOCK_CREATORS.find(c => c.id === id) ?? null);
      return;
    }

    setLoading(true);
    supabase.from("profiles").select("*").eq("id", id).single()
      .then(({ data }) => { setCreator(data as Profile); setLoading(false); });
  }, [id]);

  return { creator, loading };
}
