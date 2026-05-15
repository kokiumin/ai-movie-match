import { useState } from "react";
import { User, Briefcase, CircleDollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Overview } from "./tabs/Overview";
import { Projects } from "./tabs/Projects";
import { Earnings } from "./tabs/Earnings";

/**
 * CreatorMyPage (クリエイター マイページ)
 *
 * App.tsx から `<CreatorMyPage />` の1行で呼び出すページコンポーネント。
 * タブ構造: Overview / Projects / Earnings
 *
 * Overview タブの最上部にランクダッシュボードを配置し、
 * ログイン直後に現在のランク・手数料率・次ランクまでの進捗が
 * 即座に視認できる設計。
 */

type TabId = "overview" | "projects" | "earnings";

const TABS: Array<{ id: TabId; label: string; icon: typeof User }> = [
  { id: "overview", label: "概要", icon: User },
  { id: "projects", label: "案件", icon: Briefcase },
  { id: "earnings", label: "売上", icon: CircleDollarSign },
];

export function CreatorMyPage() {
  const { user } = useAuth();
  const creatorId = user?.id ?? "demo-creator";
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="max-w-3xl mx-auto">
      {/* タブバー */}
      <div className="bg-white border-b border-gray-200 mb-4 -mx-4 md:mx-0 md:rounded-lg md:border md:shadow-sm">
        <div className="flex overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-colors font-semibold ${
                  active
                    ? "border-blue-700 text-blue-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* タブ本体 */}
      {activeTab === "overview" && <Overview creatorId={creatorId} />}
      {activeTab === "projects" && <Projects />}
      {activeTab === "earnings" && <Earnings />}
    </div>
  );
}
