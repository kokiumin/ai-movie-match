import { useRef, useState } from "react";
import { Pencil, Star, Camera, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RankDashboard } from "../RankDashboard";
import { BadgeList } from "../BadgeList";
import { ScoreChart } from "../ScoreChart";
import { ScoreCircle } from "@/components/creators/ScoreCircle";
import { BadgeShowcase } from "@/components/creators/BadgeShowcase";
import { NextBadgeHint } from "@/components/creators/NextBadgeHint";
import { useCreatorScore } from "@/hooks/useCreatorScore";
import { DEMO_CREATOR } from "../types";

function BadgeEl({ type }: { type: string }) {
  if (type === "TOP")
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-sm tracking-wide">
        <Award size={9} /> TOP
      </span>
    );
  if (type === "認定")
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-blue-700 text-white px-1.5 py-0.5 rounded-sm tracking-wide">
        <Shield size={9} /> 認定
      </span>
    );
  return null;
}

interface OverviewTabProps {
  creatorId: string;
}

/**
 * 概要タブ。ランクダッシュボードを最上部に配置 (ログイン直後に見える位置)。
 */
export function Overview({ creatorId }: OverviewTabProps) {
  const me = DEMO_CREATOR;
  const { info: scoreInfo } = useCreatorScore(creatorId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: me.name,
    bio: me.bio,
    tools: me.tools.join("、"),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-4">
      {/* ① スコア + ランク (最上部・最重要) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row items-center gap-5 border-b border-gray-100">
          <ScoreCircle
            score={scoreInfo?.score ?? 0}
            completedOrders={scoreInfo?.completed_orders ?? 0}
            size="lg"
          />
          <div className="flex-1 w-full">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              保有バッジ
            </div>
            <BadgeShowcase creatorId={creatorId} size="sm" />
            {scoreInfo && (
              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                <div>
                  <div className="text-gray-400">平均評価</div>
                  <div className="font-bold text-gray-900">
                    ★ {scoreInfo.avg_rating.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">納期遵守</div>
                  <div className="font-bold text-gray-900">
                    {Math.round(scoreInfo.on_time_delivery_rate * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">リピート</div>
                  <div className="font-bold text-gray-900">
                    {Math.round(scoreInfo.repeat_client_rate * 100)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {scoreInfo && (
        <NextBadgeHint
          creatorId={creatorId}
          stats={{
            completed_orders: scoreInfo.completed_orders,
            avg_rating: scoreInfo.avg_rating,
            on_time_delivery_rate: scoreInfo.on_time_delivery_rate,
          }}
        />
      )}

      <ScoreChart creatorId={creatorId} />

      {/* ② ランクダッシュボード */}
      <RankDashboard creatorId={creatorId} />

      {/* ② プロフィール */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <h2 className="font-serif-jp text-base font-semibold text-gray-900 tracking-tight leading-snug">
            プロフィール
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-gray-300 gap-1.5 h-7 font-medium"
            onClick={() => setEditProfile((v) => !v)}
          >
            <Pencil size={12} />
            {editProfile ? "閉じる" : "編集"}
          </Button>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 relative group">
              <div
                className={`w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 shadow-sm flex items-center justify-center ${
                  !photo ? me.color : ""
                }`}
              >
                {photo ? (
                  <img src={photo} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">{me.avatar}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera size={18} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center shadow-md border-2 border-white"
              >
                <Camera size={11} className="text-white" />
              </button>
            </div>

            {editProfile ? (
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    表示名
                  </Label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                    className="border-gray-300 h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    自己紹介
                  </Label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                    className="border-gray-300 text-sm min-h-[70px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    使用ツール（読点区切り）
                  </Label>
                  <Input
                    value={profileData.tools}
                    onChange={(e) => setProfileData((p) => ({ ...p, tools: e.target.value }))}
                    className="border-gray-300 h-8 text-sm"
                  />
                </div>
                <Button
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-800 font-semibold h-8 text-xs"
                  onClick={() => setEditProfile(false)}
                >
                  保存する
                </Button>
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-serif-jp text-xl font-semibold text-gray-900 tracking-tight">
                    {profileData.name}
                  </h2>
                  <BadgeEl type={me.badge} />
                </div>
                <p className="text-sm text-gray-400 font-mono mb-2">{me.handle}</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-sm font-bold text-gray-800">
                    <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
                    {me.rating}
                  </span>
                  <span className="text-xs text-gray-400">レビュー {me.reviews}件</span>
                  <span className="text-xs text-gray-400">納品 {me.deliveries}件</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{profileData.bio}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {profileData.tools.split("、").map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-sm"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ③ 実績サマリー */}
          <div className="grid grid-cols-4 gap-3 text-center mt-5 pt-5 border-t border-gray-100">
            {[
              { label: "今月の売上", value: `¥${(me.monthlyRevenue / 10000).toFixed(0)}万` },
              { label: "納品実績", value: `${me.deliveries}件` },
              { label: "進行中", value: `${me.activeProjects}件` },
              { label: "総合評価", value: `${me.rating}` },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1 font-serif-jp">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ④ バッジ (プレースホルダ) */}
      <BadgeList />
    </div>
  );
}
