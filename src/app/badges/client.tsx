"use client";
import { useRouter } from "next/navigation";
import { BadgesPage } from "@/components/legal/BadgesPage";

export function BadgesPageClient() {
  const router = useRouter();
  return <BadgesPage onBack={() => router.push("/")} />;
}
