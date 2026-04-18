// ============================================================
// クリエイター段階的手数料システム — ユーティリティ
// ============================================================
import type { CreatorRank } from '@/types/database'

// 各ランクの基準と手数料率
export interface RankConfig {
  rank: CreatorRank
  label: string
  feeRate: number // 0.0 - 1.0
  // 昇格条件（いずれか満たせば該当ランク以上）
  minCompletedOrders?: number
  minEarnings30d?: number
  minEarnings90d?: number
  color: string // Tailwindクラス
  bgColor: string
  description: string
}

export const RANK_CONFIG: Record<CreatorRank, RankConfig> = {
  starter: {
    rank: 'starter',
    label: 'スターター',
    feeRate: 0.20,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100 border-gray-200',
    description: 'これから実績を積み上げるクリエイター',
  },
  regular: {
    rank: 'regular',
    label: 'レギュラー',
    feeRate: 0.15,
    minCompletedOrders: 3,
    minEarnings30d: 100_000,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    description: '安定した実績を持つクリエイター',
  },
  pro: {
    rank: 'pro',
    label: 'プロ',
    feeRate: 0.10,
    minEarnings90d: 900_000,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    description: '高い信頼と実績を築いたクリエイター',
  },
  elite: {
    rank: 'elite',
    label: 'エリート',
    feeRate: 0.07,
    minEarnings30d: 800_000,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    description: 'トップクラスの稼働と成果を維持するクリエイター',
  },
}

// リピートクライアントの手数料割引率（50% OFF）
export const REPEAT_CLIENT_DISCOUNT = 0.5

export interface CreatorStats {
  total_earnings_30d: number
  total_earnings_90d: number
  completed_orders: number
}

/**
 * ランク判定: ElITE → PRO → REGULAR → STARTER の順で評価
 * 上位ランクの条件を満たせばそのランク
 */
export function determineRank(stats: CreatorStats): CreatorRank {
  // Elite: 30日800k以上
  if (stats.total_earnings_30d >= (RANK_CONFIG.elite.minEarnings30d ?? Infinity)) {
    return 'elite'
  }
  // Pro: 90日900k以上
  if (stats.total_earnings_90d >= (RANK_CONFIG.pro.minEarnings90d ?? Infinity)) {
    return 'pro'
  }
  // Regular: 3件以上 OR 30日100k以上
  if (
    stats.completed_orders >= (RANK_CONFIG.regular.minCompletedOrders ?? Infinity) ||
    stats.total_earnings_30d >= (RANK_CONFIG.regular.minEarnings30d ?? Infinity)
  ) {
    return 'regular'
  }
  return 'starter'
}

export interface FeeBreakdown {
  rate: number // 適用手数料率
  baseRate: number // ランク固有の手数料率（割引前）
  isRepeat: boolean
  feeAmount: number // 手数料金額
  creatorPayout: number // クリエイター受取額
}

/**
 * 手数料計算: amount に対してランク + リピート割引を適用
 */
export function calculateFee(
  amount: number,
  rank: CreatorRank,
  isRepeat: boolean = false,
): FeeBreakdown {
  const baseRate = RANK_CONFIG[rank].feeRate
  const rate = isRepeat ? baseRate * (1 - REPEAT_CLIENT_DISCOUNT) : baseRate
  const feeAmount = Math.round(amount * rate)
  return {
    rate,
    baseRate,
    isRepeat,
    feeAmount,
    creatorPayout: amount - feeAmount,
  }
}

export interface RankProgress {
  current: CreatorRank
  next: CreatorRank | null
  requirements: Array<{
    label: string
    current: number
    target: number
    unit: 'yen' | 'count'
    met: boolean
  }>
}

/**
 * 次のランクまでの進捗情報
 */
export function getProgressToNextRank(stats: CreatorStats): RankProgress {
  const current = determineRank(stats)
  const order: CreatorRank[] = ['starter', 'regular', 'pro', 'elite']
  const nextIdx = order.indexOf(current) + 1
  const next = nextIdx < order.length ? order[nextIdx] : null

  if (!next) {
    return { current, next: null, requirements: [] }
  }

  const cfg = RANK_CONFIG[next]
  const requirements: RankProgress['requirements'] = []

  if (cfg.minCompletedOrders != null) {
    requirements.push({
      label: '完了案件数',
      current: stats.completed_orders,
      target: cfg.minCompletedOrders,
      unit: 'count',
      met: stats.completed_orders >= cfg.minCompletedOrders,
    })
  }
  if (cfg.minEarnings30d != null) {
    requirements.push({
      label: '30日間の売上',
      current: stats.total_earnings_30d,
      target: cfg.minEarnings30d,
      unit: 'yen',
      met: stats.total_earnings_30d >= cfg.minEarnings30d,
    })
  }
  if (cfg.minEarnings90d != null) {
    requirements.push({
      label: '90日間の売上',
      current: stats.total_earnings_90d,
      target: cfg.minEarnings90d,
      unit: 'yen',
      met: stats.total_earnings_90d >= cfg.minEarnings90d,
    })
  }

  return { current, next, requirements }
}

export function getRankMeta(rank: CreatorRank): RankConfig {
  return RANK_CONFIG[rank]
}

export function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(rate < 0.1 ? 1 : 0)}%`
}
