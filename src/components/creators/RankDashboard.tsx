import { TrendingUp, Award, Clock } from "lucide-react";
import { useCreatorRank } from "@/hooks/useCreatorRank";
import {
  getProgressToNextRank,
  getRankMeta,
  formatRate,
  RANK_CONFIG,
} from "@/lib/rank";
import { RankBadge } from "./RankBadge";

interface RankDashboardProps {
  creatorId: string;
}

export function RankDashboard({ creatorId }: RankDashboardProps) {
  const { info, history, loading } = useCreatorRank(creatorId);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-100 rounded mb-3" />
        <div className="h-4 w-full bg-gray-100 rounded" />
      </div>
    );
  }
  if (!info) return null;

  const meta = getRankMeta(info.rank);
  const progress = getProgressToNextRank({
    total_earnings_30d: info.total_earnings_30d,
    total_earnings_90d: info.total_earnings_90d,
    completed_orders: info.completed_orders,
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* ヘッダー */}
      <div className={`p-5 border-b border-gray-100 ${meta.bgColor}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-600 mb-1">現在のランク</div>
            <div className="flex items-center gap-2">
              <RankBadge rank={info.rank} size="md" />
              <span className="text-sm text-gray-700 font-semibold">
                手数料 {formatRate(meta.feeRate)}
              </span>
            </div>
          </div>
          <Award className={meta.color} size={32} />
        </div>
        <p className="text-xs text-gray-600 mt-2">{meta.description}</p>
      </div>

      {/* 実績 */}
      <div className="grid grid-cols-3 border-b border-gray-100">
        <div className="p-4 border-r border-gray-100">
          <div className="text-xs text-gray-500 font-semibold mb-1">30日売上</div>
          <div className="text-lg font-black text-gray-900">
            ¥{info.total_earnings_30d.toLocaleString()}
          </div>
        </div>
        <div className="p-4 border-r border-gray-100">
          <div className="text-xs text-gray-500 font-semibold mb-1">90日売上</div>
          <div className="text-lg font-black text-gray-900">
            ¥{info.total_earnings_90d.toLocaleString()}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500 font-semibold mb-1">完了案件</div>
          <div className="text-lg font-black text-gray-900">{info.completed_orders}件</div>
        </div>
      </div>

      {/* 次のランクまでの進捗 */}
      {progress.next && (
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-gray-700" />
            <span className="text-sm font-bold text-gray-900">
              次のランク「{RANK_CONFIG[progress.next].label}」まで
            </span>
            <span className="text-xs text-gray-500 ml-auto">
              手数料 {formatRate(RANK_CONFIG[progress.next].feeRate)}
            </span>
          </div>
          <div className="space-y-3">
            {progress.requirements.map((r) => {
              const pct = Math.min(100, (r.current / r.target) * 100);
              return (
                <div key={r.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-700 font-semibold">{r.label}</span>
                    <span className={r.met ? "text-emerald-700 font-bold" : "text-gray-600"}>
                      {r.unit === "yen"
                        ? `¥${r.current.toLocaleString()} / ¥${r.target.toLocaleString()}`
                        : `${r.current} / ${r.target}件`}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        r.met ? "bg-emerald-500" : "bg-brand-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            いずれかの条件を満たすとランクアップ
          </p>
        </div>
      )}

      {/* ランク履歴 */}
      {history.length > 0 && (
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-gray-700" />
            <span className="text-sm font-bold text-gray-900">ランク履歴</span>
          </div>
          <ul className="space-y-2">
            {history.slice(0, 5).map((h) => (
              <li
                key={h.id}
                className="flex items-center gap-2 text-xs text-gray-700"
              >
                <span className="text-gray-400">
                  {new Date(h.created_at ?? "").toLocaleDateString("ja-JP")}
                </span>
                {h.previous_rank && (
                  <>
                    <RankBadge rank={h.previous_rank} size="sm" showIcon={false} />
                    <span>→</span>
                  </>
                )}
                <RankBadge rank={h.new_rank} size="sm" showIcon={false} />
                {h.reason && <span className="text-gray-500">{h.reason}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
