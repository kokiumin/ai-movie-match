"use client";
import { useState } from "react";
import { MessageSquare, ChevronRight, CheckCircle, Clock, Send } from "lucide-react";
import { useConsultationThreads, useConsultationThread } from "@/hooks/useConsultations";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  open: { label: "返信待ち", color: "bg-amber-50 text-amber-700 border-amber-200" },
  replied: { label: "相談中", color: "bg-blue-50 text-blue-700 border-blue-200" },
  converted: { label: "正式発注済み", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  closed: { label: "終了", color: "bg-gray-100 text-gray-500 border-gray-200" },
};

interface ConsultationListProps {
  perspective: "client" | "creator";
}

/**
 * マイページ等から呼び出す、自分が関わる相談スレッドの一覧。
 */
export function ConsultationList({ perspective }: ConsultationListProps) {
  const { user } = useAuth();
  const { threads, loading } = useConsultationThreads(user?.id ?? "demo-creator");
  const [activeId, setActiveId] = useState<string | null>(null);

  if (loading) {
    return <div className="text-center py-12 text-sm text-gray-400">読み込み中...</div>;
  }
  if (threads.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
        <MessageSquare size={28} className="mx-auto mb-3 opacity-40" />
        <p>{perspective === "creator" ? "まだ相談は届いていません。" : "相談中のクリエイターはまだいません。"}</p>
      </div>
    );
  }

  if (activeId) {
    return <ConsultationDetail threadId={activeId} onBack={() => setActiveId(null)} />;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <h2 className="font-bold text-gray-900">相談メッセージ</h2>
        <span className="text-xs text-gray-500">{threads.length}件</span>
      </div>
      <ul className="divide-y divide-gray-50">
        {threads.map((t) => {
          const status = STATUS_LABEL[t.status];
          const unread = perspective === "client" ? t.client_unread_count : t.creator_unread_count;
          return (
            <li key={t.id}>
              <button
                onClick={() => setActiveId(t.id)}
                className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                    {unread > 0 && (
                      <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                        新着 {unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 line-clamp-1">{t.initial_message}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    <Clock size={11} />
                    {t.last_message_at ? new Date(t.last_message_at).toLocaleString("ja-JP") : "—"}
                    {t.budget_range && <span className="ml-2">予算: {t.budget_range}</span>}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ConsultationDetail({ threadId, onBack }: { threadId: string; onBack: () => void }) {
  const { user } = useAuth();
  const { thread, messages, loading, sendMessage } = useConsultationThread(threadId);
  const [draft, setDraft] = useState("");

  if (loading || !thread) {
    return <div className="text-center py-12 text-sm text-gray-400">読み込み中...</div>;
  }

  const handleSend = async () => {
    if (!draft.trim()) return;
    await sendMessage(user?.id ?? "demo-creator", draft.trim());
    setDraft("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[600px]">
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-blue-700 hover:underline">
          ← 一覧
        </button>
        <span className="text-xs text-gray-500">
          {thread.budget_range && <>予算: {thread.budget_range}</>}
          {thread.deadline_range && <span className="ml-3">納期: {thread.deadline_range}</span>}
        </span>
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-3 bg-gray-50/30">
        {messages.map((m) => {
          const isMine = m.sender_id === (user?.id ?? "demo-creator");
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "bg-brand-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                <p className={`text-[10px] mt-1 ${isMine ? "text-brand-100" : "text-gray-400"}`}>
                  {new Date(m.created_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {thread.status !== "converted" && thread.status !== "closed" && (
        <div className="border-t border-gray-100 p-3 bg-white flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="メッセージを入力..."
            className="flex-1 text-sm"
          />
          <Button onClick={handleSend} disabled={!draft.trim()} className="bg-brand-600 hover:bg-brand-700">
            <Send size={14} />
          </Button>
        </div>
      )}

      {thread.status === "replied" && (
        <div className="border-t border-gray-100 p-3 bg-emerald-50">
          <Button
            variant="outline"
            className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-100 gap-2"
          >
            <CheckCircle size={14} /> 正式発注へ進む
          </Button>
        </div>
      )}
    </div>
  );
}
