import { Star, Play } from "lucide-react";
import type { Profile } from "@/types/database";

interface CreatorSpotlightProps {
  creators: Profile[];
  onCreatorClick: (creator: Profile) => void;
  onSeeAll: () => void;
}

export function CreatorSpotlight({ creators, onCreatorClick, onSeeAll }: CreatorSpotlightProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              人気のクリエイター
            </h2>
            <p className="text-gray-500 mt-2">高評価・実績豊富なクリエイターをピックアップ</p>
          </div>
          <button
            onClick={onSeeAll}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap"
          >
            すべて見る →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {creators.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => onCreatorClick(c)}
              className="text-left group"
            >
              {/* Thumbnail */}
              <div className={`aspect-[4/3] ${c.color || 'bg-gradient-to-br from-brand-400 to-brand-700'} rounded-xl relative overflow-hidden mb-3`}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/50 transition-colors">
                    <Play size={20} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  {c.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/90 text-gray-900 px-2 py-0.5 rounded">
                      {c.badge}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 text-white text-xs font-bold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
                  {c.tags?.[0] ?? ''}
                </div>
              </div>
              {/* Info */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 rounded-full ${c.color || 'bg-brand-500'} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}>
                    {c.display_name?.[0]}
                  </div>
                  <span className="font-bold text-gray-900 text-sm truncate">{c.display_name}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
                  {c.bio || c.tags?.join(' / ')}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">{c.rating}</span>
                  <span className="text-gray-500">({c.review_count})</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                  最低 <span className="font-bold text-gray-900">¥{((c.min_price || 0) / 10000)}万円〜</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
