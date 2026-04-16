import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadAvatar } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Profile } from "@/types/database";

export function useProfile() {
  const { profile, updateProfile, refreshProfile, loading } = useAuth();

  const saveProfile = useCallback(async (data: Partial<Profile>) => {
    return updateProfile(data);
  }, [updateProfile]);

  const changeAvatar = useCallback(async (file: File) => {
    if (!profile?.id) return { error: "Not authenticated" };

    if (!isSupabaseConfigured()) {
      const url = URL.createObjectURL(file);
      await updateProfile({ avatar_url: url });
      return { error: null, url };
    }

    const url = await uploadAvatar(profile.id, file);
    if (!url) return { error: "Upload failed" };

    await updateProfile({ avatar_url: url });
    return { error: null, url };
  }, [profile?.id, updateProfile]);

  const connectStripe = useCallback(async () => {
    // Simulated Stripe Connect flow — will be replaced with real integration
    await new Promise(resolve => setTimeout(resolve, 1800));
    await updateProfile({
      stripe_connected: true,
      stripe_account_id: "acct_demo_" + Math.random().toString(36).slice(2, 10),
    });
    return { error: null };
  }, [updateProfile]);

  return {
    profile,
    loading,
    saveProfile,
    changeAvatar,
    connectStripe,
    refreshProfile,
  };
}
