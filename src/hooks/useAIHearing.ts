import { useState, useCallback } from "react";
import {
  generateHearingQuestions,
  mockHearingQuestions,
  isAIConfigured,
  type HearingQuestion,
  type ProjectBrief,
} from "@/lib/ai";

export function useAIHearing() {
  const [questions, setQuestions] = useState<HearingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(async (brief: ProjectBrief) => {
    setLoading(true);
    setError(null);
    try {
      let qs: HearingQuestion[];
      if (isAIConfigured()) {
        qs = await generateHearingQuestions(brief);
      } else {
        // Simulate delay for demo
        await new Promise(r => setTimeout(r, 800));
        qs = mockHearingQuestions(brief);
      }
      setQuestions(qs);
      setGenerated(true);
    } catch (e: any) {
      setError(e.message);
      // Fallback to mock
      setQuestions(mockHearingQuestions(brief));
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const reset = useCallback(() => {
    setQuestions([]);
    setAnswers({});
    setGenerated(false);
    setError(null);
  }, []);

  const isComplete = questions.length > 0 && questions.every(q => !!answers[q.id]);

  return {
    questions,
    answers,
    loading,
    error,
    generated,
    isComplete,
    generate,
    setAnswer,
    reset,
  };
}
