import { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  CreditCard,
  ExternalLink,
  Lock,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EarningsChart } from "../EarningsChart";
import { MOCK_PAYOUT_HISTORY } from "../types";

/**
 * 売上タブ: 売上推移 + Stripe Connect + 振込履歴。
 */
export function Earnings() {
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);

  const handleStripeConnect = () => {
    setStripeLoading(true);
    setTimeout(() => {
      setStripeLoading(false);
      setStripeConnected(true);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      {/* 売上推移チャート */}
      <EarningsChart />

      {/* Stripe Connect */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <h2 className="font-serif-jp text-base font-semibold text-gray-900 tracking-tight">
            お支払い・口座設定
          </h2>
          {stripeConnected && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle size={12} /> Stripe 接続済み
            </span>
          )}
        </div>
        <div className="p-5">
          {stripeConnected ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Stripe Connect 接続済み
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    売上は案件完了・クライアント承認後、翌月末に自動振り込まれます。
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    接続口座
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-1.5">
                    <Building size={13} className="text-gray-500" /> ＊＊＊＊ 1234
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    次回振込予定
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">2026年4月30日</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">振込予定額</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>売上合計</span>
                    <span className="font-semibold">¥420,000</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>プラットフォーム手数料</span>
                    <span>▲ ¥42,000</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-gray-900 font-bold">
                    <span>お振込額</span>
                    <span>¥378,000</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-gray-300 font-medium gap-1.5"
              >
                <ExternalLink size={12} /> Stripeダッシュボードで詳細確認
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">口座が未登録です</p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    案件が成立しても、Stripe Connect への口座登録が完了するまで売上の受け取りができません。
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                {[
                  "「口座を登録する」ボタンをクリックし、Stripeの登録画面へ移動します",
                  "氏名・生年月日・銀行口座情報を入力します（Stripe上で安全に管理）",
                  "登録完了後、案件完了・クライアント承認のたびに自動振り込みが行われます",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              <Button
                className="bg-blue-700 hover:bg-blue-800 font-semibold gap-2 h-10"
                onClick={handleStripeConnect}
                disabled={stripeLoading}
              >
                <CreditCard size={16} />
                {stripeLoading ? "Stripeに接続中..." : "口座を登録する（Stripe Connect）"}
                <ExternalLink size={13} className="opacity-70" />
              </Button>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Lock size={11} /> 銀行情報はStripeが直接管理します。当プラットフォームはカード・口座番号を保持しません。
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 振込履歴 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
          <h2 className="font-serif-jp text-base font-semibold text-gray-900 tracking-tight">
            売上履歴
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_PAYOUT_HISTORY.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-gray-800">{r.client}</p>
                <p className="text-xs text-gray-400">
                  {r.type} · {r.date}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  ¥{r.net.toLocaleString()}
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    （手数料控除後）
                  </span>
                </p>
                <span className="text-xs text-emerald-600 font-semibold">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
