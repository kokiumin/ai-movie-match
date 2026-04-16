import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Profile, UserRole } from "@/types/database";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isDemo: boolean;
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, role: UserRole, displayName: string, extra?: Record<string, string>) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Demo profile for when Supabase is not configured
const DEMO_PROFILES: Record<UserRole, Profile> = {
  client: {
    id: "demo-client",
    role: "client",
    display_name: "デモ発注者",
    handle: null,
    avatar_url: null,
    company_name: "デモ株式会社",
    industry: "IT・Web",
    bio: null,
    specialty: null,
    tools: null,
    tags: null,
    badge: "",
    turnaround: null,
    min_price: null,
    max_price: null,
    rating: 0,
    review_count: 0,
    delivery_count: 0,
    monthly_revenue: 0,
    active_projects: 0,
    stripe_account_id: null,
    stripe_connected: false,
    color: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  creator: {
    id: "demo-creator",
    role: "creator",
    display_name: "デモクリエイター",
    handle: "@demo_creator",
    avatar_url: null,
    company_name: null,
    industry: null,
    bio: "デモ用のクリエイターアカウントです",
    specialty: ["採用動画", "会社紹介"],
    tools: ["Runway", "Sora"],
    tags: ["採用動画"],
    badge: "認定",
    turnaround: "5〜7日",
    min_price: 50000,
    max_price: 150000,
    rating: 4.8,
    review_count: 10,
    delivery_count: 20,
    monthly_revenue: 300000,
    active_projects: 2,
    stripe_account_id: null,
    stripe_connected: false,
    color: "bg-blue-600",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  admin: {
    id: "demo-admin",
    role: "admin",
    display_name: "管理者",
    handle: null,
    avatar_url: null,
    company_name: null,
    industry: null,
    bio: null,
    specialty: null,
    tools: null,
    tags: null,
    badge: "",
    turnaround: null,
    min_price: null,
    max_price: null,
    rating: 0,
    review_count: 0,
    delivery_count: 0,
    monthly_revenue: 0,
    active_projects: 0,
    stripe_account_id: null,
    stripe_connected: false,
    color: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    isDemo: !isSupabaseConfigured(),
  });

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Failed to fetch profile:", error);
      return null;
    }
    return data as Profile;
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Demo mode — no auth needed
      setState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        isDemo: true,
      });
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let profile: Profile | null = null;
      if (session?.user) {
        profile = await fetchProfile(session.user.id);
      }
      setState({
        user: session?.user ?? null,
        profile,
        session,
        loading: false,
        isDemo: false,
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        let profile: Profile | null = null;
        if (session?.user) {
          profile = await fetchProfile(session.user.id);
        }
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          profile,
          session,
          loading: false,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = useCallback(
    async (email: string, password: string, role: UserRole, displayName: string, extra?: Record<string, string>) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            display_name: displayName,
            ...extra,
          },
        },
      });
      return { error: error?.message ?? null };
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState(prev => ({ ...prev, user: null, profile: null, session: null }));
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<Profile>) => {
      if (!state.user) return { error: "Not authenticated" };
      const { error } = await supabase
        .from("profiles")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", state.user.id);
      if (!error) {
        setState(prev => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, ...data } : null,
        }));
      }
      return { error: error?.message ?? null };
    },
    [state.user]
  );

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    if (profile) {
      setState(prev => ({ ...prev, profile }));
    }
  }, [state.user, fetchProfile]);

  // Demo mode helper: set demo profile for role
  const setDemoRole = useCallback((role: UserRole) => {
    setState(prev => ({
      ...prev,
      profile: DEMO_PROFILES[role],
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
        // Expose setDemoRole as a hidden feature for demo mode
        ...(state.isDemo ? { setDemoRole } : {}),
      } as AuthContextValue & { setDemoRole?: (role: UserRole) => void }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useDemoRole() {
  const ctx = useContext(AuthContext) as (AuthContextValue & { setDemoRole?: (role: UserRole) => void }) | null;
  return ctx?.setDemoRole;
}
