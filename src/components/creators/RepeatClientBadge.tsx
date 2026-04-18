import { Repeat } from "lucide-react";

interface RepeatClientBadgeProps {
  transactionCount?: number;
  size?: "sm" | "md";
}

export function RepeatClientBadge({ transactionCount, size = "sm" }: RepeatClientBadgeProps) {
  const sizeCls = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 ${sizeCls}`}
    >
      <Repeat size={size === "sm" ? 11 : 13} />
      リピート
      {transactionCount != null && transactionCount > 1 && (
        <span className="text-emerald-600">×{transactionCount}</span>
      )}
      <span className="ml-1 text-emerald-600">手数料 -50%</span>
    </span>
  );
}
