"use client";
import { useRouter } from "next/navigation";
import { HowScoringWorksPage } from "@/components/legal/HowScoringWorksPage";

export function ScoringPageClient() {
  const router = useRouter();
  return <HowScoringWorksPage onBack={() => router.push("/")} />;
}
