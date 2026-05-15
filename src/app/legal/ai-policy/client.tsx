"use client";
import { useRouter } from "next/navigation";
import { AIContentPolicyPage } from "@/components/legal/AIContentPolicyPage";

export function AIPolicyClient() {
  const router = useRouter();
  return <AIContentPolicyPage onBack={() => router.push("/")} />;
}
