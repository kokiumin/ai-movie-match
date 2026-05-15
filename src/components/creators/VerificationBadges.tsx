import { Mail, Phone, FileCheck, Wallet, ShieldCheck } from "lucide-react";

interface VerificationBadgesProps {
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  bankAccountVerified: boolean;
  compact?: boolean;
}

/**
 * 4種の本人確認状態をバッジで表示。
 * 全完了で「完全認証済みクリエイター」表示。
 */
export function VerificationBadges({
  emailVerified,
  phoneVerified,
  identityVerified,
  bankAccountVerified,
  compact = false,
}: VerificationBadgesProps) {
  const items = [
    { label: "メール", icon: Mail, ok: emailVerified },
    { label: "電話", icon: Phone, ok: phoneVerified },
    { label: "本人確認", icon: FileCheck, ok: identityVerified },
    { label: "報酬口座", icon: Wallet, ok: bankAccountVerified },
  ];
  const allOk = items.every((i) => i.ok);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {allOk ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            <ShieldCheck size={11} /> 完全認証済み
          </span>
        ) : (
          items
            .filter((i) => i.ok)
            .map(({ label, icon: Icon }) => (
              <Icon key={label} size={12} className="text-emerald-600" />
            ))
        )}
      </div>
    );
  }

  return (
    <div>
      {allOk && (
        <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full mb-3">
          <ShieldCheck size={13} /> 完全認証済みクリエイター
        </div>
      )}
      <ul className="space-y-1.5">
        {items.map(({ label, icon: Icon, ok }) => (
          <li
            key={label}
            className={`flex items-center gap-2 text-xs ${ok ? "text-gray-800" : "text-gray-400"}`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center ${ok ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}
            >
              <Icon size={11} />
            </span>
            <span className="font-medium">{label}認証</span>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wider">
              {ok ? "✓ 完了" : "未"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ResponseStatsProps {
  responseRate?: number;  // 0-1
  avgResponseHours?: number;
}

export function ResponseStats({ responseRate, avgResponseHours }: ResponseStatsProps) {
  if (responseRate == null && avgResponseHours == null) return null;
  return (
    <div className="text-xs text-gray-700 space-y-0.5">
      {responseRate != null && (
        <div>
          返信率 <strong className="text-gray-900">{Math.round(responseRate * 100)}%</strong>
        </div>
      )}
      {avgResponseHours != null && (
        <div>
          平均返信 <strong className="text-gray-900">{avgResponseHours.toFixed(1)}時間</strong>
        </div>
      )}
    </div>
  );
}
