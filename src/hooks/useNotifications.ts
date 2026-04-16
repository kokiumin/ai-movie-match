import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Notification } from "@/types/database";

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", user_id: "", type: "proposal", text: "田中蒼さんから見積もりが届きました", read: false, data: null, created_at: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: "n2", user_id: "", type: "message", text: "鈴木凛さんからメッセージが届きました", read: false, data: null, created_at: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: "n3", user_id: "", type: "match", text: "グリーンテック案件が成立しました", read: false, data: null, created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: "n4", user_id: "", type: "review", text: "新しいレビューが投稿されました", read: true, data: null, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "n5", user_id: "", type: "system", text: "プロフィールを更新してマッチング率をUPしましょう", read: true, data: null, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "昨日";
  return `${days}日前`;
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<(Notification & { timeLabel: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<any>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setNotifications(MOCK_NOTIFICATIONS.map(n => ({ ...n, timeLabel: timeAgo(n.created_at) })));
      setLoading(false);
      return;
    }

    if (!userId) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    setNotifications((data ?? []).map(n => ({ ...n, timeLabel: timeAgo(n.created_at) })));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchNotifications();

    // Realtime subscription
    if (isSupabaseConfigured() && userId) {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
          () => fetchNotifications()
        )
        .subscribe();
    }

    return () => { subscriptionRef.current?.unsubscribe(); };
  }, [userId, fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!isSupabaseConfigured()) {
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
      return;
    }
    await supabase.from("notifications").update({ read: true }).eq("id", notificationId);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      return;
    }
    if (!userId) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [userId]);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch: fetchNotifications };
}
