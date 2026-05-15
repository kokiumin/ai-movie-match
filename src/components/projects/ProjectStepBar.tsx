import { CheckCircle2 } from "lucide-react";

type ProjectStep = "hearing" | "first_draft" | "revision" | "final_delivery" | "completed";

const STEPS: { id: ProjectStep; label: string; desc: string }[] = [
  { id: "hearing", label: "ヒアリング", desc: "詳細要件の確認" },
  { id: "first_draft", label: "初稿提出", desc: "クリエイターが初稿を納品" },
  { id: "revision", label: "修正対応", desc: "発注者の修正依頼に対応" },
  { id: "final_delivery", label: "最終納品", desc: "最終データの納品" },
  { id: "completed", label: "検収完了", desc: "案件完了" },
];

interface ProjectStepBarProps {
  currentStep: ProjectStep;
  revisionCount?: number;
  maxRevisions?: number;
}

/**
 * 案件単位トークルームの上部に表示する進捗バー。
 * 仕様: ステップ自動更新は project_messages の action_type からトリガで反映される。
 */
export function ProjectStepBar({ currentStep, revisionCount = 0, maxRevisions = 2 }: ProjectStepBarProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        {STEPS.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-brand-600 text-white ring-4 ring-brand-100"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {done ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 text-center ${
                    active ? "text-brand-700" : done ? "text-emerald-700" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 -mt-4 ${done ? "bg-emerald-500" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between text-xs">
        <span className="text-gray-700">
          <strong>現在: {STEPS[currentIdx]?.label ?? "—"}</strong> · {STEPS[currentIdx]?.desc}
        </span>
        {currentStep === "revision" && (
          <span
            className={`font-bold ${
              revisionCount >= maxRevisions ? "text-red-600" : "text-amber-600"
            }`}
          >
            修正 {revisionCount} / {maxRevisions === 99 ? "無制限" : `${maxRevisions} 回`}
            {revisionCount >= maxRevisions && maxRevisions !== 99 && " (上限到達)"}
          </span>
        )}
      </div>
    </div>
  );
}
