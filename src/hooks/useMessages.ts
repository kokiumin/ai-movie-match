import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface MessageThread {
  id: string;
  name: string;
  avatar: string;
  color: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  sender_id?: string;
  text: string;
  time: string;
  created_at?: string;
}

// Mock data
const MOCK_THREADS: MessageThread[] = [
  { id: "t1", name: "田中 蒼", avatar: "田", color: "bg-blue-600", lastMessage: "ありがとうございます。明日までに初稿をお送りします。", time: "14:30", unread: 2 },
  { id: "t2", name: "鈴木 凛", avatar: "凛", color: "bg-emerald-600", lastMessage: "見積もりの件、確認しました。", time: "昨日", unread: 0 },
  { id: "t3", name: "中村 健", avatar: "健", color: "bg-rose-600", lastMessage: "修正版をアップロードしました。ご確認ください。", time: "3/28", unread: 1 },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "m1", sender: "them", text: "採用動画の件、ご依頼ありがとうございます。", time: "10:00" },
  { id: "m2", sender: "them", text: "ヒアリングシートをお送りしました。ご記入をお願いできますか？", time: "10:02" },
  { id: "m3", sender: "me", text: "ありがとうございます！本日中に記入してお送りします。", time: "11:30" },
  { id: "m4", sender: "them", text: "承知しました。確認次第、絵コンテを作成します。", time: "11:45" },
  { id: "m5", sender: "me", text: "よろしくお願いします。納期は来週金曜でお願いできますか？", time: "13:00" },
  { id: "m6", sender: "them", text: "はい、問題ありません。来週金曜に初稿をお送りします。", time: "13:15" },
  { id: "m7", sender: "them", text: "ありがとうございます。明日までに初稿をお送りします。", time: "14:30" },
];

export function useMessages(userId?: string) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<any>(null);

  // Fetch threads
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setThreads(MOCK_THREADS);
      setLoading(false);
      return;
    }

    if (!userId) return;

    const fetchThreads = async () => {
      const { data: participations } = await supabase
        .from("thread_participants")
        .select("thread_id, last_read_at")
        .eq("user_id", userId);

      if (!participations?.length) {
        setThreads([]);
        setLoading(false);
        return;
      }

      const threadIds = participations.map(p => p.thread_id);

      // Get threads with latest message and other participant info
      const threadResults: MessageThread[] = [];

      for (const threadId of threadIds) {
        // Get other participant
        const { data: otherParts } = await supabase
          .from("thread_participants")
          .select("user_id")
          .eq("thread_id", threadId)
          .neq("user_id", userId);

        const otherUserId = otherParts?.[0]?.user_id;
        let otherProfile = null;
        if (otherUserId) {
          const { data } = await supabase
            .from("profiles")
            .select("display_name, color")
            .eq("id", otherUserId)
            .single();
          otherProfile = data;
        }

        // Get latest message
        const { data: latestMsgs } = await supabase
          .from("messages")
          .select("text, created_at")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: false })
          .limit(1);

        // Count unread
        const myParticipation = participations.find(p => p.thread_id === threadId);
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("thread_id", threadId)
          .neq("sender_id", userId)
          .gt("created_at", myParticipation?.last_read_at ?? "1970-01-01");

        const name = otherProfile?.display_name ?? "不明";
        threadResults.push({
          id: threadId,
          name,
          avatar: name[0],
          color: otherProfile?.color ?? "bg-gray-600",
          lastMessage: latestMsgs?.[0]?.text ?? "",
          time: latestMsgs?.[0]?.created_at
            ? new Date(latestMsgs[0].created_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
            : "",
          unread: count ?? 0,
        });
      }

      setThreads(threadResults);
      setLoading(false);
    };

    fetchThreads();
  }, [userId]);

  // Fetch messages for selected thread
  useEffect(() => {
    if (!selectedThreadId) { setMessages([]); return; }

    if (!isSupabaseConfigured()) {
      setMessages(MOCK_MESSAGES);
      return;
    }

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", selectedThreadId)
        .order("created_at", { ascending: true });

      setMessages(
        (data ?? []).map(m => ({
          id: m.id,
          sender: m.sender_id === userId ? "me" as const : "them" as const,
          sender_id: m.sender_id,
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
          created_at: m.created_at,
        }))
      );

      // Mark as read
      if (userId) {
        await supabase
          .from("thread_participants")
          .update({ last_read_at: new Date().toISOString() })
          .eq("thread_id", selectedThreadId)
          .eq("user_id", userId);
      }
    };

    fetchMessages();

    // Subscribe to realtime messages
    if (isSupabaseConfigured()) {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = supabase
        .channel(`messages:${selectedThreadId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${selectedThreadId}` },
          (payload) => {
            const m = payload.new as any;
            setMessages(prev => [
              ...prev,
              {
                id: m.id,
                sender: m.sender_id === userId ? "me" as const : "them" as const,
                sender_id: m.sender_id,
                text: m.text,
                time: new Date(m.created_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
                created_at: m.created_at,
              },
            ]);
          }
        )
        .subscribe();
    }

    return () => { subscriptionRef.current?.unsubscribe(); };
  }, [selectedThreadId, userId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!selectedThreadId || !text.trim()) return;

    if (!isSupabaseConfigured()) {
      setMessages(prev => [
        ...prev,
        { id: `m-${Date.now()}`, sender: "me", text, time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }) },
      ]);
      return;
    }

    if (!userId) return;
    await supabase.from("messages").insert({
      thread_id: selectedThreadId,
      sender_id: userId,
      text,
    });
    // Realtime subscription will pick up the new message
  }, [selectedThreadId, userId]);

  const createThread = useCallback(async (otherUserId: string, projectId?: string): Promise<string | null> => {
    if (!isSupabaseConfigured() || !userId) return null;

    // Check existing thread
    const { data: myThreads } = await supabase
      .from("thread_participants")
      .select("thread_id")
      .eq("user_id", userId);

    if (myThreads?.length) {
      const { data: otherThreads } = await supabase
        .from("thread_participants")
        .select("thread_id")
        .eq("user_id", otherUserId)
        .in("thread_id", myThreads.map(t => t.thread_id));

      if (otherThreads?.length) return otherThreads[0].thread_id;
    }

    // Create new thread
    const { data: thread } = await supabase
      .from("message_threads")
      .insert({ project_id: projectId ?? null })
      .select()
      .single();

    if (!thread) return null;

    await supabase.from("thread_participants").insert([
      { thread_id: thread.id, user_id: userId },
      { thread_id: thread.id, user_id: otherUserId },
    ]);

    return thread.id;
  }, [userId]);

  return {
    threads,
    messages,
    selectedThreadId,
    setSelectedThreadId,
    sendMessage,
    createThread,
    loading,
  };
}
