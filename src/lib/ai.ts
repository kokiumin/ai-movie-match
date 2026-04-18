/**
 * Claude API integration for AI-powered matching automation.
 *
 * Calls go through Supabase Edge Function (/functions/v1/ai) which keeps
 * the API key server-side. The frontend never sees ANTHROPIC_API_KEY.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const AI_PROXY_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/ai` : "";

export const isAIConfigured = () =>
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co";

// ─── Low-level API call (via Edge Function proxy) ────────────────────────────

interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

async function callClaude(
  system: string,
  messages: ClaudeMessage[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  if (!isAIConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const res = await fetch(AI_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Anon key is required by Supabase to reach the function's public gateway.
      // The real Anthropic API key lives only as a Function Secret on the server.
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: options?.maxTokens ?? 2048,
      temperature: options?.temperature ?? 0.3,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI proxy error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

// ─── 1. AI Hearing: Generate follow-up questions ─────────────────────────────

export interface HearingQuestion {
  id: string;
  question: string;
  type: "text" | "choice";
  options?: string[];
}

export interface ProjectBrief {
  type: string;
  budget: string;
  deadline: string;
  description: string;
  style: string;
  industry: string;
  company: string;
}

export async function generateHearingQuestions(
  brief: ProjectBrief
): Promise<HearingQuestion[]> {
  const system = `あなたは映像制作のプロフェッショナルコンサルタントです。
企業からの動画制作依頼を受け、より正確なクリエイターマッチングのために、
追加で確認すべき重要な質問を生成してください。

ルール:
- 質問は3〜5個に絞ること
- 各質問はマッチング精度に直結するものだけ
- 選択式にできるものは選択肢を付けること
- JSON配列で返すこと（他のテキストは不要）

出力フォーマット:
[
  {"id": "q1", "question": "質問文", "type": "choice", "options": ["選択肢1", "選択肢2", "選択肢3"]},
  {"id": "q2", "question": "質問文", "type": "text"}
]`;

  const userMsg = `以下の依頼内容を分析し、追加質問を生成してください:

会社名: ${brief.company}
業界: ${brief.industry}
動画種類: ${brief.type}
予算: ${brief.budget}
希望納期: ${brief.deadline}
希望スタイル: ${brief.style || "未指定"}
依頼詳細: ${brief.description}`;

  const text = await callClaude(system, [{ role: "user", content: userMsg }]);

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as HearingQuestion[];
  } catch {
    console.error("Failed to parse hearing questions:", text);
    return [];
  }
}

// ─── 2. AI Matching: Score creators against a project ───────────────────────

export interface CreatorProfile {
  id: string;
  name: string;
  specialty: string[];
  tools: string[];
  tags: string[];
  badge: string;
  turnaround: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  reviewCount: number;
  deliveryCount: number;
  bio: string;
}

export interface MatchResult {
  creatorId: string;
  creatorName: string;
  score: number;           // 0-100
  matchReason: string;     // Why this creator is a good fit
  strengths: string[];     // Key strengths for this project
  concerns: string[];      // Potential concerns
  skillSummary: string;    // AI-generated skill evaluation
}

export async function scoreCreators(
  brief: ProjectBrief & { hearingAnswers?: Record<string, string> },
  creators: CreatorProfile[]
): Promise<MatchResult[]> {
  const system = `あなたはAI映像制作マッチングエンジンです。
企業の依頼内容と各クリエイターのプロフィールを照合し、
マッチング結果をJSON配列で返してください。

スコアリング基準（重み付き）:
1. 専門分野一致度 (30%): 動画種類×業界経験がどれだけ一致するか
2. 予算適合度 (20%): クリエイターの価格帯が依頼予算に収まるか
3. 納期適合度 (15%): 平均納品日数が希望納期に間に合うか
4. 実績・評価 (20%): 評価スコア×納品件数のバランス
5. スタイル親和性 (15%): クリエイターの得意テイストと希望スタイルの一致

出力フォーマット（JSON配列のみ、他テキスト不要）:
[
  {
    "creatorId": "id",
    "creatorName": "名前",
    "score": 85,
    "matchReason": "なぜこのクリエイターが最適か（2〜3文）",
    "strengths": ["強み1", "強み2"],
    "concerns": ["注意点があれば"],
    "skillSummary": "このクリエイターのスキル評価サマリー（1〜2文）"
  }
]

注意:
- スコアは0-100の整数
- 全クリエイターをスコア降順でソート
- matchReasonは発注者目線で書くこと（「御社の〜」ではなく「〜に最適」など）
- 日本語で回答`;

  const creatorsInfo = creators.map(c =>
    `【${c.name}】ID:${c.id} / 専門:${c.tags.join(",")} / ツール:${c.tools.join(",")} / 価格:${c.minPrice}〜${c.maxPrice}円 / 納期:${c.turnaround} / 評価:${c.rating}(${c.reviewCount}件) / 納品:${c.deliveryCount}件 / バッジ:${c.badge || "なし"} / 自己紹介:${c.bio}`
  ).join("\n");

  const hearingInfo = brief.hearingAnswers
    ? "\n\n追加ヒアリング回答:\n" + Object.entries(brief.hearingAnswers).map(([q, a]) => `Q: ${q}\nA: ${a}`).join("\n")
    : "";

  const userMsg = `■ 依頼内容
会社名: ${brief.company}
業界: ${brief.industry}
動画種類: ${brief.type}
予算: ${brief.budget}
希望納期: ${brief.deadline}
希望スタイル: ${brief.style || "未指定"}
依頼詳細: ${brief.description}${hearingInfo}

■ クリエイター一覧
${creatorsInfo}`;

  const text = await callClaude(system, [{ role: "user", content: userMsg }], {
    maxTokens: 4096,
  });

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const results = JSON.parse(jsonMatch[0]) as MatchResult[];
    return results.sort((a, b) => b.score - a.score);
  } catch {
    console.error("Failed to parse match results:", text);
    return [];
  }
}

// ─── 3. AI Skill Evaluation: Evaluate a single creator ──────────────────────

export interface SkillEvaluation {
  summary: string;
  strengths: string[];
  bestFor: string[];
  caution: string[];
  overallGrade: "S" | "A" | "B" | "C";
}

export async function evaluateCreatorSkill(
  creator: CreatorProfile
): Promise<SkillEvaluation> {
  const system = `あなたは映像制作クリエイターの評価エンジンです。
クリエイターのプロフィールデータからスキル評価レポートをJSON形式で生成してください。

出力フォーマット（JSONのみ、他テキスト不要）:
{
  "summary": "1〜2文のスキル総評",
  "strengths": ["強み1", "強み2", "強み3"],
  "bestFor": ["このクリエイターに最適な案件タイプ1", "タイプ2"],
  "caution": ["注意点やデメリットがあれば"],
  "overallGrade": "S"
}

グレード基準:
S: 評価4.8以上 & 納品50件以上 & 認定バッジあり
A: 評価4.5以上 & 納品30件以上
B: 評価4.0以上 or 納品20件以上
C: それ以外`;

  const userMsg = `クリエイター情報:
名前: ${creator.name}
専門: ${creator.tags.join(", ")}
ツール: ${creator.tools.join(", ")}
価格帯: ${creator.minPrice.toLocaleString()}〜${creator.maxPrice.toLocaleString()}円
納期目安: ${creator.turnaround}
評価: ${creator.rating} (${creator.reviewCount}件のレビュー)
納品実績: ${creator.deliveryCount}件
バッジ: ${creator.badge || "なし"}
自己紹介: ${creator.bio}`;

  const text = await callClaude(system, [{ role: "user", content: userMsg }], {
    maxTokens: 1024,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0]) as SkillEvaluation;
  } catch {
    return {
      summary: `${creator.name}のスキル評価データを取得できませんでした。`,
      strengths: creator.tags,
      bestFor: creator.specialty,
      caution: [],
      overallGrade: creator.rating >= 4.8 && creator.deliveryCount >= 50 ? "S" : creator.rating >= 4.5 ? "A" : "B",
    };
  }
}

// ─── Mock versions (when API key not set) ───────────────────────────────────

export function mockHearingQuestions(brief: ProjectBrief): HearingQuestion[] {
  const base: HearingQuestion[] = [
    {
      id: "q1",
      question: "完成動画の主な配信先はどこですか？",
      type: "choice",
      options: ["自社サイト", "YouTube", "Instagram/TikTok", "採用ページ", "展示会・セミナー"],
    },
    {
      id: "q2",
      question: "出演者（社員インタビュー等）は予定していますか？",
      type: "choice",
      options: ["はい（社員出演）", "いいえ（ナレーション+素材のみ）", "AI生成のアバターを希望", "未定"],
    },
  ];

  if (brief.type.includes("採用")) {
    base.push({
      id: "q3",
      question: "採用ターゲットはどの層ですか？",
      type: "choice",
      options: ["新卒（大学生）", "中途（若手）", "中途（管理職）", "パート・アルバイト"],
    });
  }

  if (brief.type.includes("SNS")) {
    base.push({
      id: "q3",
      question: "メインのSNSプラットフォームはどれですか？",
      type: "choice",
      options: ["Instagram リール", "TikTok", "YouTube ショート", "X (Twitter)", "複数"],
    });
  }

  base.push({
    id: "q_free",
    question: "その他、クリエイターに伝えておきたいことがあれば教えてください",
    type: "text",
  });

  return base;
}

export function mockMatchResults(
  brief: ProjectBrief,
  creators: CreatorProfile[]
): MatchResult[] {
  return creators
    .map(c => {
      let score = 50;

      // Specialty match
      if (c.tags.some(t => brief.type.includes(t) || t.includes(brief.type.replace("動画", "")))) score += 20;

      // Budget match
      const budgetNum = parseInt(brief.budget.replace(/[^0-9]/g, "")) * 10000;
      if (budgetNum && c.minPrice <= budgetNum) score += 10;

      // Rating bonus
      score += Math.round(c.rating * 3);

      // Delivery count bonus
      if (c.deliveryCount >= 50) score += 8;
      else if (c.deliveryCount >= 30) score += 5;

      // Badge bonus
      if (c.badge === "TOP") score += 5;
      else if (c.badge === "認定") score += 3;

      score = Math.min(100, score);

      return {
        creatorId: c.id,
        creatorName: c.name,
        score,
        matchReason: `${c.tags[0]}の実績${c.deliveryCount}件、評価${c.rating}。${brief.type}に適した経験を持つクリエイターです。`,
        strengths: [
          `${c.tags[0]}の専門家`,
          `評価${c.rating}（${c.reviewCount}件）`,
          c.badge ? `${c.badge}クリエイター` : `納品${c.deliveryCount}件の実績`,
        ],
        concerns: c.minPrice > (budgetNum || 999999)
          ? ["予算を超える可能性があります"]
          : [],
        skillSummary: c.bio,
      };
    })
    .sort((a, b) => b.score - a.score);
}
