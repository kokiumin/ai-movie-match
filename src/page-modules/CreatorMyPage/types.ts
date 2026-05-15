// CreatorMyPage 内で共有するローカル型 / 定数
//
// 現状は MOCK プロフィールをそのまま使う。将来的には useProfile フック経由で
// 実データに差し替える前提で、Props 契約だけ安定させておく。

export interface MockCreatorProfile {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  tools: string[];
  rating: number;
  reviews: number;
  deliveries: number;
  minPrice: number;
  maxPrice: number;
  badge: string;
  color: string;
  monthlyRevenue: number;
  activeProjects: number;
}

export interface ActiveProject {
  client: string;
  type: string;
  price: string;
  deadline: string;
  progress: number;
}

export interface PayoutRecord {
  client: string;
  type: string;
  gross: number;
  net: number;
  date: string;
  status: string;
}

// Overview タブの「進行中」「売上履歴」は後で実データに置換予定。
// 切り出しのタイミングでは既存 App.tsx のハードコード値をそのまま移す。
export const MOCK_ACTIVE_PROJECTS: ActiveProject[] = [
  { client: "株式会社グリーンテック", type: "採用動画", price: "¥150,000", deadline: "3日後", progress: 65 },
  { client: "ミライ不動産", type: "会社紹介動画", price: "¥80,000", deadline: "8日後", progress: 30 },
  { client: "ハナビ食品", type: "商品PR動画", price: "¥120,000", deadline: "15日後", progress: 10 },
];

export const MOCK_PAYOUT_HISTORY: PayoutRecord[] = [
  { client: "佐藤歯科クリニック", type: "SNS広告動画", gross: 60000, net: 54000, date: "3/28", status: "振込済み" },
  { client: "丸山電機", type: "採用動画", gross: 140000, net: 126000, date: "3/15", status: "振込済み" },
  { client: "ひかり保育園", type: "紹介動画", gross: 70000, net: 63000, date: "3/5", status: "振込済み" },
];

// 画面に表示するデモプロフィール (App.tsx の creators[0] 相当)
export const DEMO_CREATOR: MockCreatorProfile = {
  id: 1,
  name: "田中 蒼",
  handle: "@aosora_gen",
  avatar: "田",
  bio: "生成AI専門クリエイター。中小企業の採用・PR動画を低コストで高速制作します。",
  tools: ["Runway", "Sora", "CapCut"],
  rating: 4.9,
  reviews: 38,
  deliveries: 52,
  minPrice: 50000,
  maxPrice: 150000,
  badge: "認定",
  color: "bg-blue-600",
  monthlyRevenue: 420000,
  activeProjects: 3,
};
