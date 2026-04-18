import { ChevronLeft } from "lucide-react";
import { SCORE_WEIGHTS, SCORE_MAX } from "@/lib/score";

interface HowScoringWorksPageProps {
  onBack?: () => void;
}

/**
 * スコア計算ロジックの完全公開ページ。
 * 「運営が恣意的に付与しているのではなく完全自動・公開ロジック」
 * であることを明示する。
 */
export function HowScoringWorksPage({ onBack }: HowScoringWorksPageProps) {
  const rows = [
    {
      factor: "完了件数",
      max: SCORE_WEIGHTS.COMPLETED_MAX_COUNT * SCORE_WEIGHTS.COMPLETED_PER_ORDER,
      formula: `件数 × ${SCORE_WEIGHTS.COMPLETED_PER_ORDER}点（上限${SCORE_WEIGHTS.COMPLETED_MAX_COUNT}件分）`,
      note: "成約条件を満たした完了案件のみカウント",
    },
    {
      factor: "平均評価",
      max: 300,
      formula: `平均評価（1.0〜5.0） × ${SCORE_WEIGHTS.RATING_MULTIPLIER}`,
      note: "クライアントからのレビュー平均",
    },
    {
      factor: "納期遵守率",
      max: 200,
      formula: `遵守率（0〜1） × ${SCORE_WEIGHTS.ON_TIME_MULTIPLIER}`,
      note: "完了日が納期以内だった案件の比率",
    },
    {
      factor: "リピート率",
      max: 200,
      formula: `リピート率（0〜1） × ${SCORE_WEIGHTS.REPEAT_MULTIPLIER}`,
      note: "2回以上発注されたクライアント ÷ 総クライアント数",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-blue-700 hover:underline mb-5 flex items-center gap-1 font-medium"
        >
          <ChevronLeft size={14} /> 戻る
        </button>
      )}

      <h1 className="font-serif-jp text-3xl font-black text-gray-900 mb-2">
        スコアはこう決まります
      </h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-8">
        AIムービーマッチのクリエイタースコアは、<strong>完全に自動・公開ロジック</strong>で算出されます。
        運営が恣意的に付与することはありません。以下のルールに従って毎日バッチで再計算されます。
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8">
        <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
          最大点
        </div>
        <div className="text-4xl font-black text-gray-900">
          {SCORE_MAX}
          <span className="text-base text-gray-500 font-semibold ml-1">点満点</span>
        </div>
      </div>

      <h2 className="font-serif-jp text-xl font-bold text-gray-900 mb-3">
        計算式
      </h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2 font-bold text-gray-700">要素</th>
              <th className="text-right px-4 py-2 font-bold text-gray-700">最大点</th>
              <th className="text-left px-4 py-2 font-bold text-gray-700">計算式</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.factor} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 font-semibold text-gray-900">{r.factor}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">{r.max}点</td>
                <td className="px-4 py-3 text-gray-600">
                  <code className="text-xs bg-gray-50 px-1.5 py-0.5 rounded">{r.formula}</code>
                  <div className="text-xs text-gray-400 mt-1">{r.note}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-serif-jp text-xl font-bold text-gray-900 mb-3">
        集計対象となる「完了案件」の定義
      </h2>
      <ul className="space-y-2 text-sm text-gray-700 mb-8 pl-5 list-disc">
        <li>案件ステータスが <code>completed</code> であること</li>
        <li>クリエイターへの送金 (payout) が完了していること</li>
        <li>クライアントの検収、または72時間の自動承認が成立していること</li>
        <li>キャンセル・返金された案件は対象外</li>
      </ul>

      <h2 className="font-serif-jp text-xl font-bold text-gray-900 mb-3">
        再計算のタイミング
      </h2>
      <p className="text-sm text-gray-700 mb-8 leading-relaxed">
        毎日 JST 02:30 にバッチが稼働し、全クリエイターのスコアを再計算します。
        実行ログは <code>batch_execution_logs</code> に記録され、冪等性が担保されています。
      </p>

      <h2 className="font-serif-jp text-xl font-bold text-gray-900 mb-3">
        ローンチ期間の暫定措置
      </h2>
      <ul className="space-y-2 text-sm text-gray-700 mb-8 pl-5 list-disc">
        <li>完了件数が5件未満のクリエイターは「新規クリエイター」タグを表示し、スコアは非表示</li>
        <li>ローンチから3ヶ月間は、全クリエイターが <strong>Launch Period Creator</strong> バッジを保有</li>
        <li>3ヶ月経過後に通常のスコアリングへ移行</li>
      </ul>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600">
        <p>
          <strong>透明性について:</strong> このロジックは GitHub 上で公開されており、
          Supabase Edge Function <code>score-update</code> が毎日実行しています。
          計算方法・バッチコード・DBスキーマ、すべて検証可能です。
        </p>
      </div>
    </div>
  );
}
