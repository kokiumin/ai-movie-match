"use client";
import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { createConsultationThread } from "@/hooks/useConsultations";

interface ConsultationModalProps {
  creatorId: string;
  creatorName: string;
  open: boolean;
  onClose: () => void;
  onSent?: (threadId: string) => void;
}

/**
 * クリエイターに「契約前」の相談を送るモーダル。
 * 「指名で発注」とは独立した、気軽に質問できる動線。
 */
export function ConsultationModal({ creatorId, creatorName, open, onClose, onSent }: ConsultationModalProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    const { data, error: err } = await createConsultationThread({
      clientId: user?.id ?? "demo-client",
      creatorId,
      initialMessage: message.trim(),
      budgetRange: budget || undefined,
      deadlineRange: deadline || undefined,
    });
    setSending(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data) {
      onSent?.(data.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={16} className="text-brand-600" />
            {creatorName} さんに相談する
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs bg-blue-50 text-blue-800 border border-blue-100 rounded-md p-3">
            これは<strong>正式発注ではありません</strong>。気になることをお気軽に質問してください。
          </p>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              相談内容 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="例: 採用動画を検討中です。1〜2分の構成で、社員インタビューを含めることは可能ですか?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] text-sm border-gray-300"
              maxLength={500}
            />
            <p className="text-[10px] text-gray-400 text-right">{message.length} / 500</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">想定予算</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="border-gray-300 h-9 text-sm"><SelectValue placeholder="未定" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="未定">未定</SelectItem>
                  <SelectItem value="〜5万円">〜5万円</SelectItem>
                  <SelectItem value="5〜10万円">5〜10万円</SelectItem>
                  <SelectItem value="10〜20万円">10〜20万円</SelectItem>
                  <SelectItem value="20〜50万円">20〜50万円</SelectItem>
                  <SelectItem value="50万円以上">50万円以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">希望納期</Label>
              <Select value={deadline} onValueChange={setDeadline}>
                <SelectTrigger className="border-gray-300 h-9 text-sm"><SelectValue placeholder="未定" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="未定">未定</SelectItem>
                  <SelectItem value="1週間以内">1週間以内</SelectItem>
                  <SelectItem value="2週間以内">2週間以内</SelectItem>
                  <SelectItem value="1ヶ月以内">1ヶ月以内</SelectItem>
                  <SelectItem value="急がない">急がない</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || sending}
            className="w-full bg-gray-900 hover:bg-gray-800 font-bold gap-2"
          >
            <Send size={14} />
            {sending ? "送信中..." : "相談を送信する"}
          </Button>

          <p className="text-[10px] text-gray-400 text-center">
            返信は内部通知とメールで届きます。プラットフォーム外取引は禁止されています。
          </p>
        </div>
      </div>
    </div>
  );
}
