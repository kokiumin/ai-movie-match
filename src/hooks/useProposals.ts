import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Proposal, Profile } from "@/types/database";

export type ProposalWithCreator = Proposal & { creator?: Profile };

export function useProposals(projectId?: string) {
  const [proposals, setProposals] = useState<ProposalWithCreator[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProposals = useCallback(async () => {
    if (!projectId) return;
    if (!isSupabaseConfigured()) {
      setProposals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from("proposals")
      .select("*, creator:profiles!proposals_creator_id_fkey(*)")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    setProposals((data ?? []) as ProposalWithCreator[]);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const submitProposal = useCallback(async (data: {
    project_id: string;
    creator_id: string;
    message?: string;
    price?: number;
    delivery_days?: number;
  }) => {
    if (!isSupabaseConfigured()) {
      const mock: Proposal = {
        id: `prop-${Date.now()}`,
        ...data,
        message: data.message ?? null,
        price: data.price ?? null,
        delivery_days: data.delivery_days ?? null,
        status: "pending",
        tools_used: null,
        created_at: new Date().toISOString(),
      };
      setProposals(prev => [mock, ...prev]);
      return { error: null };
    }

    const { error } = await supabase.from("proposals").insert(data);
    if (!error) fetchProposals();
    return { error: error?.message ?? null };
  }, [fetchProposals]);

  const updateProposalStatus = useCallback(async (proposalId: string, status: "accepted" | "rejected") => {
    if (!isSupabaseConfigured()) {
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
      return { error: null };
    }

    const { error } = await supabase.from("proposals").update({ status }).eq("id", proposalId);
    if (!error) fetchProposals();
    return { error: error?.message ?? null };
  }, [fetchProposals]);

  return { proposals, loading, submitProposal, updateProposalStatus, refetch: fetchProposals };
}

export function useMyProposals(creatorId?: string) {
  const [proposals, setProposals] = useState<(Proposal & { project?: any })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!creatorId || !isSupabaseConfigured()) return;
    setLoading(true);
    supabase
      .from("proposals")
      .select("*, project:projects(*)")
      .eq("creator_id", creatorId)
      .then(({ data }) => {
        setProposals(data ?? []);
        setLoading(false);
      });
  }, [creatorId]);

  return { proposals, loading };
}
