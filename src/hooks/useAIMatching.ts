import { useState, useCallback } from "react";
import {
  scoreCreators,
  evaluateCreatorSkill,
  mockMatchResults,
  isAIConfigured,
  type MatchResult,
  type SkillEvaluation,
  type ProjectBrief,
  type CreatorProfile,
} from "@/lib/ai";

export function useAIMatching() {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [skillEvals, setSkillEvals] = useState<Record<string, SkillEvaluation>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scored, setScored] = useState(false);

  const runMatching = useCallback(async (
    brief: ProjectBrief & { hearingAnswers?: Record<string, string> },
    creators: CreatorProfile[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      let matchResults: MatchResult[];
      if (isAIConfigured()) {
        matchResults = await scoreCreators(brief, creators);
      } else {
        await new Promise(r => setTimeout(r, 1200));
        matchResults = mockMatchResults(brief, creators);
      }
      setResults(matchResults);
      setScored(true);
    } catch (e: any) {
      setError(e.message);
      setResults(mockMatchResults(brief, creators));
      setScored(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const evaluateSkill = useCallback(async (creator: CreatorProfile) => {
    if (skillEvals[creator.id]) return skillEvals[creator.id];

    try {
      let evaluation: SkillEvaluation;
      if (isAIConfigured()) {
        evaluation = await evaluateCreatorSkill(creator);
      } else {
        evaluation = {
          summary: `${creator.name}は${creator.tags.join("・")}を専門とするクリエイターです。評価${creator.rating}、納品実績${creator.deliveryCount}件。`,
          strengths: [
            `${creator.tags[0]}の専門家`,
            `${creator.tools.slice(0, 2).join("・")}に精通`,
            `評価${creator.rating}の高評価`,
          ],
          bestFor: creator.tags.map(t => `${t}の制作`),
          caution: creator.deliveryCount < 30 ? ["実績数がやや少なめ"] : [],
          overallGrade: creator.rating >= 4.8 && creator.deliveryCount >= 50 ? "S" :
                        creator.rating >= 4.5 && creator.deliveryCount >= 30 ? "A" : "B",
        };
      }
      setSkillEvals(prev => ({ ...prev, [creator.id]: evaluation }));
      return evaluation;
    } catch {
      return null;
    }
  }, [skillEvals]);

  const reset = useCallback(() => {
    setResults([]);
    setSkillEvals({});
    setScored(false);
    setError(null);
  }, []);

  return {
    results,
    skillEvals,
    loading,
    error,
    scored,
    runMatching,
    evaluateSkill,
    reset,
  };
}
