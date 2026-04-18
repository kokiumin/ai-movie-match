import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { CreatorBadge } from "@/types/database";
import type { BadgeType } from "@/lib/badges";
import { LAUNCH_PERIOD_END } from "@/lib/score";

const MOCK_BADGES: CreatorBadge[] = [
  {
    creator_id: "demo-creator",
    badge_type: "launch_period_creator",
    awarded_at: new Date().toISOString(),
    expires_at: LAUNCH_PERIOD_END.toISOString(),
    reason: null,
  },
  {
    creator_id: "demo-creator",
    badge_type: "founding_creator",
    awarded_at: new Date().toISOString(),
    expires_at: null,
    reason: null,
  },
  {
    creator_id: "demo-creator",
    badge_type: "rising_star",
    awarded_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 60 * 86400_000).toISOString(),
    reason: null,
  },
];

export function useCreatorBadges(creatorId?: string) {
  const [badges, setBadges] = useState<CreatorBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!creatorId) {
      setBadges([]);
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured()) {
      setBadges(MOCK_BADGES);
      setLoading(false);
      return;
    }

    let cancelled = false;
    supabase
      .from("creator_badges")
      .select("*")
      .eq("creator_id", creatorId)
      .then(({ data }) => {
        if (cancelled) return;
        setBadges((data ?? []) as CreatorBadge[]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [creatorId]);

  const has = (type: BadgeType) => badges.some((b) => b.badge_type === type);
  const earnedSet = new Set(badges.map((b) => b.badge_type as BadgeType));

  return { badges, earnedSet, has, loading };
}
