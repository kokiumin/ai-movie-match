import { Search, Heart, Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

type Role = "client" | "creator";

interface FiverHeaderProps {
  user: AuthUser | null;
  profile: Profile | null;
  isDemo: boolean;
  role: Role;
  onRoleChange: (role: Role) => void;
  onLogoClick: () => void;
  onShowLogin: () => void;
  onSignOut: () => Promise<void>;
  onShowLegal: (page: "terms" | "privacy") => void;
  unreadNotifications: number;
  onCategoryClick?: (category: string) => void;
  onPostProject?: () => void;
}

const CATEGORIES = [
  "採用動画", "会社紹介", "SNS広告", "商品PR",
  "ブランド動画", "研修・教育", "IR・株主向け", "イベント",
];

export function FiverHeader({
  user, profile, isDemo, role, onRoleChange,
  onLogoClick, onShowLogin, onSignOut, onShowLegal,
  unreadNotifications, onCategoryClick, onPostProject,
}: FiverHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      {/* Main header bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center gap-4">
          {/* Logo */}
          <button onClick={onLogoClick} className="flex items-center gap-2 flex-shrink-0">
            <div className="text-xl font-black text-gray-900 tracking-tight">
              <span className="text-brand-500">ai</span>
              <span>-movie-match</span>
              <span className="text-brand-500">.</span>
            </div>
          </button>

          {/* Wide search */}
          <div className="flex-1 max-w-2xl relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="どんな動画制作を探す？"
              className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Right navigation */}
          <nav className="hidden md:flex items-center gap-5 flex-shrink-0">
            {role === "client" && onPostProject && (
              <button
                onClick={onPostProject}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                案件を投稿
              </button>
            )}

            <button
              onClick={() => onRoleChange(role === "client" ? "creator" : "client")}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              {role === "client" ? "クリエイターになる" : "発注者に戻る"}
            </button>

            <button className="text-gray-600 hover:text-gray-900 p-1.5 transition-colors relative">
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <button className="text-gray-600 hover:text-gray-900 p-1.5 transition-colors">
              <Heart size={18} />
            </button>

            {user || isDemo ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                    {profile?.display_name?.[0] ?? "U"}
                  </div>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{profile?.display_name ?? "ゲスト"}</p>
                      <p className="text-xs text-gray-400">{user?.email ?? (isDemo ? "デモモード" : "")}</p>
                    </div>
                    {!isDemo && user && (
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                        onClick={async () => { await onSignOut(); setMenuOpen(false); }}
                      >
                        ログアウト
                      </button>
                    )}
                    {(isDemo || !user) && (
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-brand-600 font-semibold hover:bg-gray-50"
                        onClick={() => { onShowLogin(); setMenuOpen(false); }}
                      >
                        ログイン / 新規登録
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={onShowLogin}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                >
                  ログイン
                </button>
                <button
                  onClick={onShowLogin}
                  className="text-sm font-semibold text-brand-600 border border-brand-600 rounded-md px-4 py-1.5 hover:bg-brand-50 transition-colors"
                >
                  新規登録
                </button>
              </>
            )}
          </nav>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Category bar */}
      <div className="max-w-[1400px] mx-auto px-5 h-11 flex items-center overflow-x-auto">
        <div className="flex items-center gap-6 whitespace-nowrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick?.(cat)}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export { CATEGORIES };
