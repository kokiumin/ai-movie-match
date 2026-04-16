import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Loader2, Video } from "lucide-react";
import type { UserRole } from "@/types/database";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

export function LoginDialog({ open, onOpenChange, defaultTab = "login" }: LoginDialogProps) {
  const { signIn, signUp, isDemo } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [companyName, setCompanyName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isDemo) {
      // In demo mode, just close the dialog
      onOpenChange(false);
      setLoading(false);
      return;
    }

    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
    else onOpenChange(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("名前を入力してください");
      return;
    }
    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);

    if (isDemo) {
      onOpenChange(false);
      setLoading(false);
      return;
    }

    const extra: Record<string, string> = {};
    if (role === "client" && companyName) {
      extra.company_name = companyName;
    }

    const { error: err } = await signUp(email, password, role, displayName, extra);
    setLoading(false);
    if (err) setError(err);
    else {
      setError(null);
      setTab("login");
      // Show success message
      setError("アカウントを作成しました。ログインしてください。");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <Video size={16} className="text-white" />
            </div>
            AIムービーマッチ
          </DialogTitle>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === "login"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => { setTab("login"); setError(null); }}
          >
            ログイン
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === "signup"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => { setTab("signup"); setError(null); }}
          >
            新規登録
          </button>
        </div>

        {error && (
          <div className={`flex items-center gap-2 text-sm p-3 rounded-lg mb-3 ${
            error.includes("作成しました")
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-email" className="text-sm font-medium">メールアドレス</Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="login-password" className="text-sm font-medium">パスワード</Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-10" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              ログイン
            </Button>

            {isDemo && (
              <p className="text-xs text-gray-400 text-center">
                デモモードで動作中。Supabase接続後にログイン機能が有効になります。
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Role selection */}
            <div>
              <Label className="text-sm font-medium">アカウントの種類</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    role === "client"
                      ? "border-blue-700 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setRole("client")}
                >
                  <div className="text-sm font-semibold text-gray-900">発注者</div>
                  <div className="text-xs text-gray-500 mt-0.5">動画制作を依頼する</div>
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    role === "creator"
                      ? "border-blue-700 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setRole("creator")}
                >
                  <div className="text-sm font-semibold text-gray-900">クリエイター</div>
                  <div className="text-xs text-gray-500 mt-0.5">動画制作を受注する</div>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="signup-name" className="text-sm font-medium">
                {role === "client" ? "ご担当者名" : "クリエイター名"}
              </Label>
              <Input
                id="signup-name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder={role === "client" ? "山田 太郎" : "田中 蒼"}
                required
                className="mt-1"
              />
            </div>

            {role === "client" && (
              <div>
                <Label htmlFor="signup-company" className="text-sm font-medium">会社名</Label>
                <Input
                  id="signup-company"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="株式会社○○"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="signup-email" className="text-sm font-medium">メールアドレス</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="signup-password" className="text-sm font-medium">パスワード</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="6文字以上"
                required
                minLength={6}
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-10" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              アカウントを作成
            </Button>
          </form>
        )}

        {/* Demo login hints */}
        {!isDemo && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 mb-1">テストアカウント</p>
            <div className="text-xs text-gray-400 space-y-0.5">
              <p>クリエイター: tanaka@test.com / password123</p>
              <p>発注者: greentech@test.com / password123</p>
              <p>管理者: admin@test.com / password123</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
