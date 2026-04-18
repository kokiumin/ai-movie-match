import { Zap, Shield, Sparkles, MessageSquare } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AIが最適なクリエイターを提案",
    desc: "依頼内容をAIが解析し、予算・納期・業界経験から最もマッチする人を自動でスコアリング。",
  },
  {
    icon: Zap,
    title: "最短3日で納品",
    desc: "AI映像制作に特化したクリエイターだから、従来の1/3の期間で高品質な動画を納品。",
  },
  {
    icon: Shield,
    title: "審査制で品質保証",
    desc: "全クリエイターを審査制で厳選。納品後の修正対応も含めた安心のサポート体制。",
  },
  {
    icon: MessageSquare,
    title: "直接メッセージ",
    desc: "マッチング後はクリエイターと直接チャット。要望を細かく擦り合わせて制作できます。",
  },
];

export function FeatureSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            AIムービーマッチが選ばれる理由
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            従来の動画制作マッチングとは一線を画す、次世代のプラットフォーム。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-7 border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
                <Icon size={22} className="text-brand-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 tracking-tight leading-snug">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
