import { useState, useRef } from "react";
import { useAuth, useDemoRole } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useNotifications } from "@/hooks/useNotifications";
import { useMessages } from "@/hooks/useMessages";
import { useAIHearing } from "@/hooks/useAIHearing";
import { useAIMatching } from "@/hooks/useAIMatching";
import type { CreatorProfile } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search, Star, CheckCircle, Heart, ChevronDown, ChevronRight,
  Play, Send, Bell, User, SlidersHorizontal,
  TrendingUp, Users, Briefcase, CircleDollarSign, Eye,
  MessageSquare, Video, ArrowRight,
  Shield, Clock, Award, Sparkles, Pencil,
  ChevronLeft, Camera, CreditCard, AlertCircle,
  Building, ExternalLink, Lock,
  Zap, DollarSign, X, FileText, MessageCircle,
} from "lucide-react";

type Role = "client" | "creator";

// ─── Data ────────────────────────────────────────────────────────────────────
const VIDEO_CATEGORIES = [
  { id: "all", label: "すべて" },
  { id: "recruit", label: "採用動画" },
  { id: "company", label: "会社紹介" },
  { id: "sns", label: "SNS広告" },
  { id: "product", label: "商品PR" },
  { id: "brand", label: "ブランド動画" },
  { id: "training", label: "研修・説明" },
];

const AI_TOOLS = ["Runway", "Sora", "Kling", "HeyGen", "D-ID", "Midjourney", "CapCut", "After Effects"];

const creators = [
  {
    id: 1, name: "田中 蒼", handle: "@aosora_gen", avatar: "田",
    specialty: ["採用動画", "会社紹介"], tools: ["Runway", "Sora", "CapCut"],
    rating: 4.9, reviews: 38, deliveries: 52,
    minPrice: 50000, maxPrice: 150000,
    badge: "認定", turnaround: "5〜7日",
    bio: "生成AI専門クリエイター。中小企業の採用・PR動画を低コストで高速制作します。",
    color: "bg-blue-600", tags: ["採用動画", "会社紹介"],
    monthlyRevenue: 420000, activeProjects: 3,
  },
  {
    id: 2, name: "鈴木 凛", handle: "@rin_aicinema", avatar: "凛",
    specialty: ["SNS広告", "商品PR"], tools: ["Kling", "HeyGen", "Premiere"],
    rating: 4.7, reviews: 24, deliveries: 31,
    minPrice: 30000, maxPrice: 100000,
    badge: "", turnaround: "3〜5日",
    bio: "SNS向けショート動画が得意。ターゲットに刺さるAI映像を高速納品。",
    color: "bg-emerald-600", tags: ["SNS広告", "商品PR"],
    monthlyRevenue: 180000, activeProjects: 2,
  },
  {
    id: 3, name: "山本 剛", handle: "@gocreate_ai", avatar: "剛",
    specialty: ["採用動画", "研修コンテンツ"], tools: ["Sora", "D-ID", "After Effects"],
    rating: 4.8, reviews: 41, deliveries: 67,
    minPrice: 80000, maxPrice: 200000,
    badge: "認定", turnaround: "7〜10日",
    bio: "元映像ディレクター。AIで単価を下げながら品質を維持。採用動画の実績多数。",
    color: "bg-violet-600", tags: ["採用動画", "研修・説明"],
    monthlyRevenue: 610000, activeProjects: 4,
  },
  {
    id: 4, name: "伊藤 美咲", handle: "@misaki_aifilm", avatar: "美",
    specialty: ["ブランド動画", "会社紹介"], tools: ["Runway", "Midjourney", "Resolve"],
    rating: 4.6, reviews: 17, deliveries: 23,
    minPrice: 100000, maxPrice: 250000,
    badge: "", turnaround: "5〜8日",
    bio: "アート系ビジュアルが強み。ブランドイメージを高める映像表現を得意とする。",
    color: "bg-amber-600", tags: ["ブランド動画", "会社紹介"],
    monthlyRevenue: 320000, activeProjects: 2,
  },
  {
    id: 5, name: "中村 健", handle: "@ken_aigiga", avatar: "健",
    specialty: ["採用動画", "SNS広告", "会社紹介"], tools: ["Kling", "Sora", "Runway"],
    rating: 4.9, reviews: 56, deliveries: 89,
    minPrice: 50000, maxPrice: 180000,
    badge: "TOP", turnaround: "4〜6日",
    bio: "業界最多実績。どんな業種でも対応できる汎用力と圧倒的スピードが強み。",
    color: "bg-rose-600", tags: ["採用動画", "SNS広告", "会社紹介"],
    monthlyRevenue: 780000, activeProjects: 5,
  },
  {
    id: 6, name: "林 奈津子", handle: "@natsu_aiworks", avatar: "奈",
    specialty: ["商品PR", "SNS広告"], tools: ["Kling", "CapCut", "HeyGen"],
    rating: 4.5, reviews: 12, deliveries: 18,
    minPrice: 20000, maxPrice: 80000,
    badge: "", turnaround: "2〜4日",
    bio: "食品・コスメ・アパレルのSNS広告専門。短納期・低価格が強み。",
    color: "bg-pink-600", tags: ["商品PR", "SNS広告"],
    monthlyRevenue: 140000, activeProjects: 1,
  },
];

const projects = [
  {
    id: 1, company: "株式会社グリーンテック", type: "採用動画", budget: "10〜20万円",
    deadline: "2週間", status: "マッチング中", views: 12, proposals: 3,
    description: "新卒採用向けの会社紹介・仕事紹介動画。1〜2分程度。明るく活気のある雰囲気で。",
    industry: "IT・Web", posted: "2日前",
  },
  {
    id: 2, company: "ミライ不動産", type: "会社紹介動画", budget: "5〜10万円",
    deadline: "10日", status: "募集中", views: 28, proposals: 7,
    description: "創業20周年を機に会社紹介動画をリニューアル。地域密着の温かみを表現したい。",
    industry: "不動産", posted: "1日前",
  },
  {
    id: 3, company: "佐藤歯科クリニック", type: "SNS広告動画", budget: "3〜8万円",
    deadline: "1週間", status: "成立済み", views: 45, proposals: 11,
    description: "Instagramリール用の広告動画。清潔感・信頼感が伝わるビジュアルで。30秒以内。",
    industry: "医療・クリニック", posted: "3日前",
  },
  {
    id: 4, company: "ハナビ食品株式会社", type: "商品PR動画", budget: "8〜15万円",
    deadline: "3週間", status: "募集中", views: 19, proposals: 4,
    description: "新商品（冷凍惣菜）のPR動画。食欲をそそるビジュアルと商品の特徴を伝えること。",
    industry: "食品・飲料", posted: "本日",
  },
];

// ─── New Mock Data ───────────────────────────────────────────────────────────
const messageThreads = [
  { id: 1, name: "田中 蒼", avatar: "田", color: "bg-blue-600", lastMessage: "ありがとうございます。明日までに初稿をお送りします。", time: "14:30", unread: 2 },
  { id: 2, name: "鈴木 凛", avatar: "凛", color: "bg-emerald-600", lastMessage: "見積もりの件、確認しました。", time: "昨日", unread: 0 },
  { id: 3, name: "中村 健", avatar: "健", color: "bg-rose-600", lastMessage: "修正版をアップロードしました。ご確認ください。", time: "3/28", unread: 1 },
];

const chatMessages = [
  { id: 1, sender: "them", text: "採用動画の件、ご依頼ありがとうございます。", time: "10:00" },
  { id: 2, sender: "them", text: "ヒアリングシートをお送りしました。ご記入をお願いできますか？", time: "10:02" },
  { id: 3, sender: "me", text: "ありがとうございます！本日中に記入してお送りします。", time: "11:30" },
  { id: 4, sender: "them", text: "承知しました。確認次第、絵コンテを作成します。", time: "11:45" },
  { id: 5, sender: "me", text: "よろしくお願いします。納期は来週金曜でお願いできますか？", time: "13:00" },
  { id: 6, sender: "them", text: "はい、問題ありません。来週金曜に初稿をお送りします。", time: "13:15" },
  { id: 7, sender: "them", text: "ありがとうございます。明日までに初稿をお送りします。", time: "14:30" },
];

const portfolioItems = [
  { id: 1, title: "IT企業 新卒採用動画", category: "採用動画", views: 1200, color: "from-blue-500 to-blue-700" },
  { id: 2, title: "飲食チェーン Instagram CM", category: "SNS広告", views: 3400, color: "from-emerald-500 to-emerald-700" },
  { id: 3, title: "SaaS製品 プロモーション", category: "商品PR", views: 890, color: "from-violet-500 to-violet-700" },
  { id: 4, title: "建設会社 会社紹介ムービー", category: "会社紹介", views: 2100, color: "from-amber-500 to-amber-700" },
  { id: 5, title: "クリニック SNS広告", category: "SNS広告", views: 5600, color: "from-pink-500 to-pink-700" },
  { id: 6, title: "アパレルブランド PV", category: "ブランド動画", views: 4200, color: "from-rose-500 to-rose-700" },
];

const reviewsData = [
  { id: 1, author: "株式会社グリーンテック", rating: 5, date: "2026/3/20", text: "採用動画を依頼しました。こちらの要望を丁寧にヒアリングしてくださり、期待以上の仕上がりでした。納期も予定より早く助かりました。" },
  { id: 2, author: "ミライ不動産", rating: 4, date: "2026/3/10", text: "会社紹介動画の制作をお願いしました。AIを活用した映像表現が斬新で、社内でも好評です。修正対応も迅速でした。" },
  { id: 3, author: "佐藤歯科クリニック", rating: 5, date: "2026/2/28", text: "Instagram広告動画を作っていただきました。ターゲットに刺さるクリエイティブで、問い合わせが1.5倍に増えました。" },
  { id: 4, author: "丸山電機株式会社", rating: 5, date: "2026/2/15", text: "新卒採用動画を依頼。若手社員の魅力を引き出す構成が素晴らしかったです。応募者数が前年比120%に。" },
];

const notificationsData = [
  { id: 1, type: "proposal", text: "田中蒼さんから見積もりが届きました", time: "30分前", read: false },
  { id: 2, type: "message", text: "鈴木凛さんからメッセージが届きました", time: "1時間前", read: false },
  { id: 3, type: "match", text: "グリーンテック案件が成立しました", time: "3時間前", read: false },
  { id: 4, type: "review", text: "新しいレビューが投稿されました", time: "昨日", read: true },
  { id: 5, type: "system", text: "プロフィールを更新してマッチング率をUPしましょう", time: "2日前", read: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtPrice(n: number) {
  return n >= 10000 ? `${n / 10000}万円` : `${n.toLocaleString()}円`;
}

function BadgeEl({ type }: { type: string }) {
  if (type === "TOP") return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-sm tracking-wide">
      <Award size={9} /> TOP
    </span>
  );
  if (type === "認定") return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-blue-700 text-white px-1.5 py-0.5 rounded-sm tracking-wide">
      <Shield size={9} /> 認定
    </span>
  );
  return null;
}

function StatusChip({ s }: { s: string }) {
  const cls: Record<string, string> = {
    "募集中": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "マッチング中": "bg-blue-50 text-blue-700 border border-blue-200",
    "成立済み": "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cls[s] || ""}`}>{s}</span>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif-jp text-base font-semibold text-gray-900 tracking-tight leading-snug">{children}</h2>
  );
}

function NotificationIcon({ type }: { type: string }) {
  if (type === "proposal") return <FileText size={14} className="text-blue-600" />;
  if (type === "message") return <MessageCircle size={14} className="text-emerald-600" />;
  if (type === "match") return <CheckCircle size={14} className="text-violet-600" />;
  if (type === "review") return <Star size={14} className="text-amber-500" />;
  return <Bell size={14} className="text-gray-400" />;
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-5 py-20 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
              <Video size={22} className="text-white" />
            </div>
            <span className="font-serif-jp text-xl font-semibold tracking-tight">AIムービーマッチ</span>
          </div>
          <h1 className="font-serif-jp text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
            映像クリエイターと企業を、<br />AIでつなぐ
          </h1>
          <p className="text-blue-200 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            AI映像制作に特化したクリエイターマッチングプラットフォーム。<br className="hidden md:block" />
            採用動画・会社紹介・SNS広告を、最短3日・適正価格で。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button className="bg-white text-blue-800 hover:bg-blue-50 font-semibold h-12 px-8 text-base shadow-lg" onClick={onStart}>
              クリエイターを探す <ArrowRight size={16} className="ml-1.5" />
            </Button>
            <Button className="bg-white/20 border border-white/40 text-white hover:bg-white/30 font-semibold h-12 px-8 text-base" onClick={onStart}>
              案件を投稿する
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-serif-jp text-2xl font-bold text-center text-gray-900 mb-10 tracking-tight">選ばれる3つの理由</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Zap, color: "bg-amber-50 text-amber-600", title: "最短3日納品", desc: "AI映像制作に特化したクリエイターだから、従来の1/3の期間で高品質な動画を納品。" },
            { icon: Shield, color: "bg-blue-50 text-blue-600", title: "品質保証", desc: "全クリエイターを審査制で厳選。納品後の修正対応も含めた安心のサポート体制。" },
            { icon: DollarSign, color: "bg-emerald-50 text-emerald-600", title: "適正価格", desc: "AI活用で制作コストを削減。2万円台から利用可能。予算に合わせた柔軟な対応。" },
          ].map(f => (
            <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={22} />
              </div>
              <h3 className="font-serif-jp font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-5 py-12">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: "500+", label: "累計マッチング数", sub: "件" },
              { value: "100+", label: "登録クリエイター", sub: "名" },
              { value: "98%", label: "クライアント満足度", sub: "" },
            ].map(s => (
              <div key={s.label}>
                <p className="font-serif-jp text-4xl md:text-5xl font-bold text-blue-700 tracking-tight">{s.value}<span className="text-lg text-gray-400">{s.sub}</span></p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-serif-jp text-2xl font-bold text-center text-gray-900 mb-10 tracking-tight">ご利用の流れ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: 1, title: "案件を投稿", desc: "動画の種類・予算・納期を入力するだけ。最短1分で投稿完了。", icon: FileText },
            { step: 2, title: "AIマッチング", desc: "案件内容に最適なクリエイターを自動提案。プロ選定サービスも。", icon: Sparkles },
            { step: 3, title: "制作開始", desc: "クリエイターとチャットで打ち合わせ。進捗もリアルタイムで確認。", icon: Video },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl font-bold">{s.step}</span>
              </div>
              <h3 className="font-serif-jp font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <h2 className="font-serif-jp text-2xl md:text-3xl font-bold mb-4 tracking-tight">AI映像制作、始めませんか？</h2>
          <p className="text-blue-200 mb-6">登録無料・最短1分で案件投稿完了</p>
          <Button className="bg-white text-blue-800 hover:bg-blue-50 font-semibold h-12 px-10 text-base shadow-lg" onClick={onStart}>
            無料で始める <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-5">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center shadow-sm">
              <Video size={10} className="text-white" />
            </div>
            <span className="font-serif-jp font-semibold text-gray-600 tracking-tight">AIムービーマッチ</span>
          </div>
          <div className="flex gap-5 font-medium">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">利用規約</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">プライバシーポリシー</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">お問い合わせ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Creator Card ─────────────────────────────────────────────────────────────
function CreatorCard({ c, onClick }: { c: typeof creators[0]; onClick: () => void }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all cursor-pointer relative group" onClick={onClick}>
      <button
        className="absolute top-3 right-3 z-10 text-gray-300 hover:text-red-400 transition-colors"
        onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
      >
        <Heart size={17} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "currentColor"} />
      </button>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-full ${c.color} text-white text-lg font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm`}>
            {c.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-jp font-semibold text-gray-900 text-sm tracking-tight">{c.name}</span>
              <BadgeEl type={c.badge} />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
              <span className="text-xs font-semibold text-gray-700">{c.rating}</span>
              <span className="text-xs text-gray-400">({c.reviews}件)</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 font-normal">{c.bio}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {c.tags.map(t => <span key={t} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-sm font-medium">{t}</span>)}
          {c.tools.slice(0, 2).map(t => <span key={t} className="text-xs bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm">{t}</span>)}
        </div>
        <Separator className="mb-3" />
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">最低価格</span>
            <p className="text-lg font-bold text-gray-900 leading-none mt-0.5">{fmtPrice(c.minPrice)}<span className="text-xs font-normal text-gray-400">〜</span></p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 flex items-center gap-1 justify-end"><Clock size={10} />{c.turnaround}</span>
            <span className="text-xs text-gray-400">納品 {c.deliveries}件</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Filter ───────────────────────────────────────────────────────────
function SidebarFilter({ selectedTools, setSelectedTools, priceRange, setPriceRange }:
  { selectedTools: string[]; setSelectedTools: (t: string[]) => void; priceRange: string; setPriceRange: (v: string) => void }) {
  const [openTool, setOpenTool] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const toggleTool = (t: string) =>
    setSelectedTools(selectedTools.includes(t) ? selectedTools.filter(x => x !== t) : [...selectedTools, t]);

  return (
    <aside className="w-52 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 tracking-wider uppercase"><SlidersHorizontal size={12} />絞り込み</p>
        </div>
        <div className="border-b border-gray-100">
          <button className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 tracking-wide uppercase" onClick={() => setOpenPrice(v => !v)}>
            予算 {openPrice ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
          {openPrice && (
            <div className="px-4 pb-3 space-y-2">
              {["すべて", "〜5万円", "5〜10万円", "10〜20万円", "20万円以上"].map(p => (
                <label key={p} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="price" value={p} checked={priceRange === p} onChange={() => setPriceRange(p)} className="accent-blue-700" />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">{p}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div>
          <button className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 tracking-wide uppercase" onClick={() => setOpenTool(v => !v)}>
            使用ツール {openTool ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
          {openTool && (
            <div className="px-4 pb-3 space-y-2">
              {AI_TOOLS.map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={selectedTools.includes(t)} onChange={() => toggleTool(t)} className="accent-blue-700" />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">{t}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ─── Creator Detail (with tabs) ──────────────────────────────────────────────
function CreatorDetail({ c, onBack }: { c: typeof creators[0]; onBack: () => void }) {
  const [sent, setSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "reviews">("overview");

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="text-sm text-blue-700 hover:underline mb-5 flex items-center gap-1 font-medium">
        <ChevronLeft size={14} /> クリエイター一覧に戻る
      </button>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 rounded-full ${c.color} text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow`}>{c.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif-jp text-xl font-semibold text-gray-900 tracking-tight">{c.name}</h2>
                <BadgeEl type={c.badge} />
              </div>
              <p className="text-sm text-gray-400 mb-1.5 font-mono">{c.handle}</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-sm font-bold text-gray-800">
                  <Star size={14} fill="#f59e0b" stroke="#f59e0b" />{c.rating}
                  <span className="text-gray-400 font-normal text-xs ml-0.5">({c.reviews}件のレビュー)</span>
                </span>
                <span className="text-sm text-gray-400">納品実績 <strong className="text-gray-700">{c.deliveries}件</strong></span>
              </div>
            </div>
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-md px-4 py-2 text-sm text-emerald-700 flex items-center gap-1.5 font-medium">
                <CheckCircle size={15} /> 依頼を送りました
              </div>
            ) : (
              <Button className="bg-blue-700 hover:bg-blue-800 text-sm font-semibold h-9" onClick={() => setSent(true)}>
                見積もりを依頼する
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-0">
            {([
              { id: "overview" as const, label: "概要" },
              { id: "portfolio" as const, label: "ポートフォリオ" },
              { id: "reviews" as const, label: `レビュー (${c.reviews})` },
            ]).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-700 text-blue-700" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="p-6 grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-5">
              <div>
                <SectionHeading>自己紹介</SectionHeading>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{c.bio}</p>
              </div>
              <Separator />
              <div>
                <SectionHeading>対応カテゴリ</SectionHeading>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {c.tags.map(t => <span key={t} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-sm font-medium">{t}</span>)}
                </div>
              </div>
              <Separator />
              <div>
                <SectionHeading>使用AIツール</SectionHeading>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {c.tools.map(t => <span key={t} className="text-xs bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-sm flex items-center gap-1"><Sparkles size={10} className="text-blue-500" />{t}</span>)}
                </div>
              </div>
              <Separator />
              <div>
                <SectionHeading>制作実績</SectionHeading>
                <div className="space-y-2 mt-2">
                  {["採用動画 × 製造業（150,000円・7日納品）", "会社紹介 × IT企業（80,000円・5日納品）", "SNS広告 × 飲食業（50,000円・3日納品）"].map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Play size={11} className="text-blue-600 flex-shrink-0" />{p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">最低価格</p>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">{fmtPrice(c.minPrice)}<span className="text-sm font-normal text-gray-400">〜</span></p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={11} />標準納期</span>
                    <span className="text-xs font-semibold text-gray-800">{c.turnaround}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle size={11} />納品実績</span>
                    <span className="text-xs font-semibold text-gray-800">{c.deliveries}件</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-sm font-semibold h-9" onClick={() => setSent(true)}>
                  見積もりを依頼する
                </Button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                <p className="font-semibold mb-1 flex items-center gap-1 text-slate-700"><Shield size={11} />プロ選定サービス</p>
                <p className="leading-relaxed">専任スタッフがご要件をヒアリングし、最適なクリエイターをご提案します（¥30,000〜）</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {portfolioItems.map(item => (
                <div key={item.id} className="group cursor-pointer">
                  <div className={`aspect-video bg-gradient-to-br ${item.color} rounded-lg relative overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Play size={20} className="text-gray-800 ml-0.5" />
                      </div>
                    </div>
                    <Video size={32} className="text-white/30" />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-sm font-medium">{item.category}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={10} />{item.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="p-6">
            {/* Rating Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 font-serif-jp">{c.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={14} fill={i <= Math.round(c.rating) ? "#f59e0b" : "none"} stroke={i <= Math.round(c.rating) ? "#f59e0b" : "#d1d5db"} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{c.reviews}件のレビュー</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = star === 5 ? Math.round(c.reviews * 0.7) : star === 4 ? Math.round(c.reviews * 0.2) : star === 3 ? Math.round(c.reviews * 0.08) : 0;
                    const pct = c.reviews > 0 ? (count / c.reviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-4 text-right">{star}</span>
                        <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{count}件</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Review List */}
            <div className="space-y-4">
              {reviewsData.map(review => (
                <div key={review.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {review.author[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{review.author}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={12} fill={i <= review.rating ? "#f59e0b" : "none"} stroke={i <= review.rating ? "#f59e0b" : "#d1d5db"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── [Client] クリエイターを探す ──────────────────────────────────────────────
function ClientCreatorsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("すべて");
  const [sortBy, setSortBy] = useState("おすすめ");
  const [selected, setSelected] = useState<typeof creators[0] | null>(null);

  if (selected) return <CreatorDetail c={selected} onBack={() => setSelected(null)} />;

  const catMap: Record<string, string> = { recruit: "採用動画", company: "会社紹介", sns: "SNS広告", product: "商品PR", brand: "ブランド動画", training: "研修・説明" };
  const filtered = creators.filter(c => {
    const matchCat = category === "all" || c.tags.some(t => t === catMap[category]);
    const matchQ = query === "" || c.name.includes(query) || c.tags.some(t => t.includes(query)) || c.tools.some(t => t.toLowerCase().includes(query.toLowerCase()));
    const matchTools = selectedTools.length === 0 || selectedTools.some(t => c.tools.includes(t));
    const matchPrice = priceRange === "すべて" ||
      (priceRange === "〜5万円" && c.minPrice <= 50000) ||
      (priceRange === "5〜10万円" && c.minPrice >= 50000 && c.minPrice <= 100000) ||
      (priceRange === "10〜20万円" && c.minPrice >= 100000 && c.minPrice <= 200000) ||
      (priceRange === "20万円以上" && c.minPrice >= 200000);
    return matchCat && matchQ && matchTools && matchPrice;
  });

  return (
    <div>
      <div className="bg-white border-b border-gray-200 mb-5">
        <div className="flex overflow-x-auto">
          {VIDEO_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors font-medium ${category === cat.id ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-5">
        <SidebarFilter selectedTools={selectedTools} setSelectedTools={setSelectedTools} priceRange={priceRange} setPriceRange={setPriceRange} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="クリエイター名・ツール名で検索" className="pl-9 bg-white border-gray-300 text-sm h-9" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 text-xs border-gray-300 bg-white h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["おすすめ", "評価が高い", "価格が安い", "実績が多い"].map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-400 mb-3 font-medium">{filtered.length}件のクリエイター</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(c => <CreatorCard key={c.id} c={c} onClick={() => setSelected(c)} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Search size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">条件に合うクリエイターが見つかりませんでした</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── [Client] 案件投稿 ────────────────────────────────────────────────────────
function ClientPostProject({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ company: "", industry: "", type: "", budget: "", deadline: "", description: "", style: "", proSelect: true });
  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const aiHearing = useAIHearing();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-0 mb-8">
        {[1, 2, 3, 4].map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${step >= s ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-500"}`}>{s}</div>
            {i < 3 && <div className={`h-0.5 flex-1 mx-1 transition-colors ${step > s ? "bg-blue-700" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 -mt-6 mb-6 px-0.5 font-medium">
        <span className={step >= 1 ? "text-blue-700" : ""}>会社情報</span>
        <span className={step >= 2 ? "text-blue-700" : ""}>制作内容</span>
        <span className={step >= 3 ? "text-blue-700" : ""}>詳細</span>
        <span className={step >= 4 ? "text-blue-700" : ""}>AIヒアリング</span>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {step === 1 && (
          <div className="p-6 space-y-4">
            <SectionHeading>会社情報の入力</SectionHeading>
            <Separator className="mt-2" />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">会社名 <span className="text-red-500">*</span></Label>
              <Input placeholder="例：株式会社〇〇" value={form.company} onChange={e => upd("company", e.target.value)} className="border-gray-300 h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">業種 <span className="text-red-500">*</span></Label>
              <Select onValueChange={v => upd("industry", v)}>
                <SelectTrigger className="border-gray-300 h-9"><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {["IT・Web", "製造業", "建設・不動産", "医療・介護", "飲食・食品", "小売・EC", "士業・コンサル", "その他"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setStep(2)} disabled={!form.company || !form.industry} className="bg-blue-700 hover:bg-blue-800 font-semibold h-9">次へ</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <SectionHeading>制作内容の入力</SectionHeading>
            <Separator className="mt-2" />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">動画の種類 <span className="text-red-500">*</span></Label>
              <Select onValueChange={v => upd("type", v)}>
                <SelectTrigger className="border-gray-300 h-9"><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {["採用動画", "会社紹介動画", "SNS広告動画", "商品PR動画", "研修・説明動画", "その他"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">予算 <span className="text-red-500">*</span></Label>
              <Select onValueChange={v => upd("budget", v)}>
                <SelectTrigger className="border-gray-300 h-9"><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {["〜5万円", "5〜10万円", "10〜20万円", "20〜30万円", "30万円以上"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">希望納期</Label>
              <Select onValueChange={v => upd("deadline", v)}>
                <SelectTrigger className="border-gray-300 h-9"><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {["1週間以内", "2週間", "3週間", "1ヶ月", "相談可"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500 font-medium">戻る</Button>
              <Button onClick={() => setStep(3)} disabled={!form.type || !form.budget} className="bg-blue-700 hover:bg-blue-800 font-semibold h-9">次へ</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="p-6 space-y-4">
            <SectionHeading>詳細・確認</SectionHeading>
            <Separator className="mt-2" />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">制作の詳細・要望 <span className="text-red-500">*</span></Label>
              <Textarea placeholder="動画の尺、ターゲット、雰囲気、参考動画など。詳しく書くほどマッチング精度が上がります。"
                className="min-h-[100px] text-sm border-gray-300" value={form.description} onChange={e => upd("description", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">希望スタイル</Label>
              <div className="flex flex-wrap gap-2">
                {["明るい・元気", "クール・スタイリッシュ", "温かみ・親しみやすい", "信頼感・誠実", "高級感", "勢い・インパクト"].map(s => (
                  <button key={s} onClick={() => upd("style", s)}
                    className={`px-3 py-1 text-xs rounded-sm border transition-colors font-medium ${form.style === s ? "bg-blue-700 text-white border-blue-700" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${form.proSelect ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
              onClick={() => upd("proSelect", !form.proSelect)}>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${form.proSelect ? "bg-blue-700 border-blue-700" : "border-gray-400"}`}>
                  {form.proSelect && <CheckCircle size={12} className="text-white" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">プロ選定サービスを利用する <span className="text-xs text-blue-600 ml-1">¥30,000〜</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">専任スタッフがご要件をヒアリングし、最適なクリエイターを選定します</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-500 font-medium">戻る</Button>
              <Button
                onClick={() => {
                  if (form.description) {
                    setStep(4);
                    aiHearing.generate({
                      type: form.type,
                      budget: form.budget,
                      deadline: form.deadline,
                      description: form.description,
                      style: form.style,
                      industry: form.industry,
                      company: form.company,
                    });
                  }
                }}
                disabled={!form.description}
                className="bg-blue-700 hover:bg-blue-800 font-semibold h-9"
              >
                AIヒアリングへ <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Sparkles size={15} className="text-white" />
              </div>
              <div>
                <SectionHeading>AIヒアリング</SectionHeading>
                <p className="text-xs text-gray-400 mt-0.5">依頼内容をAIが解析し、マッチング精度を高める質問を自動生成します</p>
              </div>
            </div>
            <Separator className="mt-2" />

            {aiHearing.loading && (
              <div className="py-10 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  AIが依頼内容を分析中...
                </div>
              </div>
            )}

            {!aiHearing.loading && aiHearing.questions.length > 0 && (
              <div className="space-y-5">
                {aiHearing.questions.map((q, idx) => (
                  <div key={q.id} className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-800 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <span>{q.question}</span>
                    </Label>
                    {q.type === "choice" && q.options ? (
                      <div className="flex flex-wrap gap-2 pl-7">
                        {q.options.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => aiHearing.setAnswer(q.id, opt)}
                            className={`px-3 py-1.5 text-xs rounded-md border transition-colors font-medium ${
                              aiHearing.answers[q.id] === opt
                                ? "bg-blue-700 text-white border-blue-700"
                                : "border-gray-300 text-gray-600 hover:border-blue-400"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="pl-7">
                        <Textarea
                          placeholder="回答を入力..."
                          className="min-h-[60px] text-sm border-gray-300"
                          value={aiHearing.answers[q.id] || ""}
                          onChange={e => aiHearing.setAnswer(q.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setStep(3)} className="text-gray-500 font-medium">戻る</Button>
              <Button
                onClick={() => onSuccess()}
                disabled={aiHearing.loading}
                className="bg-blue-700 hover:bg-blue-800 font-semibold h-9"
              >
                案件を投稿する <Send size={14} className="ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── [Client] マッチング ──────────────────────────────────────────────────────
function ClientMatchingPage() {
  const [selIdx, setSelIdx] = useState(0);
  const [sent, setSent] = useState<number[]>([]);
  const [expandedCreator, setExpandedCreator] = useState<string | null>(null);
  const proj = projects[selIdx];
  const aiMatch = useAIMatching();

  // Auto-trigger AI matching when project changes
  const projId = proj.id;
  const lastProjRef = useRef<number | null>(null);
  if (lastProjRef.current !== projId && !aiMatch.loading) {
    lastProjRef.current = projId;
    setTimeout(() => {
      const creatorProfiles: CreatorProfile[] = creators.map(c => ({
        id: String(c.id),
        name: c.name,
        specialty: c.specialty,
        tools: c.tools,
        tags: c.tags,
        badge: c.badge,
        turnaround: c.turnaround,
        minPrice: c.minPrice,
        maxPrice: c.maxPrice,
        rating: c.rating,
        reviewCount: c.reviews,
        deliveryCount: c.deliveries,
        bio: c.bio,
      }));
      aiMatch.reset();
      aiMatch.runMatching(
        {
          type: proj.type,
          budget: proj.budget,
          deadline: proj.deadline,
          description: proj.description,
          style: "",
          industry: proj.industry,
          company: proj.company,
        },
        creatorProfiles
      );
    }, 0);
  }

  // Build matched list from AI results (fall back to empty if not scored yet)
  const matched = aiMatch.scored
    ? aiMatch.results
        .map(r => {
          const c = creators.find(cr => String(cr.id) === r.creatorId);
          return c ? { ...c, aiResult: r } : null;
        })
        .filter((x): x is (typeof creators[0] & { aiResult: any }) => x !== null)
        .slice(0, 5)
    : [];

  return (
    <div className="flex gap-5">
      <div className="w-64 flex-shrink-0 space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">投稿した案件</p>
        {projects.map((p, i) => (
          <button key={p.id} onClick={() => { setSelIdx(i); setSent([]); }}
            className={`w-full text-left px-3 py-3 rounded-lg border transition-all ${selIdx === i ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
            <p className="text-xs font-semibold text-gray-800 truncate">{p.company}</p>
            <p className="text-xs text-gray-500 mt-0.5">{p.type}</p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-gray-400">{p.budget}</span>
              <StatusChip s={p.status} />
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-serif-jp font-semibold text-gray-900 tracking-tight">{proj.company}</p>
              <p className="text-xs text-gray-400 mt-0.5">{proj.type} · {proj.budget} · 納期 {proj.deadline}</p>
            </div>
            <StatusChip s={proj.status} />
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{proj.description}</p>
          <div className="flex gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Eye size={11} />{proj.views}閲覧</span>
            <span className="flex items-center gap-1"><MessageSquare size={11} />{proj.proposals}件の提案</span>
            <span className="text-gray-200">|</span>
            <span>投稿 {proj.posted}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded px-2.5 py-1">
            <Sparkles size={11} className="text-violet-600" />
            <span className="text-xs font-semibold text-violet-700">AIマッチング結果</span>
          </div>
          {aiMatch.scored && (
            <span className="text-[10px] text-gray-400">{matched.length}名のクリエイターをAI分析</span>
          )}
        </div>

        {aiMatch.loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
              AIが全クリエイターを分析しスコアリング中...
            </div>
            <p className="text-xs text-gray-400 mt-2">依頼内容・予算・専門分野・実績を総合評価しています</p>
          </div>
        )}

        {!aiMatch.loading && (
          <div className="space-y-3">
            {matched.map((c, idx) => {
              const ai = c.aiResult;
              const isExpanded = expandedCreator === String(c.id);
              const scoreColor = ai.score >= 85 ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                                 ai.score >= 70 ? "text-blue-600 bg-blue-50 border-blue-200" :
                                 "text-gray-600 bg-gray-50 border-gray-200";
              return (
                <div key={c.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:border-gray-300 transition-colors">
                  <div className="p-4 flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full ${c.color} text-white text-base font-bold flex items-center justify-center ring-2 ring-white shadow-sm`}>{c.avatar}</div>
                      {idx === 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] px-1 rounded font-bold tracking-wide">最適</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif-jp font-semibold text-gray-900 text-sm tracking-tight">{c.name}</span>
                        <BadgeEl type={c.badge} />
                        <span className="flex items-center gap-0.5 text-xs font-bold text-gray-600">
                          <Star size={11} fill="#f59e0b" stroke="#f59e0b" />{c.rating}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border ${scoreColor}`}>
                          <Sparkles size={10} />
                          マッチ度 {ai.score}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{ai.matchReason}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ai.strengths.slice(0, 3).map((s: string) => (
                          <span key={s} className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded-sm border border-violet-100 font-medium">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                      {ai.concerns && ai.concerns.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ai.concerns.map((concern: string) => (
                            <span key={concern} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-sm border border-amber-100 font-medium">
                              ⚠ {concern}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                      <p className="text-xs text-gray-400 font-medium">{fmtPrice(c.minPrice)}〜</p>
                      <Button size="sm"
                        variant={sent.includes(c.id) ? "ghost" : "default"}
                        className={sent.includes(c.id) ? "text-emerald-700 bg-emerald-50 text-xs h-8 font-semibold" : "bg-blue-700 hover:bg-blue-800 text-xs h-8 font-semibold"}
                        onClick={() => setSent(s => s.includes(c.id) ? s : [...s, c.id])}>
                        {sent.includes(c.id) ? <><CheckCircle size={12} className="mr-1" />送付済み</> : "見積依頼"}
                      </Button>
                      <button
                        onClick={() => setExpandedCreator(isExpanded ? null : String(c.id))}
                        className="text-[10px] text-blue-600 font-medium hover:underline flex items-center gap-0.5"
                      >
                        {isExpanded ? "閉じる" : "AIスキル評価"}
                        <ChevronDown size={10} className={isExpanded ? "rotate-180" : ""} />
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gradient-to-br from-violet-50/40 to-blue-50/40 px-4 py-3">
                      <div className="flex items-start gap-2">
                        <Sparkles size={12} className="text-violet-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-700 mb-1">AIスキル評価</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{ai.skillSummary}</p>
                          <div className="flex gap-1 mt-2">
                            {c.tools.map(t => <span key={t} className="text-[10px] bg-white text-gray-500 px-1.5 py-0.5 rounded-sm border border-gray-200">{t}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {sent.length > 0 && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700 flex items-center gap-2 font-medium">
            <CheckCircle size={13} />
            {sent.length}名に見積もりを依頼しました。1〜2営業日以内に回答が届きます。
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Messaging Page ──────────────────────────────────────────────────────────
function MessagingPage() {
  const [selectedThread, setSelectedThread] = useState(0);
  const [newMsg, setNewMsg] = useState("");
  const [msgs, setMsgs] = useState(chatMessages);
  const thread = messageThreads[selectedThread];

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMsgs(prev => [...prev, { id: prev.length + 1, sender: "me", text: newMsg, time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }) }]);
    setNewMsg("");
  };

  return (
    <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm" style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
      {/* Thread List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5"><MessageCircle size={12} />メッセージ</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messageThreads.map((t, i) => (
            <button key={t.id} onClick={() => setSelectedThread(i)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 flex items-center gap-3 transition-colors ${selectedThread === i ? "bg-blue-50" : "hover:bg-gray-50"}`}>
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full ${t.color} text-white text-sm font-bold flex items-center justify-center`}>{t.avatar}</div>
                {t.unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{t.unread}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{t.name}</span>
                  <span className="text-[10px] text-gray-400">{t.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{t.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${thread.color} text-white text-xs font-bold flex items-center justify-center`}>{thread.avatar}</div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{thread.name}</p>
            <p className="text-[10px] text-gray-400">オンライン</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {msgs.map(m => (
            <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${m.sender === "me" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-800"}`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.sender === "me" ? "text-blue-200" : "text-gray-400"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Input
              placeholder="メッセージを入力..."
              className="flex-1 border-gray-300 h-10"
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <Button className="bg-blue-700 hover:bg-blue-800 h-10 px-4" onClick={handleSend} disabled={!newMsg.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── [Creator] 案件を探す ─────────────────────────────────────────────────────
function CreatorProjectsPage() {
  const [category, setCategory] = useState("all");
  const [applied, setApplied] = useState<number[]>([]);
  const [detail, setDetail] = useState<typeof projects[0] | null>(null);
  const catMap: Record<string, string> = { recruit: "採用動画", company: "会社紹介動画", sns: "SNS広告動画", product: "商品PR動画" };
  const filtered = projects.filter(p => category === "all" || p.type === catMap[category]);

  if (detail) return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => setDetail(null)} className="text-sm text-blue-700 hover:underline mb-5 flex items-center gap-1 font-medium">
        <ChevronLeft size={14} /> 案件一覧に戻る
      </button>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif-jp font-semibold text-gray-900 text-lg tracking-tight">{detail.company}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{detail.industry} · 投稿 {detail.posted}</p>
            </div>
            <StatusChip s={detail.status} />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[{ l: "種別", v: detail.type }, { l: "予算", v: detail.budget }, { l: "希望納期", v: detail.deadline }].map(s => (
              <div key={s.l} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{s.l}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{s.v}</p>
              </div>
            ))}
          </div>
          <div>
            <SectionHeading>案件詳細</SectionHeading>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">{detail.description}</p>
          </div>
          <div className="flex gap-3 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1"><Eye size={11} />{detail.views}閲覧</span>
            <span className="flex items-center gap-1"><MessageSquare size={11} />{detail.proposals}件提案済み</span>
          </div>
          <Separator />
          {applied.includes(detail.id) ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700 flex items-center gap-2 font-medium">
              <CheckCircle size={15} /> 提案を送りました。クライアントからの返信をお待ちください。
            </div>
          ) : detail.status === "成立済み" ? (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-400 text-center">この案件は成立済みです</div>
          ) : (
            <div className="space-y-3">
              <Textarea placeholder="提案内容を入力してください。あなたのアプローチ・使用ツール・参考実績などを記載するとより選ばれやすくなります。" className="min-h-[100px] text-sm border-gray-300" />
              <div className="flex gap-2">
                <Input placeholder="見積金額（例：80,000円）" className="text-sm border-gray-300 h-9" />
                <Input placeholder="納期（例：7日）" className="text-sm border-gray-300 h-9 w-32" />
              </div>
              <Button className="w-full bg-blue-700 hover:bg-blue-800 font-semibold" onClick={() => setApplied(a => [...a, detail.id])}>
                この案件に提案する <Send size={14} className="ml-1.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-white border-b border-gray-200 mb-5">
        <div className="flex overflow-x-auto">
          {[{ id: "all", label: "すべて" }, { id: "recruit", label: "採用動画" }, { id: "company", label: "会社紹介" }, { id: "sns", label: "SNS広告" }, { id: "product", label: "商品PR" }].map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors font-medium ${category === cat.id ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer shadow-sm ${p.status === "成立済み" ? "opacity-60" : ""}`}
            onClick={() => setDetail(p)}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-serif-jp font-semibold text-gray-900 tracking-tight">{p.company}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.industry} · 投稿 {p.posted}</p>
              </div>
              <StatusChip s={p.status} />
            </div>
            <div className="flex gap-2 mb-2 flex-wrap">
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-sm font-medium">{p.type}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1"><CircleDollarSign size={11} />{p.budget}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={11} />納期 {p.deadline}</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{p.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Eye size={11} />{p.views}閲覧</span>
              <span className="flex items-center gap-1"><MessageSquare size={11} />{p.proposals}件提案</span>
              {applied.includes(p.id) && <span className="text-emerald-600 flex items-center gap-1 font-semibold"><CheckCircle size={11} />提案済み</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── [Creator] マイページ ──────────────────────────────────────────────────────
function CreatorMyPage() {
  const me = creators[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
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

  const handleStripeConnect = () => {
    setStripeLoading(true);
    setTimeout(() => { setStripeLoading(false); setStripeConnected(true); }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <SectionHeading>プロフィール</SectionHeading>
          <Button variant="outline" size="sm" className="text-xs border-gray-300 gap-1.5 h-7 font-medium" onClick={() => setEditProfile(v => !v)}>
            <Pencil size={12} />{editProfile ? "閉じる" : "編集"}
          </Button>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 relative group">
              <div className={`w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 shadow-sm flex items-center justify-center ${!photo ? me.color : ""}`}>
                {photo
                  ? <img src={photo} alt="profile" className="w-full h-full object-cover" />
                  : <span className="text-white text-2xl font-bold">{me.avatar}</span>
                }
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera size={18} className="text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
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
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">表示名</Label>
                  <Input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} className="border-gray-300 h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">自己紹介</Label>
                  <Textarea value={profileData.bio} onChange={e => setProfileData(p => ({ ...p, bio: e.target.value }))} className="border-gray-300 text-sm min-h-[70px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">使用ツール（読点区切り）</Label>
                  <Input value={profileData.tools} onChange={e => setProfileData(p => ({ ...p, tools: e.target.value }))} className="border-gray-300 h-8 text-sm" />
                </div>
                <Button size="sm" className="bg-blue-700 hover:bg-blue-800 font-semibold h-8 text-xs" onClick={() => setEditProfile(false)}>
                  保存する
                </Button>
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-serif-jp text-xl font-semibold text-gray-900 tracking-tight">{profileData.name}</h2>
                  <BadgeEl type={me.badge} />
                </div>
                <p className="text-sm text-gray-400 font-mono mb-2">{me.handle}</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-sm font-bold text-gray-800">
                    <Star size={13} fill="#f59e0b" stroke="#f59e0b" />{me.rating}
                  </span>
                  <span className="text-xs text-gray-400">レビュー {me.reviews}件</span>
                  <span className="text-xs text-gray-400">納品 {me.deliveries}件</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{profileData.bio}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {profileData.tools.split("、").map(t => <span key={t} className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-sm">{t.trim()}</span>)}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3 text-center mt-5 pt-5 border-t border-gray-100">
            {[
              { label: "今月の売上", value: `¥${(me.monthlyRevenue / 10000).toFixed(0)}万` },
              { label: "納品実績", value: `${me.deliveries}件` },
              { label: "進行中", value: `${me.activeProjects}件` },
              { label: "総合評価", value: `${me.rating}` },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{s.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1 font-serif-jp">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stripe Connect */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <SectionHeading>お支払い・口座設定</SectionHeading>
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
                  <p className="text-sm font-semibold text-emerald-800">Stripe Connect 接続済み</p>
                  <p className="text-xs text-emerald-600 mt-0.5">売上は案件完了・クライアント承認後、翌月末に自動振り込まれます。</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">接続口座</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-1.5">
                    <Building size={13} className="text-gray-500" /> ＊＊＊＊ 1234
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">次回振込予定</p>
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
              <Button variant="outline" size="sm" className="text-xs border-gray-300 font-medium gap-1.5">
                <ExternalLink size={12} /> Stripeダッシュボードで詳細確認
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">口座が未登録です</p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">案件が成立しても、Stripe Connect への口座登録が完了するまで売上の受け取りができません。</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <p>「口座を登録する」ボタンをクリックし、Stripeの登録画面へ移動します</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <p>氏名・生年月日・銀行口座情報を入力します（Stripe上で安全に管理）</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <p>登録完了後、案件完了・クライアント承認のたびに自動振り込みが行われます</p>
                </div>
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

      {/* 進行中案件 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
          <SectionHeading>進行中の案件</SectionHeading>
        </div>
        <div className="p-5 space-y-3">
          {[
            { client: "株式会社グリーンテック", type: "採用動画", price: "¥150,000", deadline: "3日後", progress: 65 },
            { client: "ミライ不動産", type: "会社紹介動画", price: "¥80,000", deadline: "8日後", progress: 30 },
            { client: "ハナビ食品", type: "商品PR動画", price: "¥120,000", deadline: "15日後", progress: 10 },
          ].map((p, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.client}</p>
                  <p className="text-xs text-gray-400">{p.type} · {p.price}</p>
                </div>
                <span className="text-xs text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full font-medium">締切 {p.deadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0 font-medium">{p.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 売上履歴 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
          <SectionHeading>売上履歴</SectionHeading>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { client: "佐藤歯科クリニック", type: "SNS広告動画", gross: 60000, net: 54000, date: "3/28", status: "振込済み" },
            { client: "丸山電機", type: "採用動画", gross: 140000, net: 126000, date: "3/15", status: "振込済み" },
            { client: "ひかり保育園", type: "紹介動画", gross: 70000, net: 63000, date: "3/5", status: "振込済み" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-xs font-semibold text-gray-800">{r.client}</p>
                <p className="text-xs text-gray-400">{r.type} · {r.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">¥{r.net.toLocaleString()}<span className="text-xs text-gray-400 font-normal ml-1">（手数料控除後）</span></p>
                <span className="text-xs text-emerald-600 font-semibold">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminPage() {
  const PLATFORM_FEE = 10;
  const stats = [
    { label: "今月の成立件数", value: "18件", change: "+4", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "登録クリエイター", value: "47名", change: "+3", icon: Users, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "登録企業", value: "124社", change: "+11", icon: Briefcase, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "手数料収入（今月）", value: "¥50.4万", change: "+18%", icon: CircleDollarSign, color: "text-amber-600", bg: "bg-amber-50" },
  ];
  const [approved, setApproved] = useState<string[]>([]);
  const pending = [
    { name: "佐々木 翔", specialty: "採用動画・会社紹介", applied: "2日前" },
    { name: "林 奈津子", specialty: "SNS広告・ブランド", applied: "本日" },
  ];
  const activity = [
    { tag: "成立", text: "ミライ不動産 × 田中蒼 — 会社紹介動画 ¥12万", time: "1時間前", dot: "bg-emerald-500" },
    { tag: "入金", text: "グリーンテック — ¥186,000 エスクロー着金", time: "3時間前", dot: "bg-blue-500" },
    { tag: "審査", text: "クリエイター「伊藤美咲」が登録申請", time: "本日9:00", dot: "bg-violet-500" },
    { tag: "振込", text: "田中蒼 — ¥108,000 Stripe自動振込完了", time: "昨日18:00", dot: "bg-amber-500" },
    { tag: "入金", text: "グリーンテック — ¥186,000 確認", time: "昨日14:30", dot: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-800 flex items-center gap-2 font-medium">
        <Shield size={13} /> 管理者専用画面 — 成約手数料率: <strong>{PLATFORM_FEE}%</strong> · プロ選定サービス: <strong>¥30,000〜</strong>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5 font-serif-jp tracking-tight">{s.value}</p>
            <p className="text-xs text-emerald-600 flex items-center gap-0.5 mt-0.5 font-semibold"><TrendingUp size={10} />{s.change}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <SectionHeading>収益内訳（今月）</SectionHeading>
        <div className="grid grid-cols-3 gap-4 text-center mt-4">
          {[
            { label: `成約手数料 (${PLATFORM_FEE}%)`, value: "¥50.4万", sub: `18件 × 平均¥28万 × ${PLATFORM_FEE}%`, bg: "bg-blue-50 border-blue-100", labelColor: "text-blue-700", valueColor: "text-blue-900" },
            { label: "プロ選定サービス費", value: "¥27万", sub: "9件利用", bg: "bg-amber-50 border-amber-100", labelColor: "text-amber-700", valueColor: "text-amber-900" },
            { label: "合計", value: "¥77.4万", sub: "前月比 +18%", bg: "bg-gray-50 border-gray-200", labelColor: "text-gray-600", valueColor: "text-gray-900" },
          ].map(r => (
            <div key={r.label} className={`${r.bg} border rounded-lg p-4`}>
              <p className={`text-xs font-semibold ${r.labelColor}`}>{r.label}</p>
              <p className={`text-xl font-bold ${r.valueColor} mt-1 font-serif-jp`}>{r.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{r.sub}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <SectionHeading>直近のアクティビティ</SectionHeading>
          <div className="space-y-3 mt-4">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${a.dot} flex-shrink-0`} />
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold tracking-wide uppercase flex-shrink-0">{a.tag}</span>
                <span className="text-xs text-gray-700 flex-1">{a.text}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <SectionHeading>審査待ちクリエイター</SectionHeading>
          <div className="space-y-3 mt-4">
            {pending.map((p, i) => (
              approved.includes(p.name) ? (
                <div key={i} className="p-2 bg-emerald-50 rounded text-xs text-emerald-700 flex items-center gap-1.5 font-medium"><CheckCircle size={12} />{p.name} を承認</div>
              ) : (
                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{p.specialty} · {p.applied}</p>
                  <div className="flex gap-1.5">
                    <Button size="sm" className="flex-1 text-xs h-7 bg-blue-700 hover:bg-blue-800 font-semibold" onClick={() => setApproved(a => [...a, p.name])}>承認</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7 border-gray-300 font-medium">却下</Button>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
          <SectionHeading>案件管理</SectionHeading>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["企業名", "種別", "予算", "提案数", "ステータス"].map(h => (
                <th key={h} className="text-left text-xs text-gray-400 font-semibold py-2.5 px-5 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5 text-sm font-semibold text-gray-800">{p.company}</td>
                <td className="py-3 px-5 text-xs text-gray-500">{p.type}</td>
                <td className="py-3 px-5 text-xs text-gray-500">{p.budget}</td>
                <td className="py-3 px-5 text-xs text-gray-500">{p.proposals}件</td>
                <td className="py-3 px-5"><StatusChip s={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, profile, isDemo, signOut } = useAuth();
  const setDemoRole = useDemoRole();

  const [showLanding, setShowLanding] = useState(true);
  const [role, setRole] = useState<Role>("client");
  const [clientPage, setClientPage] = useState<"creators" | "post" | "match" | "messages" | "admin">("creators");
  const [creatorPage, setCreatorPage] = useState<"projects" | "messages" | "mypage">("projects");
  const [postDone, setPostDone] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Use auth-based role when available, fallback to local state
  const effectiveRole: Role = (!isDemo && profile?.role === "creator") ? "creator" : role;

  const { notifications: notifs, unreadCount: unreadNotifications } = useNotifications(user?.id);
  const { threads: msgThreads } = useMessages(user?.id);
  const unreadMessages = msgThreads.reduce((acc, t) => acc + t.unread, 0);

  const handleRoleSwitch = (newRole: Role) => {
    setRole(newRole);
    if (isDemo && setDemoRole) {
      setDemoRole(newRole);
    }
  };

  if (showLanding) return <LandingPage onStart={() => setShowLanding(false)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-4">
          <button className="flex items-center gap-2 mr-2 flex-shrink-0" onClick={() => { setClientPage("creators"); setCreatorPage("projects"); }}>
            <div className="w-7 h-7 bg-blue-700 rounded flex items-center justify-center shadow-sm">
              <Video size={14} className="text-white" />
            </div>
            <span className="font-serif-jp font-semibold text-gray-900 text-sm tracking-tight">AIムービーマッチ</span>
          </button>
          <div className="flex-1 max-w-md relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder={effectiveRole === "client" ? "クリエイターを探す" : "案件を探す"}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-600 bg-gray-50 font-medium text-gray-700 placeholder:font-normal placeholder:text-gray-400" />
          </div>
          <div className="flex-1" />
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
            <button onClick={() => handleRoleSwitch("client")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${effectiveRole === "client" ? "bg-white text-blue-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-800"}`}>
              発注者
            </button>
            <button onClick={() => handleRoleSwitch("creator")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${effectiveRole === "creator" ? "bg-white text-blue-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-800"}`}>
              クリエイター
            </button>
          </div>
          {effectiveRole === "client" && (
            <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-xs h-8 px-4 font-semibold shadow-sm" onClick={() => setClientPage("post")}>
              案件を投稿する
            </Button>
          )}
          {/* Notification Bell */}
          <div className="relative">
            <button
              className="text-gray-400 hover:text-gray-700 p-1.5 transition-colors relative"
              onClick={() => setShowNotifications(v => !v)}
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">通知</p>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {(notifs.length > 0 ? notifs : notificationsData).map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? "bg-blue-50/50" : ""}`}>
                      <div className="mt-0.5 flex-shrink-0">
                        <NotificationIcon type={n.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-gray-800" : "text-gray-600"}`}>{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{"timeLabel" in n ? (n as any).timeLabel : (n as any).time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <button className="text-xs text-blue-700 font-semibold hover:underline">すべての通知を見る</button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="text-gray-400 hover:text-gray-700 p-1.5 transition-colors"
              onClick={() => {
                if (!isDemo && user) setShowUserMenu(v => !v);
                else if (!isDemo) setShowLoginDialog(true);
                else setShowUserMenu(v => !v);
              }}
            >
              {user || isDemo ? (
                <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {profile?.display_name?.[0] ?? "U"}
                </div>
              ) : (
                <User size={18} />
              )}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{profile?.display_name ?? "ゲスト"}</p>
                  <p className="text-xs text-gray-400">{user?.email ?? (isDemo ? "デモモード" : "")}</p>
                </div>
                {!isDemo && user && (
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={async () => { await signOut(); setShowUserMenu(false); setShowLanding(true); }}
                  >
                    ログアウト
                  </button>
                )}
                {(isDemo || !user) && (
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-blue-700 font-semibold hover:bg-gray-50 transition-colors"
                    onClick={() => { setShowLoginDialog(true); setShowUserMenu(false); }}
                  >
                    ログイン / 新規登録
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:bg-gray-50 transition-colors border-t border-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-5 flex">
            {role === "client" ? (
              <>
                {[
                  { id: "creators" as const, label: "クリエイターを探す" },
                  { id: "post" as const, label: "案件を投稿する" },
                  { id: "match" as const, label: "マッチング管理" },
                  { id: "messages" as const, label: "メッセージ", badge: unreadMessages },
                  { id: "admin" as const, label: "管理者ダッシュボード" },
                ].map(t => (
                  <button key={t.id} onClick={() => setClientPage(t.id)}
                    className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors tracking-wide flex items-center gap-1.5 ${clientPage === t.id ? "border-blue-700 text-blue-700" : "border-transparent text-gray-400 hover:text-gray-800"}`}>
                    {t.label}
                    {t.badge && t.badge > 0 && (
                      <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{t.badge}</span>
                    )}
                  </button>
                ))}
              </>
            ) : (
              <>
                {[
                  { id: "projects" as const, label: "案件を探す" },
                  { id: "messages" as const, label: "メッセージ", badge: unreadMessages },
                  { id: "mypage" as const, label: "マイページ・売上管理" },
                ].map(t => (
                  <button key={t.id} onClick={() => setCreatorPage(t.id)}
                    className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors tracking-wide flex items-center gap-1.5 ${creatorPage === t.id ? "border-blue-700 text-blue-700" : "border-transparent text-gray-400 hover:text-gray-800"}`}>
                    {t.label}
                    {t.badge && t.badge > 0 && (
                      <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{t.badge}</span>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {postDone && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
            <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-serif-jp font-semibold text-emerald-800">案件を投稿しました</p>
              <p className="text-xs text-emerald-600 mt-0.5">専任スタッフが最適なクリエイターを選定します。1営業日以内にご連絡します。</p>
            </div>
            <Button size="sm" variant="ghost" className="text-emerald-700 text-xs font-semibold" onClick={() => { setClientPage("match"); setPostDone(false); }}>
              マッチング確認 <ArrowRight size={13} className="ml-1" />
            </Button>
          </div>
        )}
        {effectiveRole === "client" && clientPage === "creators" && <ClientCreatorsPage />}
        {effectiveRole === "client" && clientPage === "post" && <ClientPostProject onSuccess={() => { setPostDone(true); setClientPage("creators"); }} />}
        {effectiveRole === "client" && clientPage === "match" && <ClientMatchingPage />}
        {effectiveRole === "client" && clientPage === "messages" && <MessagingPage />}
        {effectiveRole === "client" && clientPage === "admin" && <AdminPage />}
        {effectiveRole === "creator" &&creatorPage === "projects" && <CreatorProjectsPage />}
        {effectiveRole === "creator" &&creatorPage === "messages" && <MessagingPage />}
        {effectiveRole === "creator" &&creatorPage === "mypage" && <CreatorMyPage />}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-10 py-5">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center shadow-sm">
              <Video size={10} className="text-white" />
            </div>
            <span className="font-serif-jp font-semibold text-gray-600 tracking-tight">AIムービーマッチ</span>
          </div>
          <div className="flex gap-5 font-medium">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">利用規約</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">プライバシーポリシー</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">お問い合わせ</span>
          </div>
        </div>
      </footer>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}
