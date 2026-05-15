"use client";
import { useRouter } from "next/navigation";
import { CommunityGuidelinesPage } from "@/components/legal/CommunityGuidelinesPage";

export function CommunityClient() {
  const router = useRouter();
  return <CommunityGuidelinesPage onBack={() => router.push("/")} />;
}
