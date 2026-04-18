import { MOCK_ACTIVE_PROJECTS } from "../types";

/**
 * 案件タブ: 進行中の案件の進捗一覧。
 * 将来は useProjects({ creatorId, status: 'in_progress' }) に差し替え。
 */
export function Projects() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
        <h2 className="font-serif-jp text-base font-semibold text-gray-900 tracking-tight">
          進行中の案件
        </h2>
      </div>
      <div className="p-5 space-y-3">
        {MOCK_ACTIVE_PROJECTS.map((p, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{p.client}</p>
                <p className="text-xs text-gray-400">
                  {p.type} · {p.price}
                </p>
              </div>
              <span className="text-xs text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full font-medium">
                締切 {p.deadline}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 font-medium">
                {p.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
