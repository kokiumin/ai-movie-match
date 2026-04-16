import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Project } from "@/types/database";

const MOCK_PROJECTS: Project[] = [
  { id: "p1", client_id: "c1", company_name: "株式会社グリーンテック", industry: "IT・Web", type: "採用動画", budget: "10〜20万円", deadline: "2週間", description: "新卒採用向けの会社紹介・仕事紹介動画。1〜2分程度。明るく活気のある雰囲気で。", style: null, pro_select: false, status: "マッチング中", view_count: 12, proposal_count: 3, created_at: new Date(Date.now() - 2 * 86400000).toISOString(), updated_at: "" },
  { id: "p2", client_id: "c2", company_name: "ミライ不動産", industry: "不動産", type: "会社紹介動画", budget: "5〜10万円", deadline: "10日", description: "創業20周年を機に会社紹介動画をリニューアル。地域密着の温かみを表現したい。", style: null, pro_select: false, status: "募集中", view_count: 28, proposal_count: 7, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: "" },
  { id: "p3", client_id: "c3", company_name: "佐藤歯科クリニック", industry: "医療・クリニック", type: "SNS広告動画", budget: "3〜8万円", deadline: "1週間", description: "Instagramリール用の広告動画。清潔感・信頼感が伝わるビジュアルで。30秒以内。", style: null, pro_select: false, status: "成立済み", view_count: 45, proposal_count: 11, created_at: new Date(Date.now() - 3 * 86400000).toISOString(), updated_at: "" },
  { id: "p4", client_id: "c4", company_name: "ハナビ食品株式会社", industry: "食品・飲料", type: "商品PR動画", budget: "8〜15万円", deadline: "3週間", description: "新商品（冷凍惣菜）のPR動画。食欲をそそるビジュアルと商品の特徴を伝えること。", style: null, pro_select: false, status: "募集中", view_count: 19, proposal_count: 4, created_at: new Date().toISOString(), updated_at: "" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "本日";
  if (days === 1) return "1日前";
  return `${days}日前`;
}

interface UseProjectsOptions {
  category?: string;
  status?: string;
  clientId?: string;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<(Project & { posted?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      let result = [...MOCK_PROJECTS];
      if (options.category && options.category !== "すべて") {
        result = result.filter(p => p.type.includes(options.category!));
      }
      if (options.status) {
        result = result.filter(p => p.status === options.status);
      }
      setProjects(result.map(p => ({ ...p, posted: timeAgo(p.created_at) })));
      setLoading(false);
      return;
    }

    setLoading(true);
    let q = supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (options.category && options.category !== "すべて") {
      q = q.ilike("type", `%${options.category}%`);
    }
    if (options.status) {
      q = q.eq("status", options.status as any);
    }
    if (options.clientId) {
      q = q.eq("client_id", options.clientId);
    }

    const { data } = await q;
    setProjects((data ?? []).map(p => ({ ...p, posted: timeAgo(p.created_at) })));
    setLoading(false);
  }, [options.category, options.status, options.clientId]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = useCallback(async (project: Omit<Project, "id" | "created_at" | "updated_at" | "view_count" | "proposal_count">) => {
    if (!isSupabaseConfigured()) {
      const newProject: Project = {
        ...project,
        id: `p${Date.now()}`,
        view_count: 0,
        proposal_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProjects(prev => [{ ...newProject, posted: "本日" }, ...prev]);
      return { data: newProject, error: null };
    }

    const { data, error } = await supabase.from("projects").insert(project).select().single();
    if (!error) fetchProjects();
    return { data, error: error?.message ?? null };
  }, [fetchProjects]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    if (!isSupabaseConfigured()) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return { error: null };
    }

    const { error } = await supabase.from("projects").update(updates).eq("id", id);
    if (!error) fetchProjects();
    return { error: error?.message ?? null };
  }, [fetchProjects]);

  return { projects, loading, createProject, updateProject, refetch: fetchProjects };
}
