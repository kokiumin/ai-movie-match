"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { ConsultationThread, ConsultationMessage } from "@/types/database";

// ─── Mock data (demo mode) ────────────────────────────────────────────────────
const MOCK_THREADS: ConsultationThread[] = [
  {
    id: "ct-1",
    client_id: "demo-client",
    creator_id: "1",
    initial_message: "新卒採用向けの動画を検討中です。1〜2分でテンポ良くつくりたいのですが、可能でしょうか?",
    budget_range: "10〜20万円",
    deadline_range: "2週間以内",
    status: "replied",
    converted_project_id: null,
    client_unread_count: 1,
    creator_unread_count: 0,
    last_message_at: new Date(Date.now() - 3600_000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400_000).toISOString(),
    updated_at: new Date(Date.now() - 3600_000).toISOString(),
  },
];

const MOCK_MESSAGES_BY_THREAD: Record<string, ConsultationMessage[]> = {
  "ct-1": [
    {
      id: "cm-1",
      thread_id: "ct-1",
      sender_id: "demo-client",
      message: "新卒採用向けの動画を検討中です。1〜2分でテンポ良くつくりたいのですが、可能でしょうか?",
      is_read: true,
      created_at: new Date(Date.now() - 2 * 86400_000).toISOString(),
    },
    {
      id: "cm-2",
      thread_id: "ct-1",
      sender_id: "1",
      message: "もちろん対応可能です。ヒアリング次第ですが、¥120,000程度で 10日程度の納期目安になります。具体的にはどんな業界・職種でしょうか?",
      is_read: false,
      created_at: new Date(Date.now() - 3600_000).toISOString(),
    },
  ],
};

// ─── Threads list ─────────────────────────────────────────────────────────────
export function useConsultationThreads(userId?: string) {
  const [threads, setThreads] = useState<ConsultationThread[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setThreads([]);
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured()) {
      setThreads(MOCK_THREADS);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("consultation_threads")
      .select("*")
      .or(`client_id.eq.${userId},creator_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });
    setThreads((data ?? []) as ConsultationThread[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { threads, loading, refresh };
}

// ─── Single thread + messages ──────────────────────────────────────────────────
export function useConsultationThread(threadId?: string) {
  const [thread, setThread] = useState<ConsultationThread | null>(null);
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!threadId) {
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured()) {
      setThread(MOCK_THREADS.find((t) => t.id === threadId) ?? null);
      setMessages(MOCK_MESSAGES_BY_THREAD[threadId] ?? []);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [{ data: t }, { data: msgs }] = await Promise.all([
        supabase.from("consultation_threads").select("*").eq("id", threadId).maybeSingle(),
        supabase.from("consultation_messages").select("*").eq("thread_id", threadId).order("created_at"),
      ]);
      if (cancelled) return;
      setThread((t as ConsultationThread | null) ?? null);
      setMessages((msgs ?? []) as ConsultationMessage[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  const sendMessage = useCallback(
    async (senderId: string, message: string) => {
      if (!threadId) return;
      if (!isSupabaseConfigured()) {
        const msg: ConsultationMessage = {
          id: `cm-${Date.now()}`,
          thread_id: threadId,
          sender_id: senderId,
          message,
          is_read: false,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, msg]);
        return;
      }
      const { data } = await supabase
        .from("consultation_messages")
        .insert({ thread_id: threadId, sender_id: senderId, message })
        .select()
        .single();
      if (data) setMessages((prev) => [...prev, data as ConsultationMessage]);
    },
    [threadId],
  );

  return { thread, messages, loading, sendMessage };
}

// ─── Create new thread ─────────────────────────────────────────────────────────
export async function createConsultationThread(input: {
  clientId: string;
  creatorId: string;
  initialMessage: string;
  budgetRange?: string;
  deadlineRange?: string;
}) {
  if (!isSupabaseConfigured()) {
    return { data: { id: `ct-${Date.now()}` }, error: null };
  }
  const { data, error } = await supabase
    .from("consultation_threads")
    .insert({
      client_id: input.clientId,
      creator_id: input.creatorId,
      initial_message: input.initialMessage,
      budget_range: input.budgetRange ?? null,
      deadline_range: input.deadlineRange ?? null,
    })
    .select("id")
    .single();
  if (data) {
    // 初回メッセージを messages にも記録
    await supabase.from("consultation_messages").insert({
      thread_id: data.id,
      sender_id: input.clientId,
      message: input.initialMessage,
    });
  }
  return { data, error };
}
