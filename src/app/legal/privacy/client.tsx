"use client";
import { useRouter } from "next/navigation";
import { PrivacyPage } from "@/components/legal/PrivacyPage";

export function PrivacyClient() {
  const router = useRouter();
  return <PrivacyPage onBack={() => router.push("/")} />;
}
