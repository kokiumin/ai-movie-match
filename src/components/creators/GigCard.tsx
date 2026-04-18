import { Star, Heart, Play, Shield, Award } from "lucide-react";
import { useState } from "react";
import type { Profile } from "@/types/database";
import { isNewCreator, getScoreGrade } from "@/lib/score";
import { BadgeShowcase } from "./BadgeShowcase";

interface GigCardProps {
  creator: Profile;
  onClick: () => void;
}

export function GigCard({ creator: c, onClick }: GigCardProps) {
  const [liked, setLiked] = useState(false);
  const title = c.bio?.split("。")[0] ?? `${c.tags?.[0] ?? "動画"}を制作します`;
  const priceMan = c.min_price ? Math.round(c.min_price / 10000) : null;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className={`relative aspect-[4/3] ${c.color || 'bg-gradient-to-br from-brand-400 to-brand-700'} rounded-xl overflow-hidden mb-3`}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-transparent to-black/40" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={22} className="text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {c.badge === "TOP" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded">
              <Award size={10} /> TOP
            </span>
          )}
          {c.badge === "認定" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-brand-500 text-white px-2 py-0.5 rounded">
              <Shield size={10} /> PRO
            </span>
          )}
        </div>

        {/* Top-right heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((v) => !v); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            size={15}
            fill={liked ? "#ef4444" : "none"}
            stroke={liked ? "#ef4444" : "#374151"}
            strokeWidth={2}
          />
        </button>

        {/* Bottom-right category */}
        <div className="absolute bottom-3 right-3 text-white text-xs font-bold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
          {c.tags?.[0] ?? ""}
        </div>
      </div>

      {/* Seller row */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded-full ${c.color || 'bg-brand-500'} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
          {c.display_name?.[0]}
        </div>
        <span className="font-bold text-sm text-gray-900 truncate">{c.display_name}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Lv {c.delivery_count && c.delivery_count > 50 ? "2" : "1"}
        </span>
      </div>

      {/* Gig title */}
      <p className="text-sm text-gray-900 font-medium leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
        {title}
      </p>

      {/* Rating + Score */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <Star size={13} className="fill-gray-900 text-gray-900" />
          <span className="font-bold text-sm text-gray-900">{c.rating?.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({c.review_count})</span>
        </div>
        {isNewCreator(c.completed_orders ?? 0) ? (
          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
            新規クリエイター
          </span>
        ) : (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${getScoreGrade(c.score ?? 0).color} bg-white border-gray-200`}
            title={`スコア ${c.score}/1000`}
          >
            Score {c.score}
          </span>
        )}
      </div>

      {/* Top 3 badges */}
      <BadgeShowcase creatorId={c.id} max={3} size="sm" compact className="mb-3" />

      {/* Separator */}
      <div className="border-t border-gray-100 pt-3 flex items-end justify-between">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          最低
        </div>
        <div className="text-right">
          <span className="text-base font-black text-gray-900">
            ¥{priceMan ?? "?"}万〜
          </span>
        </div>
      </div>
    </div>
  );
}
